import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface PricingOption {
  type: string;
  bedrooms: number;
  bathrooms: number;
  price: string; // 改为string以便于输入处理
}

export default function ExpectedPricing() {
  const router = useRouter();
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([
    { type: "Studio", bedrooms: 0, bathrooms: 1, price: "30" },
    { type: "1 Bedroom 1 Bathroom", bedrooms: 1, bathrooms: 1, price: "40" },
    { type: "2 Bedrooms 1 Bathroom", bedrooms: 2, bathrooms: 1, price: "60" },
    { type: "2 Bedrooms 2 Bathrooms", bedrooms: 2, bathrooms: 2, price: "80" },
    { type: "3 Bedrooms 2 Bathrooms", bedrooms: 3, bathrooms: 2, price: "100" },
  ]);

  const handlePriceChange = (index: number, newPrice: string) => {
    const updatedOptions = [...pricingOptions];
    // 只允许输入数字
    const numericPrice = newPrice.replace(/[^0-9]/g, "");
    updatedOptions[index] = {
      ...updatedOptions[index],
      price: numericPrice,
    };
    setPricingOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Error", "Please login first");
        return;
      }

      // 更新用户 profile 中的 pricing
      const { error } = await supabase
        .from("profiles")
        .update({
          pricing: pricingOptions,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      Alert.alert("Success", "Pricing saved successfully");

      router.push("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to save pricing");
    }
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
            Expected your profile
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mt-6">
          <Text className="text-lg font-semibold mb-2">Expected Pricing</Text>
          <Text className="text-gray-500 mb-4">
            AirCare will notify you when tasks match your pricing mode
          </Text>

          {pricingOptions.map((option, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center border border-gray-200 rounded-lg p-4 mb-3"
            >
              <Text className="text-base">{option.type}</Text>
              <View className="flex-row items-center">
                <Text className="text-lg font-semibold">$ </Text>
                <TextInput
                  className="text-lg font-semibold w-16 text-right"
                  value={option.price}
                  onChangeText={(text) => handlePriceChange(index, text)}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-3 items-center"
          onPress={handleSubmit}
        >
          <Text className="text-white font-medium">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
