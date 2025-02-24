import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { format } from "date-fns";
import { AntDesign } from "@expo/vector-icons";

// 定义任务类型
type Task = {
  task_id: number;
  customer_id: string;
  task_type: string;
  estimated_price: number;
  confirmed_price: number | null;
  status: string;
  payment_status: string;
  scheduled_start_time: string;
  actual_start_time: string | null;
  completion_time: string | null;
  address: string;
  latitude: number;
  longitude: number;
  is_confirmed: boolean;
  cleaner_id: string | null;
  approval_status: string;
};

export default function Opportunity() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      console.log("Fetching tasks...");
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("scheduled_start_time", { ascending: true });

      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }

      console.log("Fetched tasks:", data);
      setTasks(data || []);
    } catch (error) {
      console.error("Error in fetchTasks:", error);
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
      style={styles.taskCard}
      onPress={() => router.push(`/(pages)/(tasks)/task?id=${item.task_id}`)}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskType}>{item.task_type}</Text>
        <Text style={styles.price}>${item.estimated_price}</Text>
      </View>

      <View style={styles.taskInfo}>
        <AntDesign name="calendar" size={16} color="gray" />
        <Text style={styles.infoText}>
          {format(new Date(item.scheduled_start_time), "MMM dd, yyyy HH:mm")}
        </Text>
      </View>

      <View style={styles.taskInfo}>
        <AntDesign name="enviromento" size={16} color="gray" />
        <Text style={styles.infoText} numberOfLines={1}>
          {item.address}
        </Text>
      </View>

      <View style={styles.taskInfo}>
        <AntDesign name="tag" size={16} color="gray" />
        <Text style={styles.statusText}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Available Tasks</Text>
      </View>

      <FlatList
        style={styles.list}
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.task_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: 16,
    paddingTop: 60,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  list: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  taskType: {
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    color: "#4A90E2",
    fontWeight: "600",
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: "#666",
    flex: 1,
  },
  statusText: {
    marginLeft: 8,
    color: "#666",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});
