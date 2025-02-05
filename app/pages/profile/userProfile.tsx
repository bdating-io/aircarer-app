import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import useStore from "../../utils/store";

type Role = "Laundry Partner" | "Supervisor" | "Cleaner" | "House Owner";

export default function CreateProfile() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [abn, setAbn] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [backgroundCheck, setBackgroundCheck] = useState<string>("");
  const { myProfile, setMyProfile } = useStore(); // Get the setMessage action from the store
  const [isLoading, setIsLoading] = useState(false);

  const createPersonalProfile = async (profileData: any) => {
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
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          abn: profileData.abn,
          role: profileData.role,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("Supabase error:", error.message, error.details);
        throw error;
      }
      alert("Profile updated successfully");
      console.log("Profile updated successfully:", data);
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

  useEffect(() => {
    setFirstName(myProfile.first_name);
    setLastName(myProfile.last_name);
    setAbn(myProfile.abn);
    setSelectedRole(myProfile.role);
  }, []);

  const handleNext = async () => {
    try {
      // 验证输入
      if (!firstName || !lastName || !abn || !selectedRole) {
        return;
      }

      // 创建个人资料
      const profileData = {
        firstName,
        lastName,
        abn,
        role: selectedRole,
        backgroundCheck,
      };

      // 调用 API 保存数据
      const response = await createPersonalProfile(profileData);

      // 根据角色跳转到相应页面
      switch (selectedRole) {
        // case "Laundry Partner":
        //   router.push({
        //     pathname: "/pages/profile/laundryPartner",
        //     params: { profileData: JSON.stringify(profileData) },
        //   });
        //   break;
        // case "Supervisor":
        //   router.push({
        //     pathname: "/pages/profile/supervisor",
        //     params: { profileData: JSON.stringify(profileData) },
        //   });
        //   break;
        case "Cleaner":
          router.push({
            pathname: "/pages/profile/cleanerProfile/cleanerProfile",
            params: { profileData: JSON.stringify(profileData) },
          });
          break;
        case "House Owner":
          router.push({
            pathname: "/pages/profile/houseOwner/houseOwner",
            params: { profileData: JSON.stringify(profileData) },
          });

          break;
        default:
          router.push({
            pathname: "/(tabs)/home",
            params: { profileData: JSON.stringify(profileData) },
          });
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      // 处理错误
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
          <Text className="text-xl font-semibold ml-4">
            Create your profile
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Form Fields */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">First name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text className="text-gray-600 mb-2">Last name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <Text className="text-gray-600 mb-2">ABN (if applicable)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4"
            placeholder="23456777777"
            value={abn}
            onChangeText={setAbn}
            keyboardType="numeric"
          />

          <Text className="text-gray-600 mb-4">
            What is your main role on AirCarer?
          </Text>

          {/* Role Selection Grid */}
          <View className="flex-row flex-wrap justify-between mb-6">
            {[
              { id: "Laundry Partner", icon: "🧺", color: "bg-blue-100" },
              { id: "Supervisor", icon: "👥", color: "bg-green-100" },
              { id: "Cleaner", icon: "🧹", color: "bg-yellow-100" },
              { id: "House Owner", icon: "🏠", color: "bg-purple-100" },
            ].map((role) => (
              <TouchableOpacity
                key={role.id}
                className={`w-[48%] p-4 rounded-lg mb-4 ${role.color} ${
                  selectedRole === role.id ? "border-2 border-blue-500" : ""
                }`}
                onPress={() => setSelectedRole(role.id as Role)}
              >
                <Text className="text-center text-2xl mb-2">{role.icon}</Text>
                <Text className="text-center">{role.id}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Background Check Upload */}
          <Text className="text-gray-600 mb-2">Background Check</Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-lg p-3 mb-6 flex-row items-center justify-between"
            onPress={() => {
              /* Handle file upload */
            }}
          >
            <Text className="text-gray-500">Upload file</Text>
            <AntDesign name="upload" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-full py-3 items-center ${
            firstName && lastName && abn && selectedRole
              ? "bg-[#4A90E2]"
              : "bg-gray-200"
          }`}
          onPress={handleNext}
          disabled={!firstName || !lastName || !abn || !selectedRole}
        >
          <Text
            className={`font-medium ${
              firstName && lastName && abn && selectedRole
                ? "text-white"
                : "text-gray-500"
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
