import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import PhoneInput from "react-native-phone-number-input";

export default function Signup() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+61");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formattedValue, setFormattedValue] = useState("");
  const phoneInput = useRef<PhoneInput>(null);

  const googleSignup = () => {
    console.log("Google Signup");
  };

  const sendVerificationCode = async () => {
    if (!phone) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        phone: `${countryCode}${phone}`,
        password: Math.random().toString(36).slice(-8),
      });

      if (error) throw error;

      setShowVerification(true);
      Alert.alert("Success", "Verification code sent to your phone");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyPhone = async () => {
    if (!verificationCode) {
      Alert.alert("Error", "Please enter verification code");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `${countryCode}${phone}`,
        token: verificationCode,
        type: "sms",
      });

      if (error) throw error;
      setPhoneVerified(true);
      Alert.alert(
        "Success",
        "Phone verified successfully! Please complete your registration."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const completeSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        password,
        data: {
          phone_verified: true,
          phone: `${countryCode}${phone}`,
        },
      });

      if (error) throw error;

      Alert.alert("Success", "Account created successfully!");
      router.push("/pages/authentication/login");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPhoneInput = () => (
    <View className="mb-4">
      <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
        defaultCode="AU"
        layout="first"
        onChangeText={(text) => {
          setPhone(text);
        }}
        onChangeFormattedText={(text) => {
          setFormattedValue(text);
          const countryCode = text.split(phone)[0];
          setCountryCode(countryCode);
        }}
        withDarkTheme
        withShadow
        containerStyle={{
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 8,
        }}
        textContainerStyle={{
          backgroundColor: "transparent",
        }}
        textInputStyle={{
          color: "white",
        }}
        codeTextStyle={{
          color: "white",
        }}
        flagButtonStyle={{
          backgroundColor: "transparent",
        }}
        countryPickerButtonStyle={{
          backgroundColor: "transparent",
        }}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#1B1B1B]">
      <ScrollView className="flex-1">
        {/* Logo Section */}
        <View className="items-center mt-10 mb-8">
          <Text className="text-white text-2xl font-bold mt-4">
            Create Account
          </Text>
        </View>

        {/* Input Fields */}
        <View className="px-6">
          {!phoneVerified ? (
            <>
              {renderPhoneInput()}

              {!showVerification ? (
                <TouchableOpacity
                  className="bg-blue-500 rounded-lg py-4 mb-4"
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
                    placeholderTextColor="gray"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    className="bg-blue-500 rounded-lg py-4 mb-4"
                    onPress={verifyPhone}
                    disabled={loading}
                  >
                    <Text className="text-white text-center">Verify Phone</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <TextInput
                className="bg-white/10 rounded-lg p-4 text-white mb-4"
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              <TextInput
                className="bg-white/10 rounded-lg p-4 text-white mb-4"
                placeholder="Password"
                placeholderTextColor="gray"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              <TouchableOpacity
                className={`bg-blue-500 rounded-lg py-4 mb-4 ${
                  loading ? "opacity-50" : ""
                }`}
                onPress={completeSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Complete Registration
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Social Signup */}
          <View className="mt-6">
            <TouchableOpacity
              className="flex-row items-center justify-center space-x-2 border border-white/20 rounded-lg py-4"
              onPress={googleSignup}
            >
              <AntDesign name="google" size={20} color="white" />
              <Text className="text-white">Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6 mb-8">
            <Text className="text-gray-400">Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push("/pages/authentication/login")}
            >
              <Text className="text-blue-500">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
