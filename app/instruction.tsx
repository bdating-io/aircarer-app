import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Instruction() {
  const navigation = useNavigation();

  // 使用一个数组记录每个选项的状态（true 表示选中，false 表示未选中）
  const [selectedOptions, setSelectedOptions] = useState([false, false]);

  const instructions = [
    "Take a panoramic view of the kitchen from multiple angles.",
    "Take photos of the cleanliness of the kitchen countertops and whether there is water or food residue in the sink.",
  ];

  const handleOptionToggle = (index) => {
    setSelectedOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = !updatedOptions[index]; // 切换选中状态
      return updatedOptions;
    });
  };

  return (
    <View className="flex-1 bg-primary-100">
      {/* Header */}
      <View className="bg-primary-500 py-4 px-6">
        <Text className="text-white text-xl font-JakartaBold text-center">
          Photo After Cleaning
        </Text>
      </View>

      {/* Instructions */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text className="text-black text-lg font-JakartaBold text-center mb-4">
          Instructions
        </Text>

        {instructions.map((instruction, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center mb-6"
            onPress={() => handleOptionToggle(index)}
          >
            <View
              className={`w-6 h-6 mr-4 rounded-full border-2 ${
                selectedOptions[index] ? "border-primary-500 bg-primary-500" : "border-secondary-500"
              }`}
            />
            <Text className="text-black text-base font-Jakarta">{instruction}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Back Button */}
            <TouchableOpacity
        className="bg-purple-500 p-4 rounded-lg"
        onPress={() => navigation.navigate('task')}
      >
        <Text className="text-white text-lg">Job status</Text>
      </TouchableOpacity>
    </View>
  );
}
