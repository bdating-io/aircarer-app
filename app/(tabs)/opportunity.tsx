import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';
import { Task } from '@/types/task';
import { useTaskViewModel } from '@/viewModels/taskViewModel';
import { ActivityIndicator } from 'react-native-paper';

export default function Opportunity() {
  const router = useRouter();
  const { loading, tasks, fetchTasks, isError, setLoading, acceptTask } =
    useTaskViewModel();

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = () => {
    setLoading(true);
    fetchTasks();
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-md">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold">{item.cleaning_type}</Text>
        <Text className="text-lg text-blue-500 font-semibold">
          ${item.estimated_price}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <AntDesign name="calendar" size={16} color="gray" />
        <Text className="ml-2 text-gray-600 flex-1">
          {item.scheduled_start_time
            ? format(new Date(item.scheduled_start_time), 'MMM dd, yyyy HH:mm')
            : 'N/A'}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <AntDesign name="enviromento" size={16} color="gray" />
        <Text className="ml-2 text-gray-600 flex-1" numberOfLines={1}>
          {item.address}
        </Text>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center mb-2">
          <AntDesign name="tag" size={16} color="gray" />
          <Text className="ml-2 text-gray-600">Status: {item.status}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Text className="ml-2 text-gray-600">ID: {item.task_id}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-3">
        <TouchableOpacity
          className="bg-gray-200 py-2 px-3 rounded flex-1 mr-2 items-center"
          onPress={() =>
            router.push(`/(pages)/(tasks)/task?taskId=${item.task_id}`)
          }
        >
          <Text className="text-gray-800 font-medium">View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 py-2 px-3 rounded flex-1 ml-2 items-center"
          onPress={() => acceptTask(item.task_id ?? '')}
        >
          <Text className="text-white font-medium">Accept Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading tasks</Text>
        <TouchableOpacity onPress={onRefresh} className="mt-2">
          <Text className="text-blue-500">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-blue-500 p-4 pt-16">
        <Text className="text-white text-xl font-semibold">
          Available Tasks
        </Text>
        <Text className="text-white text-lg font-normal">
          All unassigned tasks you can accept
        </Text>
      </View>

      <FlatList
        className="p-4"
        data={tasks}
        renderItem={renderTask}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="p-6 items-center">
            <Text className="text-gray-600 text-lg">
              No available tasks at the moment
            </Text>
          </View>
        }
      />
    </View>
  );
}
