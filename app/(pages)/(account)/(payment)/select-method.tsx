import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectPaymentMethod() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">Add Payment Method</Text>
      </View>

      <View className="flex-1 p-4">
        <Text className="text-lg mb-2">Payment Method</Text>
        <Text className="text-gray-500 mb-6">
          Choose your preferred payment method
        </Text>

        <TouchableOpacity
          className="border border-gray-300 rounded-lg p-4 mb-4 flex-row items-center"
          onPress={() => router.push("/(pages)/(account)/(payment)/add-bank-account")}
        >
          <Ionicons name="wallet-outline" size={24} color="#4A90E2" />
          <Text className="ml-3">BSB and Account Number</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-gray-300 rounded-lg p-4 mb-4 flex-row items-center"
          onPress={() => router.push("/(pages)/(account)/(payment)/add-credit-card")}
        >
          <MaterialCommunityIcons name="credit-card" size={24} color="#4A90E2" />
          <Text className="ml-3">Credit Card</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={() => router.back()}
        >
          <Text className="text-white text-center">Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 