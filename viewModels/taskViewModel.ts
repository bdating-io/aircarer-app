import { supabaseAuthClient } from '@/clients/supabase/auth';
import { supabaseDBClient } from '@/clients/supabase/database';
import { Task } from '@/types/task';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { differenceInHours } from 'date-fns';
import { useSessionModel } from '@/models/sessionModel';

export const useTaskViewModel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [distanceToTask, setDistanceToTask] = useState<number | undefined>(
    undefined,
  );
  const [hasArrived, setHasArrived] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const { mySession } = useSessionModel();
  const currentUserId = mySession?.user?.id;

  const fetchTask = async (taskId: string) => {
    try {
      setLoading(true);
      const data = await supabaseDBClient.getTaskById(taskId);
      setTask(data);
    } catch (error) {
      console.error('Error in fetchTask:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data = await supabaseDBClient.getTasks();
      if (!data) {
        setTasks([]);
        return;
      }
      const filteredTasks = filterTasksByDate(data || []);
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  //filter task by date, dont show past tasks
  const filterTasksByDate = (tasks: Task[]) => {
    const currentDate = new Date();
    return tasks.filter((task) => {
      const taskDate = new Date(task.scheduled_start_time || '');
      return taskDate >= currentDate;
    });
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      setLoading(true);
      const data = await supabaseDBClient.updateTaskById(taskId, taskData);
      setTask(data);
    } catch (error) {
      console.error('Error in updateTask:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const acceptTask = async (taskId: string) => {
    const user = await supabaseAuthClient.getUser();
    Alert.alert('Accept Task', 'Are you sure you want to accept this task?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            // 更新任务，将当前用户设为清洁工
            await supabaseDBClient.updateTaskById(taskId, {
              cleaner_id: user.id,
            });

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
                    router.push(
                      `/(pages)/(tasks)/taskDetailScreen?taskId=${taskId}`,
                    );
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

  // 更新任务状态
  const updateTaskStatus = (taskData: Task) => {
    if (!taskData) return;

    const taskTime = taskData.scheduled_start_time
      ? new Date(taskData.scheduled_start_time)
      : new Date();
    const now = new Date();
    const hoursUntilTask = differenceInHours(taskTime, now);

    // 设置是否可以确认任务
    setCanConfirm(
      !taskData.is_confirmed && hoursUntilTask <= 24 && hoursUntilTask >= 4,
    );

    // 设置是否可以签到
    setCanCheckIn(
      taskData.is_confirmed && hoursUntilTask < 4 && hoursUntilTask >= 0,
    );
  };
  // 确认任务
  const handleConfirmTask = async (taskId: string) => {
    if (!task) return;

    try {
      await supabaseDBClient.updateTaskById(taskId, {
        is_confirmed: true,
      });

      Alert.alert('Success', 'Task confirmed successfully!');

      // 刷新任务数据
      await fetchTask(taskId);

      updateTaskStatus(task);
    } catch (error) {
      console.error('Error confirming task:', error);
      Alert.alert('Error', 'Failed to confirm task');
    }
  };

  // 签到
  const handleCheckIn = async (taskId: string) => {
    if (!task) return;

    try {
      const isLocationValid = await validateTaskLocation(task);
      if (!isLocationValid) return;

      // 更新任务状态
      const now = new Date();
      await supabaseDBClient.updateTaskById(taskId, {
        check_in_time: now.toISOString(),
        status: 'In Progress',
      });

      setHasCheckedIn(true);
      Alert.alert('Success', 'Check-in successful!');

      // 刷新任务数据
      await fetchTask(taskId);
    } catch (error) {
      console.error('Error during check-in:', error);
      Alert.alert('Error', 'Failed to check in');
    }
  };

  // 计算两点之间的距离（公里）
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
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

  // 打开导航
  const handleNavigate = () => {
    if (!task) return;

    const latLng = `${task.latitude},${task.longitude}`;
    const url = Platform.select({
      ios: `maps://app?daddr=${latLng}`,
      android: `google.navigation:q=${latLng}`,
    });

    Linking.canOpenURL(url as string).then((supported) => {
      if (supported) {
        Linking.openURL(url as string);
      } else {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}`;
        Linking.openURL(googleMapsUrl);
      }
    });
  };

  // 取消任务
  const handleCancelTask = async (taskId: string) => {
    if (!task) return;

    Alert.alert('Cancel Task', 'Are you sure you want to cancel this task?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await supabaseDBClient.updateTaskById(taskId, {
              cleaner_id: null,
              status: 'Pending',
              is_confirmed: false,
              check_in_time: null,
            });

            console.debug('Success, Task cancelled successfully');
            router.back();
          } catch (error) {
            console.error('Error cancelling task:', error);
            Alert.alert('Error', 'Failed to cancel task');
          }
        },
      },
    ]);
  };

  const validateTaskLocation = async (task: Task): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Location permission is required to confirm arrival',
      );
      return false;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    if (task.latitude === undefined || task.longitude === undefined) {
      Alert.alert('Error', 'Task location is not available');
      return false;
    }
    // 计算与任务地点的距离
    const distance = calculateDistance(
      latitude,
      longitude,
      task.latitude,
      task.longitude,
    );
    setDistanceToTask(distance);
    // 检查距离是否在10公里以内
    if (distance > 40) {
      Alert.alert(
        'Location Check Failed',
        `You are too far from the task location (${distance.toFixed(
          2,
        )} km). Please confirm arrival when you are within 10km of the location.`,
      );
      return false;
    }
    return true;
  };

  // 处理确认到达按钮点击
  const handleConfirmArrived = async (taskId: string) => {
    if (!task) return;

    try {
      const isLocationValid = await validateTaskLocation(task);
      if (!isLocationValid) return;

      // 更新任务状态
      const now = new Date();

      await supabaseDBClient.updateTaskById(taskId, {
        status: 'In Progress',
        check_in_time: now.toISOString(),
      });

      setHasArrived(true);
      Alert.alert('Success', 'Arrival confirmed successfully!');

      // 导航到 beforeClean 页面
      router.push({
        pathname: '/beforeClean',
        params: { taskId: taskId },
      });
    } catch (error) {
      console.error('Error confirming arrival:', error);
      Alert.alert('Error', 'Failed to confirm arrival');
    }
  };

  return {
    currentUserId,
    loading,
    task,
    tasks,
    isError,
    distanceToTask,
    hasArrived,
    canConfirm,
    hasCheckedIn,
    canCheckIn,
    fetchTask,
    fetchTasks,
    updateTask,
    acceptTask,
    updateTaskStatus,
    handleConfirmTask,
    handleCheckIn,
    handleNavigate,
    handleCancelTask,
    handleConfirmArrived,
    setLoading,
    setIsError,
    setTask,
  };
};
