import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useAuthViewModel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

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

  const handlePhoneLogin = async (
    formattedValue: string,
    verificationCode: string,
  ) => {
    setLoading(true);
    try {
      if (!isCodeSent) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedValue,
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
          phone: formattedValue,
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

  return {
    isCodeSent,
    loading,
    signInWithEmail,
    handlePhoneLogin,
  };
};
