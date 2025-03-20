import React from 'react';
import { Stack } from 'expo-router';
import { useEffect, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/clients/supabase';
import { useStripe } from '@stripe/stripe-react-native';
import { Linking } from 'react-native';

import '../global.css';
import StripeProvider from '@/clients/stripe';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can return or add extra handling here as you see fit
        } else {
          // This was NOT a Stripe URL – handle as you normally would
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener(
      'url',
      (event: { url: string }) => {
        handleDeepLink(event.url);
      }
    );

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

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
