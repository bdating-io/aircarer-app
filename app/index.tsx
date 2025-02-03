import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      {/* 应用名称或欢迎文案 */}
      <Text className="text-black text-2xl font-bold text-center mb-6">
        AirCarer
      </Text>

      {/* 跳转按钮 */}
      <Link href="../launch" asChild>
        <TouchableOpacity className="bg-[#4E89CE] px-6 py-3 rounded-full">
          <Text className="text-white text-base font-semibold">
            Go to launch a cleaning task
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
