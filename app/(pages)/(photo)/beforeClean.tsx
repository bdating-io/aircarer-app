import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";

type RoomType = "living_room" | "bedroom" | "kitchen" | "bathroom" | "other";

interface RoomPhotos {
  [key: string]: string[];
}

export default function BeforeCleaning() {
  const [uploadedImages, setUploadedImages] = useState<RoomPhotos>({
    living_room: [],
    bedroom: [],
    kitchen: [],
    bathroom: [],
    other: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const rooms = [
    {
      id: "living_room" as RoomType,
      label: "Living Room",
      description: "Living room area",
    },
    {
      id: "bedroom" as RoomType,
      label: "Bedroom",
      description: "Bedroom area",
    },
    {
      id: "kitchen" as RoomType,
      label: "Kitchen",
      description: "Kitchen area",
    },
    {
      id: "bathroom" as RoomType,
      label: "Bathroom",
      description: "Bathroom area",
    },
    { id: "other" as RoomType, label: "Other", description: "Other areas" },
  ];

  const handleSelectImage = async (roomId: RoomType) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setUploadedImages((prev) => ({
          ...prev,
          [roomId]: [...prev[roomId], result.assets[0].uri],
        }));
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const handleRemoveImage = (roomId: RoomType, index: number) => {
    setUploadedImages((prev) => ({
      ...prev,
      [roomId]: prev[roomId].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    const hasAnyImage = Object.values(uploadedImages).some(
      (urls) => urls.length > 0
    );
    if (!hasAnyImage) {
      Alert.alert("Required", "Please select at least one photo");
      return;
    }

    setIsUploading(true);

    try {
      // 获取或创建任务
      let currentTask;
      const { data: tasks, error: taskError } = await supabase
        .from("cleaning_tasks")
        .select()
        .order("created_at", { ascending: false })
        .limit(1);

      if (taskError) throw taskError;

      if (!tasks || tasks.length === 0) {
        // 创建新任务
        const { data: newTask, error: createError } = await supabase
          .from("cleaning_tasks")
          .insert([{ status: "in_progress" }])
          .select()
          .single();

        if (createError) throw createError;
        currentTask = newTask;
      } else {
        currentTask = tasks[0];
      }

      const taskId = currentTask.id;

      // 上传所有照片
      for (const [roomId, uris] of Object.entries(uploadedImages)) {
        if (uris.length === 0) continue;

        for (const uri of uris) {
          try {
            // 读取文件内容
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

            // 生成文件名
            const fileName = `${taskId}/${roomId}_before_${Date.now()}.jpg`;

            // 上传到 Storage
            const { error: uploadError } = await supabase.storage
              .from("cleaning-photos")
              .upload(fileName, base64, {
                contentType: "image/jpeg",
                cacheControl: "3600",
              });

            if (uploadError) throw uploadError;

            // 获取公共 URL
            const {
              data: { publicUrl },
            } = supabase.storage.from("cleaning-photos").getPublicUrl(fileName);

            // 保存照片记录
            await supabase.from("room_photos").insert([
              {
                task_id: taskId,
                room_type: roomId,
                photo_type: "before",
                photo_url: publicUrl,
              },
            ]);
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            continue; // 继续处理其他照片
          }
        }
      }

      Alert.alert("Success", "Photos uploaded successfully", [
        { text: "OK", onPress: () => router.push("/taskDetail") },
      ]);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to upload photos");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800">Before Cleaning</Text>
        <Text className="text-gray-600 mt-1">Take photos before cleaning</Text>
      </View>

      {rooms.map((room) => (
        <View key={room.id} className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="text-lg font-semibold">{room.label}</Text>
              <Text className="text-gray-500 text-sm">{room.description}</Text>
            </View>
            <Text className="text-gray-500">
              {uploadedImages[room.id].length} photos
            </Text>
          </View>

          <ScrollView
            horizontal
            className="mb-2"
            showsHorizontalScrollIndicator={false}
          >
            {uploadedImages[room.id].map((uri, index) => (
              <View key={index} className="mr-2">
                <Image
                  source={{ uri }}
                  style={{ width: 120, height: 120, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                  onPress={() => handleRemoveImage(room.id, index)}
                >
                  <Text className="text-white text-sm">×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => handleSelectImage(room.id)}
              style={{
                width: 120,
                height: 120,
                borderRadius: 8,
                backgroundColor: "#f3f4f6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text className="text-4xl text-gray-400">+</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ))}

      <View className="mt-4 mb-8">
        <TouchableOpacity
          className={`py-4 rounded-lg items-center ${
            isUploading
              ? "bg-gray-400"
              : Object.values(uploadedImages).some((urls) => urls.length > 0)
              ? "bg-blue-500"
              : "bg-gray-300"
          }`}
          onPress={handleSave}
          disabled={isUploading}
        >
          <Text className="text-white font-medium">
            {isUploading ? "Uploading..." : "Save Photos"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
