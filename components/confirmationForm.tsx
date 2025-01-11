import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function ConfirmationForm() {
  const [estimatedTime, setEstimatedTime] = useState("");

  const handleSubmit = () => {
    // Handle the submission of estimated time
    console.log("Estimated arrival time:", estimatedTime);
  };

  return (
    <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
          <Text className="text-purple-600 font-bold">⏰</Text>
        </View>
        <View>
          <Text className="text-gray-900 font-bold text-xl">Arrival Time</Text>
          <Text className="text-gray-500 mt-1">
            Enter your estimated arrival
          </Text>
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-gray-700 font-medium mb-2">
          Estimated Arrival Time
        </Text>
        <TextInput
          value={estimatedTime}
          onChangeText={setEstimatedTime}
          placeholder="e.g., 10:30 AM"
          className="bg-white border border-gray-200 rounded-lg p-3 mb-4"
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-purple-500 p-4 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            Confirm Arrival Time
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center">
        <View className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
        <Text className="text-gray-600">
          Customer will be notified of your estimated arrival time
        </Text>
      </View>
    </View>
  );
}
