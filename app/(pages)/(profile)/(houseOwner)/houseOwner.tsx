import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface Property {
  address: string;
  bedrooms: string[];
  petCleaning: boolean;
  carpetCleaning: boolean;
  rangeHoodCleaning: boolean;
  ovenCleaning: boolean;
  entryMethod: string;
}

const initialProperty: Property = {
  address: "",
  bedrooms: [""],
  petCleaning: false,
  carpetCleaning: false,
  rangeHoodCleaning: false,
  ovenCleaning: false,
  entryMethod: "",
};

interface ToggleButtonProps {
  value: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleButton = ({ value, onToggle }: ToggleButtonProps) => (
  <View className="flex-row space-x-2">
    <TouchableOpacity
      className={`px-6 py-2 rounded-full border ${
        value ? "bg-blue-500 border-blue-500" : "border-gray-300"
      }`}
      onPress={() => onToggle(true)}
    >
      <Text className={value ? "text-white" : "text-gray-600"}>YES</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className={`px-6 py-2 rounded-full border ${
        !value ? "bg-blue-500 border-blue-500" : "border-gray-300"
      }`}
      onPress={() => onToggle(false)}
    >
      <Text className={!value ? "text-white" : "text-gray-600"}>No</Text>
    </TouchableOpacity>
  </View>
);

export default function HouseOwner() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([initialProperty]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentProperty = properties[currentIndex];

  const handleSubmit = async () => {
    try {
      // 获取当前用户ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Error", "Please login first");
        return;
      }

      // 验证所有必填字段
      if (!currentProperty.address || !currentProperty.entryMethod) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      const { data, error } = await supabase.from("properties").insert([
        {
          address: currentProperty.address,
          bedrooms: currentProperty.bedrooms.filter((room) => room !== ""),
          pet_cleaning: currentProperty.petCleaning,
          carpet_cleaning: currentProperty.carpetCleaning,
          range_hood_cleaning: currentProperty.rangeHoodCleaning,
          oven_cleaning: currentProperty.ovenCleaning,
          entry_method: currentProperty.entryMethod,
          user_id: user.id,
        },
      ]);

      if (error) throw error;
      Alert.alert("Success", "Property added successfully!");

      // 导航到 propertyList 页面
      router.push("/(pages)/(profile)/propertyList");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "An unexpected error occurred");
    }
  };

  const addNewProperty = () => {
    setProperties([...properties, { ...initialProperty }]);
    setCurrentIndex(properties.length);
  };

  const updateCurrentProperty = (updates: Partial<Property>) => {
    const updatedProperties = [...properties];
    updatedProperties[currentIndex] = {
      ...currentProperty,
      ...updates,
    };
    setProperties(updatedProperties);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">
            Property {currentIndex + 1}
          </Text>
          <View style={{ width: 24 }} /> {/* 为了对称的空白 */}
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Address */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Address</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="111/111 Road Street, Melbourne"
            value={currentProperty.address}
            onChangeText={(text) => updateCurrentProperty({ address: text })}
          />
        </View>

        {/* Bedrooms */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Bedrooms</Text>
          {currentProperty.bedrooms.map((room, index) => (
            <TextInput
              key={index}
              className="border border-gray-300 rounded-lg p-3 mb-2"
              placeholder="1"
              value={room}
              onChangeText={(text) => {
                const newBedrooms = [...currentProperty.bedrooms];
                newBedrooms[index] = text;
                updateCurrentProperty({ bedrooms: newBedrooms });
              }}
              keyboardType="numeric"
            />
          ))}
          <TouchableOpacity
            className="mt-2"
            onPress={() =>
              updateCurrentProperty({
                bedrooms: [...currentProperty.bedrooms, ""],
              })
            }
          >
            <Text className="text-blue-500">+ Add another bedroom</Text>
          </TouchableOpacity>
        </View>

        {/* Special Requirements */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Special Requirements</Text>
          <View className="space-y-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Pet cleaning</Text>
              <ToggleButton
                value={currentProperty.petCleaning}
                onToggle={(value) =>
                  updateCurrentProperty({ petCleaning: value })
                }
              />
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Carpet cleaning</Text>
              <ToggleButton
                value={currentProperty.carpetCleaning}
                onToggle={(value) =>
                  updateCurrentProperty({ carpetCleaning: value })
                }
              />
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Range hood cleaning</Text>
              <ToggleButton
                value={currentProperty.rangeHoodCleaning}
                onToggle={(value) =>
                  updateCurrentProperty({ rangeHoodCleaning: value })
                }
              />
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Oven cleaning</Text>
              <ToggleButton
                value={currentProperty.ovenCleaning}
                onToggle={(value) =>
                  updateCurrentProperty({ ovenCleaning: value })
                }
              />
            </View>
          </View>
        </View>

        {/* Entry Method */}
        <View className="mt-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-gray-600">Entry Method</Text>
            <Text className="text-red-500 ml-2">*</Text>
            <Text className="text-gray-600 ml-2">(compulsory)</Text>
            <TouchableOpacity className="ml-2">
              <AntDesign name="questioncircleo" size={16} color="gray" />
            </TouchableOpacity>
          </View>
          <TextInput
            className={`border ${
              !currentProperty.entryMethod
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg p-3`}
            placeholder="Enter method details"
            value={currentProperty.entryMethod}
            onChangeText={(text) =>
              updateCurrentProperty({ entryMethod: text })
            }
            multiline
            numberOfLines={4}
          />
          {!currentProperty.entryMethod && (
            <Text className="text-red-500 text-sm mt-1">
              This field is required
            </Text>
          )}
        </View>

        {/* Add New Property Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center border border-blue-500 rounded-lg p-4 mt-6 mb-6"
          onPress={addNewProperty}
        >
          <AntDesign name="plus" size={20} color="#4A90E2" />
          <Text className="text-blue-500 ml-2">Add New Property</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Next Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-3 items-center"
          onPress={handleSubmit}
        >
          <Text className="text-white font-medium">
            {currentIndex === properties.length - 1
              ? "Submit"
              : "Next Property"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
