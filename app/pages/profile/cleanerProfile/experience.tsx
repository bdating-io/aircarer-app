import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function Experience() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [yearsExperience, setYearsExperience] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills = [
    "Deep Cleaning",
    "Window Cleaning",
    "Carpet Cleaning",
    "Oven Cleaning",
    "Pet Friendly",
    "Move In/Out",
    "Laundry",
    "Ironing",
  ];

  const handleNext = () => {
    if (!yearsExperience) return;

    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    const profileData = {
      ...previousData,
      experience: {
        years: yearsExperience,
        skills: selectedSkills,
      },
    };

    router.push({
      pathname: "/pages/profile/cleanerProfile/pricing",
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
            Experience & Skills
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mt-6">
          <Text className="text-gray-700 text-lg font-medium mb-2">
            Years of Experience
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 mb-6"
            placeholder="Enter years of experience"
            value={yearsExperience}
            onChangeText={setYearsExperience}
            keyboardType="numeric"
          />
        </View>

        <View>
          <Text className="text-gray-700 text-lg font-medium mb-4">
            Select your skills
          </Text>
          <View className="flex-row flex-wrap">
            {skills.map((skill) => (
              <TouchableOpacity
                key={skill}
                className={`m-1 px-4 py-2 rounded-full border ${
                  selectedSkills.includes(skill)
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
                onPress={() => {
                  setSelectedSkills((prev) =>
                    prev.includes(skill)
                      ? prev.filter((s) => s !== skill)
                      : [...prev, skill]
                  );
                }}
              >
                <Text
                  className={
                    selectedSkills.includes(skill)
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-lg py-4 items-center ${
            yearsExperience ? "bg-[#4A90E2]" : "bg-gray-200"
          }`}
          onPress={handleNext}
          disabled={!yearsExperience}
        >
          <Text
            className={`font-medium ${
              yearsExperience ? "text-white" : "text-gray-500"
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
