import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function WorkingArea() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const areas = [
    "Melbourne CBD",
    "South Melbourne",
    "North Melbourne",
    "East Melbourne",
    "West Melbourne",
    "Docklands",
    "Carlton",
    "Fitzroy",
  ];

  const handleNext = () => {
    if (selectedAreas.length === 0) return;

    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    const profileData = {
      ...previousData,
      workingAreas: selectedAreas,
    };

    router.push({
      pathname: "/workingTime",
      params: { profileData: JSON.stringify(profileData) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">
            Select Working Areas
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <Text className="text-gray-600 mt-6 mb-4">
          Select the areas where you'd like to work
        </Text>

        <View className="flex-row flex-wrap">
          {areas.map((area) => (
            <TouchableOpacity
              key={area}
              className={`m-1 px-4 py-2 rounded-full border ${
                selectedAreas.includes(area)
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300"
              }`}
              onPress={() => {
                setSelectedAreas((prev) =>
                  prev.includes(area)
                    ? prev.filter((a) => a !== area)
                    : [...prev, area]
                );
              }}
            >
              <Text
                className={
                  selectedAreas.includes(area) ? "text-white" : "text-gray-600"
                }
              >
                {area}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-lg py-4 items-center ${
            selectedAreas.length > 0 ? "bg-[#4A90E2]" : "bg-gray-200"
          }`}
          onPress={handleNext}
          disabled={selectedAreas.length === 0}
        >
          <Text
            className={`font-medium ${
              selectedAreas.length > 0 ? "text-white" : "text-gray-500"
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
