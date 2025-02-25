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
import { format, differenceInHours, addHours } from "date-fns";

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
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // 处理确认按钮
  const handleAccept = async () => {
    if (!task) return;

    try {
      // 获取当前用户ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user:", userError);
        return;
      }

      // 更新任务状态
      const { error } = await supabase
        .from("tasks")
        .update({
          is_confirmed: true,
          status: "In Progress", // 更改状态为进行中
          cleaner_id: user.id,
          date_updated: new Date().toISOString(),
        })
        .eq("task_id", task.task_id);

      if (error) {
        console.error("Error accepting task:", error);
        Alert.alert("Error", "Failed to accept task. Please try again.");
        return;
      }

      // 成功接受任务后显示提示
      Alert.alert(
        "Success",
        "Task accepted successfully! You will receive reminders before the task.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error accepting task:", error);
      Alert.alert("Error", "Failed to accept task. Please try again.");
    }
  };

  // 处理取消按钮
  const handleCancel = async () => {
    if (!task) return;

    try {
      // 更新任务状态为 Cancelled
      const { error } = await supabase
        .from("tasks")
        .update({
          status: "Cancelled",
          date_updated: new Date().toISOString(),
        })
        .eq("task_id", task.task_id);

      if (error) {
        console.error("Error cancelling task:", error);
        return;
      }

      // 关闭取消确认弹窗
      setShowCancelModal(false);

      // 返回到任务列表页面
      router.back();
    } catch (error) {
      console.error("Error cancelling task:", error);
    }
  };

  // 处理开始按钮
  const handleStart = () => {
    if (!task) return;

    const address = encodeURIComponent(task.address);
    const latLng = `${task.latitude},${task.longitude}`;

    // 根据平台选择不同的导航 URL
    const url = Platform.select({
      ios: `maps://app?daddr=${address}&ll=${latLng}`,
      android: `google.navigation:q=${latLng}&mode=d`, // mode=d 表示驾驶模式
    });

    // 尝试打开导航
    Linking.canOpenURL(url as string).then((supported) => {
      if (supported) {
        Linking.openURL(url as string);
      } else {
        // 如果无法打开默认导航，尝试打开 Google Maps
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}&travelmode=driving`;
        Linking.openURL(googleMapsUrl).catch((err) => {
          console.error("Error opening navigation:", err);
          Alert.alert("Navigation Error", "Could not open navigation app");
        });
      }
    });
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

  // 检查是否可以签到
  const checkIfCanCheckIn = async () => {
    if (!task) return;

    const taskTime = new Date(task.scheduled_start_time);
    const now = new Date();
    const hoursUntilTask = differenceInHours(taskTime, now);

    // 只有在任务开始前4小时内才能签到
    if (hoursUntilTask <= 4 && hoursUntilTask > 0) {
      setCanCheckIn(true);
    }
  };

  // 处理签到
  const handleCheckIn = async () => {
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

      if (!task) return;

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
          "You are too far from the task location. Please check in when you are closer."
        );
        return;
      }

      // 更新任务状态
      const { error } = await supabase
        .from("tasks")
        .update({
          check_in_time: new Date().toISOString(),
          check_in_latitude: latitude,
          check_in_longitude: longitude,
        })
        .eq("task_id", task.task_id);

      if (error) throw error;

      setHasCheckedIn(true);
      Alert.alert("Success", "Check-in successful!");

      // 发送通知给客户
      // TODO: 实现通知功能
    } catch (error) {
      console.error("Error during check-in:", error);
      Alert.alert("Error", "Failed to check in. Please try again.");
    }
  };

  // 设置提醒
  useEffect(() => {
    if (!task) return;

    const taskTime = new Date(task.scheduled_start_time);
    const now = new Date();

    // 24小时提醒
    const reminder24h = setTimeout(() => {
      Alert.alert(
        "Task Reminder",
        "Please check your cleaning tools and supplies for tomorrow's task."
      );
    }, Math.max(0, taskTime.getTime() - now.getTime() - 24 * 60 * 60 * 1000));

    // 4小时提醒（签到开启）
    const reminder4h = setTimeout(() => {
      setCanCheckIn(true);
      Alert.alert(
        "Check-in Available",
        "You can now check in for your upcoming task."
      );
    }, Math.max(0, taskTime.getTime() - now.getTime() - 4 * 60 * 60 * 1000));

    // 2小时提醒
    const reminder2h = setTimeout(() => {
      Alert.alert(
        "Task Approaching",
        "Your task will start in 2 hours. Please ensure you're prepared."
      );
    }, Math.max(0, taskTime.getTime() - now.getTime() - 2 * 60 * 60 * 1000));

    return () => {
      clearTimeout(reminder24h);
      clearTimeout(reminder4h);
      clearTimeout(reminder2h);
    };
  }, [task]);

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
      </View>
    );
  }

  const date = new Date(task.scheduled_start_time);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });

  const renderButtons = () => {
    if (!task.is_confirmed) {
      return (
        <View className="flex-row space-x-4">
          <TouchableOpacity
            className="flex-1 bg-gray-500 py-3 rounded items-center"
            onPress={() => router.back()}
          >
            <Text className="text-white font-medium">Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-[#4A90E2] py-3 rounded items-center"
            onPress={handleAccept}
          >
            <Text className="text-white font-medium">Accept</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex-row space-x-4">
        <TouchableOpacity
          className="flex-1 bg-red-500 py-3 rounded items-center"
          onPress={() => setShowCancelModal(true)}
        >
          <Text className="text-white font-medium">Cancel</Text>
        </TouchableOpacity>
        {task.status === "Pending" && (
          <TouchableOpacity
            className="flex-1 bg-[#4A90E2] py-3 rounded items-center"
            onPress={() => setShowConfirmModal(true)}
          >
            <Text className="text-white font-medium">Start</Text>
          </TouchableOpacity>
        )}
        {task.status === "In Progress" && (
          <TouchableOpacity
            className="flex-1 bg-[#4A90E2] py-3 rounded items-center"
            onPress={handleStart}
          >
            <Text className="text-white font-medium">Navigate</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // 渲染签到按钮
  const renderCheckInButton = () => {
    if (!canCheckIn) return null;
    if (hasCheckedIn) {
      return (
        <View className="bg-green-100 p-4 rounded-lg mb-4">
          <Text className="text-green-700">Checked in successfully</Text>
          {distanceToTask && (
            <Text className="text-green-700">
              Distance to task: {distanceToTask.toFixed(2)} km
            </Text>
          )}
        </View>
      );
    }
    return (
      <TouchableOpacity
        className="bg-[#4A90E2] p-4 rounded-lg mb-4"
        onPress={handleCheckIn}
      >
        <Text className="text-white text-center font-semibold">Check In</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#4A90E2] p-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg ml-4">Task Detail</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Map */}
        <View className="h-[200px]">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: task.latitude,
              longitude: task.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
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
          <Text className="text-lg font-bold">{task.task_type}</Text>
          <View className="flex-row items-center mt-2">
            <AntDesign name="calendar" size={16} color="gray" />
            <Text className="text-gray-600 ml-2">
              {format(
                new Date(task.scheduled_start_time),
                "MMM dd, yyyy HH:mm"
              )}
            </Text>
          </View>
          <View className="flex-row items-center mt-2">
            <AntDesign name="enviromento" size={16} color="gray" />
            <Text className="text-gray-600 ml-2">{task.address}</Text>
          </View>
        </View>

        {/* Status and Price */}
        <View className="p-4 flex-row justify-between items-center bg-gray-50">
          <View>
            <Text className="text-gray-500">Status</Text>
            <Text className="text-lg font-semibold mt-1">{task.status}</Text>
          </View>
          <View>
            <Text className="text-gray-500">Price</Text>
            <Text className="text-lg font-semibold mt-1">
              ${task.confirmed_price || task.estimated_price}
            </Text>
          </View>
        </View>

        {/* Bottom Buttons */}
        <View className="p-4 mt-auto">{renderButtons()}</View>

        {/* Check-in Button */}
        {renderCheckInButton()}
      </ScrollView>

      {/* Modals */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-4 rounded-lg w-[90%]">
            <Text className="text-lg">Confirm Task</Text>
            <Text className="text-gray-600 my-4">
              Are you sure you want to confirm this task?
            </Text>
            <View className="flex-row justify-end space-x-6">
              <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                <Text className="text-red-500">No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/(pages)/(photo)/task")}>
                <Text className="text-[#4A90E2]">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showCancelModal}
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-4 rounded-lg w-[90%]">
            <Text className="text-lg">Cancel Task</Text>
            <Text className="text-gray-600 my-4">
              Are you sure you want to cancel this task?
            </Text>
            <View className="flex-row justify-end space-x-6">
              <TouchableOpacity onPress={() => setShowCancelModal(false)}>
                <Text className="text-[#4A90E2]">No</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/(pages)/(photo)/beforeClean")}>
                <Text className="text-red-500">Yes</Text>
              </TouchableOpacity>

              
              
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
