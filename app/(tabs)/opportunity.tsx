import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/clients/supabase';
import { format } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';

// 定义任务类型
type Task = {
  task_id: number;
  customer_id: string;
  task_type: string;
  estimated_price: number;
  confirmed_price: number | null;
  status: string;
  payment_status: string;
  scheduled_start_time: string;
  actual_start_time: string | null;
  completion_time: string | null;
  address: string;
  latitude: number;
  longitude: number;
  is_confirmed: boolean;
  cleaner_id: string | null;
  approval_status: string;
};

export default function Opportunity() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 获取当前用户ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };

    getCurrentUser();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      // 获取当前用户
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'No user logged in.');
        setLoading(false);
        return;
      }

      // 查询条件：
      // 1. cleaner_id 为 null (未分配给清洁工)
      // 2. customer_id 不等于当前用户ID (不是当前用户创建的任务)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .is('cleaner_id', null) // 未分配给清洁工
        .eq('status', 'Pending') 
        .eq('payment_status', 'Completed') 
        .order('scheduled_start_time', { ascending: true });

      if (error) {
        console.error('Query error:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} available tasks`);
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  // 接受任务
  const handleAcceptTask = async (taskId: number) => {
    if (!currentUserId) {
      Alert.alert('Error', 'You must be logged in to accept tasks');
      return;
    }

    Alert.alert('Accept Task', 'Are you sure you want to accept this task?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            // 更新任务，将当前用户设为清洁工
            const { error } = await supabase
              .from('tasks')
              .update({
                cleaner_id: currentUserId,
              })
              .eq('task_id', taskId);

            if (error) throw error;

            Alert.alert(
              'Success',
              'Task accepted! You can now view it in your task list and confirm it.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // 刷新任务列表
                    fetchTasks();
                    // 可选：导航到任务详情页
                    router.push(`/(pages)/(tasks)/task?id=${taskId}`);
                  },
                },
              ],
            );
          } catch (error) {
            console.error('Error accepting task:', error);
            Alert.alert('Error', 'Failed to accept task. Please try again.');
          }
        },
      },
    ]);
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
          {format(new Date(item.scheduled_start_time), 'MMM dd, yyyy HH:mm')}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <AntDesign name="enviromento" size={16} color="gray" />
        <Text className="ml-2 text-gray-600 flex-1" numberOfLines={1}>
          {item.address}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <AntDesign name="tag" size={16} color="gray" />
        <Text className="ml-2 text-gray-600">Status: {item.status}</Text>
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
          onPress={() => handleAcceptTask(item.task_id)}
        >
          <Text className="text-white font-medium">Accept Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
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
        keyExtractor={(item) => item.task_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
