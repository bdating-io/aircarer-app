import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import PhoneInput from "react-native-phone-number-input";

export default function Login() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [formattedValue, setFormattedValue] = useState("");
  const phoneInput = useRef<PhoneInput>(null);

  const countryCodes = [
    { code: "+61", country: "Australia 澳大利亚" },
    { code: "+86", country: "China 中国" },
    { code: "+852", country: "Hong Kong 香港" },
    { code: "+853", country: "Macau 澳门" },
    { code: "+886", country: "Taiwan 台湾" },
    { code: "+1", country: "USA/Canada 美国/加拿大" },
    { code: "+44", country: "United Kingdom 英国" },
    { code: "+81", country: "Japan 日本" },
    { code: "+82", country: "South Korea 韩国" },
    { code: "+65", country: "Singapore 新加坡" },
    { code: "+60", country: "Malaysia 马来西亚" },
    { code: "+66", country: "Thailand 泰国" },
    { code: "+84", country: "Vietnam 越南" },
    { code: "+62", country: "Indonesia 印度尼西亚" },
    { code: "+63", country: "Philippines 菲律宾" },
    { code: "+91", country: "India 印度" },
    { code: "+92", country: "Pakistan 巴基斯坦" },
    { code: "+971", country: "UAE 阿联酋" },
    { code: "+966", country: "Saudi Arabia 沙特阿拉伯" },
    { code: "+49", country: "Germany 德国" },
    { code: "+33", country: "France 法国" },
    { code: "+39", country: "Italy 意大利" },
    { code: "+34", country: "Spain 西班牙" },
    { code: "+31", country: "Netherlands 荷兰" },
    { code: "+46", country: "Sweden 瑞典" },
    { code: "+47", country: "Norway 挪威" },
    { code: "+45", country: "Denmark 丹麦" },
    { code: "+358", country: "Finland 芬兰" },
    { code: "+7", country: "Russia 俄罗斯" },
    { code: "+380", country: "Ukraine 乌克兰" },
    { code: "+48", country: "Poland 波兰" },
    { code: "+55", country: "Brazil 巴西" },
    { code: "+52", country: "Mexico 墨西哥" },
    { code: "+54", country: "Argentina 阿根廷" },
    { code: "+56", country: "Chile 智利" },
    { code: "+64", country: "New Zealand 新西兰" },
    { code: "+27", country: "South Africa 南非" },
    { code: "+20", country: "Egypt 埃及" },
    { code: "+212", country: "Morocco 摩洛哥" },
    { code: "+234", country: "Nigeria 尼日利亚" },
  ];

  const googleLogin = async () => {
    console.log("Google Login");
  };

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Success", "Successfully logged in!");
      router.push("/pages/authentication/home");
    }
    setLoading(false);
  };

  const handlePhoneLogin = async () => {
    setLoading(true);
    try {
      if (!isCodeSent) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedValue,
        });

        if (error) {
          Alert.alert("Error", error.message);
        } else {
          setIsCodeSent(true);
          Alert.alert(
            "Success",
            "Verification code has been sent to your phone!"
          );
        }
      } else {
        const { error } = await supabase.auth.verifyOtp({
          phone: formattedValue,
          token: verificationCode,
          type: "sms",
        });

        if (error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Success", "Successfully logged in!");
          router.push("/pages/authentication/home");
        }
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 替换原来的手机号输入部分
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
        {/* Header Section */}
        <View className="items-center mt-10 mb-8">
          <Text className="text-white text-2xl font-bold mt-4">
            Welcome Back
          </Text>
        </View>

        {/* Login Method Switcher */}
        <View className="flex-row justify-center mb-6">
          <TouchableOpacity
            className={`px-6 py-2 rounded-full ${
              loginMethod === "email" ? "bg-blue-500" : "bg-transparent"
            }`}
            onPress={() => setLoginMethod("email")}
          >
            <Text className="text-white">Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-full ${
              loginMethod === "phone" ? "bg-blue-500" : "bg-transparent"
            }`}
            onPress={() => setLoginMethod("phone")}
          >
            <Text className="text-white">Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View className="px-6">
          {/* Email/Phone Fields */}
          {loginMethod === "email" ? (
            <View className="mb-4">
              <TextInput
                className="bg-white/10 rounded-lg p-4 text-white"
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          ) : (
            renderPhoneInput()
          )}

          {/* Password Field */}
          {loginMethod === "email" && (
            <View className="mb-4">
              <TextInput
                className="bg-white/10 rounded-lg p-4 text-white"
                placeholder="Password"
                placeholderTextColor="gray"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          )}

          {loginMethod === "phone" && (
            <View>
              {isCodeSent ? (
                <View className="mb-4">
                  <TextInput
                    className="bg-white/10 rounded-lg p-4 text-white"
                    placeholder="Enter verification code"
                    placeholderTextColor="gray"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
              ) : null}
              <TouchableOpacity
                className="bg-blue-500 rounded-lg py-4 mb-4"
                onPress={handlePhoneLogin}
                disabled={loading}
              >
                <Text className="text-white text-center font-semibold">
                  {loading
                    ? "Loading..."
                    : isCodeSent
                    ? "Verify Code"
                    : "Send Code"}
                </Text>
              </TouchableOpacity>
              {isCodeSent && (
                <TouchableOpacity
                  className="mb-4"
                  onPress={() => {
                    setIsCodeSent(false);
                    setVerificationCode("");
                  }}
                >
                  <Text className="text-blue-500 text-center">Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-4 mb-4"
            onPress={signInWithEmail}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold">Login </Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View className="mt-6">
            <TouchableOpacity
              className="flex-row items-center justify-center space-x-2 border border-white/20 rounded-lg py-4"
              onPress={googleLogin}
            >
              <AntDesign name="google" size={20} color="white" />
              <Text className="text-white">Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6 mb-8">
            <Text className="text-gray-400">Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push("/pages/authentication/signup")}
            >
              <Text className="text-blue-500">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
