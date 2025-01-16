import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#1B1B1B]">
      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo and Title Section */}
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-bold">AirCarer</Text>
          <Text className="text-white text-3xl font-bold">AirCarer</Text>
          <Text className="text-gray-400 mt-2">Get cleaning done</Text>
        </View>

        {/* Login/Signup Buttons */}
        <View className="w-full space-y-4 mt-8">
          <TouchableOpacity
            className="w-full bg-[#FF6B6B] rounded-xl py-4"
            onPress={() => router.push("/pages/authentication/login")}
          >
            <Text className="text-white text-center font-semibold">Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-[#4A90E2] rounded-xl py-4"
            onPress={() => router.push("/pages/authentication/signup")}
          >
            <Text className="text-white text-center font-semibold">
              Sign up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Selector */}
        <View className="flex-row mt-8">
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-gray-400">English</Text>
            <Text className="text-gray-400 mx-2">|</Text>
            <Text className="text-gray-400">中文</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
