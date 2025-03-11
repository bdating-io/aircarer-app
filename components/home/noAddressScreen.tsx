import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

export const NoAddressScreen: React.FC = () => {
  const router = useRouter();
  return (
    <View className="mt-8 space-y-4">
      <Text className="text-2xl text-white font-semibold">
        Complete your profile to start working
      </Text>
      <TouchableOpacity
        className="bg-[#FF6B6B] rounded-lg p-4"
        onPress={() =>
          router.push('/(pages)/(profile)/(cleanerProfile)/cleanerProfile')
        }
      >
        <Text className="text-white text-center text-lg font-semibold">
          Add Your Address
        </Text>
      </TouchableOpacity>
    </View>
  );
};
