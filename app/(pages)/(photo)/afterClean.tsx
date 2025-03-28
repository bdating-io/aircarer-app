import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/clients/supabase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

type RoomType = 'entrance' | 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'laundry' | 'other';

interface RoomPhotos {
  [key: string]: string[];
}

export default function AfterCleaning() {
  const { taskId } = useLocalSearchParams();
  const [uploadedImages, setUploadedImages] = useState<RoomPhotos>({
    entrance: [],
    living_room: [],
    bedroom: [],
    kitchen: [],
    bathroom: [],
    laundry: [],
    other: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const rooms = [
   {
      id: 'entrance' as RoomType,
      label: 'Entrance',
      description: '1) Entrance area. 2) lock.',
    },
    {
      id: 'living_room' as RoomType,
      label: 'Living Room',
      description: '1) Sitting area. 2) TV stand area. 3) Waste bin.',
    },
    {
      id: 'bedroom' as RoomType,
      label: 'Bedrooms',
      description: '1) Full view of bed. 2) Nightstand area. 3) Wardrobe area.',
    },
    {
      id: 'kitchen' as RoomType,
      label: 'Kitchen',
      description: '1) Sink, 2) Countertop, 3) Stove, 4) Fridge, 5) Microwave.',
    },
    {
      id: 'bathroom' as RoomType,
      label: 'Bathrooms',
      description: '1) Toilet bowl, 2) Sink, 3) Shower screen. 4) Shower drain',
    },
     {
      id: 'laundry' as RoomType,
      label: 'Laundry/Balcony',
      description: '1) Washing machine/dryer, 2) Balcony.',
    },
    { id: 'other' as RoomType, label: 'Other', description: 'Other areas' },
  ];

  const handleSelectImage = async (roomId: RoomType) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Please grant camera roll permissions',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setUploadedImages((prev) => ({
          ...prev,
          [roomId]: [...prev[roomId], result.assets[0].uri],
        }));
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleTakePhoto = async (roomId: RoomType) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setUploadedImages((prev) => ({
          ...prev,
          [roomId]: [...prev[roomId], result.assets[0].uri],
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleRemoveImage = (roomId: RoomType, index: number) => {
    setUploadedImages((prev) => ({
      ...prev,
      [roomId]: prev[roomId].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    const hasAnyImage = Object.values(uploadedImages).some(
      (urls) => urls.length > 0,
    );
    if (!hasAnyImage) {
      Alert.alert('Required', 'Please select at least one photo');
      return;
    }

    setIsUploading(true);

    try {
      for (const [roomId, uris] of Object.entries(uploadedImages)) {
        if (uris.length === 0) continue;

        for (const uri of uris) {
          try {
            // 读取文件内容为 base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

            // 创建唯一文件名
            const fileName = `${taskId}/${roomId}/after_${Date.now()}_${Math.random()
              .toString(36)
              .substring(7)}.jpg`;

            // 上传到 Supabase Storage
            const { error: uploadError } = await supabase.storage
              .from('cleaning-photos')
              .upload(fileName, decode(base64), {
                contentType: 'image/jpeg',
                cacheControl: '3600',
              });

            if (uploadError) throw uploadError;

            // 获取公共 URL
            const {
              data: { publicUrl },
            } = supabase.storage.from('cleaning-photos').getPublicUrl(fileName);

            // 保存照片记录
            await supabase.from('room_photos').insert([
              {
                task_id: taskId,
                room_type: roomId,
                photo_type: 'after',
                photo_url: publicUrl,
              },
            ]);
          } catch (uploadError) {
            console.error('Upload error:', uploadError);
            continue; // 继续处理其他照片
          }
        }
      }

      //TODO: update task status to completed
       const { error: updateError } = await supabase
              .from('tasks')
              .update({
                status: 'Completed', // 更新状态为 Completed
              })
              .eq('task_id', taskId);

            if (updateError) {
              console.error('Error updating task:', updateError);
              throw updateError;
            }
      Alert.alert('Success', 'After cleaning photos uploaded successfully', [
        {
          text: 'OK',
          onPress: () => {
            // 导航回任务详情页面
              router.push({
                pathname: '/(pages)/(tasks)/task',
                params: { taskId: taskId },
              })
          },
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to save photos');
    } finally {
      setIsUploading(false);
    }
  };

  // 辅助函数：将 base64 字符串解码为 Uint8Array
  function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800">
            After Cleaning Photos
          </Text>
          <Text className="text-gray-600 mt-1">
            Upload photos of each area after cleaning
          </Text>
        </View>

        {rooms.map((room) => (
          <View key={room.id} className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-gray-800">
                {room.label}
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => handleTakePhoto(room.id)}
                  className="bg-blue-500 p-2 rounded-full mr-2"
                >
                  <Ionicons name="camera" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSelectImage(room.id)}
                  className="bg-green-500 p-2 rounded-full"
                >
                  <Ionicons name="images" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              horizontal
              className="mb-2"
              showsHorizontalScrollIndicator={false}
            >
              {uploadedImages[room.id].map((uri, index) => (
                <View key={index} className="mr-2">
                  <Image
                    source={{ uri }}
                    style={{ width: 120, height: 120, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                    onPress={() => handleRemoveImage(room.id, index)}
                  >
                    <Text className="text-white text-sm">×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {uploadedImages[room.id].length === 0 && (
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 8,
                    backgroundColor: '#f3f4f6',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text className="text-gray-400">No photos</Text>
                </View>
              )}
            </ScrollView>
            <Text className="text-gray-500 text-sm">{room.description}</Text>
          </View>
        ))}

        <View className="mt-4 mb-8">
          <TouchableOpacity
            className={`py-4 rounded-lg items-center ${
              isUploading
                ? 'bg-gray-400'
                : Object.values(uploadedImages).some((urls) => urls.length > 0)
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
            }`}
            onPress={handleSave}
            disabled={isUploading}
          >
            {isUploading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-bold ml-2">Uploading...</Text>
              </View>
            ) : (
              <Text className="text-white font-bold">
                Save Photos & Complete Task
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 rounded-lg items-center bg-gray-500 mt-4"
            onPress={() => router.back()}
            disabled={isUploading}
          >
            <Text className="text-white font-bold">Back to Cleaning Guide</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
