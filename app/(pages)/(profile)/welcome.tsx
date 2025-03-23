import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useProfileViewModel } from '@/viewModels/profileViewModel';
import { supabaseAuthClient } from '@/clients/supabase/auth';
import { supabaseDBClient } from '@/clients/supabase/database';

export default function Welcome() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const { myProfile, setMyProfile, isLoading, setIsLoading } =
    useProfileViewModel(); // Get the setMessage action from the store

  useEffect(() => {
    if (myProfile && myProfile.first_name) {
      setNickname(myProfile.first_name);
    }
  }, [myProfile]);

  const handleContinue = async () => {
    if (!nickname.trim()) return;

    setIsLoading(true);
    try {
      const user = await supabaseAuthClient.getUser();
      await supabaseDBClient.updateUserProfile(user.id, {
        first_name: nickname.trim(),
        updated_at: new Date().toISOString(),
      });

      console.log('Profile updated successfully:');
      if (myProfile) {
        myProfile.first_name = nickname.trim();
        setMyProfile(myProfile);
      }

      router.push('/(pages)/(profile)/userTerms');
    } catch (error) {
      console.error('Error updating first name:', error);
      Alert.alert(
        'Error',
        (error as Error).message ||
          'Failed to update first name. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <ActivityIndicator size="large" />
        <Text>Loading properties...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">{'Welcome'}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        <Text className="text-3xl font-bold text-center mb-8">
          {'Welcome to Aircarer'}
        </Text>

        <Text className="text-lg text-gray-600 text-center mb-12">
          {"Let's get to know each other better!"}
        </Text>

        <Text className="text-lg mb-4">
          {'How would you like to be called?'}
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
          placeholder="Enter your preferred name"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
        />

        <TouchableOpacity
          className={`bg-[#4A90E2] rounded-xl py-4 ${
            !nickname?.trim() ? 'opacity-50' : ''
          }`}
          onPress={handleContinue}
          disabled={!nickname.trim()}
        >
          <Text className="text-white text-center font-semibold">
            {'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
