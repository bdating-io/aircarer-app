import { RoomPhotos, RoomType } from '@/types/task';
import { useImagePicker } from '@/utils/imagePicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { supabaseStorageClient } from '@/clients/supabase/storage';
import { supabaseDBClient } from '@/clients/supabase/database';

export const usePhotoViewModel = () => {
  const [uploadedImages, setUploadedImages] = useState<RoomPhotos>({
    entrance: [],
    living_room: [],
    bedroom: [],
    kitchen: [],
    bathroom: [],
    laundry: [],
    other: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { checkPermissions, takePhoto, pickImage } = useImagePicker();

  const handleSelectImage = async (roomId: RoomType) => {
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) return;

      const result = await pickImage();
      if (!result.canceled) {
        //if multiple images are selected, upload all of them
        const newUris = result.assets.map((asset) => asset.uri);
        setUploadedImages((prev) => ({
          ...prev,
          [roomId]: [...prev[roomId], ...newUris],
        }));
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleTakePhoto = async (roomId: RoomType) => {
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) return;

      const result = await takePhoto();
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

  const saveImageAndContinue = async (taskId: string) => {
    const hasAnyImage = Object.values(uploadedImages).some(
      (urls) => urls.length > 0,
    );
    if (!hasAnyImage) {
      Alert.alert('Required', 'Please select at least one photo');
      return;
    }

    setIsLoading(true);

    try {
      // 获取当前进行中的任务

      // 上传所有照片
      for (const [roomId, uris] of Object.entries(uploadedImages)) {
        //per roomtype
        if (uris.length === 0) continue;
        for (const uri of uris) {
          //per image
          try {
            // 读取文件内容为 base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

            // 创建唯一文件名
            const fileName = `${taskId}/${roomId}/before_${Date.now()}_${Math.random()
              .toString(36)
              .substring(7)}.jpg`;

            // 上传到 Supabase Storage
            await supabaseStorageClient.uploadCleaningPhoto(fileName, base64);

            // 获取公共 URL
            const publicUrl = supabaseStorageClient.getPublicUrl(fileName);
            // 保存照片记录
            await supabaseDBClient.insertRoomPhoto(
              taskId,
              roomId,
              publicUrl.publicUrl,
              'before',
            );
          } catch (error) {
            console.error('Upload or Insert Error:', error);
            continue; // 继续处理其他照片
          }
        }
      }
      console.debug('Uploaded all images successfully');
      router.push({
        pathname: '/cleaningGuide',
        params: { taskId: taskId },
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to save photos');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadedImages,
    isLoading,
    handleSelectImage,
    handleTakePhoto,
    handleRemoveImage,
    saveImageAndContinue,
  };
};
