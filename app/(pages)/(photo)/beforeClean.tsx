import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../../lib/supabase";
import { useRouter, useLocalSearchParams } from "expo-router";
import { v4 as uuidv4 } from "uuid";

export default function BeforeClean() {
  const router = useRouter();
  const { taskId: paramTaskId } = useLocalSearchParams<{ taskId?: string }>();

  // ✅ 如果没有 `taskId`，自动生成一个 UUID
  const [taskId, setTaskId] = useState(paramTaskId || uuidv4());
  const [uploadedImages, setUploadedImages] = useState({
    livingRoom: null,
    bedroom: null,
    kitchen: null,
    bathroom: null,
  });

  // ✅ 获取当前用户 ID
  const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      Alert.alert("Authentication Error", "User not authenticated");
      throw new Error("User not authenticated");
    }
    console.log("User ID:", user.id);
    return user.id;
  };

  // ✅ 处理图片上传
  const handleUpload = async (room) => {
    try {
      if (!taskId) {
        Alert.alert("Error", "No task ID provided. Cannot upload images.");
        return;
      }

      // 获取权限
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access media is required.");
        return;
      }

      // 选择图片
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5, 
      });

      if (pickerResult.canceled) return;

      const imageUri = pickerResult.assets[0].uri;
      const fileName = `${taskId}-${room}-${Date.now()}.jpg`;

      console.log(`Uploading ${fileName} from ${imageUri}`);

      // ✅ 直接上传文件（移除 Base64）
      const { data, error: uploadError } = await supabase.storage
        .from("cleaning-photos")
        .upload(fileName, {
          uri: imageUri,
          type: "image/jpeg",
          name: fileName,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        Alert.alert("Upload Failed", "There was an issue uploading the image.");
        return;
      }

      // ✅ 获取 `publicUrl`
      const { data: publicUrl } = supabase.storage
        .from("cleaning-photos")
        .getPublicUrl(fileName);

      console.log("Uploaded Image URL:", publicUrl.publicUrl);

      // ✅ 更新数据库，存入图片 URL
      const { error: dbError } = await supabase
        .from("cleaning_tasks")
        .update({ [`${room}_photo`]: publicUrl.publicUrl })
        .eq("task_id", taskId);

      if (dbError) {
        console.error("Database Update Error:", dbError);
        Alert.alert("Database Update Failed", "Could not save image URL.");
        return;
      }

      // ✅ 更新状态
      setUploadedImages((prev) => ({
        ...prev,
        [room]: publicUrl.publicUrl,
      }));

      Alert.alert("Upload Success", "Image uploaded and saved successfully!");

    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Upload Error", "Something went wrong.");
    }
  };

  // ✅ 处理确认提交
  const handleConfirm = async () => {
    try {
      const userId = await getUser();

      console.log("Updating Task ID:", taskId);
      console.log("User ID:", userId);

      // ✅ 插入或更新数据库
      const { error } = await supabase
        .from("cleaning_tasks")
        .upsert([
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

      if (error) {
        console.error("Update Error:", error);
        throw error;
      }

      Alert.alert("Success", "Images updated successfully!");
      router.push("/(pages)/(photo)/task");
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert("Error", error.message || "Failed to update images.");
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
