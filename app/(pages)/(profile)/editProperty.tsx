import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface Property {
  property_id?: number;
  user_id?: string;
  address: string;
  pet_cleaning: boolean;
  carpet_cleaning: boolean;
  range_hood_cleaning: boolean;
  oven_cleaning: boolean;
  entry_method: string;
  bedrooms: number;
  bathrooms: number;
  unit_number?: string;
  street_number: string;
  street_name: string;
  suburb: string;
  state: string;
  postal_code: string;
  created_at?: string;
}

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

export default function EditProperty() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId as string);
    }
  }, [propertyId]);

  const fetchProperty = async (property_id: string) => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("property_id", property_id)
        .single();

      if (error) throw error;
      if (data) {
        setProperty(data);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!property) return;

    try {
      setLoading(true);

      // Validate required fields
      if (
        !property.street_number ||
        !property.street_name ||
        !property.suburb ||
        !property.state ||
        !property.postal_code ||
        !property.entry_method
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      // Construct full address
      const fullAddress = `${
        property.unit_number ? property.unit_number + "/" : ""
      }${property.street_number} ${property.street_name}, ${property.suburb}, ${
        property.state
      } ${property.postal_code}`;

      const { error } = await supabase
        .from("properties")
        .update({
          address: fullAddress,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          pet_cleaning: property.pet_cleaning,
          carpet_cleaning: property.carpet_cleaning,
          range_hood_cleaning: property.range_hood_cleaning,
          oven_cleaning: property.oven_cleaning,
          entry_method: property.entry_method,
          unit_number: property.unit_number,
          street_number: property.street_number,
          street_name: property.street_name,
          suburb: property.suburb,
          state: property.state,
          postal_code: property.postal_code,
        })
        .eq("property_id", propertyId);

      if (error) throw error;
      Alert.alert("Success", "Property updated successfully!");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this property? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase
                .from("properties")
                .delete()
                .eq("property_id", propertyId);

              if (error) throw error;
              Alert.alert("Success", "Property deleted successfully!");
              router.back();
            } catch (err: any) {
              Alert.alert("Error", err.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (fetchLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="mt-4 text-gray-600">Loading property details...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <AntDesign name="exclamationcircleo" size={50} color="#FF4D4F" />
        <Text className="mt-4 text-lg font-semibold">Property Not Found</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-2 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Edit Property</Text>
          <TouchableOpacity onPress={handleDelete}>
            <AntDesign name="delete" size={24} color="#FF4D4F" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4">
          {/* Address Details */}
          <View className="mt-6">
            <Text className="text-lg font-semibold mb-4">Property Address</Text>

            <View className="flex-row space-x-2 mb-4">
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">Unit/Apt (optional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Unit number"
                  value={property.unit_number}
                  onChangeText={(text) =>
                    setProperty({ ...property, unit_number: text })
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">Street Number</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Street number"
                  value={property.street_number}
                  onChangeText={(text) =>
                    setProperty({ ...property, street_number: text })
                  }
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Street Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="Street name"
                value={property.street_name}
                onChangeText={(text) =>
                  setProperty({ ...property, street_name: text })
                }
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Suburb</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="Suburb"
                value={property.suburb}
                onChangeText={(text) =>
                  setProperty({ ...property, suburb: text })
                }
              />
            </View>

            <View className="flex-row space-x-2 mb-4">
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">State</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="State"
                  value={property.state}
                  onChangeText={(text) =>
                    setProperty({ ...property, state: text })
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">Postal Code</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Postal code"
                  value={property.postal_code}
                  onChangeText={(text) =>
                    setProperty({ ...property, postal_code: text })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Preview Address */}
          {property.street_number &&
            property.street_name &&
            property.suburb && (
              <View className="mt-2 p-3 bg-gray-50 rounded-lg mb-4">
                <Text className="text-gray-800 font-medium">
                  Address Preview:
                </Text>
                <Text className="text-gray-800">
                  {property.unit_number ? `${property.unit_number}/` : ""}
                  {property.street_number} {property.street_name},{" "}
                  {property.suburb},{property.state ? ` ${property.state}` : ""}
                  {property.postal_code ? property.postal_code : ""}
                </Text>
              </View>
            )}

          {/* Bedrooms */}
          <View className="mt-6">
            <Text className="text-gray-600 mb-2">Bedrooms</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  if (property.bedrooms > 1) {
                    setProperty({
                      ...property,
                      bedrooms: property.bedrooms - 1,
                    });
                  }
                }}
              >
                <AntDesign name="minus" size={20} color="#4A90E2" />
              </TouchableOpacity>

              <Text className="mx-4 text-lg font-semibold">
                {property.bedrooms}
              </Text>

              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  setProperty({
                    ...property,
                    bedrooms: property.bedrooms + 1,
                  });
                }}
              >
                <AntDesign name="plus" size={20} color="#4A90E2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bathrooms */}
          <View className="mt-6">
            <Text className="text-gray-600 mb-2">Bathrooms</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  if (property.bathrooms > 1) {
                    setProperty({
                      ...property,
                      bathrooms: property.bathrooms - 1,
                    });
                  }
                }}
              >
                <AntDesign name="minus" size={20} color="#4A90E2" />
              </TouchableOpacity>

              <Text className="mx-4 text-lg font-semibold">
                {property.bathrooms}
              </Text>

              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  setProperty({
                    ...property,
                    bathrooms: property.bathrooms + 1,
                  });
                }}
              >
                <AntDesign name="plus" size={20} color="#4A90E2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Special Requirements */}
          <View className="mt-6">
            <Text className="text-lg font-semibold mb-2">
              Special Requirements
            </Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Pet cleaning</Text>
                <ToggleButton
                  value={property.pet_cleaning}
                  onToggle={(value) =>
                    setProperty({ ...property, pet_cleaning: value })
                  }
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Carpet cleaning</Text>
                <ToggleButton
                  value={property.carpet_cleaning}
                  onToggle={(value) =>
                    setProperty({ ...property, carpet_cleaning: value })
                  }
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Range hood cleaning</Text>
                <ToggleButton
                  value={property.range_hood_cleaning}
                  onToggle={(value) =>
                    setProperty({ ...property, range_hood_cleaning: value })
                  }
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Oven cleaning</Text>
                <ToggleButton
                  value={property.oven_cleaning}
                  onToggle={(value) =>
                    setProperty({ ...property, oven_cleaning: value })
                  }
                />
              </View>
            </View>
          </View>

          {/* Entry Method */}
          <View className="mt-6 mb-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-600">Entry Method</Text>
              <Text className="text-red-500 ml-2">*</Text>
              <Text className="text-gray-600 ml-2">(compulsory)</Text>
              <TouchableOpacity
                className="ml-2"
                onPress={() =>
                  Alert.alert(
                    "Entry Method",
                    "Please provide details on how the cleaner can access your property (e.g., key in mailbox, door code, etc.)"
                  )
                }
              >
                <AntDesign name="questioncircleo" size={16} color="gray" />
              </TouchableOpacity>
            </View>
            <TextInput
              className={`border ${
                !property.entry_method ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3`}
              placeholder="Enter method details"
              value={property.entry_method}
              onChangeText={(text) =>
                setProperty({ ...property, entry_method: text })
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {!property.entry_method && (
              <Text className="text-red-500 text-sm mt-1">
                This field is required
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Update Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-3 items-center"
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium">Update Property</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
