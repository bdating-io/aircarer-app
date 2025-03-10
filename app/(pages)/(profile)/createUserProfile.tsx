import React, { useEffect, useState } from 'react';
import { supabase } from '@/clients/supabase';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import useStore from '../../../lib/store';
import { ProfileData } from '@/types/type';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

export default function CreateProfile() {
  const router = useRouter();
  const { myProfile, setMyProfile } = useStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [abn, setAbn] = useState('');
  const [selectedRole, setSelectedRole] = useState<ProfileData['role'] | null>(
    null,
  );
  const [backgroundCheck, setBackgroundCheck] = useState<string>('');
  const [backgroundCheckImage, setBackgroundCheckImage] = useState<
    string | null
  >(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [abnValid, setAbnValid] = useState<boolean | null>(null);
  const [validatingAbn, setValidatingAbn] = useState<boolean>(false);

  useEffect(() => {
    if (myProfile) {
      setFirstName(myProfile.first_name || '');
      setLastName(myProfile.last_name || '');
      setAbn(myProfile.abn || '');
      setSelectedRole(myProfile.role || null);
    }
  }, [myProfile]);

  // 请求相机权限
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload images.',
        );
      }
    })();
  }, []);

  // 图片上传函数
  const pickBackgroundCheckImage = async () => {
    try {
      setUploadingImage(true);

      // 打开图片选择器
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageAsset = result.assets[0];

        // 检查用户是否已登录
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('User not authenticated');
        }

        // 准备文件名
        const fileExt = imageAsset.uri.split('.').pop();
        const fileName = `${user.id}-background-check-${Date.now()}.${fileExt}`;
        const filePath = `background-checks/${fileName}`;

        // 确保图片有base64数据
        if (!imageAsset.base64) {
          throw new Error('No image data available');
        }

        // 上传到Supabase Storage
        const { data, error } = await supabase.storage
          .from('profile-documents')
          .upload(filePath, decode(imageAsset.base64), {
            contentType: `image/${fileExt}`,
          });

        if (error) {
          throw error;
        }

        // 获取公共URL
        const { data: urlData } = supabase.storage
          .from('profile-documents')
          .getPublicUrl(filePath);

        // 设置背景检查图片URL
        setBackgroundCheckImage(imageAsset.uri);
        setBackgroundCheck(urlData.publicUrl);

        // 存储URL到用户元数据而不是profiles表中
        await updateUserMetadata(urlData.publicUrl);

        Alert.alert('Success', 'Background check image uploaded successfully');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      Alert.alert('Upload Failed', error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // 使用用户元数据来存储背景检查URL
  const updateUserMetadata = async (documentUrl: string) => {
    try {
      // 获取当前用户
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // 获取当前元数据
      const { data: userData, error: metadataError } =
        await supabase.auth.getUser();
      if (metadataError) throw metadataError;

      const currentMetadata = userData.user.user_metadata || {};

      // 更新元数据中的背景检查URL
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...currentMetadata,
          background_check_url: documentUrl,
        },
      });

      if (error) throw error;

      console.log('User metadata updated with background check URL');
    } catch (error) {
      console.error('Error updating user metadata:', error);
    }
  };

  const createPersonalProfile = async (profileData: any) => {
    setIsLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('User not found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          abn: profileData.abn,
          role: profileData.role,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // 更新本地状态
      setMyProfile({
        ...myProfile,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        abn: profileData.abn,
        role: profileData.role,
      });

      Alert.alert('Success', 'Profile created successfully!');
      return data;
    } catch (error: any) {
      console.error('Error creating profile:', error.message);
      Alert.alert('Error', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ABN验证函数
  const validateABN = (abnValue: string): boolean => {
    // 删除所有空格
    const cleanABN = abnValue.replace(/\s/g, '');

    // 检查是否为11位数字
    if (!/^\d{11}$/.test(cleanABN)) {
      return false;
    }

    // 标准ABN验证算法
    // 将第一位数字减1
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    let sum = 0;

    // 第一位减1
    const digits = cleanABN.split('').map(Number);
    digits[0] -= 1;

    // 应用权重算法
    for (let i = 0; i < 11; i++) {
      sum += digits[i] * weights[i];
    }

    // 如果总和能被89整除，ABN有效
    return sum % 89 === 0;
  };

  // 在线验证ABN（模拟）
  const validateABNOnline = async (abnValue: string) => {
    try {
      setValidatingAbn(true);

      // 先进行本地基本验证
      const isBasicValid = validateABN(abnValue);
      if (!isBasicValid) {
        setAbnValid(false);
        return false;
      }

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 这里可以添加实际的ABN验证API调用
      // const response = await fetch(`https://api.example.com/verify-abn/${abnValue}`);
      // const data = await response.json();
      // const isValid = data.valid;

      // 假设ABN验证通过
      const isValid = true;
      setAbnValid(isValid);
      return isValid;
    } catch (error) {
      console.error('Error validating ABN:', error);
      // 如果验证服务失败，回退到本地验证
      const isBasicValid = validateABN(abnValue);
      setAbnValid(isBasicValid);
      return isBasicValid;
    } finally {
      setValidatingAbn(false);
    }
  };

  // 处理ABN输入变化
  const handleAbnChange = (text: string) => {
    // 更新ABN输入值
    setAbn(text);

    // 如果ABN为空，重置验证状态
    if (!text.trim()) {
      setAbnValid(null);
      return;
    }

    // 如果有11位数字，进行验证
    if (text.replace(/\s/g, '').length === 11) {
      validateABNOnline(text);
    } else {
      // 长度不符合，设置为无效
      setAbnValid(false);
    }
  };

  const handleNext = async () => {
    if (!firstName || !lastName || !abn || !selectedRole) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // 验证ABN
    setValidatingAbn(true);
    const isAbnValid = await validateABNOnline(abn);
    setValidatingAbn(false);

    if (!isAbnValid) {
      Alert.alert(
        'Invalid ABN',
        'Please enter a valid Australian Business Number',
      );
      return;
    }

    try {
      const profileData = {
        firstName,
        lastName,
        abn,
        role: selectedRole,
      };

      await createPersonalProfile(profileData);

      // 根据角色导航到不同页面
      switch (selectedRole) {
        case 'Cleaner':
          router.push({
            pathname: '/(pages)/(profile)/(cleanerProfile)/cleanerProfile',
            params: { profileData: JSON.stringify(profileData) },
          });
          break;
        case 'House Owner':
          router.push({
            pathname: '/(pages)/(profile)/(houseOwner)/houseOwner',
            params: { profileData: JSON.stringify(profileData) },
          });
          break;
        default:
          router.push('/(pages)/(profile)/(houseOwner)/houseOwner');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">
            Create your profile
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* First Name */}
        <Text className="text-gray-600 mb-2">First Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        {/* Last Name */}
        <Text className="text-gray-600 mb-2">Last Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* ABN Field */}
        <Text className="text-gray-600 mb-2">
          ABN (Australian Business Number)
        </Text>
        <View className="mb-4">
          <TextInput
            className={`border rounded-lg p-3 ${
              abnValid === true
                ? 'border-green-500'
                : abnValid === false
                  ? 'border-red-500'
                  : 'border-gray-300'
            }`}
            placeholder="e.g. 51 824 753 556"
            value={abn}
            onChangeText={handleAbnChange}
            keyboardType="numeric"
          />

          {/* ABN验证状态指示器 */}
          {abn.length > 0 && (
            <View className="flex-row items-center mt-1">
              {validatingAbn ? (
                <ActivityIndicator
                  size="small"
                  color="#4A90E2"
                  style={{ marginRight: 6 }}
                />
              ) : abnValid === true ? (
                <AntDesign
                  name="checkcircle"
                  size={16}
                  color="green"
                  style={{ marginRight: 6 }}
                />
              ) : abnValid === false ? (
                <AntDesign
                  name="exclamationcircle"
                  size={16}
                  color="red"
                  style={{ marginRight: 6 }}
                />
              ) : null}

              <Text
                className={`text-sm ${
                  abnValid === true
                    ? 'text-green-600'
                    : abnValid === false
                      ? 'text-red-600'
                      : 'text-gray-500'
                }`}
              >
                {validatingAbn
                  ? 'Validating ABN...'
                  : abnValid === true
                    ? 'Valid ABN'
                    : abnValid === false
                      ? 'Invalid ABN format'
                      : 'Enter your 11-digit ABN'}
              </Text>
            </View>
          )}
        </View>

        {/* Role Selection Grid */}
        <Text className="text-gray-600 mb-4">
          What is your main role on AirCarer?
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {[
            { id: 'Laundry Partner', icon: '🧺', color: 'bg-blue-100' },
            { id: 'Supervisor', icon: '👥', color: 'bg-green-100' },
            { id: 'Cleaner', icon: '🧹', color: 'bg-yellow-100' },
            { id: 'House Owner', icon: '🏠', color: 'bg-purple-100' },
          ].map((role) => (
            <TouchableOpacity
              key={role.id}
              className={`w-[48%] p-4 rounded-lg mb-4 ${role.color} ${
                selectedRole === role.id ? 'border-2 border-blue-500' : ''
              }`}
              onPress={() => setSelectedRole(role.id as ProfileData['role'])}
            >
              <Text className="text-center text-2xl mb-2">{role.icon}</Text>
              <Text className="text-center">{role.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Background Check Upload - 仅当角色为"Cleaner"时显示 */}
        {selectedRole === 'Cleaner' && (
          <>
            <Text className="text-gray-600 mb-2">Background Check</Text>
            <Text className="text-xs text-gray-500 mb-3">
              As a cleaner, you need to upload a valid background check
              document. This helps ensure safety and trust for our customers.
            </Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-3 mb-2 flex-row items-center justify-between"
              onPress={pickBackgroundCheckImage}
              disabled={uploadingImage}
            >
              <Text className="text-gray-500">
                {uploadingImage
                  ? 'Uploading...'
                  : 'Upload background check document'}
              </Text>
              {uploadingImage ? (
                <ActivityIndicator color="#4A90E2" size="small" />
              ) : (
                <AntDesign name="upload" size={20} color="gray" />
              )}
            </TouchableOpacity>

            {/* 显示已上传的图片预览 */}
            {backgroundCheckImage && (
              <View className="mb-6">
                <Image
                  source={{ uri: backgroundCheckImage }}
                  className="h-40 rounded-lg w-full"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                  onPress={() => {
                    setBackgroundCheckImage(null);
                    setBackgroundCheck('');
                  }}
                >
                  <AntDesign name="close" size={16} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Next Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-full py-3 items-center ${
            firstName &&
            lastName &&
            abn &&
            selectedRole &&
            (selectedRole !== 'Cleaner' ||
              (selectedRole === 'Cleaner' && backgroundCheck)) &&
            abnValid === true
              ? 'bg-[#4A90E2]'
              : 'bg-gray-200'
          }`}
          onPress={handleNext}
          disabled={
            !firstName ||
            !lastName ||
            !abn ||
            !selectedRole ||
            (selectedRole === 'Cleaner' && !backgroundCheck) ||
            abnValid !== true
          }
        >
          <Text
            className={`font-medium ${
              firstName &&
              lastName &&
              abn &&
              selectedRole &&
              (selectedRole !== 'Cleaner' ||
                (selectedRole === 'Cleaner' && backgroundCheck)) &&
              abnValid === true
                ? 'text-white'
                : 'text-gray-500'
            }`}
          >
            {validatingAbn ? 'Validating...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
