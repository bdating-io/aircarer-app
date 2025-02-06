import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useStore from "../../utils/store";

export default function Settings() {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(22);
  const [language, setLanguage] = useState("English");
  const [character, setCharacter] = useState("House Owner");

  const handleIncreaseFontSize = () => {
    if (fontSize < 30) {
      setFontSize(fontSize + 2);
    } else {
      Alert.alert("Maximum font size reached");
    }
  };

  const handleDecreaseFontSize = () => {
    if (fontSize > 14) {
      setFontSize(fontSize - 2);
    } else {
      Alert.alert("Minimum font size reached");
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "English" ? "中文" : "English");
  };

  const toggleCharacter = () => {
    setCharacter(
      character === "House Owner" ? "Service Provider" : "House Owner"
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold mr-6">
          Settings
        </Text>
      </View>

      <View className="flex-1 px-4 pt-4">
        {/* Font Size Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Font Size</Text>
          <View className="space-y-2">
            <Text className="text-gray-500">Current Font size: {fontSize}</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className="bg-[#4A90E2] flex-1 py-3 rounded-lg"
                onPress={handleIncreaseFontSize}
              >
                <Text className="text-white text-center">+ increase</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#4A90E2] flex-1 py-3 rounded-lg"
                onPress={handleDecreaseFontSize}
              >
                <Text className="text-white text-center">- decrease</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Language Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Language</Text>
          <TouchableOpacity
            className="bg-[#4A90E2] py-3 rounded-lg"
            onPress={toggleLanguage}
          >
            <Text className="text-white text-center">{language}</Text>
          </TouchableOpacity>
        </View>

        {/* Character Type Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">
            Change your character
          </Text>
          <TouchableOpacity
            className="bg-[#4A90E2] py-3 rounded-lg"
            onPress={toggleCharacter}
          >
            <Text className="text-white text-center">{character}</Text>
          </TouchableOpacity>
        </View>

        {/* Report Bug Section */}
        <View className="mt-auto mb-6">
          <TouchableOpacity
            className="bg-[#FF6B6B] py-3 rounded-lg"
            onPress={() => {
              Alert.alert("Report Bug", "Would you like to report a bug?", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Report",
                  onPress: () => {
                    // Handle bug report
                    Alert.alert("Thank you", "Your report has been submitted.");
                  },
                },
              ]);
            }}
          >
            <Text className="text-white text-center">Report bug</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
