import { supabaseClient } from '@/clients/supabase';
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
    try {
      await supabaseClient.signInWithEmail(email, password);
      Alert.alert('Success', 'Successfully logged in!');
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (verificationCode: string) => {
    setLoading(true);
    try {
      if (!isCodeSent) {
        await supabaseClient.signInWithPhone(phone);
        setIsCodeSent(true);
        Alert.alert(
          'Success',
          'Verification code has been sent to your phone!',
        );
      } else {
        await supabaseClient.verifyPhone(phone, verificationCode);
        Alert.alert('Success', 'Successfully logged in!');
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    const session = await supabaseClient.getSession();
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
      supabaseClient.signUp(phone, Math.random().toString(36).slice(-8));
      setShowVerification(true);
      Alert.alert('Success', 'Verification code sent to your phone');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred, please try again.');
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
      await supabaseClient.verifyPhone(phone, verificationCode);

      setPhoneVerified(true);
      Alert.alert(
        'Success',
        'Phone verified successfully! Please complete your registration.',
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred, please try again.');
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
      await supabaseClient.updateUser(email, password, phone);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred, please try again.');
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
