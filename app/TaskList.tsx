import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TaskList() {
  const navigation = useNavigation();

  // 跳转到指定页面
  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <View className="flex-1 bg-primary-100 px-6 py-4">
      {/* Header */}
      <View className="bg-primary-500 py-4 px-6 mb-4">
        <Text className="text-white text-xl font-JakartaBold text-center">
          Task Detail
        </Text>
      </View>

      {/* Task Info */}
      <Text className="text-black text-lg font-JakartaBold mb-2">
        Living Room
      </Text>

      <View className="bg-primary-100 p-4 rounded-lg mb-4">
        <Text className="text-primary-500 text-lg font-JakartaBold">
          Take a photo for kitchen
        </Text>
        <Text className="text-gray-600 text-base">
          Photo taking instructions
        </Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        className="border border-gray-400 bg-secondary-100 py-4 rounded-lg mb-4"
        onPress={() => handleNavigation("instruction")}
      >
        <Text className="text-black text-center text-lg font-JakartaBold">
          Before Cleaning
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-gray-400 bg-secondary-100 py-4 rounded-lg mb-4"
        onPress={() => handleNavigation("task")}
      >
        <Text className="text-black text-center text-lg font-JakartaBold">
          Task Details
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-gray-400 bg-secondary-100 py-4 rounded-lg mb-4"
        onPress={() => Alert.alert("After Cleaning", "Feature not implemented yet.")}
      >
        <Text className="text-black text-center text-lg font-JakartaBold">
          After Cleaning
        </Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity
        className="bg-primary-500 py-4 rounded-lg"
        onPress={() => Alert.alert("Next", "Proceed to the next step.")}
      >
        <Text className="text-white text-center text-lg font-JakartaBold">
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}
