import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function UploadDocuments() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-primary-100 px-6 py-4">
      <Text className="text-primary-500 text-xl font-JakartaBold mb-6">
        Upload Documents
      </Text>
      {/* 页面内容省略... */}
      <TouchableOpacity
        className="bg-primary-500 py-4 rounded-lg"
        onPress={() => navigation.navigate("Summary")}
      >
        <Text className="text-white text-center text-lg font-JakartaBold">
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}
