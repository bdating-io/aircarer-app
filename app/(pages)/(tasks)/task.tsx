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
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Linking from "expo-linking";
import * as Location from "expo-location";

interface TaskData {
  id: string;
  title: string;
  requester: string;
  location: {
    latitude: number;
    longitude: number;
  };
  date: string;
  time: string;
  price: number;
  description: string;
  status: "pending" | "confirmed" | "started" | "completed";
}

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

export default function Task() {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [taskStatus, setTaskStatus] = useState<TaskData["status"]>("pending");
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [hasArrived, setHasArrived] = useState(false);

  // 模拟任务数据
  const mockTask: TaskData = {
    id: "task-001",
    title: "Task Title",
    requester: "Requester",
    location: {
      latitude: -33.8688,
      longitude: 151.2093,
    },
    date: "2025-02-12",
    time: "12:00",
    price: 150,
    description: "Task description goes here...",
    status: "pending",
  };

  // 检查是否在24小时内和4小时内
  const taskDate = new Date(`${mockTask.date}T${mockTask.time}`);
  const now = new Date();
  const timeDiff = taskDate.getTime() - now.getTime();
  const isWithin24Hours = timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000;
  const isWithin4Hours = timeDiff > 0 && timeDiff <= 4 * 60 * 60 * 1000;

  // 检查位置权限并开始监听位置
  useEffect(() => {
    if (taskStatus === "started") {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        // 开始监听位置
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // 每10米更新一次
          },
          (location) => {
            setUserLocation(location);
            checkIfArrived(location);
          }
        );

        return () => {
          locationSubscription.remove();
        };
      })();
    }
  }, [taskStatus]);

  // 检查是否到达目的地（距离小于50米）
  const checkIfArrived = (location: Location.LocationObject) => {
    const distance = getDistance(
      location.coords.latitude,
      location.coords.longitude,
      mockTask.location.latitude,
      mockTask.location.longitude
    );
    if (distance <= 50) {
      // 50米范围内
      setHasArrived(true);
    }
  };

  // 计算两点之间的距离（米）
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // 地球半径（米）
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // 处理确认按钮
  const handleConfirm = () => {
    console.log("Confirming task...");
    setTaskStatus("confirmed");
    setShowConfirmModal(false);

    // 如果在4小时内，显示提醒
    if (isWithin4Hours) {
      console.log("Within 4 hours, showing reminder...");
      setShowReminderModal(true);
    }
  };

  // 处理开始按钮
  const handleStart = () => {
    console.log("Starting task...");
    setTaskStatus("started");

    // 打开地图导航
    const { latitude, longitude } = mockTask.location;
    // 对于 iOS 使用 Apple Maps，Android 使用 Google Maps
    const scheme = Platform.select({ ios: "maps:", android: "geo:" });
    const url = Platform.select({
      ios: `${scheme}${latitude},${longitude}`,
      android: `${scheme}${latitude},${longitude}?q=${latitude},${longitude}`,
    });

    Linking.openURL(url as string).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  // 处理取消按钮
  const handleCancel = () => {
    setShowCancelModal(true);
  };

  // 确认取消任务
  const confirmCancel = () => {
    console.log("Cancelling task...");
    // 这里可以添加取消任务的API调用
    router.back(); // 返回上一页
  };

  // 修改底部按钮逻辑
  const renderBottomButtons = () => {
    if (!isWithin24Hours) {
      return (
        <TouchableOpacity
          className="bg-[#4A90E2] py-3 rounded items-center"
          onPress={handleCancel}
        >
          <Text className="text-white font-medium">Cancel</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View className="flex-row space-x-4">
        <TouchableOpacity
          className="flex-1 bg-[#4A90E2] py-3 rounded items-center"
          onPress={handleCancel}
        >
          <Text className="text-white font-medium">Cancel</Text>
        </TouchableOpacity>
        {taskStatus === "pending" && (
          <TouchableOpacity
            className="flex-1 bg-[#4A90E2] py-3 rounded items-center"
            onPress={() => setShowConfirmModal(true)}
          >
            <Text className="text-white font-medium">Confirm</Text>
          </TouchableOpacity>
        )}
        {taskStatus === "confirmed" && (
          <TouchableOpacity
            className="flex-1 bg-[#4A90E2] py-3 rounded items-center"
            onPress={handleStart}
          >
            <Text className="text-white font-medium">Start</Text>
          </TouchableOpacity>
        )}
        {taskStatus === "started" && hasArrived && (
          <TouchableOpacity
            className="flex-1 bg-green-500 py-3 rounded items-center"
            onPress={() => setTaskStatus("completed")}
          >
            <Text className="text-white font-medium">Confirm Arrival</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const date = new Date(mockTask.date);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });

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
        {/* Task Info */}
        <View className="p-4">
          <Text className="text-lg">{mockTask.title}</Text>
          <View className="flex-row items-center mt-1">
            <AntDesign name="user" size={16} color="gray" />
            <Text className="text-gray-600 ml-2">{mockTask.requester}</Text>
          </View>
        </View>

        {/* Map */}
        <View className="h-[180px]">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              ...mockTask.location,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker coordinate={mockTask.location} />
          </MapView>
        </View>

        {/* Date and Price */}
        <View className="p-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <AntDesign name="calendar" size={16} color="gray" />
            <Text className="text-gray-600 ml-2">
              On {month} {day}
              {getOrdinalSuffix(day)}
            </Text>
          </View>
          <Text className="text-xl font-bold">${mockTask.price}AUD</Text>
        </View>

        {/* Description */}
        <View className="px-4">
          <Text className="text-gray-600">{mockTask.description}</Text>
        </View>

        {/* Property Photos */}
        <View className="p-4">
          <Text className="font-medium mb-2">Property Photos</Text>
          <View className="h-40 bg-gray-100 rounded" />
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="p-4 border-t border-gray-200">
        {renderBottomButtons()}
      </View>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-4 rounded-lg w-[90%]">
            <Text className="text-lg">Attendance confirmation</Text>
            <Text className="text-gray-600 my-4">
              This is confirmation that you will attend this cleaning task for
              time {mockTask.time} tomorrow {mockTask.date}
            </Text>
            <View className="flex-row justify-end space-x-6">
              <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                <Text className="text-red-500">No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm}>
                <Text className="text-[#4A90E2]">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4-Hour Reminder Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showReminderModal}
        onRequestClose={() => setShowReminderModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-4 rounded-lg w-[90%]">
            <Text className="text-lg">Task Reminding</Text>
            <Text className="text-gray-600 my-4">
              This is reminding that this cleaning task is about to start in 4
              hours. Please open GPS and moving to the place
            </Text>
            <View className="flex-row justify-end space-x-6">
              <TouchableOpacity onPress={() => setShowReminderModal(false)}>
                <Text className="text-red-500">No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowReminderModal(false)}>
                <Text className="text-[#4A90E2]">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Confirmation Modal */}
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
              Are you sure you want to cancel this task? This action cannot be
              undone.
            </Text>
            <View className="flex-row justify-end space-x-6">
              <TouchableOpacity onPress={() => setShowCancelModal(false)}>
                <Text className="text-[#4A90E2]">No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmCancel}>
                <Text className="text-red-500">Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
