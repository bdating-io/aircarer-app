import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useAuthViewModel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phone, setPhone] = useState('');

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Success', 'Successfully logged in!');
      router.push('/(tabs)/home');
    }
    setLoading(false);
  };

  const signInWithPhone = async (verificationCode: string) => {
    setLoading(true);
    try {
      if (!isCodeSent) {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
        });

        if (error) {
          Alert.alert('Error', error.message);
        } else {
          setIsCodeSent(true);
          Alert.alert(
            'Success',
            'Verification code has been sent to your phone!',
          );
        }
      } else {
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token: verificationCode,
          type: 'sms',
        });

        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Success', 'Successfully logged in!');
          router.push('/(tabs)/home');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      router.replace('/(tabs)/home');
    }
  };

  const sendVerificationCode = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        phone,
        password: Math.random().toString(36).slice(-8),
      });

      if (error) throw error;

      setShowVerification(true);
      Alert.alert('Success', 'Verification code sent to your phone');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyPhone = async (verificationCode: string) => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: verificationCode,
        type: 'sms',
      });

      if (error) throw error;
      setPhoneVerified(true);
      Alert.alert(
        'Success',
        'Phone verified successfully! Please complete your registration.',
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  const completeSignUp = async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        password,
        data: {
          phone_verified: true,
          phone,
        },
      });

      if (error) throw error;

      Alert.alert('Success', 'Account created successfully!');
      router.push('/(pages)/(authentication)/login');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    // States
    phone,
    isCodeSent,
    loading,
    showVerification,
    phoneVerified,
    // Methods
    signInWithEmail,
    signInWithPhone,
    checkSession,
    sendVerificationCode,
    verifyPhone,
    completeSignUp,
    setPhone,
  };
};
