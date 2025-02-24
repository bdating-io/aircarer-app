import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { format } from "date-fns";
import { AntDesign } from "@expo/vector-icons";

type Task = {
  task_id: number;
  task_type: string;
  estimated_price: number;
  scheduled_start_time: string;
  address: string;
};

export default function Opportunity() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_confirmed", false) // 获取未确认的任务
        .neq("status", "Cancelled")
        .order("scheduled_start_time", { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      className="bg-white p-4 mb-4 rounded-lg shadow"
      onPress={() => router.push(`/(pages)/(tasks)/task?id=${item.task_id}`)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">{item.task_type}</Text>
        <Text className="text-[#4A90E2]">${item.estimated_price}</Text>
      </View>

      <View className="flex-row items-center mb-2">
        <AntDesign name="calendar" size={16} color="gray" />
        <Text className="text-gray-600 ml-2">
          {format(new Date(item.scheduled_start_time), "MMM dd, yyyy HH:mm")}
        </Text>
      </View>

      <View className="flex-row items-center">
        <AntDesign name="enviromento" size={16} color="gray" />
        <Text className="text-gray-600 ml-2" numberOfLines={1}>
          {item.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-[#4A90E2] p-4">
        <Text className="text-white text-lg font-semibold">Opportunities</Text>
      </View>

      <FlatList
        className="p-4"
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.task_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500">No opportunities available</Text>
          </View>
        }
      />
    </View>
  );
}
