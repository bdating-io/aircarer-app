import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import PhoneInput from 'react-native-phone-number-input';
import { useAuthViewModel } from '@/viewModels/authViewModel';

export default function Login() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const phoneInput = useRef<PhoneInput>(null);
  const [formattedValue, setFormattedValue] = useState('');

  const { isCodeSent, signInWithEmail, handlePhoneLogin } = useAuthViewModel();

  // 添加会话检查
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      // 如果已登录，重定向到首页
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      <View className="flex-1 px-6">
        {/* Header with Back Button */}
        <View className="flex-row items-center pt-4"></View>

        {/* Logo & Welcome */}
        <View className="items-center mt-12">
          <Text className="text-4xl font-bold text-white">AirCarer</Text>
          <Text className="text-white text-lg mt-2 opacity-80">
            Welcome back!
          </Text>
        </View>

        {/* Login Method Toggle */}
        <View className="flex-row justify-center mt-8">
          <TouchableOpacity
            className={`px-6 py-2 rounded-l-xl ${
              loginMethod === 'email' ? 'bg-white' : 'bg-white/20'
            }`}
            onPress={() => setLoginMethod('email')}
          >
            <Text
              className={
                loginMethod === 'email' ? 'text-[#4A90E2]' : 'text-white'
              }
            >
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-r-xl ${
              loginMethod === 'phone' ? 'bg-white' : 'bg-white/20'
            }`}
            onPress={() => setLoginMethod('phone')}
          >
            <Text
              className={
                loginMethod === 'phone' ? 'text-[#4A90E2]' : 'text-white'
              }
            >
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Form */}
        <View className="mt-8">
          {loginMethod === 'email' ? (
            // Email Login Form
            <>
              <View className="bg-white/10 rounded-xl p-4 mb-4">
                <TextInput
                  className="text-white text-lg"
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <View className="bg-white/10 rounded-xl p-4">
                <TextInput
                  className="text-white text-lg"
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </>
          ) : (
            // Phone Login Form
            <>
              <View className="mb-4">
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={phone}
                  defaultCode="AU"
                  layout="first"
                  onChangeText={(text) => setPhone(text)}
                  onChangeFormattedText={(text) => setFormattedValue(text)}
                  containerStyle={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                  }}
                  textContainerStyle={{
                    backgroundColor: 'transparent',
                  }}
                  textInputStyle={{
                    color: 'white',
                  }}
                  codeTextStyle={{
                    color: 'white',
                  }}
                />
              </View>
              {isCodeSent && (
                <View className="bg-white/10 rounded-xl p-4">
                  <TextInput
                    className="text-white text-lg"
                    placeholder="Verification Code"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                  />
                </View>
              )}
            </>
          )}
        </View>

        {/* Action Button */}
        <View className="mt-8">
          <TouchableOpacity
            className="bg-[#FF6B6B] rounded-xl p-4"
            onPress={() => {
              if (loginMethod === 'email') {
                signInWithEmail(email, password);
              } else {
                handlePhoneLogin(formattedValue, verificationCode);
              }
            }}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {loginMethod === 'email'
                ? 'Log in'
                : isCodeSent
                  ? 'Verify Code'
                  : 'Send Code'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-white opacity-80">
            {"Don't have an account? "}
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(pages)/(authentication)/signup')}
          >
            <Text className="text-white font-semibold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
