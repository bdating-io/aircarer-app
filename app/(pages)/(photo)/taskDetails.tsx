import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function TaskDetails() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white p-4">
      {/* 标题 */}
      <Text className="text-2xl font-bold mb-2">Task Title</Text>
      <Text className="text-gray-500 mb-6">Brief description of task</Text>

      {/* 图片部分 */}
      <View className="mb-6">
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            backgroundColor: "#e0e0e0",
            alignSelf: "center",
          }}
        />
        <Text className="text-center mt-2 text-gray-600">Photo 1</Text>
      </View>

      {/* 任务细节部分 */}
      <View className="bg-gray-100 rounded-lg p-4 mb-6">
        <Text className="text-lg font-bold mb-2">
          How to access the cleaning tools
        </Text>
        <Text>1. Get the key from somewhere</Text>
        <Text>2. Use the key to open the lock of the small room</Text>
        <Text>3. The cleaning tool is inside</Text>
      </View>

      {/* 返回按钮 */}
      <TouchableOpacity
        onPress={() => router.push("/(pages)/(photo)/task")}
        className="bg-blue-500 py-4 px-6 rounded-lg"
      >
        <Text className="text-white text-center text-lg font-bold">Back</Text>
      </TouchableOpacity>
    </View>
  );
}
