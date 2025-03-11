import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/clients/supabase';
import useStore from '@/lib/store';

export default function EditProfile() {
  const router = useRouter();
  const { myProfile, setMyProfile } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: myProfile?.first_name || '',
    last_name: myProfile?.last_name || '',
    bio: myProfile?.bio || '',
    location: myProfile?.location || '',
  });

  const updateProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('No user found');

      const updates = {
        user_id: user.id,
        ...formData,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      setMyProfile({ ...myProfile, ...formData });
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold mr-6">
          Edit Public Profile
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mt-4">
          <Text className="text-gray-500 mb-2">Make your profile shine!</Text>
          <Text className="text-gray-400 text-sm mb-6">
            The information you add is visible to everyone
          </Text>
        </View>

        {/* Profile Picture */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-gray-200 rounded-full justify-center items-center">
            <Ionicons name="person-outline" size={40} color="#666" />
          </View>
          <TouchableOpacity className="mt-2">
            <Text className="text-blue-500">Change photo</Text>
          </TouchableOpacity>
        </View>

        {/* Bio */}
        <View className="mb-6">
          <Text className="font-semibold mb-2">Bio</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 min-h-[100px]"
            multiline
            placeholder="Introduce yourself to new customers..."
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
          />
        </View>

        {/* First Name */}
        <View className="mb-4">
          <Text className="font-semibold mb-2">First name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4"
            value={formData.first_name}
            onChangeText={(text) =>
              setFormData({ ...formData, first_name: text })
            }
          />
        </View>

        {/* Last Name */}
        <View className="mb-4">
          <Text className="font-semibold mb-2">Last name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4"
            value={formData.last_name}
            onChangeText={(text) =>
              setFormData({ ...formData, last_name: text })
            }
          />
        </View>

        {/* Location */}
        <View className="mb-6">
          <Text className="font-semibold mb-2">Location</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4"
            placeholder="Which suburb are you based in?"
            value={formData.location}
            onChangeText={(text) =>
              setFormData({ ...formData, location: text })
            }
          />
        </View>

        {/* Portfolio Section */}
        <View className="mb-6">
          <Text className="font-semibold mb-2">Portfolio</Text>
          <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg p-8 items-center">
            <Ionicons name="add-circle-outline" size={32} color="#666" />
            <Text className="text-gray-500 mt-2">
              Show off your work (Max. 20 images)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verifications */}
        <View className="mb-6">
          <Text className="font-semibold mb-2">Verifications</Text>
          <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
            <View className="flex-row items-center">
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="#666"
              />
              <Text className="ml-2">Get Verified</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Skills */}
        <View className="mb-6">
          <Text className="font-semibold mb-2">Skills</Text>
          <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
            <View className="flex-row items-center">
              <Ionicons name="add-circle-outline" size={24} color="#666" />
              <Text className="ml-2">Add Skills</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-[#4A90E2] rounded-lg p-4"
          onPress={updateProfile}
          disabled={loading}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
