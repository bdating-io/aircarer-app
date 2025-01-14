import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useLinenContext } from "@/contexts/LinenContext";
import { LinenBag } from "@/types/linen";

const LinenHandoverScreen = () => {
  const { linenBags, updateBagStatus } = useLinenContext();
  
  const pendingBags = linenBags.filter(bag => bag.status === "pending");

  const handleCollect = (bagId: string) => {
    updateBagStatus(bagId, "collected");
  };

  const renderLinenBag = ({ item }: { item: LinenBag }) => (
    <View className="bg-white p-4 rounded-lg mb-3 shadow-sm">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">Bag #{item.id}</Text>
        <Text
          className={`px-2 py-1 rounded ${
            item.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      <Text className="text-gray-600 mb-1">Location: {item.location}</Text>
      <Text className="text-gray-600 mb-3">Time: {item.timestamp}</Text>
      
      {item.status === "pending" && (
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg"
          onPress={() => handleCollect(item.id)}
        >
          <Text className="text-white text-center font-semibold">
            Mark as Collected
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-5">
      <Text className="text-2xl font-bold mb-6 text-center">
        Linen Collection Management
      </Text>

      <FlatList
        data={pendingBags}
        renderItem={renderLinenBag}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />
    </View>
  );
};

export default LinenHandoverScreen; 