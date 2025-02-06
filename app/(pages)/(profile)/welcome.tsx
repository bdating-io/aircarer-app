import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import useStore from "../../utils/store";

export default function Welcome() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { myProfile, setMyProfile } = useStore(); // Get the setMessage action from the store

  useEffect(() => {
    setNickname(myProfile.first_name);
  }, []);

  const handleContinue = async () => {
    if (!nickname.trim()) return;

    setIsLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError);
        Alert.alert("Error", "Failed to get user information");
        return;
      }

      if (!user) {
        console.error("No user found");
        Alert.alert("Error", "User not found");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: nickname.trim(),
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("Supabase error:", error.message, error.details);
        throw error;
      }

      console.log("Profile updated successfully:", data);
      myProfile.first_name = nickname.trim();
      setMyProfile(myProfile);
      router.push("/(pages)/(profile)/userTerms");
    } catch (error: any) {
      console.error("Error updating first name:", {
        message: error?.message,
        details: error?.details,
        error,
      });
      Alert.alert(
        "Error",
        error?.message || "Failed to update first name. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Welcome</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        <Text className="text-3xl font-bold text-center mb-8">
          Welcome to Aircarer
        </Text>

        <Text className="text-lg text-gray-600 text-center mb-12">
          Let's get to know each other better!
        </Text>

        <Text className="text-lg mb-4">How would you like to be called?</Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
          placeholder="Enter your preferred name"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
        />

        <TouchableOpacity
          className={`bg-[#4A90E2] rounded-xl py-4 ${
            !myProfile.first_name.trim() ? "opacity-50" : ""
          }`}
          onPress={handleContinue}
          disabled={!myProfile.first_name.trim()}
        >
          <Text className="text-white text-center font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
