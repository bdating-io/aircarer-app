import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function BeforeClean() {
  const [uploadedImages, setUploadedImages] = useState({
    livingRoom: null,
    bedroom: null,
    kitchen: null,
    bathroom: null,
  });

  const handleUpload = async (room) => {
    // 检查权限
    const permissionResult =
      Platform.OS === "web"
        ? true
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult?.granted === false) {
      Alert.alert("Permission Required", "Permission to access media is required.");
      return;
    }

    // 打开图片选择器
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const newImages = { ...uploadedImages };
      newImages[room] = pickerResult.assets[0].uri; // 保存图片 URI
      setUploadedImages(newImages);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f9f9f9" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Photo Before Cleaning
      </Text>

      {["livingRoom", "bedroom", "kitchen", "bathroom"].map((room) => (
        <View
          key={room}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
              {room.charAt(0).toUpperCase() + room.slice(1)}
            </Text>
            <Text style={{ color: "#888" }}>Brief description</Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#e0e0e0",
              padding: 12,
              borderRadius: 8,
            }}
            onPress={() => handleUpload(room)}
          >
            {uploadedImages[room] ? (
              <Image
                source={{ uri: uploadedImages[room] }}
                style={{ width: 40, height: 40, borderRadius: 4 }}
              />
            ) : (
              <Text style={{ fontSize: 24, color: "#888" }}>+</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ marginTop: 24 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#4A90E2",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => Alert.alert("Confirm", "Images submitted successfully!")}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
