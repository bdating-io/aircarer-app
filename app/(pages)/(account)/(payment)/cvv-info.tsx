import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CVVInfo() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">
          What is CVC/CVV code?
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="mb-4">
          The CVC/CVV code (Card Verification Code/Value) is the 3 or 4 digit
          number found on the back of your card or on the front for American
          Express cards.
        </Text>

        <View className="bg-gray-100 h-40 rounded-lg mb-4 justify-center items-center">
          <Text className="text-gray-400">CVV Example Image</Text>
          {/* 如果您有图片，请使用: */}
          {/* <Image 
            source={require('@/assets/images/cvv-example.png')} 
            className="h-full w-full rounded-lg"
            resizeMode="contain"
          /> */}
        </View>

        <Text className="text-gray-700 mb-4">
          This code provides an additional layer of security when making online
          transactions and helps verify that you, the cardholder, are
          authorizing the purchase.
        </Text>

        <Text className="font-medium mb-2">Where to find it:</Text>
        <Text className="mb-4">
          • Visa, Mastercard, Discover: 3 digits on the back of your card, to
          the right of the signature strip.
        </Text>
        <Text className="mb-4">
          • American Express: 4 digits on the front of your card, above and to
          the right of your card number.
        </Text>
      </ScrollView>

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={() => router.back()}
        >
          <Text className="text-white text-center">Got it</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
