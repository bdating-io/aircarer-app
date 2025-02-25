import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function EditProperty() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams(); 
  // state for property
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId as string);
    }
  }, [propertyId]);

  const fetchProperty = async (property_id: string) => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("property_id", property_id)
        .single();
      if (error) throw error;
      if (data) {
        setAddress(data.address);
        setBedrooms(data.bedrooms?.toString() || "");
        setBathrooms(data.bathrooms?.toString() || "");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleSave = async () => {
    try {
      const bdr = parseInt(bedrooms, 10);
      const bth = parseInt(bathrooms, 10);
      if (isNaN(bdr) || bdr < 0) {
        Alert.alert("Invalid bedrooms", "Please provide valid integer");
        return;
      }
      if (isNaN(bth) || bth < 0) {
        Alert.alert("Invalid bathrooms", "Please provide valid integer");
        return;
      }

      const { error } = await supabase
        .from("properties")
        .update({
          address,
          bedrooms: bdr,
          bathrooms: bth,
        })
        .eq("property_id", propertyId);

      if (error) throw error;
      Alert.alert("Success", "Property updated successfully!");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text>Edit Property</Text>

      <Text style={{ marginTop: 16 }}>Address:</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        style={{ borderWidth: 1, borderColor: "#ccc", marginTop: 4, padding: 8 }}
      />

      <Text style={{ marginTop: 16 }}>Bedrooms:</Text>
      <TextInput
        value={bedrooms}
        onChangeText={setBedrooms}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ccc", marginTop: 4, padding: 8 }}
      />

      <Text style={{ marginTop: 16 }}>Bathrooms:</Text>
      <TextInput
        value={bathrooms}
        onChangeText={setBathrooms}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ccc", marginTop: 4, padding: 8 }}
      />

      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#4A90E2",
          padding: 12,
          borderRadius: 6,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "#fff" }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
