import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { format } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';
import { HouseOwnerTask } from '@/types/task';
import { useTaskViewModel } from '@/viewModels/taskViewModel';

export default function ViewTaskDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  const taskDataString = params.taskData as string;

  const { task, loading, isError, setIsError, setLoading, fetchTask, setTask } =
    useTaskViewModel();

  const { toggles, custom, numeric } = task?.special_requirements || {};
  const toggleOptions = [
    { label: 'Pet fur cleaning', key: 'pet_fur_cleaning' },
    { label: 'Carpet steaming', key: 'carpet_steaming' },
    { label: 'Range hood cleaning', key: 'rangehood_cleaning' },
    { label: 'Oven cleaning', key: 'oven_cleaning' },
    { label: 'Outdoor cleaning', key: 'outdoor_cleaning' },
    { label: 'Dishwasher cleaning', key: 'dishwasher_cleaning' },
  ];

  useEffect(() => {
    if (taskDataString) {
      try {
        const parsedTask = JSON.parse(taskDataString) as HouseOwnerTask;
        setTask(parsedTask);
        setLoading(false);
      } catch (err) {
        console.error('Error parsing task data:', err);
        fetchTask(taskId);
      }
    } else if (taskId) {
      fetchTask(taskId);
    } else {
      setIsError(false);
      setLoading(false);
    }
  }, [taskDataString, taskId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4E89CE" />
        <Text className="mt-4 text-lg font-medium">
          Loading task details...
        </Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="mb-4 text-lg font-medium text-red-500">
          {'Something wrong happened while fetching task details'}
        </Text>
      </View>
    );
  }
  if (!task) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg font-medium text-red-500">Task not found</Text>
      </View>
    );
  }
  let displayDateTime = '';
  if (task.scheduled_start_time) {
    const dt = new Date(task.scheduled_start_time);
    displayDateTime = format(dt, 'h:mm a do MMMM, yyyy');
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <View className="bg-blue-500 flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="pr-4">
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg text-white font-bold">Task Details</Text>
      </View>

      <View className="flex-1 bg-white">
        {task.latitude && task.longitude && (
          <View className="h-48 w-full">
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

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="mb-4">
            <Text className="text-lg text-gray-700">{task.address}</Text>
            <Text className="text-lg text-gray-700">{task.cleaning_type}</Text>
            {displayDateTime ? (
              <Text className="text-lg text-gray-700">{displayDateTime}</Text>
            ) : null}
            <View className="flex-row justify-between mt-3">
              <View>
                <Text className="text-sm text-gray-500">Status</Text>
                <Text className="text-base font-semibold">{task.status}</Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500">Price</Text>
                <Text className="text-base font-semibold">
                  ${task.estimated_price?.toFixed(2) ?? 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2">Estimated Hours</Text>
            <Text className="text-base text-gray-700 bg-gray-200 p-3 rounded-lg">
              {task.estimated_hours || 'N/A'}
            </Text>
          </View>

          {toggles && Object.values(toggles).some((value) => value) && (
            <View className="mb-4">
              <Text className="text-base font-medium mb-2">
                Special Requirements
              </Text>

              <View className="flex-row flex-wrap">
                {toggleOptions.map((option) => {
                  const selected = toggles[option.key as keyof typeof toggles];
                  if (selected) {
                    return (
                      <View
                        key={option.key}
                        className="bg-blue-500 px-3 py-2 rounded-lg mr-2 mb-2"
                      >
                        <Text className="text-white font-bold text-sm">
                          {option.label}
                        </Text>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            </View>
          )}

          {numeric?.glass_cleaning !== undefined &&
            numeric?.glass_cleaning !== 0 && (
              <View className="flex-row justify-between items-center my-2">
                <Text className="font-semibold text-base">Glass Cleaning</Text>
                <View className="flex-row items-center">
                  <Text className="mx-2 font-bold text-base">
                    {numeric?.glass_cleaning}
                  </Text>
                </View>
              </View>
            )}

          {numeric?.wall_stain_removal !== undefined &&
            numeric?.wall_stain_removal !== 0 && (
              <View className="flex-row justify-between items-center my-2">
                <Text className="font-semibold text-base">
                  Wall Stain Removal
                </Text>
                <View className="flex-row items-center">
                  <Text className="mx-2 font-bold text-base">
                    {numeric?.wall_stain_removal}
                  </Text>
                </View>
              </View>
            )}
          {custom && (
            <View className="mb-4">
              <Text className="font-semibold mt-3 mb-1 text-base">
                Custom Requirements
              </Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-200">
                <Text className="text-base text-gray-700">{custom}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
