import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function CleaningTools() {
  const route = useRoute();
  const navigation = useNavigation();
  const { task } = route.params;

  return (
    <ScrollView className="flex-1 bg-gray-100 p-6">
      {/* Header */}
      <View className="bg-blue-700 p-4 rounded-lg mb-6">
        <Text className="text-white text-2xl font-bold">Cleaning Tools</Text>
      </View>

      {/* Task Details */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
        <Text className="text-black text-xl font-bold mb-2">{task.name}</Text>
        <Text className="text-gray-600 text-base mb-4">{task.description}</Text>
        <Text className="text-blue-700 text-lg font-bold">How to Access the Cleaning Tools:</Text>
        <Text className="text-gray-600 text-base mt-2">1. Get the key from the main desk.</Text>
        <Text className="text-gray-600 text-base">2. Use the key to open the storage room.</Text>
        <Text className="text-gray-600 text-base">3. Locate the cleaning tools inside the cabinet.</Text>
      </View>

      {/* Additional Instructions */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
        <Text className="text-blue-700 text-lg font-bold mb-2">Important Notes:</Text>
        <Text className="text-gray-600 text-base">- Make sure to return the tools after use.</Text>
        <Text className="text-gray-600 text-base">- If any tools are missing, report to the supervisor immediately.</Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-lg shadow-lg"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white text-center text-lg font-bold">Back</Text>
      </TouchableOpacity>
      
    </ScrollView>
    
  );
}
