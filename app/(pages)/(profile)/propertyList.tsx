import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface Property {
  id: string;
  address: string;
  bedrooms: string[];
  pet_cleaning: boolean;
  carpet_cleaning: boolean;
  range_hood_cleaning: boolean;
  oven_cleaning: boolean;
  entry_method: string;
}

export default function PropertyList() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // 获取当前用户
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Error", "Please login first");
        return;
      }

      // 获取用户的房源
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
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
          <Text className="text-xl font-semibold ml-4">Property List</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {loading ? (
          <Text className="text-center py-4">Loading...</Text>
        ) : properties.length === 0 ? (
          <Text className="text-center py-4">No properties found</Text>
        ) : (
          /* Property Cards */
          properties.map((property) => (
            <View key={property.id} className="bg-gray-100 rounded-lg p-4 mb-4">
              <Text className="text-lg font-semibold">{property.address}</Text>
              <Text className="text-gray-600 mb-2">
                {property.bedrooms.length} bedroom(s)
              </Text>
              <View className="space-y-2">
                {property.pet_cleaning && (
                  <View className="flex-row items-center">
                    <AntDesign name="check" size={16} color="green" />
                    <Text className="text-gray-600 ml-2">Pet Cleaning</Text>
                  </View>
                )}
                {property.carpet_cleaning && (
                  <View className="flex-row items-center">
                    <AntDesign name="check" size={16} color="green" />
                    <Text className="text-gray-600 ml-2">Carpet Cleaning</Text>
                  </View>
                )}
                {property.range_hood_cleaning && (
                  <View className="flex-row items-center">
                    <AntDesign name="check" size={16} color="green" />
                    <Text className="text-gray-600 ml-2">
                      Range Hood Cleaning
                    </Text>
                  </View>
                )}
                {property.oven_cleaning && (
                  <View className="flex-row items-center">
                    <AntDesign name="check" size={16} color="green" />
                    <Text className="text-gray-600 ml-2">Oven Cleaning</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}

        {/* Add New Property Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center border border-blue-500 rounded-lg p-4 mb-6"
          onPress={() =>
            router.push("/(pages)/(profile)/(houseOwner)/houseOwner")
          }
        >
          <AntDesign name="plus" size={20} color="#4A90E2" />
          <Text className="text-blue-500 ml-2">Add New Property</Text>
        </TouchableOpacity>

        {/* Next Button */}
        <View className="px-4 py-4 border-t border-gray-200">
          <TouchableOpacity
            className="bg-[#4A90E2] rounded-full py-3 items-center"
            onPress={() => {
              router.push("/(pages)/(profile)/(houseOwner)/expectedPricing");
            }}
          >
            <Text className="text-white font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
