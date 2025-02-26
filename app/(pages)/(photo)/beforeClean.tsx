import React, { useState, useEffect } from "react";
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
import * as FileSystem from "expo-file-system";

export default function BeforeClean() {
  const router = useRouter();
  const { taskId: paramTaskId } = useLocalSearchParams<{ taskId?: string }>();

  const [taskId, setTaskId] = useState<string | null>(paramTaskId || null);
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

  // ✅ 获取 / 创建 `task_id`
  const getOrCreateTask = async () => {
    if (taskId) return taskId; // 如果已有 taskId，直接返回

    const userId = await getUser();

    // **创建任务，让数据库自动生成 `task_id`**
    const { data, error } = await supabase
      .from("cleaning_tasks")
      .insert([{ user_id: userId }])
      .select("task_id")
      .single();

    if (error) {
      console.error("Task creation failed:", error);
      Alert.alert("Error", "Failed to create task.");
      throw error;
    }

    setTaskId(data.task_id);
    return data.task_id;
  };

  // ✅ 处理图片上传
  const handleUpload = async (room) => {
    try {
      const currentTaskId = await getOrCreateTask();

      // **获取权限**
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access media is required.");
        return;
      }

      // **选择图片**
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5, 
      });

      if (pickerResult.canceled) return;

      const imageUri = pickerResult.assets[0].uri;
      const fileName = `${currentTaskId}-${room}-${Date.now()}.jpg`;

      console.log(`Uploading ${fileName} from ${imageUri}`);

      // ✅ 读取文件为 Base64
      const base64File = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // ✅ 转换为 `FormData`
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: fileName,
        type: "image/jpeg",
      });

      // ✅ 直接使用 `fetch` 进行上传
      const { error: uploadError } = await supabase.storage
        .from("cleaning-photos")
        .upload(fileName, formData, { contentType: "image/jpeg" });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        Alert.alert("Upload Failed", "There was an issue uploading the image.");
        return;
      }

      // ✅ 获取 `publicUrl`
      const { data: urlData } = supabase.storage
        .from("cleaning-photos")
        .getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;
      console.log("Uploaded Image URL:", publicUrl);

      // ✅ 更新数据库，存入 JSONB 字段
      const { error: dbError } = await supabase
        .from("cleaning_tasks")
        .update({ [`${room}_photo`]: publicUrl })
        .eq("task_id", currentTaskId);

      if (dbError) {
        console.error("Database Update Error:", dbError);
        Alert.alert("Database Update Failed", "Could not save image URL.");
        return;
      }

      // ✅ 更新状态
      setUploadedImages((prev) => ({
        ...prev,
        [room]: publicUrl,
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
      const currentTaskId = await getOrCreateTask();

      console.log("Updating Task ID:", currentTaskId);
      console.log("User ID:", userId);

      // ✅ 插入或更新数据库
      const { error } = await supabase
        .from("cleaning_tasks")
        .upsert([
          {
            task_id: currentTaskId,
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
