import React, { useState, useRef, useEffect } from "react";
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
import { AntDesign, Ionicons } from "@expo/vector-icons";
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
      router.push("/(tabs)/home");
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
          router.push("/(tabs)/home");
        }
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
      router.replace("/(tabs)/home");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      <View className="flex-1 px-6">
        {/* Header with Back Button */}
        <View className="flex-row items-center pt-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

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
              loginMethod === "email" ? "bg-white" : "bg-white/20"
            }`}
            onPress={() => setLoginMethod("email")}
          >
            <Text
              className={
                loginMethod === "email" ? "text-[#4A90E2]" : "text-white"
              }
            >
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-r-xl ${
              loginMethod === "phone" ? "bg-white" : "bg-white/20"
            }`}
            onPress={() => setLoginMethod("phone")}
          >
            <Text
              className={
                loginMethod === "phone" ? "text-[#4A90E2]" : "text-white"
              }
            >
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Form */}
        <View className="mt-8">
          {loginMethod === "email" ? (
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
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 12,
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
            onPress={
              loginMethod === "email" ? signInWithEmail : handlePhoneLogin
            }
          >
            <Text className="text-white text-center text-lg font-semibold">
              {loginMethod === "email"
                ? "Log in"
                : isCodeSent
                ? "Verify Code"
                : "Send Code"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-white opacity-80">Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push("/(pages)/(authentication)/signup")}
          >
            <Text className="text-white font-semibold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
