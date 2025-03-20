import { useHomeViewModel } from '@/viewModels/homeViewModel';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Dropdown from '../Dropdown';

export const HouseOwnerScreen: React.FC = () => {
  const cleaningTypes = ['AirBnB', 'End-of-Lease/Sale'];
  const [cleaningType, setCleaningType] = useState('');
  const { handleCreateTask } = useHomeViewModel();
  return (
    <View className="space-y-4">
      {/* Input + Button */}
      <View className="bg-[#4A90E2] p-4 rounded-lg py-40">
        <Dropdown
          title="Select a cleaning type to start"
          titleStyle="text-white text-center"
          options={cleaningTypes}
          selectedOption={cleaningType}
          onSelect={setCleaningType}
          placeholder={'Select cleaning type'}
        />
        <TouchableOpacity
          className="bg-[#FF6B6B] rounded-lg p-4 mt-4"
          onPress={() => handleCreateTask(cleaningType)}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Create Task
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
