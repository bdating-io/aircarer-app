import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { supabase } from '@/clients/supabase';
import { AntDesign } from '@expo/vector-icons';

export default function Layout() {
  const [userRole, setUserRole] = useState<'Cleaner' | 'House Owner' | null>(
    null,
  );
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // 颜色主题
  const theme = {
    primary: '#1890ff', // 蓝色
    background: isDark ? '#121212' : '#FFFFFF',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F3F4F6' : '#1F2937',
    border: isDark ? '#2D2D2D' : '#F0F0F0',
    inactive: isDark ? '#6B7280' : '#8C8C8C',
  };

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setUserRole(data.role);
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.inactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 16,
          color: theme.text,
        },
        headerTintColor: theme.primary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={22} color={color} />
          ),
        }}
      />

      {/* 清洁工可见的选项卡 */}
      <Tabs.Screen
        name="opportunity"
        options={{
          title: 'Opportunities',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="search1" size={22} color={color} />
          ),
          tabBarStyle:
            userRole === 'Cleaner'
              ? {
                  backgroundColor: theme.background,
                  borderTopWidth: 1,
                  borderTopColor: theme.border,
                  height: 60,
                  paddingBottom: 6,
                  paddingTop: 6,
                  elevation: 0,
                  shadowOpacity: 0,
                }
              : { display: 'none' },
          href: userRole === 'Cleaner' ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="tasklist"
        options={{
          title: 'My Tasks',
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <AntDesign name="profile" size={22} color={color} />
          ),
          tabBarStyle:
            userRole === 'Cleaner'
              ? {
                  backgroundColor: theme.background,
                  borderTopWidth: 1,
                  borderTopColor: theme.border,
                  height: 60,
                  paddingBottom: 6,
                  paddingTop: 6,
                  elevation: 0,
                  shadowOpacity: 0,
                }
              : { display: 'none' },
          href: userRole === 'Cleaner' ? undefined : null,
        }}
      />

      {/* 房主可见的选项卡 */}
      <Tabs.Screen
        name="propertyList"
        options={{
          title: 'Property List',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="pluscircleo" size={22} color={color} />
          ),
          tabBarStyle:
            userRole === 'House Owner'
              ? {
                  backgroundColor: theme.background,
                  borderTopWidth: 1,
                  borderTopColor: theme.border,
                  height: 60,
                  paddingBottom: 6,
                  paddingTop: 6,
                  elevation: 0,
                  shadowOpacity: 0,
                }
              : { display: 'none' },
          href: userRole === 'House Owner' ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="editTask"
        options={{
          title: 'Tasks',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="edit" size={22} color={color} />
          ),
          tabBarStyle:
            userRole === 'House Owner'
              ? {
                  backgroundColor: theme.background,
                  borderTopWidth: 1,
                  borderTopColor: theme.border,
                  height: 60,
                  paddingBottom: 6,
                  paddingTop: 6,
                  elevation: 0,
                  shadowOpacity: 0,
                }
              : { display: 'none' },
          href: userRole === 'House Owner' ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
