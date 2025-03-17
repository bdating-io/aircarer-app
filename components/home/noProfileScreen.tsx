import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text } from 'react-native';

interface NoProfileScreenProps {
  name: string;
  email: string;
}

export const NoProfileScreen: React.FC<NoProfileScreenProps> = ({
  name,
  email,
}) => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      <View className="flex-1 px-6">
        <View className="pt-4">
          <Text className="text-2xl font-bold text-white">AirCarer</Text>
        </View>
        <View className="mt-4">
          <Text className="text-xl text-white">Welcome {name}!</Text>
          <Text className="text-white opacity-80">{email}</Text>
          <Text className="text-white mt-2">
            Please create your profile to continue.
          </Text>
        </View>
        <TouchableOpacity
          className="bg-[#FF6B6B] rounded-lg p-4 mt-8"
          onPress={() => router.push('/(pages)/(profile)/userTerms')}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Create Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
