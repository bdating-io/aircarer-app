import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownProps {
  title: string;
  placeholder: string;
  options: string[];
  selectedOption: string;
  titleStyle?: string;
  textStyles?: string;
  dropdownStyle?: string;
  onSelect: (option: string) => void;
}

const Dropdown = ({
  title,
  options,
  selectedOption,
  placeholder,
  titleStyle,
  textStyles,
  dropdownStyle,
  onSelect,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-4">
      <Text className={titleStyle ?? 'font-bold mb-2'}>{title}</Text>
      <TouchableOpacity
        className={`flex-row justify-between items-center ${dropdownStyle ?? 'bg-white border border-blue-600 rounded px-3 py-3.5'} `}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text className={textStyles ?? 'text-lg text-black'}>
          {selectedOption || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
      {isOpen && (
        <View className="bg-white border border-gray-300 border-t-0 mt-[-1px]">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className="px-3 py-3.5 border-b border-gray-200"
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text className="text-lg text-black">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Dropdown;
