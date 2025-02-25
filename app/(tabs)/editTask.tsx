import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase"; // 根据你实际路径
import { AntDesign } from "@expo/vector-icons";

// 定义 TaskType / Status 枚举，用作下拉选或单选
const TASK_TYPES = [
  "Quick Cleaning",
  "Regular Cleaning",
  "Deep Cleaning",
] as const;
const TASK_STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

// 根据数据库表结构定义任务接口
interface Task {
  task_id: number;
  customer_id: string;
  task_type: string;
  estimated_price: number;
  confirmed_price: number | null;
  status: string;
  payment_status: string;
  date_updated: string;
  approval_status: string;
  scheduled_start_time: string;
  actual_start_time: string | null;
  completion_time: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  is_confirmed: boolean;
  cleaner_id: string | null;
  check_in_time: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  cleaning_type: string;
  bring_equipment: string;
  property_id: number | null;
  estimated_hours: number;
  schedule_mode: string;
  scheduled_start_date: string;
}

export default function EditTask() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          // 直接使用用户ID作为customer_id来过滤任务
          fetchTasksByUserId(user.id);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const fetchTasksByUserId = async (uid: string) => {
    try {
      setLoading(true);
      console.log("Fetching tasks for user ID:", uid);

      // 直接使用用户ID作为customer_id来查询任务
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("customer_id", uid)
        .order("scheduled_start_time", { ascending: true });

      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} tasks`);
      setTasks(data || []);
    } catch (error) {
      console.error("Error in fetchTasks:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (userId) {
      fetchTasksByUserId(userId);
    } else {
      setRefreshing(false);
    }
  };

  // Handle editing a task
  const handleEditTask = (task: Task) => {
    router.push({
      pathname: "/(pages)/(tasks)/editTaskDetail",
      params: {
        taskId: task.task_id.toString(),
        taskData: JSON.stringify(task),
      },
    });
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => handleEditTask(item)}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskType}>{item.task_type}</Text>
        <Text style={styles.price}>${item.estimated_price}</Text>
      </View>

      <View style={styles.taskInfo}>
        <AntDesign name="calendar" size={16} color="gray" />
        <Text style={styles.infoText}>
          {new Date(item.scheduled_start_time).toLocaleDateString()}
          {item.scheduled_start_time
            ? ` ${new Date(item.scheduled_start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : ""}
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
        <Text
          style={[styles.statusText, { color: getStatusColor(item.status) }]}
        >
          Status: {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#FFC107";
      case "In Progress":
        return "#2196F3";
      case "Completed":
        return "#4CAF50";
      case "Cancelled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

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
        <Text style={styles.headerText}>My Tasks</Text>
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
    fontWeight: "500",
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
