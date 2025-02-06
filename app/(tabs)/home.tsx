import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import useStore from "../utils/store";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [hasAddress, setHasAddress] = useState<boolean>(false);
  const { myProfile, setMyProfile } = useStore();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkProfile(session.user.id);
        checkAddress(session.user.id);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkProfile(session.user.id);
        checkAddress(session.user.id);
        setUserEmail(session.user.email || "");
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

  // 检查地址
  const checkAddress = async (userId: string) => {
    const { data: address, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "USER_ADDRESS")
      .single();

    if (error) {
      console.error("Error checking address:", error);
      return;
    }

    setHasAddress(!!address);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMyProfile(null); // 清除用户档案
      setSession(null); // 清除session
      setHasProfile(false); // 重置档案状态
    } catch (error) {
      Alert.alert("Error signing out", (error as Error).message);
    }
    router.push("/(tabs)/home");
  };

  // 如果没有登录，显示登录界面
  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-[#4A90E2]">
        <View className="flex-1 px-6">
          {/* Header */}
          <View className="pt-4">
            <Text className="text-2xl font-bold text-white">AirCarer</Text>
          </View>

          {/* Welcome Message */}
          <View className="mt-4">
            <Text className="text-2xl text-white font-semibold">
              Welcome to AirCarer
            </Text>
          </View>

          {/* Login/Signup Buttons */}
          <View className="absolute bottom-12 left-6 right-6">
            <TouchableOpacity
              className="bg-[#FF6B6B] rounded-xl p-4 mb-4"
              onPress={() => router.push("/(pages)/(authentication)/login")}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Log in
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#FF6B6B] rounded-xl p-4"
              onPress={() => router.push("/(pages)/(authentication)/signup")}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 如果没有创建档案，显示创建档案界面
  if (!hasProfile) {
    return (
      <SafeAreaView className="flex-1 bg-[#4A90E2]">
        <View className="flex-1 px-6">
          <View className="pt-4">
            <Text className="text-2xl font-bold text-white">AirCarer</Text>
          </View>
          <View className="mt-4">
            <Text className="text-xl text-white">
              Welcome {myProfile?.first_name}!
            </Text>
            <Text className="text-white opacity-80">{userEmail}</Text>
            <Text className="text-white mt-2">
              Please create your profile to continue.
            </Text>
          </View>
          <TouchableOpacity
            className="bg-[#FF6B6B] rounded-lg p-4 mt-8"
            onPress={() => router.push("/(pages)/(profile)/userTerms")}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Create Profile
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 主界面
  return (
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      {/* Header with Sign Out */}
      <View className="px-6 pt-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white">AirCarer</Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-white/20 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Message */}
      <View className="px-6 mt-4">
        <Text className="text-xl text-white">
          Good day, {myProfile?.first_name}!
        </Text>
        <Text className="text-white opacity-80">{userEmail}</Text>

        {myProfile?.role === "Cleaner" && !hasAddress ? (
          // Cleaner without address
          <View className="mt-8 space-y-4">
            <Text className="text-2xl text-white font-semibold">
              Complete your profile to start working
            </Text>
            <TouchableOpacity
              className="bg-[#FF6B6B] rounded-lg p-4"
              onPress={() =>
                router.push(
                  "/(pages)/(profile)/(cleanerProfile)/cleanerProfile"
                )
              }
            >
              <Text className="text-white text-center text-lg font-semibold">
                Add Your Address
              </Text>
            </TouchableOpacity>
          </View>
        ) : myProfile?.role === "Cleaner" ? (
          // Cleaner with address
          <View className="mt-8 space-y-4">
            <Text className="text-2xl text-white font-semibold">
              Ready to work? Find tasks nearby.
            </Text>
            <TouchableOpacity
              className="bg-[#FF6B6B] rounded-lg p-4"
              // onPress={() => router.push("/(pages)/tasks/taskList")}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Browse Tasks
              </Text>
            </TouchableOpacity>
          </View>
        ) : myProfile?.role === "HouseOwner" ? (
          // House Owner View
          <View className="mt-8 space-y-4">
            <Text className="text-2xl text-white font-semibold">
              Need cleaning service? Post a task now.
            </Text>
            <TouchableOpacity
              className="bg-[#FF6B6B] rounded-lg p-4"
              // onPress={() => router.push("/(pages)/tasks/createTask")}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Post New Task
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Default View or Loading State
          <View className="mt-8">
            <Text className="text-white text-lg">Loading...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
