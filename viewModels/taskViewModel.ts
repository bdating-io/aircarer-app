import { supabaseDBClient } from '@/clients/supabase/database';
import { Task } from '@/types/task';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useTaskViewModel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

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

  //filter task by date, dont show past tasks
  const filterTasksByDate = (tasks: Task[]) => {
    const currentDate = new Date();
    return tasks.filter((task) => {
      const taskDate = new Date(task.scheduled_start_time || '');
      return taskDate >= currentDate;
    });
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
    Alert.alert('Accept Task', 'Are you sure you want to accept this task?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            // 更新任务，将当前用户设为清洁工
            await supabaseDBClient.updateTaskById(taskId, {
              cleaner_id: 'currentUserId', // 替换为当前用户的ID
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

  return {
    loading,
    task,
    tasks,
    isError,
    setTask,
    fetchTask,
    fetchTasks,
    updateTask,
    setIsError,
    setLoading,
    acceptTask,
  };
};
