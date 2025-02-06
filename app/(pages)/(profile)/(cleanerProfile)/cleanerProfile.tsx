import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function CleanerAddress() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [address, setAddress] = useState("");

  const handleNext = () => {
    if (!address.trim()) {
      // Show error
      return;
    }

    // 获取之前页面传来的数据
    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    // 合并数据
    const profileData = {
      ...previousData,
      address,
    };

    // 跳转到下一个页面
    router.push({
      pathname: "/experience",
      params: { profileData: JSON.stringify(profileData) },
    });
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

      {/* Content */}
      <View className="flex-1 px-4">
        {/* Address Input */}
        <View className="mt-6">
          <Text className="text-gray-700 text-lg font-medium mb-2">
            Address
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4"
            placeholder="111/111 Road Street, Melbourne"
            value={address}
            onChangeText={setAddress}
            autoFocus
          />
        </View>
      </View>

      {/* Next Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-lg py-4 items-center ${
            address.trim() ? "bg-[#4A90E2]" : "bg-gray-200"
          }`}
          onPress={handleNext}
          disabled={!address.trim()}
        >
          <Text
            className={`font-medium ${
              address.trim() ? "text-white" : "text-gray-500"
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
