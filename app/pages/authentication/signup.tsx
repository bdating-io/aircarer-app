import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Signup() {
  const router = useRouter();
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const googleSignup = () => {
    console.log("Google Signup");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1B1B1B]">
      <ScrollView className="flex-1">
        {/* Logo Section */}
        <View className="items-center mt-10 mb-8">
          <Text className="text-white text-2xl font-bold mt-4">
            Create Account
          </Text>
        </View>

        {/* Signup Method Switcher */}
        <View className="flex-row justify-center mb-6">
          <TouchableOpacity
            className={`px-6 py-2 rounded-full ${
              signupMethod === "email" ? "bg-blue-500" : "bg-transparent"
            }`}
            onPress={() => setSignupMethod("email")}
          >
            <Text className="text-white">Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-full ${
              signupMethod === "phone" ? "bg-blue-500" : "bg-transparent"
            }`}
            onPress={() => setSignupMethod("phone")}
          >
            <Text className="text-white">Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View className="px-6">
          {/* Username Field */}
          <View className="mb-4">
            <TextInput
              className="bg-white/10 rounded-lg p-4 text-white"
              placeholder="Username"
              placeholderTextColor="gray"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Email/Phone Fields */}
          {signupMethod === "email" ? (
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

          {/* Password Fields */}
          <View className="mb-4">
            <TextInput
              className="bg-white/10 rounded-lg p-4 text-white mb-3"
              placeholder="Password"
              placeholderTextColor="gray"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              className="bg-white/10 rounded-lg p-4 text-white"
              placeholder="Confirm Password"
              placeholderTextColor="gray"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-4 mb-4"
            onPress={() => {
              // Handle signup logic
              router.push("/pages/authentication/home");
            }}
          >
            <Text className="text-white text-center font-semibold">
              Create Account
            </Text>
          </TouchableOpacity>

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
