import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function TaskDetail() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Task Detail</Text>

      {/* Take a photo */}
      <View className="w-full bg-gray-100 rounded-lg p-6 mb-6">
        <Text className="text-lg font-bold">Take a photo for kitchen</Text>
        <Text className="text-gray-500 mt-2">Photo taking instructions</Text>
      </View>

      {/* Before Cleaning Button */}
      <TouchableOpacity
        className="w-full bg-gray-100 rounded-lg p-4 mb-4 flex justify-center items-center"
        onPress={() => router.push("/(pages)/(photo)/beforeClean")}
      >
        <Text className="text-lg font-bold">Before Cleaning</Text>
      </TouchableOpacity>

      {/* Task Details Button */}

      <TouchableOpacity
        className="w-full bg-gray-100 rounded-lg p-4 mb-4 flex justify-center items-center"
        onPress={() => router.push("/(pages)/(photo)/taskDetails")}
      >
        <Text className="text-lg font-bold">Task Details</Text>
      </TouchableOpacity>

      {/* After Cleaning Button */}
      
      <TouchableOpacity
        className="w-full bg-gray-100 rounded-lg p-4 mb-4 flex justify-center items-center"
        onPress={() => router.push("/(pages)/(photo)/beforeClean")}
      >
        <Text className="text-lg font-bold">After Cleaning</Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity className="bg-blue-500 py-4 px-6 rounded-lg">
        <Text className="text-white text-lg text-center">Next</Text>
      </TouchableOpacity>
    </View>
  );
}
