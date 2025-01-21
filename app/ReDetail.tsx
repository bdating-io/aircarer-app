import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ReDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addItemToList } = route.params || {}; // 从父页面传递的添加方法

  const [itemType, setItemType] = useState(""); // 物品类型
  const [cleaningType, setCleaningType] = useState(""); // 清洁类型
  const [itemCount, setItemCount] = useState(""); // 数量
  const [itemPhoto, setItemPhoto] = useState<string | null>(null); // 照片 URI

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setItemPhoto(result.assets[0].uri);
      Alert.alert("Photo Uploaded", "The photo was successfully uploaded.");
    }
  };

  const handleSave = () => {
    if (!itemType || !cleaningType || !itemCount) {
      Alert.alert("Missing Fields", "Please complete all required fields.");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      type: itemType,
      cleaning: cleaningType,
      count: Number(itemCount),
      photo: itemPhoto,
    };

    if (addItemToList) {
      addItemToList(newItem); // 将新物品添加到列表
      console.log("Item saved:", newItem);
    } else {
      console.error("addItemToList is not defined!");
    }

    Alert.alert("Task Saved", "Recycle item details saved successfully.");
    navigation.navigate("RetaskDetail"); // 跳转回 RetaskDetail 页面
  };

  return (
    <View className="flex-1 bg-primary-100 px-6 py-4">
      {/* Header */}
      <View className="bg-primary-500 py-4 px-6 mb-4">
        <Text className="text-white text-xl font-JakartaBold text-center">
          Recycle Task Detail
        </Text>
      </View>

      {/* Item Type */}
      <Text className="text-primary-500 text-sm font-JakartaBold mb-2">
        Item Type
      </Text>
      <View className="border border-primary-300 bg-white rounded-lg mb-4">
        <Picker
          selectedValue={itemType}
          style={{ height: 50 }}
          onValueChange={(itemValue) => setItemType(itemValue)}
        >
          <Picker.Item label="Select the item type here" value="" />
          <Picker.Item label="Plastic" value="Plastic" />
          <Picker.Item label="Paper" value="Paper" />
          <Picker.Item label="Glass" value="Glass" />
        </Picker>
      </View>

      {/* How Many Items */}
      <Text className="text-primary-500 text-sm font-JakartaBold mb-2">
        How many items?
      </Text>
      <TextInput
        className="border border-primary-300 bg-white rounded-lg px-4 py-2 mb-4"
        placeholder="Enter item count"
        keyboardType="numeric"
        value={itemCount}
        onChangeText={setItemCount}
      />

      {/* Cleaning Type */}
      <Text className="text-primary-500 text-sm font-JakartaBold mb-2">
        What kind of cleaning needed?
      </Text>
      <View className="border border-primary-300 bg-white rounded-lg mb-4">
        <Picker
          selectedValue={cleaningType}
          style={{ height: 50 }}
          onValueChange={(itemValue) => setCleaningType(itemValue)}
        >
          <Picker.Item label="Select cleaning type here" value="" />
          <Picker.Item label="Deep Cleaning" value="Deep Cleaning" />
          <Picker.Item label="Basic Cleaning" value="Basic Cleaning" />
        </Picker>
      </View>

      {/* Photo */}
      <Text className="text-primary-500 text-sm font-JakartaBold mb-2">
        Photo for the item
      </Text>
      <TouchableOpacity
        className="w-32 h-32 bg-secondary-200 rounded-lg justify-center items-center mb-6 border border-gray-400"
        onPress={pickImage}
      >
        {itemPhoto ? (
          <Image
            source={{ uri: itemPhoto }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-primary-500 text-2xl font-bold">+</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
  className="bg-primary-500 py-4 rounded-lg mt-6"
  onPress={() =>
    navigation.navigate("ReDetail", {
      addItemToList: addItemToList, // 传递 addItemToList 方法
    })
  }
>
  <Text className="text-white text-center text-lg font-JakartaBold">
    Add Item
  </Text>
</TouchableOpacity>
      {/* Save Button */}
      <TouchableOpacity
        className="bg-primary-500 py-4 rounded-lg"
        onPress={handleSave}
      >
        <Text className="text-white text-center text-lg font-JakartaBold">
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}
