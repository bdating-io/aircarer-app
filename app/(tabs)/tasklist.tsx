import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { format } from "date-fns";
import { AntDesign } from "@expo/vector-icons";

// 定义任务类型
type Task = {
  task_id: number;
  task_type: "Quick Cleaning" | "Regular Cleaning" | "Deep Cleaning";
  estimated_price: number;
  confirmed_price: number | null;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  payment_status: "Not Paid" | "Paid";
  scheduled_start_time: string;
  actual_start_time: string | null;
  completion_time: string | null;
  approval_status: "Pending" | "Approved" | "Rejected";
};

export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 获取任务列表
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_confirmed", true)
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

  // 获取任务状态的颜色
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "In Progress":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // 获取任务类型的图标
  const getTaskTypeIcon = (type: Task["task_type"]) => {
    switch (type) {
      case "Quick Cleaning":
        return "clockcircle";
      case "Regular Cleaning":
        return "home";
      case "Deep Cleaning":
        return "tool";
      default:
        return "question";
    }
  };

  // 渲染单个任务项
  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      className="bg-white p-4 mb-2 rounded-lg shadow-sm"
      onPress={() =>
        router.push({
          pathname: "/(pages)/(tasks)/task",
          params: { id: item.task_id },
        })
      }
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <View className="flex-row items-center">
            <AntDesign
              name={getTaskTypeIcon(item.task_type)}
              size={20}
              color="#4A90E2"
              style={{ marginRight: 8 }}
            />
            <Text className="text-lg font-semibold">{item.task_type}</Text>
          </View>
          <Text className="text-gray-600 mt-1">
            {format(new Date(item.scheduled_start_time), "MMM dd, yyyy HH:mm")}
          </Text>
          {item.approval_status !== "Approved" && (
            <Text className="text-orange-500 text-sm mt-1">
              Pending Approval
            </Text>
          )}
        </View>
        <View className="items-end">
          <Text className="text-lg font-semibold">
            ${item.confirmed_price || item.estimated_price}
          </Text>
          <View
            className={`px-2 py-1 rounded-full mt-1 ${getStatusColor(
              item.status
            )}`}
          >
            <Text className="text-white text-sm">{item.status}</Text>
          </View>
          {item.payment_status === "Paid" && (
            <Text className="text-green-500 text-sm mt-1">Paid</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-xl font-bold">My Tasks</Text>
        <Text className="text-gray-500 mt-1">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"} found
        </Text>
      </View>

      <FlatList
        className="p-4"
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.task_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchTasks} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500">No tasks found</Text>
          </View>
        }
      />
    </View>
  );
}
