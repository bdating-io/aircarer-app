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
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { v4 as uuidv4 } from "uuid"; // 需要安装: npm install uuid

export default function BeforeClean() {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState({
    livingRoom: null,
    bedroom: null,
    kitchen: null,
    bathroom: null,
  });

  // 📌 获取当前用户 ID
  const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      Alert.alert("Authentication Error", "User not authenticated");
      throw new Error("User not authenticated");
    }
    return user.id;
  };

  // 📌 处理图片上传
  const handleUpload = async (room) => {
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5, 
      });

      if (pickerResult.canceled) return;

      const imageUri = pickerResult.assets[0].uri;
      const fileName = `${room}-${Date.now()}.jpg`;

      // **读取文件数据**
      const file = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // **转换 Base64 为 Blob**
      const fileBuffer = Buffer.from(file, "base64");

      const { data, error } = await supabase.storage
        .from("cleaning-photos")
        .upload(fileName, fileBuffer, { contentType: "image/jpeg" });

      if (error) {
        Alert.alert("Upload Failed", "There was an issue uploading the image.");
        console.error("Upload error:", error);
        return;
      }

      // **获取图片 URL**
      const publicUrl = supabase.storage.from("cleaning-photos").getPublicUrl(fileName).data.publicUrl;

      console.log("Uploaded Image URL:", publicUrl);

      setUploadedImages((prev) => ({
        ...prev,
        [room]: publicUrl,
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
      const userId = await getUser();
      const taskId = uuidv4(); // ✅ 生成 UUID 作为 task_id

      // **确保所有图片都已上传**
      const requiredFields = ["livingRoom", "bedroom", "kitchen", "bathroom"];
      for (let field of requiredFields) {
        if (!uploadedImages[field]) {
          Alert.alert("Error", `Please upload a photo for ${field}.`);
          return;
        }
      }

      const { error } = await supabase.from("cleaning_tasks").insert([
        {
          task_id: taskId,
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
