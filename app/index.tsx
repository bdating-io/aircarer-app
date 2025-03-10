import React from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/clients/supabase';
import { Session } from '@supabase/supabase-js';

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // 显示加载状态
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        {/* 可以添加loading指示器 */}
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
