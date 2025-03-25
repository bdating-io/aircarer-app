import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/clients/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useProfileViewModel } from '@/viewModels/profileViewModel';
import { supabaseAuthClient } from '@/clients/supabase/auth';
import { Role } from '@/types/profile';

export default function Account() {
  const router = useRouter();
  const { myProfile, clearMyProfile } = useProfileViewModel();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // 获取当前用户的邮箱
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || '');
      }
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await supabaseAuthClient.signOut();
      clearMyProfile();
      Alert.alert('Success', 'Successfully logged out!');
      router.push('/(pages)/(authentication)/login');
    } catch (error) {
      Alert.alert('Error signing out', (error as Error).message);
    }
  };

  type MenuItem = {
    title: string;
    icon:
      | 'card-outline'
      | 'notifications-outline'
      | 'settings-outline'
      | 'home-outline';
    onPress: () => void;
  };

  const menuItems: MenuItem[] = [
    // {
    //   title: 'Payment Options',
    //   icon: 'card-outline',
    //   onPress: () => null,
    //   // router.push('/(pages)/(account)/(payment)/payment'),
    // },
    // {
    //   title: 'Notifications',
    //   icon: 'notifications-outline',
    //   onPress: () => router.push('/(pages)/(account)/notifications'),
    // },
    // {
    //   title: 'Settings',
    //   icon: 'settings-outline',
    //   onPress: () => router.push('/(pages)/(account)/settings'),
    // },
  ];

  if (myProfile?.role === Role.HouseOwner) {
    menuItems.push({
      title: 'Property List',
      icon: 'home-outline',
      onPress: () => router.push('/(tabs)/propertyList'),
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      {/* Profile Header */}
      <View className="px-6 pt-4 pb-6">
        <Text className="text-2xl font-bold text-white">My Account</Text>

        {/* Profile Card */}
        <View className="mt-4 flex-row items-center">
          <View className="w-16 h-16 bg-white rounded-full justify-center items-center">
            <Ionicons name="person-outline" size={32} color="#4A90E2" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-white text-lg font-semibold">
              Hi, {myProfile?.first_name}
            </Text>
            <Text className="text-white opacity-80">{userEmail}</Text>
            <Text className="text-white opacity-80">
              Melbourne VIC, Australia
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(pages)/(profile)/editProfile')}
            className="bg-white/20 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Settings */}
      <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
        {/* <Text className="text-lg font-semibold mb-4">ACCOUNT SETTINGS</Text> */}

        {/* Menu Items */}
        <View className="space-y-4">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-3"
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={24} color="#4A90E2" />
              <Text className="flex-1 ml-4 text-lg">{item.title}</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          className="mt-8 bg-[#FF6B6B] rounded-lg p-4"
          onPress={handleSignOut}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Log out
          </Text>
        </TouchableOpacity>

         {/* <View className="mt-8 space-y-4">
          <TouchableOpacity
            className="bg-[#FF6B6B] rounded-lg p-4 mt-8"
            onPress={() => router.push('/(pages)/(profile)/userTerms')}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Update Profile test
            </Text>
          </TouchableOpacity>
       </View> */}
      </View>
    </SafeAreaView>
  );
}
