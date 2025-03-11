import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/clients/supabase';
import { format, differenceInHours } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';
import { CleanerTask } from '@/types/task';

export default function CleanerTasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<CleanerTask[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 获取任务列表 - 只显示当前用户接受的任务
  const fetchTasks = async () => {
    try {
      // 获取当前用户ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'No user logged in.');
        setLoading(false);
        return;
      }

      console.log('Current user ID:', user.id);

      // 获取当前用户接受的任务 (cleaner_id = user.id)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('cleaner_id', user.id) // 关键条件：只显示当前用户接受的任务
        .order('scheduled_start_time', { ascending: true });

      if (error) {
        console.error('Query error:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} tasks accepted by current user`);

      // 过滤掉状态为 Pending 且超过 4 小时的任务
      const now = new Date();
      const filteredTasks =
        data?.filter((task) => {
          // 如果任务状态不是 Pending，保留该任务
          if (task.status !== 'Pending') return true;

          // 计算时间差（小时）
          const taskTime = new Date(task.scheduled_start_time);
          const hoursDifference = differenceInHours(now, taskTime);

          // 如果时间差小于等于 4 小时，保留该任务
          return hoursDifference <= 4;
        }) || [];

      setTasks(filteredTasks);
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

  // 用于刷新
  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  // 取消任务 - 先读取任务数据，然后清除 cleaner_id 并将状态改为 Pending
  const handleCancelTask = async (taskId: number) => {
    Alert.alert(
      'Cancel Task',
      'Are you sure you want to cancel this task? The task will be removed from your list and become available for others.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Processing task cancellation for ID:', taskId);

              // 步骤1: 先读取任务数据，确认任务存在
              const { data: taskData, error: readError } = await supabase
                .from('tasks')
                .select('*')
                .eq('task_id', taskId)
                .single();

              if (readError) {
                console.error('Error reading task data:', readError);
                throw readError;
              }

              if (!taskData) {
                Alert.alert('Error', 'Task not found');
                return;
              }

              console.log('Found task data:', taskData);

              // 步骤2: 更新任务，清除 cleaner_id 并将状态改为 Pending
              const { error: updateError } = await supabase
                .from('tasks')
                .update({
                  cleaner_id: null, // 清除清洁工ID
                  status: 'Pending', // 更新状态为待处理（而不是已取消）
                  is_confirmed: false, // 重置确认状态
                  check_in_time: null, // 清除签到时间
                })
                .eq('task_id', taskId);

              if (updateError) {
                console.error('Error updating task:', updateError);
                throw updateError;
              }

              console.log('Successfully released task:', taskId);
              Alert.alert(
                'Success',
                'Task has been released and is now available for others.',
              );

              // 刷新任务列表
              fetchTasks();
            } catch (err: any) {
              Alert.alert('Error', 'Failed to release task: ' + err.message);
            }
          },
        },
      ],
    );
  };

  // 编辑任务
  const handleEditTask = (taskId: number) => {
    // 跳转到编辑页面
    router.push(`/editTask?taskId=${taskId}`);
  };

  // 获取任务状态的颜色 (Tailwind classes or inline)
  const getStatusColor = (status: CleanerTask['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 获取任务类型的图标
  const getTaskTypeIcon = (type: CleanerTask['task_type']) => {
    switch (type) {
      case 'Quick Cleaning':
        return 'clockcircle';
      case 'Regular Cleaning':
        return 'home';
      case 'Deep Cleaning':
        return 'tool';
      default:
        return 'question';
    }
  };

  // 渲染单个任务项
  const renderTask = ({ item }: { item: CleanerTask }) => (
    <View className="bg-white p-4 mb-2 rounded-lg shadow-sm">
      {/* 整个区域可点击跳转详情 
        如果你不想这个功能，可以去掉 onPress & Wrap */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/(pages)/(tasks)/task',
            params: { id: item.task_id },
          })
        }
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <View className="flex-row items-center">
              <AntDesign
                name={getTaskTypeIcon(item.task_type)}
                size={20}
                color="#4A90E2"
                style={{ marginRight: 8 }}
              />
              <Text className="text-lg font-semibold">{item.task_title}</Text>
            </View>
            <Text className="text-gray-600 mt-1">
              {format(
                new Date(item.scheduled_start_time),
                'MMM dd, yyyy HH:mm',
              )}
            </Text>
            {item.approval_status !== 'Approved' && (
              <Text className="text-orange-500 text-sm mt-1">
                Pending Approval
              </Text>
            )}
          </View>

          <View className="items-end">
            <Text className="text-lg font-semibold">
              ${item.confirmed_price || item.budget}
            </Text>
            <View
              className={`px-2 py-1 rounded-full mt-1 ${getStatusColor(
                item.status,
              )}`}
            >
              <Text className="text-white text-sm">{item.status}</Text>
            </View>
            {item.payment_status === 'Paid' && (
              <Text className="text-green-500 text-sm mt-1">Paid</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Edit / Delete row */}
      <View className="flex-row justify-end mt-2">
        <TouchableOpacity
          className="px-3 py-2 bg-blue-500 rounded-md"
          onPress={() => handleCancelTask(item.task_id)}
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-xl font-bold">My Accepted Tasks</Text>
        <Text className="text-gray-500 mt-1">
          Tasks you have accepted to complete
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
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-gray-500 text-center">
              {
                "You haven't accepted any tasks yet. Check the Opportunities tab to find available tasks."
              }
            </Text>
          </View>
        }
      />
    </View>
  );
}
