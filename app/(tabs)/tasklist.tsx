import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { format } from "date-fns";
import { AntDesign } from "@expo/vector-icons";

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
      // 获取当前用户ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "No user logged in.");
        setLoading(false);
        return;
      }

      // 获取属于当前顾客(customer_id = user.id)的全部任务
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("customer_id", user.id)
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

  // 用于刷新
  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  // 删除任务
  const handleDeleteTask = async (taskId: number) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("tasks")
                .delete()
                .eq("task_id", taskId);

              if (error) throw error;
              Alert.alert("Success", "Task deleted!");
              fetchTasks();
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  // 编辑任务
  const handleEditTask = (taskId: number) => {
    // 跳转到编辑页面
    router.push(`/editTask?taskId=${taskId}`);
  };

  // 获取任务状态的颜色 (Tailwind classes or inline)
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
    <View className="bg-white p-4 mb-2 rounded-lg shadow-sm">
      {/* 整个区域可点击跳转详情 
        如果你不想这个功能，可以去掉 onPress & Wrap */}
      <TouchableOpacity
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

      {/* Edit / Delete row */}
      <View className="flex-row justify-end mt-2">
        <TouchableOpacity
          className="mr-3 px-3 py-2 bg-yellow-400 rounded-md"
          onPress={() => handleEditTask(item.task_id)}
        >
          <Text className="text-black font-semibold">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-3 py-2 bg-red-500 rounded-md"
          onPress={() => handleDeleteTask(item.task_id)}
        >
          <Text className="text-white font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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

