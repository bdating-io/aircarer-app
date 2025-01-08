import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ArrivalPage = () => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-black text-2xl font-bold text-center mb-4">
        Sign-in Page
      </Text>
      <TouchableOpacity className="bg-green-500 px-6 py-3 rounded-full shadow-lg">
        <Text className="text-white text-lg font-semibold">Mark Arrival</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-full shadow-lg mt-4">
        <Text className="text-white text-lg font-semibold">Upload Image</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-red-500 px-6 py-3 rounded-full shadow-lg mt-4">
        <Text className="text-white text-lg font-semibold">Request Repricing</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ArrivalPage;
