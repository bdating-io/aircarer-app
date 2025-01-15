import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLinenContext } from "@/contexts/LinenContext";
import { LinenBag } from "@/types/linen";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const LinenProcessingScreen = () => {
  const { linenBags, updateBagStatus } = useLinenContext();
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const statusFlow: Partial<
    Record<LinenBag["status"], { next: LinenBag["status"]; color: string }>
  > = {
    collected: { next: "cleaning", color: "blue" },
    cleaning: { next: "sorted", color: "amber" },
    sorted: { next: "returned", color: "green" },
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Add refresh logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleStatusUpdate = (
    bagId: string,
    currentStatus: LinenBag["status"]
  ) => {
    const nextStatus = statusFlow[currentStatus]?.next as
      | LinenBag["status"]
      | undefined;
    if (!nextStatus) return;

    Alert.alert(
      "Update Status",
      `Are you sure you want to mark this as ${nextStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setProcessingId(bagId);
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              updateBagStatus(bagId, nextStatus);
              Alert.alert("Success", `Status updated to ${nextStatus}`);
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const ProcessingStages = () => (
    <View className="flex-row justify-between mb-6 bg-white rounded-xl p-4">
      {Object.entries(statusFlow).map(([status, { color }], index) => (
        <View key={status} className="items-center flex-1">
          <View
            className={`w-8 h-8 rounded-full bg-${color}-100 items-center justify-center mb-1`}
          >
            <Text className={`text-${color}-800 font-bold`}>{index + 1}</Text>
          </View>
          <Text className="text-xs text-gray-600 capitalize">{status}</Text>
          <Text className="text-sm font-bold mt-1">
            {linenBags.filter((bag) => bag.status === status).length}
          </Text>
        </View>
      ))}
    </View>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const colorMap = {
      collected: "blue",
      cleaning: "amber",
      sorted: "green",
      returned: "gray",
    };
    const color = colorMap[status as keyof typeof colorMap] || "gray";

    return (
      <View className={`px-3 py-1 rounded-full bg-${color}-100`}>
        <Text className={`text-sm font-medium text-${color}-800 capitalize`}>
          {status}
        </Text>
      </View>
    );
  };

  const LinenBagCard = ({ item }: { item: LinenBag }) => (
    <View className="bg-white p-4 rounded-xl mb-3 shadow-sm">
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
      <View className="bg-gray-50 p-3 rounded-lg mb-3">
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="location-on" size={18} color="#6B7280" />
          <Text className="text-gray-600 ml-2">{item.location}</Text>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="schedule" size={18} color="#6B7280" />
          <Text className="text-gray-600 ml-2">
            Last Updated: {item.timestamp}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      {statusFlow[item.status as keyof typeof statusFlow] && (
        <TouchableOpacity
          className={`
            flex-row justify-center items-center p-3 rounded-lg
            ${processingId === item.id ? "bg-blue-400" : "bg-blue-500"}
          `}
          onPress={() => handleStatusUpdate(item.id, item.status)}
          disabled={processingId === item.id}
        >
          {processingId === item.id ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons
                name="arrow-forward-circle-outline"
                size={20}
                color="white"
              />
              <Text className="text-white font-semibold ml-2">
                Move to{" "}
                {statusFlow[item.status]?.next || "next stage"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-5 pt-6 pb-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">
          Linen Processing
        </Text>
        <Text className="text-gray-500 mt-1">
          Track and manage linen processing stages
        </Text>
      </View>

      <FlatList
        className="px-5"
        ListHeaderComponent={<ProcessingStages />}
        data={linenBags.filter((bag) => bag.status !== "pending")}
        renderItem={({ item }) => <LinenBagCard item={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-5">
            <MaterialIcons name="inventory" size={60} color="#9CA3AF" />
            <Text className="text-gray-600 mt-4 text-center">
              No items in processing
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default LinenProcessingScreen;
