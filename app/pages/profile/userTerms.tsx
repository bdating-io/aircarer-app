import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function UserTerms() {
  const router = useRouter();
  const [isBottom, setIsBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    setIsBottom(isCloseToBottom);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">AGREEMENT</Text>
        </View>
      </View>

      {/* Terms Content */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text className="text-2xl font-bold mt-4 mb-2">Terms of Service</Text>
        <Text className="text-gray-500 mb-6">Last updated on 5/12/2022</Text>
        <View className="mb-8">
          <Text className="text-xl font-semibold mb-4">Clause 1</Text>
          <Text className="text-gray-600 mb-2">Some Terms and conditions</Text>

          <View className="ml-4 mb-4">
            <Text className="text-gray-600 mb-2">
              1. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              2. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              3. Some Terms and conditions
            </Text>
          </View>
        </View>
        <View className="mb-8">
          <Text className="text-xl font-semibold mb-4">Clause 2</Text>
          <Text className="text-gray-600 mb-2">Some Terms and conditions</Text>

          <View className="ml-4 mb-4">
            <Text className="text-gray-600 mb-2">
              1. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              2. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              3. Some Terms and conditions
            </Text>
          </View>
        </View>
        <View className="mb-8">
          <Text className="text-xl font-semibold mb-4">Clause 3</Text>
          <Text className="text-gray-600 mb-2">Some Terms and conditions</Text>

          <View className="ml-4 mb-4">
            <Text className="text-gray-600 mb-2">
              1. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              2. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              3. Some Terms and conditions
            </Text>
          </View>
          <View className="ml-4 mb-4">
            <Text className="text-gray-600 mb-2">
              1. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              2. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              3. Some Terms and conditions
            </Text>
          </View>
          <View className="ml-4 mb-4">
            <Text className="text-gray-600 mb-2">
              1. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              2. Some Terms and conditions
            </Text>
            <Text className="text-gray-600 mb-2">
              3. Some Terms and conditions
            </Text>
          </View>
        </View>
        <View className="h-20" /> {/* Bottom spacing */}
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="px-4 py-4 border-t border-gray-200">
        {!isBottom ? (
          <TouchableOpacity
            className="bg-gray-200 rounded-full py-3 items-center"
            onPress={scrollToBottom}
          >
            <Text>Scroll to Bottom</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-[#4A90E2] rounded-full py-3 items-center"
            onPress={() => router.push("/pages/profile/userProfile")}
          >
            <Text className="text-white font-medium">Accept & Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
