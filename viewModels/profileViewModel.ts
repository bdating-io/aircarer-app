import { supabaseAuthClient } from '@/clients/supabase/auth';
import { supabaseDBClient } from '@/clients/supabase/database';
import { supabaseStorageClient } from '@/clients/supabase/storage';
import useStore from '@/utils/store';
import { ProfileData, TimeSlot } from '@/types/profile';
import { imagePicker } from '@/utils/imagePicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { AddressFormData } from '@/types/address';
import { SUPABASE_URL } from '@/clients/supabase';
import { WorkPreference } from '@/types/workPreferences';

export const useProfileViewModel = () => {
  const router = useRouter();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [abnValid, setAbnValid] = useState<boolean | null>(null);
  const [validatingAbn, setValidatingAbn] = useState<boolean>(false);
  const [isBackgroundChecked, setIsBackgroundChecked] =
    useState<boolean>(false);
  const [backgroundCheckImage, setBackgroundCheckImage] = useState<
    string | null
  >(null);
  const [abn, setAbn] = useState('');
  const {
    myAddress,
    mySession,
    myProfile,
    setMyProfile,
    setMyAddress,
    setMyWorkPreference,
  } = useStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [workDistance, setWorkDistance] = useState(10);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [zoomDelta, setZoomDelta] = useState(0.2);
  const params = useLocalSearchParams();
  const [selectedRole, setSelectedRole] =
    useState<ProfileData['role']>('Cleaner');

  const [address, setAddress] = useState<AddressFormData>({
    type: 'USER_ADDRESS',
    street_number: '',
    street_name: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Australia', // 默认值
  });

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const initialTimeSlots = daysOfWeek.map((day) => ({
    day,
    morning: false,
    afternoon: false,
    evening: false,
  }));
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);

  const [hourlyRate, setHourlyRate] = useState('');

  const checkTermsAcceptance = async () => {
    try {
      const user = await supabaseAuthClient.getUser();
      if (!user) return;

      const userTermsStatus = await supabaseDBClient.getUserTermsStatusById(
        user.id,
      );

      if (userTermsStatus?.terms_accepted) {
        // 如果已同意条款，直接跳转到创建档案
        router.replace('/(pages)/(profile)/createUserProfile');
      }
    } catch (error) {
      console.error('Error checking terms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    try {
      const user = await supabaseAuthClient.getUser();
      if (!user) return;

      await supabaseDBClient.acceptUserTermsById(user.id);

      router.push('/(pages)/(profile)/createUserProfile');
    } catch (error) {
      console.error('Error accepting terms:', error);
      Alert.alert('Error', 'Failed to accept terms');
    }
  };

  const pickBackgroundCheckImage = async () => {
    try {
      setUploadingImage(true);

      // 打开图片选择器
      const result = await imagePicker.pickImage();

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageAsset = result.assets[0];

        // 检查用户是否已登录
        const user = await supabaseAuthClient.getUser();

        // 准备文件名
        const fileExt = imageAsset.uri.split('.').pop();
        const fileName = `${user.id}-background-check-${Date.now()}.${fileExt}`;
        const filePath = `background-checks/${fileName}`;
        // 上传到Supabase Storage
        await supabaseStorageClient.uploadImage(filePath, imageAsset, fileExt);
        console.log('Image uploaded successfully');
        // 获取公共URL
        const urlData = supabaseStorageClient.getPublicUrl(filePath);

        // 设置背景检查图片URL
        setBackgroundCheckImage(imageAsset.uri);
        setIsBackgroundChecked(true);

        // 存储URL到用户元数据而不是profiles表中
        await updateUserMetadata(urlData.publicUrl);

        Alert.alert('Success', 'Background check image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Failed', (error as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  // 使用用户元数据来存储背景检查URL
  const updateUserMetadata = async (documentUrl: string) => {
    try {
      // 获取当前用户
      const user = await supabaseAuthClient.getUser();
      const currentMetadata = user.user_metadata;

      // 更新元数据中的背景检查URL
      await supabaseAuthClient.updateUser({
        data: {
          ...currentMetadata,
          background_check_url: documentUrl,
        },
      });
      console.log('User metadata updated with background check URL');
    } catch (error) {
      console.error('Error updating user metadata:', error);
    }
  };

  const createPersonalProfile = async (profileData: ProfileData) => {
    setIsLoading(true);
    try {
      const user = await supabaseAuthClient.getUser();

      await supabaseDBClient.updateUserProfile(user.id, profileData);

      // 更新本地状态
      setMyProfile({
        ...myProfile,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        abn: profileData.abn,
        role: profileData.role,
      });

      Alert.alert('Success', 'Profile created successfully!');
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', (error as Error).message);
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

  const validateAndSubmitProfile = async () => {
    if (
      !firstName ||
      !lastName ||
      !selectedRole ||
      (selectedRole === 'Cleaner' && !abn)
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (
      selectedRole === 'Cleaner' ||
      (selectedRole === 'House Owner' && abn.length > 0)
    ) {
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
    }

    try {
      const profileData: ProfileData = {
        firstName,
        lastName,
        abn,
        role: selectedRole,
        isBackgroundChecked,
      };

      await createPersonalProfile(profileData);

      // 根据角色导航到不同页面
      switch (selectedRole) {
        case 'Cleaner':
          router.push({
            pathname: '/(pages)/(profile)/(cleanerProfile)/cleanerProfile',
          });
          break;
        case 'House Owner':
          router.push({
            pathname: '/(pages)/(profile)/(houseOwner)/createProperty',
          });
          break;
        default:
          router.push('/(pages)/(profile)/(houseOwner)/createProperty');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const getAddress = async (userId: string) => {
    try {
      const address = await supabaseDBClient.getUserAddressById(userId);
      if (!address) {
        console.log('No address found for user');
        return;
      }
      setAddress(address);
    } catch (error) {
      console.error('Error fetching address:', (error as Error).message);
    }
  };

  const updateUserAddress = async () => {
    setIsLoading(true);
    try {
      const user = await supabaseAuthClient.getUser();
      console.log('address:', address);
      await supabaseDBClient.updateUserAddress(user.id, address);

      Alert.alert('Success', 'Address saved successfully!');

      setMyAddress(address);
      router.push('/(pages)/(profile)/(cleanerProfile)/workingArea');
    } catch (error) {
      console.error('Error saving address:', (error as Error).message);
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const geocodeAddress = async (
    address: string,
  ): Promise<{ latitude: number; longitude: number }> => {
    if (!mySession) {
      throw new Error('User not authenticated');
    }
    const response = await fetch(`${SUPABASE_URL}/functions/v1/geodecode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mySession.access_token}`,
      },
      body: JSON.stringify({ address: address }),
    });
    const data = await response.json();
    return data;
  };

  const fetchCoordinatesFromMyAddress = async () => {
    try {
      const coords = await geocodeAddress(
        `${myAddress.street_number} ${myAddress.street_name}, ${myAddress.city}, ${myAddress.state}, ${myAddress.post_code}, ${myAddress.country}`,
      );
      setCoordinates(coords);
    } catch (error) {
      setCoordinates({ longitude: 0, latitude: 0 });
      console.error('Error geocoding address:', error);
    }
  };

  const getDBWorkPref = async () => {
    if (!mySession) throw new Error('User not authenticated');
    const workPref = await supabaseDBClient.getUserWorkPreferenceById(
      mySession.user.id,
    );
    setMyWorkPreference(workPref);
    setWorkDistance(workPref.areas.distance);
    setZoomDelta(workPref.areas.distance / 50);
  };

  const navigateToWorkingTime = () => {
    if (!workDistance) return;

    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    const profileData = {
      ...previousData,
      workDistance: workDistance,
    };

    router.push({
      pathname: '/workingTime',
      params: { profileData: JSON.stringify(profileData) },
    });
  };

  const navigateToExperience = () => {
    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    const profileData = {
      ...previousData,
      workingTime: timeSlots,
    };

    router.push({
      pathname: '/(pages)/(profile)/(cleanerProfile)/experience',
      params: { profileData: JSON.stringify(profileData) },
    });
  };

  const toggleTimeSlot = (
    dayIndex: number,
    slot: 'morning' | 'afternoon' | 'evening',
  ) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[dayIndex] = {
      ...newTimeSlots[dayIndex],
      [slot]: !newTimeSlots[dayIndex][slot],
    };
    setTimeSlots(newTimeSlots);
  };

  const navigateToPricing = (
    yearsExperience: string,
    selectedSkills: string[],
  ) => {
    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    const profileData = {
      ...previousData,
      experience: {
        years: yearsExperience,
        skills: selectedSkills,
      },
    };

    router.push({
      pathname: '/pricing',
      params: { profileData: JSON.stringify(profileData) },
    });
  };

  const updateWorkPreferences = async (profileData: WorkPreference) => {
    setIsLoading(true);
    try {
      const user = await supabaseAuthClient.getUser();

      const workPref = {
        user_id: user.id,
        areas: JSON.stringify({
          distance: workDistance,
          latitude: coordinates?.latitude,
          longitude: coordinates?.longitude,
        }),
        time: JSON.stringify(timeSlots),
        experience: JSON.stringify(profileData.experience),
        pricing: JSON.stringify(profileData.pricing),
      };

      await supabaseDBClient.updateUserWorkPreference(workPref);

      Alert.alert('Success', 'work preferences saved successfully!');
      router.push('/account');
    } catch (error) {
      console.error('Error saving work preferences:', (error as Error).message);
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfileSetting = () => {
    if (!hourlyRate) return;

    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    const profileData = {
      ...previousData,
      pricing: {
        hourlyRate: parseFloat(hourlyRate),
      },
    };

    updateWorkPreferences(profileData);

    // 完成注册，跳转到主页或成功页面
  };

  return {
    address,
    hourlyRate,
    timeSlots,
    uploadingImage,
    isLoading,
    abnValid,
    validatingAbn,
    isBackgroundChecked,
    backgroundCheckImage,
    abn,
    myProfile,
    firstName,
    lastName,
    selectedRole,
    workDistance,
    coordinates,
    zoomDelta,
    checkTermsAcceptance,
    handleAcceptTerms,
    pickBackgroundCheckImage,
    createPersonalProfile,
    validateABN,
    validateABNOnline,
    handleAbnChange,
    validateAndSubmitProfile,
    setFirstName,
    setLastName,
    setAbn,
    setSelectedRole,
    setBackgroundCheckImage,
    setIsBackgroundChecked,
    updateUserAddress,
    getAddress,
    setAddress,
    fetchCoordinatesFromMyAddress,
    getDBWorkPref,
    navigateToWorkingTime,
    setWorkDistance,
    setZoomDelta,
    navigateToExperience,
    toggleTimeSlot,
    navigateToPricing,
    setHourlyRate,
    completeProfileSetting,
  };
};
