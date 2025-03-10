import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import PhoneInput from 'react-native-phone-number-input';
import { useAuthViewModel } from '@/viewModels/authViewModel';

export default function Signup() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const phoneInput = useRef<PhoneInput>(null);
  const {
    phone,
    loading,
    phoneVerified,
    showVerification,
    isCodeSent,
    resendDisabled,
    countdown,
    checkSession,
    sendVerificationCode,
    verifyPhone,
    completeSignUp,
    setPhone,
    resendOTP,
  } = useAuthViewModel();

  useEffect(() => {
    checkSession();
  }, []);

  const renderPhoneInput = () => (
    <View className="mb-4">
      <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
        defaultCode="AU"
        layout="first"
        onChangeFormattedText={(text) => {
          setPhone(text);
        }}
        withDarkTheme
        withShadow
        containerStyle={{
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
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
        flagButtonStyle={{
          backgroundColor: 'transparent',
        }}
        countryPickerButtonStyle={{
          backgroundColor: 'transparent',
        }}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center pt-4"></View>

        {/* Logo & Welcome */}
        <View className="items-center mt-12">
          <Text className="text-4xl font-bold text-white">AirCarer</Text>
          <Text className="text-white text-lg mt-2 opacity-80">
            Create your account
          </Text>
        </View>

        {/* Sign Up Form */}
        <View className="mt-12">
          {!phoneVerified ? (
            <>
              {renderPhoneInput()}

              {!showVerification ? (
                <TouchableOpacity
                  className="bg-[#FF6B6B] rounded-lg py-4 mb-4"
                  onPress={sendVerificationCode}
                  disabled={loading}
                >
                  <Text className="text-white text-center">
                    Send Verification Code
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TextInput
                    className="bg-white/10 rounded-lg p-4 text-white mb-4"
                    placeholder="Enter verification code"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    className="bg-[#FF6B6B] rounded-lg py-4 mb-4"
                    onPress={() => verifyPhone(verificationCode)}
                    disabled={loading}
                  >
                    <Text className="text-white text-center">Verify Phone</Text>
                  </TouchableOpacity>
                  {isCodeSent && (
                    <TouchableOpacity
                      className="mt-4 items-center"
                      onPress={resendOTP}
                      disabled={resendDisabled}
                    >
                      <Text
                        className={`${resendDisabled ? 'text-gray-400' : 'text-white font-semibold'}`}
                      >
                        {resendDisabled
                          ? `Resend Code in ${countdown}s`
                          : 'Resend Code'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          ) : (
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

              <View className="bg-white/10 rounded-xl p-4 mb-4">
                <TextInput
                  className="text-white text-lg"
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View className="bg-white/10 rounded-xl p-4">
                <TextInput
                  className="text-white text-lg"
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </>
          )}
        </View>

        {/* Sign Up Button */}
        {phoneVerified && (
          <View className="mt-8">
            <TouchableOpacity
              className={`bg-[#FF6B6B] rounded-xl p-4 ${
                loading ? 'opacity-50' : ''
              }`}
              onPress={() => completeSignUp(email, password, confirmPassword)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Create account
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-white opacity-80">
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(pages)/(authentication)/login')}
          >
            <Text className="text-white font-semibold">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
