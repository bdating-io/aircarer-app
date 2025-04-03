import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabaseAuthClient } from '@/clients/supabase/auth';
import { useProfileViewModel } from '@/viewModels/profileViewModel';
import { AustralianState } from '@/types/address';
import Dropdown from '@/components/Dropdown';

export default function AddressForm() {
  const router = useRouter();
  const { address, getAddress, setAddress, updateUserAddress, isLoading } =
    useProfileViewModel();

  return (
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center pt-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-white ml-4">
            Enter your address
          </Text>
        </View>

        <ScrollView className="flex-1 mt-8">
          {/* Street Number */}
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">Street Number *</Text>
            <View className="bg-white/10 rounded-xl p-4">
              <TextInput
                className="text-white text-lg"
                placeholder="123"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={address.street_number}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, street_number: text }))
                }
              />
            </View>
          </View>

          {/* Street Name */}
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">Street Name *</Text>
            <View className="bg-white/10 rounded-xl p-4">
              <TextInput
                className="text-white text-lg"
                placeholder="Main Street"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={address.street_name}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, street_name: text }))
                }
              />
            </View>
          </View>

          {/* City */}
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">City *</Text>
            <View className="bg-white/10 rounded-xl p-4">
              <TextInput
                className="text-white text-lg"
                placeholder="Melbourne"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={address.city}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, city: text }))
                }
              />
            </View>
          </View>

          {/* State */}
          <View className="mb-4">
            <Dropdown
              title="State *"
              placeholder="Select State"
              options={Object.values(AustralianState)}
              selectedOption={address.state}
              titleStyle="text-white text-lg"
              dropdownStyle="bg-white/10 rounded-xl p-4"
              onSelect={(option) =>
                setAddress((prev) => ({
                  ...prev,
                  state: option as AustralianState,
                }))
              }
            />
          </View>

          {/* Postal Code */}
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">Postal Code *</Text>
            <View className="bg-white/10 rounded-xl p-4">
              <TextInput
                className="text-white text-lg"
                placeholder="3000"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={address.postal_code}
                keyboardType="number-pad"
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, postal_code: text }))
                }
              />
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View className="py-4">
          <TouchableOpacity
            className="bg-[#FF6B6B] rounded-xl p-4"
            onPress={updateUserAddress}
            disabled={isLoading}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {isLoading ? 'Saving...' : 'Save Address'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
