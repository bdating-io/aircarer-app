import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '@/clients/supabase';

export default function Pricing() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [hourlyRate, setHourlyRate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateWorkPreferences = async (profileData: any) => {
    setIsLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('work_preferences')
        .upsert(
          {
            user_id: user.id,
            areas: { distance: profileData.workDistance },
            time: profileData.workingTime,
            experience: profileData.experience,
            pricing: profileData.pricing,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        )
        .select()
        .single();

      if (error) throw error;

      Alert.alert('Success', 'work preferences saved successfully!');
      router.push('/account');
    } catch (error: any) {
      console.error('Error saving work preferences:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    if (!hourlyRate) return;

    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    const profileData = {
      ...previousData,
      pricing: {
        hourlyRate: parseFloat(hourlyRate),
      },
    };

    updateWorkPreferences(profileData);

    // 完成注册，跳转到主页或成功页面
  };

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
          onPress={handleComplete}
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
