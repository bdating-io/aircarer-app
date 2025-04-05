import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePhotoViewModel } from '@/viewModels/photoViewModel';
import { roomConfigurations } from '@/constants/rooms';

export default function BeforeCleaning() {
  const { taskId } = useLocalSearchParams();

  const router = useRouter();
  const {
    handleSelectImage,
    handleTakePhoto,
    handleRemoveImage,
    saveImageAndContinue,
    uploadedImages,
    isLoading,
  } = usePhotoViewModel();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-blue-500 p-4 pt-16">
        <Text className="text-white text-xl font-semibold">
          Before Cleaning Photos
        </Text>
        <Text className="text-white text-lg font-normal">
          Upload photos of each area before cleaning
        </Text>
      </View>
      <ScrollView className="p-4">
        {roomConfigurations.map((room) => (
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
              isLoading
                ? 'bg-gray-400'
                : Object.values(uploadedImages).some((urls) => urls.length > 0)
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
            }`}
            onPress={() => saveImageAndContinue(taskId as string)}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-bold ml-2">Uploading...</Text>
              </View>
            ) : (
              <Text className="text-white font-bold">
                Save Photos & View Cleaning Guide
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 rounded-lg items-center bg-gray-500 mt-4"
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Text className="text-white font-bold">Back to Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
