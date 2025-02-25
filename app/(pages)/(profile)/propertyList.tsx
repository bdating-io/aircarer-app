import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface Property {
  property_id: string;
  address: string;
  bedrooms: number; // set as int in DB
  bathrooms: number; // set as int in DB
  pet_cleaning: boolean;
  carpet_cleaning: boolean;
  range_hood_cleaning: boolean;
  oven_cleaning: boolean;
  entry_method: string;
  unit_number?: string;
  street_number?: string;
  street_name?: string;
  suburb?: string;
  state?: string;
  postal_code?: string;
}

export default function PropertyList() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // 添加房源相关 state
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoSuggestions, setAutoSuggestions] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  // 手动地址拆分字段
  const [unitNumber, setUnitNumber] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [suburb, setSuburb] = useState("");
  const [stateField, setStateField] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // bedrooms & bathrooms
  const [bedroomsInput, setBedroomsInput] = useState("");
  const [bathroomsInput, setBathroomsInput] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  // 1) 获取用户房源列表
  const fetchProperties = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "Please login first");
        return;
      }

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

  // 2) 自动填地址(假示例)
  const handleSearchTermChange = (text: string) => {
    setSearchTerm(text);
    setSelectedAddress(""); // 清空之前选择
    if (text.length >= 3) {
      const fakeSuggestions = [
        "601 Bourke St, Melbourne VIC 3000",
        "601 Arden St, Coogee NSW 2034",
        "601 Pitt St, Sydney NSW 2000",
      ].filter((addr) => addr.toLowerCase().includes(text.toLowerCase()));
      setAutoSuggestions(fakeSuggestions);
    } else {
      setAutoSuggestions([]);
    }
  };

  const handleSelectSuggestion = (addr: string) => {
    setSelectedAddress(addr);
    setSearchTerm(addr);
    setAutoSuggestions([]);
  };

  // 3) 提交: 新建房源
  const handleAddProperty = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "Please login first");
        return;
      }

      const bdr = parseInt(bedroomsInput, 10);
      const bth = parseInt(bathroomsInput, 10);

      if (isNaN(bdr) || bdr < 0) {
        Alert.alert("Error", "Please provide a valid number for bedrooms.");
        return;
      }
      if (isNaN(bth) || bth < 0) {
        Alert.alert("Error", "Please provide a valid number for bathrooms.");
        return;
      }

      let finalAddress = "";
      let insertObj: any = {
        user_id: user.id,
        bedrooms: bdr,
        bathrooms: bth,
        pet_cleaning: false,
        carpet_cleaning: false,
        range_hood_cleaning: false,
        oven_cleaning: false,
        entry_method: "Key exchange",
      };

      if (mode === "auto") {
        if (!selectedAddress) {
          Alert.alert("Error", "Please select an address from suggestions first.");
          return;
        }
        finalAddress = selectedAddress;
        insertObj.unit_number = "";
        insertObj.street_number = "";
        insertObj.street_name = "";
        insertObj.suburb = "";
        insertObj.state = "";
        insertObj.postal_code = "";
      } else {
        if (!streetNumber || !streetName || !suburb || !stateField || !postalCode) {
          Alert.alert("Error", "Please fill out all mandatory fields.");
          return;
        }
        finalAddress = `${unitNumber ? unitNumber + "/" : ""}${streetNumber} ${streetName}, ${suburb} ${stateField} ${postalCode}`;
        insertObj.unit_number = unitNumber;
        insertObj.street_number = streetNumber;
        insertObj.street_name = streetName;
        insertObj.suburb = suburb;
        insertObj.state = stateField;
        insertObj.postal_code = postalCode;
      }

      insertObj.address = finalAddress;

      const { data, error } = await supabase
        .from("properties")
        .insert(insertObj)
        .select("*");

      if (error) throw error;

      Alert.alert("Success", "Property added!");
      // 清空输入
      setSearchTerm("");
      setSelectedAddress("");
      setUnitNumber("");
      setStreetNumber("");
      setStreetName("");
      setSuburb("");
      setStateField("");
      setPostalCode("");
      setBedroomsInput("");
      setBathroomsInput("");
      fetchProperties();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to add property");
    }
  };

  // ========== Delete property ==========
  const handleDeleteProperty = async (propertyId: string) => {
    try {
      Alert.alert(
        "Delete Property",
        "Are you sure you want to delete this property?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const { error } = await supabase
                .from("properties")
                .delete()
                .eq("property_id", propertyId);

              if (error) {
                Alert.alert("Error", error.message);
                return;
              }

              Alert.alert("Success", "Property deleted!");
              fetchProperties();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to delete property");
    }
  };

  // ========== Edit property ==========
  const handleEditProperty = (propertyId: string) => {
    // 这里跳转到 /editProperty 路由
    // 你可以在该路由中做一个“编辑房源”表单
    router.push(`/editProperty?propertyId=${propertyId}`);
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
          // 显示已存在房源 + Edit/Delete
          properties.map((property) => (
            <View key={property.property_id} className="bg-gray-100 rounded-lg p-4 mb-4">
              <Text className="text-lg font-semibold">{property.address}</Text>
              <Text className="text-gray-600 mb-2">
                {property.bedrooms} bedroom(s), {property.bathrooms} bathroom(s)
              </Text>

              {/* Buttons row */}
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFD700",
                    padding: 8,
                    borderRadius: 6,
                    marginRight: 8,
                  }}
                  onPress={() => handleEditProperty(property.property_id)}
                >
                  <AntDesign name="edit" size={16} color="black" />
                  <Text style={{ marginLeft: 4 }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FF7E7E",
                    padding: 8,
                    borderRadius: 6,
                  }}
                  onPress={() => handleDeleteProperty(property.property_id)}
                >
                  <AntDesign name="delete" size={16} color="white" />
                  <Text style={{ color: "#fff", marginLeft: 4 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* 新增房源表单 */}
        <View className="mt-6 border-t pt-4">
          <Text className="text-lg font-semibold mb-4">Add New Property</Text>

          {/* Mode toggle: auto / manual */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setMode("auto")}
              style={{
                flex: 1,
                backgroundColor: mode === "auto" ? "#4A90E2" : "#ccc",
                padding: 12,
                marginRight: 4,
                borderRadius: 6,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>AutoComplete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode("manual")}
              style={{
                flex: 1,
                backgroundColor: mode === "manual" ? "#4A90E2" : "#ccc",
                padding: 12,
                marginLeft: 4,
                borderRadius: 6,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>Manual</Text>
            </TouchableOpacity>
          </View>

          {mode === "auto" ? (
            // Auto Complete
            <View className="mb-4">
              <Text>Type address keywords:</Text>
              <TextInput
                value={searchTerm}
                onChangeText={handleSearchTermChange}
                placeholder="e.g. '601'..."
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  borderRadius: 6,
                  marginTop: 4,
                }}
              />
              {autoSuggestions.length > 0 && (
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    marginTop: 2,
                    borderRadius: 4,
                  }}
                >
                  {autoSuggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      onPress={() => handleSelectSuggestion(suggestion)}
                      style={{ padding: 8 }}
                    >
                      <Text>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {selectedAddress ? (
                <Text style={{ marginTop: 4 }}>Selected: {selectedAddress}</Text>
              ) : null}
            </View>
          ) : (
            // Manual address
            <View className="space-y-3 mb-4">
              <TextInput
                placeholder="Unit Number (optional)"
                value={unitNumber}
                onChangeText={setUnitNumber}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  borderRadius: 6,
                }}
              />
              <TextInput
                placeholder="Street Number"
                value={streetNumber}
                onChangeText={setStreetNumber}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  borderRadius: 6,
                }}
              />
              <TextInput
                placeholder="Street Name"
                value={streetName}
                onChangeText={setStreetName}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  borderRadius: 6,
                }}
              />
              <TextInput
                placeholder="Suburb"
                value={suburb}
                onChangeText={setSuburb}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  borderRadius: 6,
                }}
              />
              <TextInput
                placeholder="State (e.g. VIC, NSW...)"
                value={stateField}
                onChangeText={setStateField}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  borderRadius: 6,
                }}
              />
              <TextInput
                placeholder="Postal Code"
                value={postalCode}
                onChangeText={setPostalCode}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  borderRadius: 6,
                }}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Bedrooms, Bathrooms */}
          <View className="mb-4">
            <Text>Bedrooms:</Text>
            <TextInput
              value={bedroomsInput}
              onChangeText={setBedroomsInput}
              placeholder="e.g. '2'"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                borderRadius: 6,
                marginTop: 4,
              }}
              keyboardType="numeric"
            />
          </View>
          <View className="mb-4">
            <Text>Bathrooms:</Text>
            <TextInput
              value={bathroomsInput}
              onChangeText={setBathroomsInput}
              placeholder="e.g. '1'"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                borderRadius: 6,
                marginTop: 4,
              }}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            onPress={handleAddProperty}
            style={{
              backgroundColor: "#4A90E2",
              padding: 12,
              borderRadius: 6,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <AntDesign name="plus" size={20} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 8 }}>Save Property</Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <View className="px-4 py-4 border-t border-gray-200 mt-4">
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
