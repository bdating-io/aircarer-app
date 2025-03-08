import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

export default function Item() {
  const router = useRouter();
  const [itemType, setItemType] = useState("");
  const [itemCount, setItemCount] = useState("");
  const [cleaningType, setCleaningType] = useState("");
  const [imageUri, setImageUri] = useState(null);

  // 选择图片
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  // 保存物品信息到 AsyncStorage
  const saveItem = async () => {
    if (!itemType || !itemCount || !cleaningType) {
      Alert.alert("错误", "请填写所有字段");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      type: itemType,
      count: itemCount,
      cleaning: cleaningType,
      image: imageUri,
    };

    try {
      // 读取已有的列表
      const existingItems = await AsyncStorage.getItem("items");
      const items = existingItems ? JSON.parse(existingItems) : [];

      // 添加新物品
      items.push(newItem);
      await AsyncStorage.setItem("items", JSON.stringify(items));

      // 跳转回列表页面
      router.push("/(pages)/(recycle)/itemlist");
    } catch (error) {
      Alert.alert("错误", "无法保存数据");
      console.error(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-white p-6">
        <Text className="text-2xl font-bold mb-4">添加物品</Text>

        {/* 选择物品类型 */}
        <Text className="mb-2">选择物品类型</Text>
        <Picker selectedValue={itemType} onValueChange={(value) => setItemType(value)}>
          <Picker.Item label="请选择物品" value="" />
          <Picker.Item label="床单" value="sheets" />
          <Picker.Item label="枕套" value="pillowcases" />
        </Picker>

        {/* 输入数量 */}
        <Text className="mb-2 mt-4">物品数量</Text>
        <TextInput
          className="border p-2 rounded"
          keyboardType="numeric"
          value={itemCount}
          onChangeText={setItemCount}
          placeholder="请输入数量"
        />

        {/* 选择清洁类型 */}
        <Text className="mb-2 mt-4">选择清洁方式</Text>
        <Picker selectedValue={cleaningType} onValueChange={(value) => setCleaningType(value)}>
          <Picker.Item label="请选择清洁类型" value="" />
          <Picker.Item label="干洗" value="dry" />
          <Picker.Item label="水洗" value="water" />
        </Picker>

        {/* 上传图片 */}
        <Text className="mb-2 mt-4">上传照片</Text>
        <TouchableOpacity className="border p-4 rounded items-center" onPress={pickImage}>
          {imageUri ? <Image source={{ uri: imageUri }} className="w-20 h-20" /> : <Text>点击选择图片</Text>}
        </TouchableOpacity>

        {/* 保存按钮 */}
        <TouchableOpacity className="bg-blue-500 p-4 rounded mt-6" onPress={saveItem}>
          <Text className="text-white text-center">保存</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
