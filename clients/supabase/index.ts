import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qfnaeliuqkgylkbtufuv.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbmFlbGl1cWtneWxrYnR1ZnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMTY5NjEsImV4cCI6MjA1MzU5Mjk2MX0.bBzt8i281vXzD8mN-iyQ-JLhc-Yb2FrR9TKRs4uEQRM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const supabaseClient = {
  signInWithEmail: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  },
  signInWithPhone: async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) {
      throw error;
    }
  },

  verifyPhone: async (phone: string, verificationCode: string) => {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: verificationCode,
      type: 'sms',
    });
    if (error) {
      throw error;
    }
  },

  getSession: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  },

  updateUser: async (email: string, password: string, phone: string) => {
    const { error } = await supabase.auth.updateUser({
      email,
      password,
      data: {
        phone_verified: true,
        phone,
      },
    });
    if (error) {
      throw error;
    }
  },
};
