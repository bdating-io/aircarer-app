import { useRouter } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export const CleanerScreen: React.FC = () => {
  const router = useRouter();
  return (
    <View className="mt-8 space-y-4">
      <Text className="text-2xl text-white font-semibold">
        Ready to work? Find tasks nearby.
      </Text>
      <TouchableOpacity
        className="bg-[#FF6B6B] rounded-lg p-4 mt-6"
        onPress={() => router.push('/opportunity')}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Browse Opportunities
        </Text>
      </TouchableOpacity>
    </View>
  );
};
