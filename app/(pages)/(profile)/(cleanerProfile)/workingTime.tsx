import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useProfileViewModel } from '@/viewModels/profileViewModel';

export default function WorkingTime() {
  const router = useRouter();

  const { timeSlots, toggleTimeSlot, navigateToExperience } =
    useProfileViewModel();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Working Hours</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <Text className="text-gray-600 mt-6 mb-4">
          Select your available working hours
        </Text>

        {timeSlots.map((slot, index) => (
          <View key={slot.day} className="mb-6">
            <Text className="text-lg font-medium mb-2">{slot.day}</Text>
            <View className="flex-row space-x-2">
              {['morning', 'afternoon', 'evening'].map((time) => (
                <TouchableOpacity
                  key={time}
                  className={`flex-1 py-2 rounded-full border ${
                    slot[time as keyof typeof slot]
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}
                  onPress={() =>
                    toggleTimeSlot(
                      index,
                      time as 'morning' | 'afternoon' | 'evening',
                    )
                  }
                >
                  <Text
                    className={`text-center ${
                      slot[time as keyof typeof slot]
                        ? 'text-white'
                        : 'text-gray-600'
                    }`}
                  >
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="rounded-lg py-4 items-center bg-[#4A90E2]"
          onPress={navigateToExperience}
        >
          <Text className="text-white font-medium">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
