import React, { useState, useRef, useEffect } from "react";
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
import { AntDesign, Ionicons } from "@expo/vector-icons";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formattedValue, setFormattedValue] = useState("");
  const phoneInput = useRef<PhoneInput>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.replace("/(tabs)/home");
    }
  };

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
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
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
      router.push("/(pages)/(authentication)/login");
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
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center pt-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

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
        <View className="mt-8">
          <TouchableOpacity
            className={`bg-[#FF6B6B] rounded-xl p-4 ${
              loading ? "opacity-50" : ""
            }`}
            onPress={completeSignUp}
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

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-white opacity-80">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(pages)/(authentication)/login")}
          >
            <Text className="text-white font-semibold">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
