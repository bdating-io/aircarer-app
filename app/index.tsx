import React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { ActivityIndicator } from '@ant-design/react-native';
import { supabaseAuthClient } from '@/clients/supabase/auth';

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabaseAuthClient.getSession().then((session) => {
      setSession(session);
      setIsLoading(false);
    });

    supabaseAuthClient.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // 显示加载状态
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  // 根据登录状态重定向
  return (
    <View className="flex-1 items-center justify-center bg-white">
      {session ? (
        <Redirect href="/(tabs)/home" />
      ) : (
        <Redirect href="/(pages)/(authentication)/login" />
      )}
    </View>
  );
}
