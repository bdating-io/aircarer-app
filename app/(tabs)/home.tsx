import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useHomeViewModel } from '@/viewModels/homeViewModel';
import { NoProfileScreen } from '@/components/home/noProfileScreen';
import { NoAddressScreen } from '@/components/home/noAddressScreen';
import { CleanerScreen } from '@/components/home/cleanerScreen';
import { HouseOwnerScreen } from '@/components/home/houseOwnerScreen';

export default function Home() {
  const { hasProfile, hasAddress, myProfile, userEmail, handleSignOut } =
    useHomeViewModel();

  // If no profile => show create profile
  if (!hasProfile) {
    <NoProfileScreen name={myProfile?.first_name} email={userEmail} />;
  } else
    // Main view
    return (
      <SafeAreaView className="flex-1 bg-[#4A90E2]">
        {/* Header + Sign Out */}
        <View className="px-6 pt-4 flex-row justify-between items-center">
          <Text className="text-3xl font-bold text-white">AirCarer</Text>
          <View className="flex-row items-center">
            {myProfile?.role && (
              <View className="bg-white/20 px-3 py-1 rounded-lg mr-3">
                <Text className="text-white font-medium">
                  {`I'm a ${myProfile.role}`}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={handleSignOut}
              className="bg-white/20 px-4 py-2 rounded-lg"
            >
              <Text className="text-white">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <View className="px-6 mt-4">
          <Text className="text-xl text-white">
            Good day, {myProfile?.first_name}!
          </Text>
          <Text className="text-white opacity-80">{userEmail}</Text>

          {myProfile?.role === 'Cleaner' && !hasAddress ? (
            // Cleaner no address
            <NoAddressScreen />
          ) : myProfile?.role === 'Cleaner' ? (
            // Cleaner has address
            <CleanerScreen />
          ) : myProfile?.role === 'House Owner' ? (
            // House Owner
            <HouseOwnerScreen />
          ) : (
            // Default / Loading
            <View className="mt-8">
              <Text className="text-white text-lg">Loading...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
}
