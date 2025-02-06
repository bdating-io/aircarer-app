import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function PropertyList() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const properties = [
    {
      address: "123 Oak st",
      location: "Burwood, VIC, 3920",
      details: "2 bedrooms, 2 bathrooms",
    },
    {
      address: "123 Oak st",
      location: "Burwood, VIC, 3920",
      details: "2 bedrooms, 2 bathrooms",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Property List</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Property Cards */}
        {properties.map((property, index) => (
          <View key={index} className="bg-gray-100 rounded-lg p-4 mb-4">
            <Text className="text-lg font-semibold">{property.address}</Text>
            <Text className="text-gray-600 mb-2">{property.location}</Text>
            <View className="flex-row items-center">
              <AntDesign name="home" size={16} color="gray" />
              <Text className="text-gray-600 ml-2">{property.details}</Text>
            </View>
          </View>
        ))}

        {/* Add New Property Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center border border-blue-500 rounded-lg p-4 mb-6"
          onPress={() => router.back()}
        >
          <AntDesign name="plus" size={20} color="#4A90E2" />
          <Text className="text-blue-500 ml-2">Add New Property</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Next Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-[#4A90E2] rounded-full py-3 items-center"
          onPress={() => {
            // Handle completion
            router.push("/(pages)/(profile)/(houseOwner)/houseOwner");
          }}
        >
          <Text className="text-white font-medium">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
