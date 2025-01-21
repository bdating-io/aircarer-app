import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

export default function ProvideHome() {
  const [address, setAddress] = useState("");
  const [livingRoom, setLivingRoom] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [bedRoom, setBedRoom] = useState("");
  const [toilet, setToilet] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState<string[]>([
    "Carpet",
    "Pet",
    "Oven",
    "Range Hood",
  ]);
  const [customRequirement, setCustomRequirement] = useState("");

  // 添加或移除固定和动态特殊需求
  const toggleSpecialRequirement = (item: string) => {
    if (specialRequirements.includes(item)) {
      setSpecialRequirements((prev) =>
        prev.filter((requirement) => requirement !== item)
      );
    } else {
      setSpecialRequirements((prev) => [...prev, item]);
    }
  };

  // 添加自定义特殊需求
  const addCustomRequirement = () => {
    if (!customRequirement.trim()) {
      Alert.alert("Invalid Input", "Please enter a valid special requirement.");
      return;
    }
    if (specialRequirements.includes(customRequirement.trim())) {
      Alert.alert("Duplicate Entry", `"${customRequirement}" already exists.`);
      return;
    }
    setSpecialRequirements((prev) => [...prev, customRequirement.trim()]);
    setCustomRequirement(""); // 清空输入框
  };

  const handleNext = () => {
    if (!address) {
      Alert.alert("Incomplete Form", "Please fill in the address.");
      return;
    }
    Alert.alert("Success", "Form submitted successfully.");
  };

  return (
    <ScrollView className="flex-1 bg-primary-100 px-6 py-4">
      {/* Header */}
      <View className="bg-primary-500 py-4 px-6">
        <Text className="text-white text-xl font-JakartaBold text-center">
          Provide Home Details
        </Text>
      </View>

      {/* Address */}
      <View className="mb-4">
        <Text className="text-primary-500 text-sm font-JakartaBold mb-1">Address</Text>
        <TextInput
          className="border border-primary-300 bg-white rounded-lg px-4 py-2"
          placeholder="111/111 Road Street, Melbourne"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Rooms */}
      <Text className="text-primary-500 text-sm font-JakartaBold mb-2">Rooms</Text>
      <View className="mb-4">
        <TextInput
          className="border border-primary-300 bg-white rounded-lg px-4 py-2 mb-3"
          placeholder="Living Room Number"
          value={livingRoom}
          onChangeText={setLivingRoom}
        />
        <TextInput
          className="border border-primary-300 bg-white rounded-lg px-4 py-2 mb-3"
          placeholder="Kitchen Number"
          value={kitchen}
          onChangeText={setKitchen}
        />
        <TextInput
          className="border border-primary-300 bg-white rounded-lg px-4 py-2 mb-3"
          placeholder="Bed Room Number"
          value={bedRoom}
          onChangeText={setBedRoom}
        />
        <TextInput
          className="border border-primary-300 bg-white rounded-lg px-4 py-2"
          placeholder="Toilet Number"
          value={toilet}
          onChangeText={setToilet}
        />
      </View>

      {/* Special Requirements */}
      <Text className="text-primary-500 text-sm font-JakartaBold mb-2">
        Special Requirement
      </Text>
      <View className="flex-row flex-wrap mb-4">
        {specialRequirements.map((item, index) => (
          <TouchableOpacity
            key={`${item}-${index}`}
            className={`border rounded-lg px-4 py-2 mb-3 mr-3 ${
              specialRequirements.includes(item)
                ? "bg-primary-500 border-primary-500"
                : "bg-white border-primary-300"
            }`}
            onPress={() => toggleSpecialRequirement(item)}
          >
            <Text
              className={`font-JakartaBold ${
                specialRequirements.includes(item) ? "text-white" : "text-primary-500"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Add Custom Special Requirement */}
        <View className="flex-row items-center">
          <TextInput
            className="border border-primary-300 bg-white rounded-lg px-4 py-2 w-32 mr-3"
            placeholder="Custom"
            value={customRequirement}
            onChangeText={setCustomRequirement}
          />
          <TouchableOpacity
            className="bg-primary-500 p-3 rounded-lg"
            onPress={addCustomRequirement}
          >
            <Text className="text-white font-JakartaBold">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        className="bg-primary-500 py-4 rounded-lg"
        onPress={handleNext}
      >
        <Text className="text-white text-center text-lg font-JakartaBold">
          Next
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
