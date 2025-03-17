import { useHomeViewModel } from '@/viewModels/homeViewModel';
import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

export const HouseOwnerScreen: React.FC = () => {
  const { taskTitle, setTaskTitle, handleCreateTask } = useHomeViewModel();
  return (
    <View className="mt-8 space-y-4">
      <Text className="text-2xl text-white font-semibold">
        Need cleaning service? Post a task now.
      </Text>
      {/* Input + Button */}
      <View className="bg-[#4A90E2] p-4 rounded-lg">
        <TextInput
          className="bg-gray-100 px-3 py-2 rounded"
          placeholder="Enter your task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <TouchableOpacity
          className="bg-[#FF6B6B] rounded-lg p-4 mt-4"
          onPress={handleCreateTask}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Create Task
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
