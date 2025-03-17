import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface ToggleButtonProps {
  value: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleButton = ({ value, onToggle }: ToggleButtonProps) => (
  <View className="flex-row space-x-2">
    <TouchableOpacity
      className={`px-6 py-2 rounded-full border ${
        value ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
      }`}
      onPress={() => onToggle(true)}
    >
      <Text className={value ? 'text-white' : 'text-gray-600'}>YES</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className={`px-6 py-2 rounded-full border ${
        !value ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
      }`}
      onPress={() => onToggle(false)}
    >
      <Text className={!value ? 'text-white' : 'text-gray-600'}>No</Text>
    </TouchableOpacity>
  </View>
);

export default ToggleButton;
