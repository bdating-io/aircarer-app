import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router"; // ① 引入 useSearchParams
import { Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function PlaceDetails() {
  const router = useRouter();
  // 从路由参数获取 taskId（首页创建时传递过来）
  const { taskId } = useLocalSearchParams() as { taskId?: string }; // ② 获取路由参数

  // Example cleaning types
  const cleaningTypes = ["Regular Cleaning", "End of Lease Cleaning"];
  const cleaningLevels = ["Quick Cleaning", "Regular Cleaning", "Deep Cleaning"];

  // UI State
  const [session, setSession] = useState<Session | null>(null);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);

  // Data from Supabase
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [noProperties, setNoProperties] = useState(false);

  // User Selections
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [cleaningType, setCleaningType] = useState("");
  const [cleaningLevel, setCleaningLevel] = useState("");
  const [equipmentProvided, setEquipmentProvided] =
    useState<"tasker" | "owner">("tasker");

  // ------------------ useEffect: Load session & fetch properties ------------------
  useEffect(() => {
    // Get current auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProperties(session.user.id);
      } else {
        setLoadingProperties(false);
      }
    });

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchUserProperties(session.user.id);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Fetch properties from Supabase
  const fetchUserProperties = async (userId: string) => {
    setLoadingProperties(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", userId); // 如果你的表里是别的字段，比如 'owner_id'，请改成相应字段

      if (error) {
        console.error("Error fetching properties:", error);
        setLoadingProperties(false);
        return;
      }

      if (!data || data.length === 0) {
        setNoProperties(true);
        setLoadingProperties(false);
        return;
      }

      setProperties(data);
      setNoProperties(false);
    } catch (err) {
      console.error("Could not fetch properties:", err);
    } finally {
      setLoadingProperties(false);
    }
  };

  // ------------------ Submit form => Update existing task & go next ------------------
  const handleSubmit = async () => {
    if (!session?.user) {
      Alert.alert("Not logged in", "Please log in first.");
      return;
    }

    // 如果路由里没带 taskId，这里也无法更新
    if (!taskId) {
      Alert.alert("No Task ID", "No taskId provided in route params.");
      return;
    }

    // If no property selected:
    if (!selectedProperty) {
      Alert.alert("Property required", "Please select a property first.");
      return;
    }

    // If user didn't pick cleaningType or cleaningLevel
    if (!cleaningType) {
      Alert.alert("Select Cleaning Type", "Please select a cleaning type.");
      return;
    }
    if (!cleaningLevel) {
      Alert.alert("Select Cleaning Level", "Please select a cleaning level.");
      return;
    }

    // Update the existing task
    try {
      // 注意：这里用 .update() 而不是 .insert()
      const { data, error } = await supabase
        .from("tasks")
        .update({
          // 只更新这些字段
          property_id: selectedProperty.property_id, // references the property's uuid
          address: selectedProperty.address,         // store address as snapshot
          cleaning_type: cleaningType,
          task_type: cleaningLevel,
          bring_equipment: equipmentProvided === "tasker" ? "Yes" : "No",
        })
        .eq("task_id", taskId) // 条件：更新特定taskId
        .select("*")
        .single();

      if (error) throw error;

      Alert.alert("Success", "Task updated successfully!");

      // 跳转到下一步 dateSelection，仍然带上同一个 taskId
      router.push(`/(pages)/(createTask)/dateSelection?taskId=${taskId}`);
    } catch (err) {
      console.error("Error updating task:", err);
      Alert.alert("Error", "Failed to update task. Please try again.");
    }
  };

  // ------------------ Render Logic ------------------
  if (loadingProperties) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
        <Text>Loading properties...</Text>
      </View>
    );
  }

  if (noProperties) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>
          Please create a property first in your account profile.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Task Detail</Text>

      {/* Select Property */}
      <Text style={styles.label}>Select your property</Text>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setPropertyOpen(!propertyOpen)}
        >
          <Text style={styles.dropdownText}>
            {selectedProperty
              ? selectedProperty.address
              : "Select your property here"}
          </Text>
          <Ionicons
            name={propertyOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>

        {propertyOpen && (
          <View style={styles.dropdownMenu}>
            {properties.map((prop) => (
              <TouchableOpacity
                key={prop.property_id} // or key={prop.id} if your column is named 'id'
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedProperty(prop);
                  setPropertyOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>
                  {prop.address || "No address"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Cleaning Type */}
      <Text style={styles.label}>What kind of clean is this?</Text>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setTypeOpen(!typeOpen)}
        >
          <Text style={styles.dropdownText}>
            {cleaningType || "Select cleaning type here"}
          </Text>
          <Ionicons
            name={typeOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
        {typeOpen && (
          <View style={styles.dropdownMenu}>
            {cleaningTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownItem}
                onPress={() => {
                  setCleaningType(type);
                  setTypeOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Cleaning Level */}
      <Text style={styles.label}>What cleaning level?</Text>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setLevelOpen(!levelOpen)}
        >
          <Text style={styles.dropdownText}>
            {cleaningLevel || "Select cleaning level here"}
          </Text>
          <Ionicons
            name={levelOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
        {levelOpen && (
          <View style={styles.dropdownMenu}>
            {cleaningLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={styles.dropdownItem}
                onPress={() => {
                  setCleaningLevel(level);
                  setLevelOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Equipment Provided */}
      <Text style={styles.label}>
        Does the cleaner need to bring equipment and supplies?
      </Text>
      <View style={styles.equipmentContainer}>
        <Button
          mode={equipmentProvided === "tasker" ? "contained" : "outlined"}
          onPress={() => setEquipmentProvided("tasker")}
          style={
            equipmentProvided === "tasker"
              ? [styles.buttonBase, styles.selectedButton]
              : [styles.buttonBase, styles.unselectedButton]
          }
          labelStyle={
            equipmentProvided === "tasker"
              ? styles.selectedLabel
              : styles.unselectedLabel
          }
        >
          Yes, tasker brings
        </Button>

        <Button
          mode={equipmentProvided === "owner" ? "contained" : "outlined"}
          onPress={() => setEquipmentProvided("owner")}
          style={
            equipmentProvided === "owner"
              ? [styles.buttonBase, styles.selectedButton]
              : [styles.buttonBase, styles.unselectedButton]
          }
          labelStyle={
            equipmentProvided === "owner"
              ? styles.selectedLabel
              : styles.unselectedLabel
          }
        >
          No, I will provide
        </Button>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: "#4E89CE",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdownWrapper: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#4E89CE",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 4,
    marginTop: -1,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#000",
  },
  equipmentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  buttonBase: {
    minWidth: 150,
    marginHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: "#4E89CE",
  },
  unselectedButton: {
    borderColor: "#4E89CE",
    borderWidth: 1,
  },
  selectedLabel: {
    color: "#fff",
    fontSize: 14,
  },
  unselectedLabel: {
    color: "#000",
    fontSize: 14,
  },
});
