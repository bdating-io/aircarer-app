import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function RecycleTask() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-primary-100 px-6 py-4">
      {/* Header */}
      <View className="bg-primary-500 py-4 px-6 mb-4">
        <Text className="text-white text-xl font-JakartaBold text-center">
          Recycle Task Detail
        </Text>
      </View>

      {/* Recycle Info */}
      <Text className="text-black text-lg font-JakartaBold mb-2">
        Recycle Item List
      </Text>
      <Text className="text-gray-600 text-base mb-4">
        Is there any items need recycle?
      </Text>

      {/* Add Recycle Item */}
      <TouchableOpacity
        className="w-16 h-16 bg-secondary-100 rounded-full justify-center items-center self-center mb-6 border border-gray-400"
        onPress={() => navigation.navigate("ReDetail")}
      >
        <Text className="text-primary-500 text-2xl font-bold">+</Text>
      </TouchableOpacity>

      {/* Done Button */}
      <TouchableOpacity className="bg-primary-500 py-4 rounded-lg">
        <Text className="text-white text-center text-lg font-JakartaBold">
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );
}
