import { supabaseClient } from '@/clients/supabase';
import { AuthError } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useAuthViewModel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phone, setPhone] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  // Countdown Timer Effect
  useEffect(() => {
    if (isCodeSent && resendDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled, isCodeSent]);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await supabaseClient.signInWithEmail(email, password);
      Alert.alert('Success', 'Successfully logged in!');
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', (error as AuthError).message);
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
      Alert.alert('Error', (error as AuthError).message);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const session = await supabaseClient.getSession();
      if (session) {
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      Alert.alert('Error', (error as AuthError).message);
    }
  };

  const sendVerificationCode = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    setLoading(true);
    try {
      await supabaseClient.signUp(phone, Math.random().toString(36).slice(-8));
      setShowVerification(true);
      setIsCodeSent(true);
      Alert.alert('Success', 'Verification code sent to your phone');
    } catch (error) {
      console.log('error', error);
      Alert.alert('Error', (error as AuthError).message);
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
      Alert.alert('Error', (error as AuthError).message);
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
      Alert.alert('Error', (error as AuthError).message);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    setResendDisabled(true);
    setCountdown(30);
    try {
      await supabaseClient.resend(phone);
      Alert.alert('Success', 'Verification code sent to your phone');
    } catch (error) {
      Alert.alert('Error', (error as AuthError).message);
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
    resendDisabled,
    countdown,
    // Methods
    signInWithEmail,
    signInWithPhone,
    checkSession,
    sendVerificationCode,
    verifyPhone,
    completeSignUp,
    setPhone,
    resendOTP,
  };
};
