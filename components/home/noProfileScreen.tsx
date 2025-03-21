import { useRouter } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export const NoProfileScreen: React.FC = () => {
  const router = useRouter();
  return (
    <View className="px-6">
      <View className="mt-4">
        <Text className="text-white font-bold mb-2">
          Please create your profile to continue.
        </Text>
      </View>
      <TouchableOpacity
        className="bg-[#FF6B6B] rounded-lg p-4 mt-4"
        onPress={() => router.push('/(pages)/(profile)/userTerms')}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Create Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};
