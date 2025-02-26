import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { supabase } from "../../../lib/supabase";
import { format, differenceInHours } from "date-fns";

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
  address: string;
  latitude: number;
  longitude: number;
  is_confirmed: boolean;
  cleaner_id: string | null;
  customer_id: string;
  check_in_time: string | null;
};

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const MELBOURNE_BOUNDS = {
  latitude: {
    min: -37.8869,
    max: -37.7869,
  },
  longitude: {
    min: 144.9,
    max: 145.0,
  },
};

const getRandomLocation = () => ({
  latitude:
    MELBOURNE_BOUNDS.latitude.min +
    Math.random() *
      (MELBOURNE_BOUNDS.latitude.max - MELBOURNE_BOUNDS.latitude.min),
  longitude:
    MELBOURNE_BOUNDS.longitude.min +
    Math.random() *
      (MELBOURNE_BOUNDS.longitude.max - MELBOURNE_BOUNDS.longitude.min),
});

export default function Task() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [hasArrived, setHasArrived] = useState(false);
  const randomLocation = getRandomLocation();
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [distanceToTask, setDistanceToTask] = useState<number | null>(null);
  const [canConfirm, setCanConfirm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hasBeforePhotos, setHasBeforePhotos] = useState(false);

  // 获取任务数据
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("task_id", id)
          .single();

        if (error) throw error;
        setTask(data);

        // 检查是否已签到
        if (data.check_in_time) {
          setHasCheckedIn(true);
        }

        // 检查任务状态
        updateTaskStatus(data);
      } catch (error) {
        console.error("Error fetching task:", error);
        Alert.alert("Error", "Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // 获取当前用户ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    getCurrentUser();
  }, []);

  // 更新任务状态
  const updateTaskStatus = (taskData: Task) => {
    if (!taskData) return;

    const taskTime = new Date(taskData.scheduled_start_time);
    const now = new Date();
    const hoursUntilTask = differenceInHours(taskTime, now);

    // 设置是否可以确认任务
    setCanConfirm(
      !taskData.is_confirmed && hoursUntilTask <= 24 && hoursUntilTask >= 4
    );

    // 设置是否可以签到
    setCanCheckIn(
      taskData.is_confirmed && hoursUntilTask < 4 && hoursUntilTask >= 0
    );
  };

  // 确认任务
  const handleConfirmTask = async () => {
    if (!task) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ is_confirmed: true })
        .eq("task_id", task.task_id);

      if (error) throw error;

      Alert.alert("Success", "Task confirmed successfully!");

      // 刷新任务数据
      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("task_id", id)
        .single();

      if (fetchError) throw fetchError;
      setTask(data);
      updateTaskStatus(data);
    } catch (error) {
      console.error("Error confirming task:", error);
      Alert.alert("Error", "Failed to confirm task");
    }
  };

  // 签到
  const handleCheckIn = async () => {
    if (!task) return;

    try {
      // 请求位置权限
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required for check-in"
        );
        return;
      }

      // 获取当前位置
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 计算与任务地点的距离
      const distance = calculateDistance(
        latitude,
        longitude,
        task.latitude,
        task.longitude
      );

      setDistanceToTask(distance);

      // 检查距离是否在10公里以内
      if (distance > 10) {
        Alert.alert(
          "Location Check Failed",
          `You are too far from the task location (${distance.toFixed(
            2
          )} km). Please check in when you are within 10km of the location.`
        );
        return;
      }

      // 更新任务状态
      const now = new Date();
      const { error } = await supabase
        .from("tasks")
        .update({
          check_in_time: now.toISOString(),
          status: "In Progress",
        })
        .eq("task_id", task.task_id);

      if (error) throw error;

      setHasCheckedIn(true);
      Alert.alert("Success", "Check-in successful!");

      // 刷新任务数据
      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("task_id", id)
        .single();

      if (fetchError) throw fetchError;
      setTask(data);
    } catch (error) {
      console.error("Error during check-in:", error);
      Alert.alert("Error", "Failed to check in");
    }
  };

  // 计算两点之间的距离（公里）
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // 地球半径（公里）
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 打开导航
  const handleNavigate = () => {
    if (!task) return;

    const latLng = `${task.latitude},${task.longitude}`;
    const url = Platform.select({
      ios: `maps://app?daddr=${latLng}`,
      android: `google.navigation:q=${latLng}`,
    });

    Linking.canOpenURL(url as string).then((supported) => {
      if (supported) {
        Linking.openURL(url as string);
      } else {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}`;
        Linking.openURL(googleMapsUrl);
      }
    });
  };

  // 取消任务
  const handleCancelTask = async () => {
    if (!task) return;

    Alert.alert("Cancel Task", "Are you sure you want to cancel this task?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase
              .from("tasks")
              .update({
                cleaner_id: null,
                status: "Pending",
                is_confirmed: false,
                check_in_time: null,
              })
              .eq("task_id", task.task_id);

            if (error) throw error;

            Alert.alert("Success", "Task cancelled successfully");
            router.back();
          } catch (error) {
            console.error("Error cancelling task:", error);
            Alert.alert("Error", "Failed to cancel task");
          }
        },
      },
    ]);
  };

  // 添加 handleAcceptTask 函数
  const handleAcceptTask = async (taskId: number) => {
    if (!currentUserId) return;
    // ... 接受任务的逻辑
  };

  // 处理确认到达按钮点击
  const handleConfirmArrived = async () => {
    if (!task) return;

    try {
      // 获取当前位置
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to confirm arrival"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 计算与任务地点的距离
      const distance = calculateDistance(
        latitude,
        longitude,
        task.latitude,
        task.longitude
      );

      // 检查距离是否在10公里以内
      if (distance > 10) {
        Alert.alert(
          "Location Check Failed",
          `You are too far from the task location (${distance.toFixed(
            2
          )} km). Please confirm arrival when you are within 10km of the location.`
        );
        return;
      }

      // 更新任务状态
      const now = new Date();
      const { error } = await supabase
        .from("tasks")
        .update({
          actual_start_time: now.toISOString(),
          status: "In Progress",
        })
        .eq("task_id", task.task_id);

      if (error) throw error;

      setHasArrived(true);
      Alert.alert("Success", "Arrival confirmed successfully!");

      // 导航到 beforeClean 页面
      router.push("/beforeClean");
    } catch (error) {
      console.error("Error confirming arrival:", error);
      Alert.alert("Error", "Failed to confirm arrival");
    }
  };

  // 渲染按钮部分
  const renderButtons = () => {
    if (!task) return null;

    // 如果任务没有被接受（没有 cleaner_id），只显示 Accept 和 Decline 按钮
    if (!task.cleaner_id) {
      return (
        <View className="flex-row space-x-4">
          <TouchableOpacity
            className="flex-1 bg-gray-500 py-4 rounded-lg items-center"
            onPress={() => router.back()}
          >
            <Text className="text-white font-bold">Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-blue-500 py-4 rounded-lg items-center"
            onPress={() => handleAcceptTask(task.task_id)}
          >
            <Text className="text-white font-bold">Accept</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // 如果任务已被当前用户接受，显示其他按钮
    if (task.cleaner_id === currentUserId) {
      return (
        <View>
          {/* Confirm Task Button - 只在任务已接受且未确认时显示 */}
          {!task.is_confirmed && (
            <TouchableOpacity
              className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
              onPress={handleConfirmTask}
            >
              <Text className="text-white font-bold">Confirm Task</Text>
            </TouchableOpacity>
          )}

          {/* Navigate to Location Button - 始终显示 */}
          <TouchableOpacity
            className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
            onPress={handleNavigate}
          >
            <Text className="text-white font-bold">Navigate to Location</Text>
          </TouchableOpacity>

          {/* Check-in Button */}
          {canCheckIn && !hasCheckedIn && (
            <TouchableOpacity
              className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
              onPress={handleCheckIn}
            >
              <Text className="text-white font-bold">Check In</Text>
            </TouchableOpacity>
          )}

          {/* Confirm Arrived Button */}
          {task.is_confirmed && !hasArrived && (
            <TouchableOpacity
              className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
              onPress={handleConfirmArrived}
            >
              <Text className="text-white font-bold">
                Confirm Arrived & Take Photos
              </Text>
            </TouchableOpacity>
          )}

          {/* Check-in Status */}
          {hasCheckedIn && (
            <View className="bg-green-100 py-4 px-4 rounded-lg mb-4">
              <Text className="text-green-800 font-semibold text-center">
                You have checked in for this task
              </Text>
              {distanceToTask !== null && (
                <Text className="text-green-700 text-center mt-1">
                  Distance to location: {distanceToTask.toFixed(1)} km
                </Text>
              )}
            </View>
          )}

          {/* Take Before Photos Button - 当已确认到达但尚未上传照片时显示 */}
          {hasArrived && !hasBeforePhotos && (
            <TouchableOpacity
              className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
              onPress={() => router.push("/beforeClean")}
            >
              <Text className="text-white font-bold">Take Before Photos</Text>
            </TouchableOpacity>
          )}

          {/* Go to Cleaning Guide Button - 只有在上传了"清洁前"照片后才显示 */}
          {hasArrived && hasBeforePhotos && (
            <TouchableOpacity
              className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
              onPress={() => router.push("/taskDetail")}
            >
              <Text className="text-white font-bold">View Cleaning Guide</Text>
            </TouchableOpacity>
          )}

          {/* Bottom Buttons */}
          <TouchableOpacity
            className="bg-red-500 py-4 px-4 rounded-lg items-center mt-4"
            onPress={handleCancelTask}
          >
            <Text className="text-white font-bold">Cancel Task</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // 如果任务被其他清洁工接受，不显示任何操作按钮
    return null;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Task not found</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-4 py-2 rounded"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const date = new Date(task.scheduled_start_time);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-500 p-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4">
            Task Details
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Map */}
        <View className="h-48">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: task.latitude,
              longitude: task.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: task.latitude,
                longitude: task.longitude,
              }}
              title={task.address}
            />
          </MapView>
        </View>

        {/* Task Info */}
        <View className="p-4">
          <Text className="text-xl font-bold">{task.task_type}</Text>
          <Text className="text-gray-600 mt-2">{task.address}</Text>
          <Text className="text-gray-600 mt-1">
            {format(new Date(task.scheduled_start_time), "PPP p")}
          </Text>
          <View className="flex-row justify-between mt-4">
            <View>
              <Text className="text-gray-500">Status</Text>
              <Text className="font-semibold">{task.status}</Text>
            </View>
            <View>
              <Text className="text-gray-500">Price</Text>
              <Text className="font-semibold">${task.estimated_price}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="p-4">{renderButtons()}</View>
      </ScrollView>
    </View>
  );
}
