import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import useStore from '../../utils/store';

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const { myProfile, setMyProfile } = useStore(); // Get the setMessage action from the store

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkProfile(session.user.id);
      }
    });
  }, []);

  const checkProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, abn, role")
      .eq("user_id", userId)
      .single();
    setMyProfile(profile);
    setHasProfile(!!profile?.first_name);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1B1B1B]">
      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo and Title Section */}
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-bold">AirCarer</Text>
          {session ? (
            <Text className="text-gray-400 mt-2">
              Welcome, {myProfile?.first_name} you have signed in as {session.user.email}， create your
              profile now to get started.
            </Text>
          ) : (
            <Text className="text-gray-400 mt-2">Get cleaning done</Text>
          )}
        </View>

        {/* Login/Signup Buttons */}
        {!session ? (
          <View className="w-full space-y-4 mt-8">
            <TouchableOpacity
              className="w-full bg-[#4A90E2] rounded-xl py-4"
              onPress={() => router.push("/pages/authentication/login")}
            >
              <Text className="text-white text-center font-semibold">
                Log in
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-[#4A90E2] rounded-xl py-4"
              onPress={() => router.push("/pages/authentication/signup")}
            >
              <Text className="text-white text-center font-semibold">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="w-full bg-[#4A90E2] rounded-xl py-4"
            onPress={() => supabase.auth.signOut()}
          >
            <Text className="text-white text-center font-semibold">
              Sign Out
            </Text>
          </TouchableOpacity>
        )}

        {/* Create Profile Button */}
        {hasProfile === false ? (
          <View className="items-center">
            <Text className="text-gray-400 mt-2">
              Welcome! Please create your profile to continue.
            </Text>
            <TouchableOpacity
              className="bg-[#4A90E2] rounded-xl py-4 px-8 mt-4"
              onPress={() => router.push("/pages/profile/welcome")}
            >
              <Text className="text-white font-semibold">Create Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center">
            <Text className="text-gray-400 mt-2">
              Profile created! You can now use the app.
            </Text>

            <TouchableOpacity
              className="bg-[#4A90E2] rounded-xl py-4 px-8 mt-4"
              onPress={() => router.push("/pages/profile/welcome")}
            >
              <Text className="text-white font-semibold">Test Update Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Language Selector */}
        <View className="flex-row mt-8">
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-gray-400">English</Text>
            <Text className="text-gray-400 mx-2">|</Text>
            <Text className="text-gray-400">中文</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
