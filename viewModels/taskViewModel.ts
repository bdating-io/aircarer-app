import { supabaseDBClient } from '@/clients/supabase/database';
import { HouseOwnerTask } from '@/types/task';
import { useState } from 'react';

export const useTaskViewModel = () => {
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<HouseOwnerTask | undefined>(undefined);
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
  return {
    loading,
    task,
    isError,
    setTask,
    fetchTask,
    setIsError,
    setLoading,
  };
};
