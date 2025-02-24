import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";

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
      const { error } = await supabase
        .from("tasks")
        .update({
          is_confirmed: true,
          status: "Pending",
          date_updated: new Date().toISOString(),
        })
        .eq("task_id", task.task_id);

      if (error) {
        console.error("Error accepting task:", error);
        return;
      }

      router.back();
    } catch (error) {
      console.error("Error accepting task:", error);
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

    const scheme = Platform.select({ ios: "maps:", android: "geo:" });
    const latLng = `${task.latitude},${task.longitude}`;
    const label = encodeURIComponent(task.address);
    const url = Platform.select({
      ios: `${scheme}?q=${latLng}&ll=${latLng}&label=${label}`,
      android: `${scheme}${latLng}?q=${latLng}(${label})`,
    });

    Linking.openURL(url as string).catch((err) =>
      console.error("An error occurred", err)
    );
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
              <TouchableOpacity onPress={handleAccept}>
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
              <TouchableOpacity onPress={handleCancel}>
                <Text className="text-red-500">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
