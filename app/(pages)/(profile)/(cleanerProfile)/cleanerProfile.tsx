import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { AddressFormData, AustralianState } from "@/types/address";

export default function AddressForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AddressFormData>({
    type: "USER_ADDRESS",
    street_number: "",
    street_name: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Australia", // 默认值
    latitude: "",
    longitude: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getAddress(session.user.id);
      }
    });
  }, []);

  const getAddress = async (userId: string) => {
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

    setFormData({
      type: "USER_ADDRESS",
      street_number: address.street_number,
      street_name: address.street_name,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: "Australia", // 默认值
      latitude: address.latitude,
      longitude: address.longitude
    })
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("addresses")
        .upsert({
          user_id: user.id,
          type: 'USER_ADDRESS',
          street_number: formData.street_number,
          street_name: formData.street_name,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          latitude: formData.latitude || null,
          longitude: formData.longitude || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,type' })
        .select()
        .single();

      if (error) throw error;

      Alert.alert("Success", "Address saved successfully!");
      router.push("/(pages)/(profile)/(cleanerProfile)/workingArea");
    } catch (error: any) {
      console.error("Error saving address:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4A90E2]">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center pt-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-white ml-4">
            Enter your address
          </Text>
        </View>

        <ScrollView className="flex-1 mt-8">
          {/* Street Number */}
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">Street Number *</Text>
            <View className="bg-white/10 rounded-xl p-4">
              <TextInput
                className="text-white text-lg"
                placeholder="123"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.street_number}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, street_number: text }))
                }
              />
            </View>
          </View>

          {/* Street Name */}
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">Street Name *</Text>
            <View className="bg-white/10 rounded-xl p-4">
              <TextInput
                className="text-white text-lg"
                placeholder="Main Street"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.street_name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, street_name: text }))
                }
              />
            </View>
          </View>

          {/* City */}
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">City *</Text>
            <View className="bg-white/10 rounded-xl p-4">
              <TextInput
                className="text-white text-lg"
                placeholder="Melbourne"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.city}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, city: text }))
                }
              />
            </View>
          </View>

          {/* State */}
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">State *</Text>
            <View className="bg-white/10 rounded-xl p-4">
              <TextInput
                className="text-white text-lg"
                placeholder="VIC"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.state}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, state: text }))
                }
              />
            </View>
          </View>

          {/* Postal Code */}
          <View className="mb-4">
            <Text className="text-white text-lg mb-2">Postal Code *</Text>
            <View className="bg-white/10 rounded-xl p-4">
              <TextInput
                className="text-white text-lg"
                placeholder="3000"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.postal_code}
                keyboardType="number-pad"
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, postal_code: text }))
                }
              />
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View className="py-4">
          <TouchableOpacity
            className="bg-[#FF6B6B] rounded-xl p-4"
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {isLoading ? "Saving..." : "Save Address"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
