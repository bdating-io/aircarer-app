import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ItemList() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  // 读取存储的物品列表
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem("items");
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        }
      } catch (error) {
        Alert.alert("错误", "无法加载数据");
        console.error(error);
      }
    };

    fetchItems();
  }, []);

  // 删除物品
  const deleteItem = async (id) => {
    try {
      const filteredItems = items.filter((item) => item.id !== id);
      setItems(filteredItems);
      await AsyncStorage.setItem("items", JSON.stringify(filteredItems));
    } catch (error) {
      Alert.alert("错误", "无法删除数据");
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-4">物品列表</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border p-4 rounded mb-4 flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-bold">{item.type}</Text>
              <Text className="text-gray-500">数量: {item.count}</Text>
              <Text className="text-gray-500">清洁方式: {item.cleaning}</Text>
            </View>
            {item.image && (
              <Image source={{ uri: item.image }} className="w-20 h-20 rounded" />
            )}
            <TouchableOpacity
              className="bg-red-500 p-2 rounded"
              onPress={() => deleteItem(item.id)}
            >
              <Text className="text-white">删除</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 添加新物品按钮 */}
      <TouchableOpacity
        className="bg-green-500 p-4 rounded mt-6"
        onPress={() => router.push("/(pages)/(recycle)/item")}
      >
        <Text className="text-white text-center">添加物品</Text>
      </TouchableOpacity>
    </View>
  );
}
