import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function Login() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const googleLogin = async () => {
    console.log("Google Login");
  };

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
            <View className="mb-4">
              <TextInput
                className="bg-white/10 rounded-lg p-4 text-white"
                placeholder="Phone Number"
                placeholderTextColor="gray"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          )}

          {/* Password Field */}
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

          {/* Login Button */}
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-4 mb-4"
            onPress={() => {
              // Handle login logic
              router.push("/pages/authentication/home");
            }}
          >
            <Text className="text-white text-center font-semibold">Log In</Text>
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
