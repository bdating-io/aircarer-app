import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { ProfileData } from "@/types/type";

export default function HouseOwnerProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const profileData = JSON.parse(params.profileData as string) as ProfileData;
  const [address, setAddress] = useState("");
  const [roomCounts, setRoomCounts] = useState<string[]>([""]);
  const [specialRequirements, setSpecialRequirements] = useState({
    petCleaning: false,
    carpetCleaning: false,
    rangeHoodCleaning: false,
    ovenCleaning: false,
  });
  const [entryMethod, setEntryMethod] = useState("");

  const handleNext = () => {
    const propertyData = {
      address,
      roomCounts,
      specialRequirements,
      entryMethod,
    };

    router.push({
      pathname: "/pages/profile/propertyList",
      params: { propertyData: JSON.stringify(propertyData) },
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

      <ScrollView className="flex-1 px-4">
        {/* Address */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Address</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4"
            placeholder="111/111 Road Street, Melbourne"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Room Types */}
        <View className="mb-6">
          <Text className="text-gray-600 mb-2">Room Types</Text>
          <Text className="text-gray-400 text-sm mb-4">
            Rough description of why we are collecting these information
          </Text>

          <Text className="text-gray-600 mb-2">Bedroom</Text>
          {roomCounts.map((count, index) => (
            <TextInput
              key={index}
              className="border border-gray-300 rounded-lg p-3 mb-2"
              placeholder="1"
              value={count}
              onChangeText={(text) => {
                const newCounts = [...roomCounts];
                newCounts[index] = text;
                setRoomCounts(newCounts);
              }}
              keyboardType="numeric"
            />
          ))}
        </View>

        {/* Special Requirements */}
        <View className="mb-6">
          <Text className="text-gray-600 mb-4">Special Requirement</Text>
          <Text className="text-gray-400 text-sm mb-4">
            Rough description of why we are collecting these information
          </Text>

          {/* Pet Cleaning */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600">Pet cleaning</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                className={`px-6 py-2 rounded-full border ${
                  specialRequirements.petCleaning
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onPress={() =>
                  setSpecialRequirements((prev) => ({
                    ...prev,
                    petCleaning: true,
                  }))
                }
              >
                <Text
                  className={
                    specialRequirements.petCleaning
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  YES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-6 py-2 rounded-full border ${
                  !specialRequirements.petCleaning
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onPress={() =>
                  setSpecialRequirements((prev) => ({
                    ...prev,
                    petCleaning: false,
                  }))
                }
              >
                <Text
                  className={
                    !specialRequirements.petCleaning
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Carpet Cleaning */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600">Carpet cleaning</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                className={`px-6 py-2 rounded-full border ${
                  specialRequirements.carpetCleaning
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onPress={() =>
                  setSpecialRequirements((prev) => ({
                    ...prev,
                    carpetCleaning: true,
                  }))
                }
              >
                <Text
                  className={
                    specialRequirements.carpetCleaning
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  YES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-6 py-2 rounded-full border ${
                  !specialRequirements.carpetCleaning
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onPress={() =>
                  setSpecialRequirements((prev) => ({
                    ...prev,
                    carpetCleaning: false,
                  }))
                }
              >
                <Text
                  className={
                    !specialRequirements.carpetCleaning
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Range Hood Cleaning */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600">Range hood cleaning</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                className={`px-6 py-2 rounded-full border ${
                  specialRequirements.rangeHoodCleaning
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onPress={() =>
                  setSpecialRequirements((prev) => ({
                    ...prev,
                    rangeHoodCleaning: true,
                  }))
                }
              >
                <Text
                  className={
                    specialRequirements.rangeHoodCleaning
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  YES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-6 py-2 rounded-full border ${
                  !specialRequirements.rangeHoodCleaning
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onPress={() =>
                  setSpecialRequirements((prev) => ({
                    ...prev,
                    rangeHoodCleaning: false,
                  }))
                }
              >
                <Text
                  className={
                    !specialRequirements.rangeHoodCleaning
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Oven Cleaning */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600">Oven cleaning</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                className={`px-6 py-2 rounded-full border ${
                  specialRequirements.ovenCleaning
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onPress={() =>
                  setSpecialRequirements((prev) => ({
                    ...prev,
                    ovenCleaning: true,
                  }))
                }
              >
                <Text
                  className={
                    specialRequirements.ovenCleaning
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  YES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-6 py-2 rounded-full border ${
                  !specialRequirements.ovenCleaning
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onPress={() =>
                  setSpecialRequirements((prev) => ({
                    ...prev,
                    ovenCleaning: false,
                  }))
                }
              >
                <Text
                  className={
                    !specialRequirements.ovenCleaning
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Entry Method */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-gray-600">Entry Method</Text>
            <Text className="text-gray-600 ml-2">(compulsory)</Text>
            <TouchableOpacity className="ml-2">
              <AntDesign name="questioncircleo" size={16} color="gray" />
            </TouchableOpacity>
          </View>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter method details"
            value={entryMethod}
            onChangeText={setEntryMethod}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Add New Property Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center border border-blue-500 rounded-lg p-4 mb-6"
          onPress={() => {
            // Handle add new property
          }}
        >
          <AntDesign name="plus" size={20} color="#4A90E2" />
          <Text className="text-blue-500 ml-2">Add New Property</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Next Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-[#4A90E2] rounded-full py-3 items-center"
          onPress={handleNext}
        >
          <Text className="text-white font-medium">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
