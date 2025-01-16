import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    // 处理登出逻辑
    router.push('/pages/authentication/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1B1B1B]">
      <View className="px-6 py-4">
        <Text className="text-white text-xl font-bold">Profile</Text>
      </View>

      <View className="flex-1 px-6">
        <View className="items-center py-8">
          <View className="w-24 h-24 bg-gray-700 rounded-full mb-4" />
          <Text className="text-white text-xl">User Name</Text>
        </View>

        {/* Profile Options */}
        <View className="space-y-4">
          <TouchableOpacity className="bg-white/10 p-4 rounded-lg">
            <Text className="text-white">Account Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-white/10 p-4 rounded-lg">
            <Text className="text-white">Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-red-500 p-4 rounded-lg mt-8"
            onPress={handleLogout}
          >
            <Text className="text-white text-center font-semibold">Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 