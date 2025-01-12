import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View className="flex-1 bg-[#1e3a8a]">
      {/* Logo and Hero Section */}
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-white text-3xl font-bold mb-2">AirCarer</Text>
        <Text className="text-white/80 text-lg mb-8">Get cleaning done</Text>

        {/* Hero Image */}
      </View>

      {/* Bottom Action Section */}
      <View className="bg-white rounded-t-3xl p-6">
        {/* Buttons */}
        <View className="flex-row gap-4 mb-6">
          <Link href="/pages/authentication/login" asChild>
            <TouchableOpacity className="flex-1 bg-[#ef4444] py-3 rounded-full">
              <Text className="text-white text-center font-semibold text-lg">
                Log in
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/pages/authentication/signUpPage" asChild>
            <TouchableOpacity className="flex-1 bg-[#1e3a8a] py-3 rounded-full">
              <Text className="text-white text-center font-semibold text-lg">
                Sign up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Language Toggle */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600">English | 中文</Text>
        </View>
      </View>
    </View>
  );
}
