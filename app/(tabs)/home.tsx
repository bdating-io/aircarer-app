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
import { supabase } from "@/lib/supabase";
import useStore from "../utils/store";

export default function Home() {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [hasAddress, setHasAddress] = useState<boolean>(false);
  const { myProfile, setMyProfile, mySession, setMySession } = useStore();
  const [userEmail, setUserEmail] = useState<string>("");

  // Store the task title
  const [taskTitle, setTaskTitle] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setMySession(session);
      if (session?.user) {
        checkProfile(session.user.id);
        checkAddress(session.user.id);
        setUserEmail(session.user.email || "");
      }
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setMySession(session);
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

  // Check address
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
      setMyProfile(null);
      setMySession(null);
      setHasProfile(false);
    } catch (error) {
      Alert.alert("Error signing out", (error as Error).message);
    }
    router.push("/(tabs)/home");
  };

  // Create Task => Insert row => if successful, navigate
  const handleCreateTask = async () => {
    // 1) check if user typed a non-empty taskTitle
    if (!taskTitle.trim()) {
      Alert.alert("Missing title", "Please enter a task title first.");
      return;
    }

    // 2) check if user is logged in
    if (!mySession?.user) {
      Alert.alert("Not logged in", "Please log in first.");
      return;
    }

    try {
      // 2) Instead of .insert(), call the Postgres function
      const { data, error } = await supabase.rpc("create_task", {
        p_customer_id: mySession.user.id,
        p_task_title: taskTitle.trim(),
      });
      if (error) throw error;

      // data will be an array of inserted rows (should be length 1)
      if (!data || data.length === 0) {
        Alert.alert("Error", "No task returned from create_task RPC.");
        return;
      }

      // The newly created task is data[0]
      const newTask = data[0];
      Alert.alert("Task Created!", `Task ID = ${newTask.task_id}`);

      // Navigate
      router.push(`/(pages)/(createTask)/placeDetails?taskId=${newTask.task_id}`);
    } catch (err) {
      console.error("RPC error:", err);
      Alert.alert("Error", "Failed to create task via RPC");
    }
  };
  // If not logged in => Show login
  if (!mySession) {
    return (
      <SafeAreaView className="flex-1 bg-[#4A90E2]">
        <View className="flex-1 px-6">
          {/* Header */}
          <View className="pt-4">
            <Text className="text-2xl font-bold text-white">AirCarer</Text>
          </View>
          {/* Intro */}
          <View className="mt-4">
            <Text className="text-2xl text-white font-semibold">
              Welcome to AirCarer
            </Text>
          </View>
          {/* Buttons */}
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

  // If no profile => show create profile
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

  // Main view
  return (
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      {/* Header + Sign Out */}
      <View className="px-6 pt-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white">AirCarer</Text>
        <View className="flex-row items-center">
          {myProfile?.role && (
            <View className="bg-white/20 px-3 py-1 rounded-lg mr-3">
              <Text className="text-white font-medium">
                {myProfile.role === "Cleaner"
                  ? "I'm a Cleaner"
                  : myProfile.role === "House Owner"
                  ? "I'm a House Owner"
                  : `I'm a ${myProfile.role}`}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-white/20 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <View className="px-6 mt-4">
        <Text className="text-xl text-white">
          Good day, {myProfile?.first_name}!
        </Text>
        <Text className="text-white opacity-80">{userEmail}</Text>

        {myProfile?.role === "Cleaner" && !hasAddress ? (
          // Cleaner no address
          <View className="mt-8 space-y-4">
            <Text className="text-2xl text-white font-semibold">
              Complete your profile to start working
            </Text>
            <TouchableOpacity
              className="bg-[#FF6B6B] rounded-lg p-4"
              onPress={() =>
                router.push("/(pages)/(profile)/(cleanerProfile)/cleanerProfile")
              }
            >
              <Text className="text-white text-center text-lg font-semibold">
                Add Your Address
              </Text>
            </TouchableOpacity>
          </View>
        ) : myProfile?.role === "Cleaner" ? (
          // Cleaner has address
          <View className="mt-8 space-y-4">
            <Text className="text-2xl text-white font-semibold">
              Ready to work? Find tasks nearby.
            </Text>
            <TouchableOpacity
              className="bg-[#FF6B6B] rounded-lg p-4"
              onPress={() => router.push("/opportunity")}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Browse Opportunities
              </Text>
            </TouchableOpacity>
          </View>
        ) : myProfile?.role === "House Owner" ? (
          // House Owner
          <View className="mt-8 space-y-4">
            <Text className="text-2xl text-white font-semibold">
              Need cleaning service? Post a task now.
            </Text>
            {/* Input + Button */}
            <View className="bg-[#4A90E2] p-4 rounded-lg">
              <TextInput
                className="bg-gray-100 px-3 py-2 rounded"
                placeholder="Enter your task title"
                value={taskTitle}
                onChangeText={setTaskTitle}
              />
              <TouchableOpacity
                className="bg-[#FF6B6B] rounded-lg p-4 mt-4"
                onPress={handleCreateTask}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  Create Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Default / Loading
          <View className="mt-8">
            <Text className="text-white text-lg">Loading...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

