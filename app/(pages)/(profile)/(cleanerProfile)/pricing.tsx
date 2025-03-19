import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useProfileViewModel } from '@/viewModels/profileViewModel';

export default function Pricing() {
  const router = useRouter();
  const { hourlyRate, setHourlyRate, completeProfileSetting } =
    useProfileViewModel();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Set Your Rate</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mt-6">
          <Text className="text-gray-700 text-lg font-medium mb-2">
            Hourly Rate (AUD)
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4"
            placeholder="Enter your hourly rate"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="numeric"
          />
          <Text className="text-gray-500 mt-2">
            Recommended rate: $25-35/hour
          </Text>
        </View>
      </ScrollView>

      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-lg py-4 items-center ${
            hourlyRate ? 'bg-[#4A90E2]' : 'bg-gray-200'
          }`}
          onPress={completeProfileSetting}
          disabled={!hourlyRate}
        >
          <Text
            className={`font-medium ${
              hourlyRate ? 'text-white' : 'text-gray-500'
            }`}
          >
            Complete
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
