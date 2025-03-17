import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
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
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskType}>{item.task_type}</Text>
        <Text style={styles.price}>${item.estimated_price}</Text>
      </View>

      <View style={styles.taskInfo}>
        <AntDesign name="calendar" size={16} color="gray" />
        <Text style={styles.infoText}>
          {format(new Date(item.scheduled_start_time), 'MMM dd, yyyy HH:mm')}
        </Text>
      </View>

      <View style={styles.taskInfo}>
        <AntDesign name="enviromento" size={16} color="gray" />
        <Text style={styles.infoText} numberOfLines={1}>
          {item.address}
        </Text>
      </View>

      <View style={styles.taskInfo}>
        <AntDesign name="tag" size={16} color="gray" />
        <Text style={styles.statusText}>Status: {item.status}</Text>
      </View>

      {/* 添加接受任务按钮 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            router.push(`/(pages)/(tasks)/task?id=${item.task_id}`)
          }
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptTask(item.task_id)}
        >
          <Text style={styles.acceptButtonText}>Accept Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Available Tasks</Text>
        <Text style={styles.subHeaderText}>
          All unassigned tasks you can accept
        </Text>
      </View>

      <FlatList
        style={styles.list}
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.task_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No available tasks at the moment
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 16,
    paddingTop: 60,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  subHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  list: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskType: {
    fontSize: 18,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '600',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    flex: 1,
  },
  statusText: {
    marginLeft: 8,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  // 新增样式
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  viewButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});
