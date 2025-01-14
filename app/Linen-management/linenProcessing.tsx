import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useLinenContext } from "@/contexts/LinenContext";
import { LinenBag } from "@/types/linen";

const LinenProcessingScreen = () => {
  const { linenBags, updateBagStatus } = useLinenContext();
  
  const processingBags = linenBags.filter(
    bag => ["collected", "cleaning", "sorted"].includes(bag.status)
  );

  const getNextStatus = (currentStatus: LinenBag["status"]) => {
    const flow: Record<LinenBag["status"], LinenBag["status"] | null> = {
      pending: "collected",
      collected: "cleaning",
      cleaning: "sorted",
      sorted: "returned",
      returned: null,
    };
    return flow[currentStatus];
  };

  const renderProcessingBag = ({ item }: { item: LinenBag }) => {
    const nextStatus = getNextStatus(item.status);

    return (
      <View className="bg-white p-4 rounded-lg mb-3 shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold">
            {item.roomNumber ? `Room #${item.roomNumber}` : `Bag #${item.id}`}
          </Text>
          <Text
            className={`px-2 py-1 rounded ${
              item.status === "returned"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
        <Text className="text-gray-600 mb-1">Location: {item.location}</Text>
        {item.collectedAt && (
          <Text className="text-gray-600 mb-3">
            Collected: {item.collectedAt}
          </Text>
        )}

        {nextStatus && (
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-lg"
            onPress={() => updateBagStatus(item.id, nextStatus)}
          >
            <Text className="text-white text-center font-semibold">
              Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 p-5">
      <Text className="text-2xl font-bold mb-6 text-center">
        Linen Processing Management
      </Text>

      <FlatList
        data={processingBags}
        renderItem={renderProcessingBag}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />
    </View>
  );
};

export default LinenProcessingScreen; 