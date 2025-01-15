import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useLinenContext } from "@/contexts/LinenContext";
import { LinenBag } from "@/types/linen";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const LinenHandoverScreen = () => {
  const { linenBags, updateBagStatus } = useLinenContext();
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [recentlyCollected, setRecentlyCollected] = useState<string[]>([]);

  const pendingBags = linenBags.filter((bag) => bag.status === "pending");
  const collectedBags = linenBags.filter((bag) => bag.status === "collected");

  const onRefresh = async () => {
    setRefreshing(true);
    // Add your refresh logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleCollect = (bagId: string) => {
    Alert.alert(
      "Confirm Collection",
      "Please verify the following before confirming:\n\n• All items are properly counted\n• Bag is securely sealed\n• Location is correctly marked",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm Collection",
          onPress: async () => {
            setProcessingId(bagId);
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
              updateBagStatus(bagId, "collected");
              setRecentlyCollected((prev) => [...prev, bagId]);

              Alert.alert(
                "Collection Successful",
                "The linen bag has been marked as collected",
                [{ text: "OK" }]
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <View
      className={`
      px-3 py-1 rounded-full
      ${status === "pending" ? "bg-amber-100" : "bg-green-100"}
    `}
    >
      <Text
        className={`
        text-sm font-medium
        ${status === "pending" ? "text-amber-800" : "text-green-800"}
      `}
      >
        {status === "pending" ? "Pending Collection" : "Collected"}
      </Text>
    </View>
  );

  const LinenBagCard = ({ item }: { item: LinenBag }) => (
    <View
      className={`
      bg-white p-4 rounded-xl mb-3 shadow-sm
      ${
        recentlyCollected.includes(item.id) ? "border-l-4 border-green-500" : ""
      }
    `}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <MaterialIcons name="inventory-2" size={24} color="#4B5563" />
          <Text className="text-lg font-semibold ml-2">
            {item.roomNumber ? `Room ${item.roomNumber}` : `Bag ${item.id}`}
          </Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      {/* Details */}
      <View className="bg-gray-50 p-3 rounded-lg mb-3 space-y-2">
        <View className="flex-row items-center">
          <MaterialIcons name="location-on" size={18} color="#6B7280" />
          <Text className="text-gray-600 ml-2">{item.location}</Text>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="access-time" size={18} color="#6B7280" />
          <Text className="text-gray-600 ml-2">{item.timestamp}</Text>
        </View>
        {item.notes && (
          <View className="flex-row items-center">
            <MaterialIcons name="note" size={18} color="#6B7280" />
            <Text className="text-gray-600 ml-2">{item.notes}</Text>
          </View>
        )}
      </View>

      {/* Action Button */}
      {item.status === "pending" && (
        <TouchableOpacity
          className={`
            flex-row justify-center items-center p-3 rounded-lg
            ${processingId === item.id ? "bg-blue-400" : "bg-blue-500"}
          `}
          onPress={() => handleCollect(item.id)}
          disabled={processingId === item.id}
        >
          {processingId === item.id ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialIcons
                name="check-circle-outline"
                size={20}
                color="white"
              />
              <Text className="text-white font-semibold ml-2">
                Mark as Collected
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  const CollectionSummary = () => (
    <View className="flex-row justify-around mb-6 mt-2">
      <View className="items-center bg-white p-4 rounded-xl flex-1 mr-2">
        <Text className="text-amber-600 text-lg font-bold">
          {pendingBags.length}
        </Text>
        <Text className="text-gray-600">Pending</Text>
      </View>
      <View className="items-center bg-white p-4 rounded-xl flex-1 ml-2">
        <Text className="text-green-600 text-lg font-bold">
          {collectedBags.length}
        </Text>
        <Text className="text-gray-600">Collected</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-5 pt-6 pb-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">
          Linen Collection
        </Text>
        <Text className="text-gray-500 mt-1">
          Manage and track linen collection status
        </Text>
      </View>

      {pendingBags.length === 0 && collectedBags.length === 0 ? (
        <View className="flex-1 justify-center items-center p-5">
          <MaterialIcons name="inventory" size={60} color="#9CA3AF" />
          <Text className="text-gray-600 mt-4 text-center">
            No linen bags to process
          </Text>
        </View>
      ) : (
        <FlatList
          className="px-5"
          data={[...pendingBags, ...collectedBags]}
          renderItem={({ item }) => <LinenBagCard item={item} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<CollectionSummary />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default LinenHandoverScreen;
