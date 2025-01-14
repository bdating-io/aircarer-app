import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Task } from "@/types/type";
import { router } from "expo-router";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const mockTask: Task = {
      id: "1",
      date: "2024-03-20",
      time: "14:00-16:00",
      budget: 150,
      location: "123 Main St, City",
      rooms: ["Bedroom", "Kitchen"],
      photos: ["../../assets/images/task1.png"],
      needsBedding: true,
      status: "accepted",
    };
    setTask(mockTask);
  }, [id]);

  const handleStartTask = () => {
    router.push({
      pathname: "/pages/taskPreparation/taskPrepare",
      params: { id: task?.id },
    });
  };

  if (!task) return null;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header Card */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Task Details
              </Text>
              <Text className="text-gray-500">ID: {task.id}</Text>
            </View>
            <View className="bg-blue-100 px-4 py-2 rounded-full">
              <Text className="text-blue-600 font-semibold">
                ${task.budget}
              </Text>
            </View>
          </View>

          {/* Time and Location */}
          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Text>📅</Text>
              </View>
              <View>
                <Text className="text-gray-600">Date & Time</Text>
                <Text className="text-gray-900 font-semibold">
                  {task.date} | {task.time}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Text>📍</Text>
              </View>
              <View>
                <Text className="text-gray-600">Location</Text>
                <Text className="text-gray-900 font-semibold">
                  {task.location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rooms Card */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Rooms to Clean
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {task.rooms.map((room, index) => (
              <View key={index} className="bg-gray-100 px-4 py-2 rounded-full">
                <Text className="text-gray-700">{room}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Requirements Card */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Requirements
          </Text>
          <View className="flex-row items-center bg-purple-50 p-3 rounded-lg">
            <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
              <Text>🛏️</Text>
            </View>
            <View>
              <Text className="text-gray-700">Bedding Change</Text>
              <Text className="text-purple-600">
                {task.needsBedding ? "Required" : "Not Required"}
              </Text>
            </View>
          </View>
        </View>

        {/* Photos Card */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Property Photos
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {task.photos.map((photo, index) => (
                <View
                  key={index}
                  className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    source={{ uri: photo }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Status Card */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Status
          </Text>
          <View className="bg-green-100 px-4 py-2 rounded-full self-start">
            <Text className="text-green-600 font-medium capitalize">
              {task.status}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {task.status === "accepted" && (
          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity
              className="flex-1 bg-green-500 p-4 rounded-xl"
              onPress={handleStartTask}
            >
              <Text className="text-white text-center font-semibold">
                Start Task
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-red-100 p-4 rounded-xl">
              <Text className="text-red-600 text-center font-semibold">
                Cancel Task
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
