import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { format } from 'date-fns';
import { useTaskViewModel } from '@/viewModels/taskViewModel';
import {
  AcceptedTaskButtons,
  UnacceptedTaskButtons,
} from '@/components/task/taskButtons';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams() as { taskId: string };
  const {
    currentUserId,
    task,
    loading,
    distanceToTask,
    hasArrived,
    canCheckIn,
    hasCheckedIn,
    fetchTask,
    acceptTask,
    handleConfirmTask,
    handleNavigate,
    handleCheckIn,
    handleConfirmArrived,
    handleCancelTask,
  } = useTaskViewModel();

  useEffect(() => {
    fetchTask(taskId);
  }, [taskId]);

  // 渲染按钮部分
  const renderButtons = () => {
    if (!task) return null;

    if (!task.cleaner_id) {
      return (
        <UnacceptedTaskButtons
          onDecline={() => router.back()}
          onAccept={() => acceptTask(taskId)}
        />
      );
    }

    if (task.cleaner_id === currentUserId && task.status !== 'Completed') {
      return (
        <AcceptedTaskButtons
          task={task}
          canCheckIn={canCheckIn}
          hasCheckedIn={hasCheckedIn}
          hasArrived={hasArrived}
          distanceToTask={distanceToTask}
          onConfirmTask={() => handleConfirmTask(taskId)}
          onNavigate={handleNavigate}
          onCheckIn={() => handleCheckIn(taskId)}
          onConfirmArrived={() => handleConfirmArrived(taskId)}
          onTakeBeforePhotos={() =>
            router.push({
              pathname: '/beforeClean',
              params: { taskId: task.task_id },
            })
          }
          onCancelTask={() => handleCancelTask(taskId)}
        />
      );
    }

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

  return (
    <SafeAreaView className="flex-1 bg-blue-500 p-4">
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
          {task.latitude && task.longitude && (
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
          )}
          {/* Task Info */}
          <View className="p-4">
            <Text className="text-xl font-bold">{task.cleaning_type}</Text>
            <Text className="text-gray-600 mt-2">{task.address}</Text>
            <Text className="text-gray-600 mt-1">
              {task.scheduled_start_time
                ? format(new Date(task.scheduled_start_time), 'PPP p')
                : 'N/A'}
            </Text>
            <Text className="text-gray-600 mt-1">ID: {task.task_id}</Text>
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
    </SafeAreaView>
  );
}
