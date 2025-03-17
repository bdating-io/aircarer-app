import React from 'react';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/clients/supabase';

import '../global.css';
import StripeProvider from '../clients/supabase/stripe';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        if (
          segments[0] !== '(pages)' ||
          (segments[0] === '(pages)' && segments[1] !== '(authentication)')
        ) {
          router.replace('/(pages)/(authentication)/welcome');
        }
      } else if (segments[1] === '(authentication)') {
        router.replace('/(tabs)/home');
      }
    };

    checkAuth();
  }, [segments]);

  return (
    <StripeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(pages)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </StripeProvider>
  );
}
