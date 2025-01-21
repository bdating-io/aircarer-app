import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CreateUser() {
  const navigation = useNavigation();
  const [role, setRole] = useState(""); // 保存选中的角色
  const roles = ["Laundry Partner", "Supervisor", "Cleaner", "House Owner"];

  const handleNext = () => {
    if (!role) {
      Alert.alert("Selection Required", "Please select a role to proceed.");
      return;
    }

    // 根据不同的角色跳转到不同页面
    switch (role) {
      case "House Owner":
        navigation.navigate("ProvideHome");
        break;
      case "Laundry Partner":
        navigation.navigate("LaundrySetup"); // 替换为实际的 Laundry Partner 页面
        break;
      case "Supervisor":
        navigation.navigate("SupervisorDashboard"); // 替换为实际的 Supervisor 页面
        break;
      case "Cleaner":
        navigation.navigate("CleanerTasks"); // 替换为实际的 Cleaner 页面
        break;
      default:
        Alert.alert("Error", "Invalid role selected.");
    }
  };

  return (
    <View className="flex-1 bg-primary-100 px-6 py-4">
      {/* Header */}
      <View className="bg-primary-500 py-4 px-6">
        <Text className="text-white text-xl font-JakartaBold text-center">
          Create Profile
        </Text>
      </View>

      {/* Role Selection */}
      <View className="mt-6">
        <Text className="text-primary-500 text-base font-JakartaBold mb-4">
          What is your main role on AirCarer?
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {roles.map((item) => (
            <TouchableOpacity
              key={item}
              className={`border ${
                role === item
                  ? "border-primary-500 bg-primary-100"
                  : "border-primary-300"
              } rounded-lg px-4 py-3 mb-3 w-[48%] flex-row items-center justify-center`}
              onPress={() => setRole(item)}
            >
              <Text
                className={`${
                  role === item ? "text-primary-500" : "text-black"
                } font-JakartaBold`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        className="bg-primary-500 py-4 rounded-lg mt-6"
        onPress={handleNext}
      >
        <Text className="text-white text-center text-lg font-JakartaBold">
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}



