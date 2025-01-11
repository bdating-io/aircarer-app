import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { TaskInfo } from "@/types/type";

// Example data
const taskInfo: TaskInfo = {
  date: "2024-03-20",
  time: "14:00-16:00",
  budget: 150,
  rooms: ["Bedroom", "Kitchen", "Bathroom", "Living Room"],
  photos: ["../../assets/images/task1.png"],
  needsBedding: true,
};

export default function TaskInfoCard() {
  const handleAccept = () => {
    console.log("Task accepted");
  };

  const handleDecline = () => {
    console.log("Task declined");
  };

  return (
    <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-gray-900 font-bold text-xl">Task Details</Text>
          <Text className="text-gray-500 mt-1">Review task information</Text>
        </View>
        <View className="bg-blue-100 px-3 py-1 rounded-full">
          <Text className="text-blue-600 font-medium">${taskInfo.budget}</Text>
        </View>
      </View>

      {/* Time and Date */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <View className="flex-row items-center mb-2">
          <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
            <Text>🕒</Text>
          </View>
          <View>
            <Text className="text-gray-700 font-semibold">{taskInfo.date}</Text>
            <Text className="text-gray-500">{taskInfo.time}</Text>
          </View>
        </View>
      </View>

      {/* Rooms Required */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">Rooms to Clean</Text>
        <View className="flex-row flex-wrap gap-2">
          {taskInfo.rooms.map((room, index) => (
            <View
              key={index}
              className="bg-gray-50 px-3 py-2 rounded-full border border-gray-200"
            >
              <Text className="text-gray-600">{room}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Photos */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">
          Current State Photos
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {taskInfo.photos.map((photo, index) => (
              <View
                key={index}
                className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden"
              >
                <Image
                  source={{ uri: "../../assets/images/task1.png" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Bedding Requirement */}
      <View className="bg-gray-50 rounded-xl p-4 mb-6">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
            <Text>🛏️</Text>
          </View>
          <View>
            <Text className="text-gray-700 font-semibold">Bedding Change</Text>
            <Text className="text-gray-500">
              {taskInfo.needsBedding ? "Required" : "Not Required"}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={handleAccept}
          className="flex-1 bg-primary-500 p-4 rounded-xl hover:bg-green-200"
        >
          <Text className="text-white text-center font-semibold text-primary">
            Accept Task
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDecline}
          className="flex-1 bg-primary-500 p-4 rounded-xl hover:bg-green-200"
        >
          <Text className=" text-center font-semibold text-white ">
            Decline
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
