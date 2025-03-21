import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProfileViewModel } from '@/viewModels/profileViewModel';

export default function UserTerms() {
  const router = useRouter();
  const [isBottom, setIsBottom] = useState(false);
  const { isLoading, checkTermsAcceptance, handleAcceptTerms } =
    useProfileViewModel();

  // 检查用户是否已同意条款
  useEffect(() => {
    checkTermsAcceptance();
  }, []);

  const handleScroll = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    setIsBottom(isCloseToBottom);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Terms of Service</Text>
        </View>
      </View>

      {/* Terms Content */}
      <ScrollView
        className="flex-1 px-4"
        onScroll={({ nativeEvent }) => handleScroll(nativeEvent)}
        scrollEventThrottle={400}
      >
        <Text className="text-2xl font-bold mt-4 mb-2">Terms of Service</Text>
        <Text className="text-gray-500 mb-6">Last updated: May 2024</Text>

        {/* Terms Sections */}
        {[1, 2, 3].map((section) => (
          <View key={section} className="mb-8">
            <Text className="text-xl font-semibold mb-4">
              Section {section}
            </Text>
            <Text className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
            {[1, 2, 3].map((point) => (
              <View key={point} className="ml-4 mb-2">
                <Text className="text-gray-600">
                  {point}. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
              </View>
            ))}
          </View>
        ))}

        <View className="h-20" />
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        {!isBottom ? (
          <TouchableOpacity
            className="bg-gray-200 rounded-lg py-3"
            onPress={() => {
              // 模拟滚动到底部
              setIsBottom(true);
            }}
          >
            <Text className="text-center">Scroll to Bottom</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-[#4A90E2] rounded-lg py-3"
            onPress={handleAcceptTerms}
          >
            <Text className="text-white text-center font-medium">
              Accept & Continue
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
