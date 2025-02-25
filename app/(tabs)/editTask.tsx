import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase"; // 根据你实际路径

// 定义 TaskType / Status 枚举，用作下拉选或单选
const TASK_TYPES = ["Quick Cleaning", "Regular Cleaning", "Deep Cleaning"] as const;
const TASK_STATUSES = ["Pending", "In Progress", "Completed", "Cancelled"] as const;

export default function EditTask() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams() as { taskId?: string };

  // 表单字段
  const [taskType, setTaskType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [scheduledStartTime, setScheduledStartTime] = useState<string>("");

  const [loading, setLoading] = useState(true);

  // 初次加载时获取数据
  useEffect(() => {
    if (!taskId) {
      Alert.alert("Error", "No taskId provided in route params.");
      return;
    }
    fetchTask(taskId);
  }, [taskId]);

  // 从 tasks 表获取当前记录
  const fetchTask = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("task_type, status, scheduled_start_time")
        .eq("task_id", id)
        .single();
      if (error) throw error;
      if (data) {
        setTaskType(data.task_type);
        setStatus(data.status);
        setScheduledStartTime(data.scheduled_start_time || "");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 提交更新
  const handleSave = async () => {
    if (!taskId) {
      Alert.alert("Error", "No taskId provided.");
      return;
    }

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          task_type: taskType,
          status: status,
          scheduled_start_time: scheduledStartTime,
        })
        .eq("task_id", taskId);

      if (error) throw error;

      Alert.alert("Success", "Task updated successfully!");
      router.push("../(tabs)/tasklist"); // 或回到TaskList，或别的路由
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading task info...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task #{taskId}</Text>

      {/* 1) Task Type */}
      <Text style={styles.label}>Task Type</Text>
      <View style={styles.row}>
        {TASK_TYPES.map((typeOption) => (
          <TouchableOpacity
            key={typeOption}
            style={[
              styles.buttonChoice,
              { backgroundColor: taskType === typeOption ? "#4E89CE" : "#ccc" },
            ]}
            onPress={() => setTaskType(typeOption)}
          >
            <Text style={{ color: "#fff" }}>{typeOption}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 2) Status */}
      <Text style={styles.label}>Status</Text>
      <View style={styles.row}>
        {TASK_STATUSES.map((statusOption) => (
          <TouchableOpacity
            key={statusOption}
            style={[
              styles.buttonChoice,
              { backgroundColor: status === statusOption ? "#4E89CE" : "#ccc" },
            ]}
            onPress={() => setStatus(statusOption)}
          >
            <Text style={{ color: "#fff" }}>{statusOption}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3) Scheduled Start Time */}
      <Text style={styles.label}>Scheduled Start Time (ISO / YYYY-MM-DD HH:mm)</Text>
      <TextInput
        style={styles.input}
        value={scheduledStartTime}
        onChangeText={setScheduledStartTime}
        placeholder="2025-03-01T09:00:00"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
    marginTop: 8,
  },
  buttonChoice: {
    padding: 10,
    marginRight: 8,
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#4E89CE",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
