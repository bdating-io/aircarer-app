import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

interface Task {
  id: string;
  date: string;
  time: string;
  budget: number;
  location: string;
  rooms: string[];
  status: "pending" | "accepted" | "completed";
}

// Example data
const tasks: Task[] = [
  {
    id: "1",
    date: "2024-03-20",
    time: "14:00-16:00",
    budget: 150,
    location: "123 Main St, City",
    rooms: ["Bedroom", "Kitchen"],
    status: "pending",
  },
  {
    id: "2",
    date: "2024-03-21",
    time: "10:00-12:00",
    budget: 120,
    location: "456 Park Ave, City",
    rooms: ["Living Room", "Bathroom"],
    status: "pending",
  },
];

export default function TaskList() {
  const handleTaskPress = (taskId: string) => {
    router.push(`/pages/taskPreparation/taskAccept?id=${taskId}`);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Available Tasks
        </Text>

        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            onPress={() => handleTaskPress(task.id)}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
          >
            {/* Task Header */}
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-blue-600 font-bold">🏠</Text>
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold">
                    House Cleaning
                  </Text>
                  <Text className="text-gray-500 text-sm">{task.location}</Text>
                </View>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-600 font-medium">
                  ${task.budget}
                </Text>
              </View>
            </View>

            {/* Task Details */}
            <View className="bg-gray-50 rounded-lg p-3">
              {/* Date & Time */}
              <View className="flex-row items-center mb-2">
                <Text className="text-gray-600 mr-4">📅 {task.date}</Text>
                <Text className="text-gray-600">⏰ {task.time}</Text>
              </View>

              {/* Rooms */}
              <View className="flex-row flex-wrap gap-2">
                {task.rooms.map((room, index) => (
                  <View
                    key={index}
                    className="bg-white px-3 py-1 rounded-full border border-gray-200"
                  >
                    <Text className="text-gray-600 text-sm">{room}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Button */}
            <View className="mt-3">
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-lg"
                onPress={() => handleTaskPress(task.id)}
              >
                <Text className="text-white text-center font-semibold">
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
