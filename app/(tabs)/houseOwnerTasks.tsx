import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/clients/supabase';
import { AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';
import { HouseOwnerTask } from '@/types/task';

export default function HouseOwnerTasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<HouseOwnerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          fetchTasksByUserId(user.id);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const fetchTasksByUserId = async (uid: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('customer_id', uid)
        .order('date_updated', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} tasks`);
      setTasks(data || []);
    } catch (error) {
      console.error('Error in fetchTasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (userId) {
      fetchTasksByUserId(userId);
    } else {
      setRefreshing(false);
    }
  };

  // Open edit page
  const handleEditTask = (task: HouseOwnerTask) => {
    if (!task.task_id) {
      console.error('No task ID found');
      return;
    }
    router.push({
      pathname: '/(pages)/(tasks)/viewTaskDetail',
      params: {
        taskId: task.task_id,
        taskData: JSON.stringify(task),
      },
    });
  };

  // Each list item
  const renderTask = ({ item }: { item: HouseOwnerTask }) => {
    // Format scheduled_start_time or show "No date"
    let displayDate = 'No date';
    if (item.scheduled_start_time) {
      try {
        displayDate = format(
          new Date(item.scheduled_start_time),
          'MMM d, yyyy',
        );
      } catch (err) {
        console.log('Error formatting date:', err);
      }
    }

    return (
      <TouchableOpacity
        className="bg-white rounded-lg p-4 mb-3 shadow"
        onPress={() => handleEditTask(item)}
      >
        {/* Title row */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold">
            {`${item.cleaning_type} - ${item.status}`}
          </Text>
          <Text className="text-lg text-blue-500 font-semibold">
            ${item.budget}
          </Text>
        </View>

        {/* Task Type row */}
        {/* <View className="flex-row items-center mb-2">
          <AntDesign name="tool" size={16} color="gray" />
          <Text className="ml-2 text-gray-600 flex-1">
            {item.cleaning_type || 'No type'}
          </Text>
        </View> */}

        {/* Date row */}
        <View className="flex-row items-center mb-2">
          <AntDesign name="calendar" size={16} color="gray" />
          <Text className="ml-2 text-gray-600 flex-1">{displayDate}</Text>
        </View>

        {/* Address row */}
        <View className="flex-row items-center mb-2">
          <AntDesign name="enviromento" size={16} color="gray" />
          <Text className="ml-2 text-gray-600 flex-1" numberOfLines={1}>
            {item.address || 'No address'}
          </Text>
        </View>

        {/* Payment row */}
        <View className="flex-row items-center mb-2">
          <AntDesign name="creditcard" size={16} color="gray" />
          <Text className="ml-2 text-gray-600 flex-1">
            Payment: {item.payment_status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="mt-2 text-gray-600 text-lg">Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-500 p-4 pt-16">
        <Text className="text-white text-2xl font-semibold">My Tasks</Text>
      </View>

      <FlatList
        className="p-4"
        data={tasks}
        renderItem={renderTask}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="p-10 items-center justify-center">
            <AntDesign name="calendar" size={60} color="#CCCCCC" />
            <Text className="text-gray-600 text-lg font-medium mt-4">
              No tasks available
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center">
              Your cleaning tasks will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
}
