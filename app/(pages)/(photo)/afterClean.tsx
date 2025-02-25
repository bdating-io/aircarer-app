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
import { supabase } from "../../../lib/supabase"; // 确保路径正确
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";

export default function BeforeClean() {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState({
    livingRoom: null,
    bedroom: null,
    kitchen: null,
    bathroom: null,
  });

  // 📌 获取当前用户 ID，并在手机端显示
  const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      Alert.alert("Authentication Error", "User not authenticated");
      throw new Error("User not authenticated");
    }
    console.log("User ID:", user.id);
    return user.id;
  };

  // 📌 处理图片上传
  const handleUpload = async (room) => {
    try {
      const permissionResult =
        Platform.OS === "web"
          ? true
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult?.granted === false) {
        Alert.alert("Permission Required", "Permission to access media is required.");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5, 
      });

      if (pickerResult.canceled) return;

      const imageUri = pickerResult.assets[0].uri;
      const fileName = `${room}-${Date.now()}.jpg`;

      console.log(`Uploading ${fileName} from ${imageUri}`);

      // **转换 `file://` 为 Base64**
      const file = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data, error } = await supabase.storage
        .from("cleaning-photos")
        .upload(fileName, file, { contentType: "image/jpeg" });

      if (error) {
        Alert.alert("Upload Failed", "There was an issue uploading the image.");
        console.error("Upload error:", error);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("cleaning-photos")
        .getPublicUrl(fileName);

      console.log("Uploaded Image URL:", publicUrl.publicUrl);

      setUploadedImages((prev) => ({
        ...prev,
        [room]: publicUrl.publicUrl,
      }));

      Alert.alert("Upload Success", "Image uploaded successfully!");

    } catch (error) {
      Alert.alert("Upload Error", "Something went wrong.");
      console.error("Upload Error:", error);
    }
  };

  // 📌 处理确认提交
  const handleConfirm = async () => {
    try {
      const userId = await getUser(); // 🔹 先获取用户 ID

      // 🔹 获取 `task_id`（确保不为空）
      let taskId = Date.now();

      console.log("Final Task ID:", taskId);
      console.log("User ID:", userId);

      const { error } = await supabase.from("cleaning_tasks").insert([
        {
          task_id: taskId, // 🔹 确保 task_id 不是 null
          user_id: userId, 
          living_room_photo: uploadedImages.livingRoom,
          bedroom_photo: uploadedImages.bedroom,
          kitchen_photo: uploadedImages.kitchen,
          bathroom_photo: uploadedImages.bathroom,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      Alert.alert("Success", "Images submitted successfully!");
      router.push("/(pages)/(photo)/task"); // 🔹 提交后跳转
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to submit images.");
      console.error("Insert Error:", error);
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
          onPress={handleConfirm}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
