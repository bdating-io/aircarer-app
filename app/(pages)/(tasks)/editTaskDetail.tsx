import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/clients/supabase';

// 根据数据库表结构定义任务接口
interface Task {
  task_id: number;
  customer_id: string;
  task_type: string;
  estimated_price: number;
  confirmed_price: number | null;
  status: string;
  payment_status: string;
  date_updated: string;
  approval_status: string;
  scheduled_start_time: string;
  actual_start_time: string | null;
  completion_time: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  is_confirmed: boolean;
  cleaner_id: string | null;
  check_in_time: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  cleaning_type: string;
  bring_equipment: string;
  property_id: number | null;
  estimated_hours: number;
  schedule_mode: string;
  scheduled_start_date: string;
}

export default function EditTaskDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  const taskDataString = params.taskData as string;

  console.log('Received params:', params);
  console.log('Task ID:', taskId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 表单字段
  const [taskType, setTaskType] = useState('');
  const [status, setStatus] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [address, setAddress] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [cleaningType, setCleaningType] = useState('');
  const [bringEquipment, setBringEquipment] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [scheduleMode, setScheduleMode] = useState('');

  // 尝试从参数中解析任务数据
  useEffect(() => {
    if (taskDataString) {
      try {
        const taskData = JSON.parse(taskDataString) as Task;
        console.log('Successfully parsed task data');

        // 设置表单字段
        setTaskType(taskData.task_type || '');
        setStatus(taskData.status || '');
        setScheduledDate(taskData.scheduled_start_date || '');
        setScheduledTime(taskData.scheduled_start_time || '');
        setAddress(taskData.address || '');
        setEstimatedPrice(taskData.estimated_price?.toString() || '');
        setCleaningType(taskData.cleaning_type || '');
        setBringEquipment(taskData.bring_equipment || '');
        setEstimatedHours(taskData.estimated_hours?.toString() || '');
        setScheduleMode(taskData.schedule_mode || '');

        setLoading(false);
      } catch (err) {
        console.error('Error parsing task data:', err);
        // 如果解析失败，回退到从数据库获取
        fetchTask();
      }
    } else if (taskId) {
      // 如果没有传递任务数据但有taskId，从数据库获取
      fetchTask();
    } else {
      setError('No task information provided');
      setLoading(false);
    }
  }, [taskDataString, taskId]);

  // 获取任务详情
  const fetchTask = async () => {
    if (!taskId) {
      setError('No task ID provided');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching task with ID:', taskId);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('task_id', taskId)
        .single();

      console.log('Supabase response:', { data: !!data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        console.log('Task data received from database');
        setTaskType(data.task_type || '');
        setStatus(data.status || '');
        setScheduledDate(data.scheduled_start_date || '');
        setScheduledTime(data.scheduled_start_time || '');
        setAddress(data.address || '');
        setEstimatedPrice(data.estimated_price?.toString() || '');
        setCleaningType(data.cleaning_type || '');
        setBringEquipment(data.bring_equipment || '');
        setEstimatedHours(data.estimated_hours?.toString() || '');
        setScheduleMode(data.schedule_mode || '');
      } else {
        setError('Task not found');
      }
    } catch (err: any) {
      console.error('Error in fetchTask:', err);
      setError(err.message || 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  // 保存任务更改
  const handleSave = async () => {
    try {
      setSaving(true);

      console.log('Saving task with ID:', taskId);

      const { error } = await supabase
        .from('tasks')
        .update({
          task_type: taskType,
          status: status,
          scheduled_start_date: scheduledDate,
          scheduled_start_time: scheduledTime,
          address: address,
          estimated_price: parseFloat(estimatedPrice) || 0,
          cleaning_type: cleaningType,
          bring_equipment: bringEquipment,
          estimated_hours: parseFloat(estimatedHours) || 0,
          schedule_mode: scheduleMode,
        })
        .eq('task_id', taskId);

      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }

      Alert.alert('Success', 'Task updated successfully');
      router.back();
    } catch (err: any) {
      console.error('Error in handleSave:', err);
      Alert.alert('Error', err.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  // 删除任务
  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);

              console.log('Deleting task with ID:', taskId);

              const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('task_id', taskId);

              if (error) {
                console.error('Error deleting task:', error);
                throw error;
              }

              Alert.alert('Success', 'Task deleted successfully');
              router.back();
            } catch (err: any) {
              console.error('Error in handleDelete:', err);
              Alert.alert('Error', err.message || 'Failed to delete task');
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4E89CE" />
        <Text style={styles.loadingText}>Loading task details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={[styles.button, styles.errorButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Task</Text>
        <Text style={styles.subtitle}>Task ID: {taskId}</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Task Type</Text>
        <TextInput
          style={styles.input}
          value={taskType}
          onChangeText={setTaskType}
          placeholder="Enter task type"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Status</Text>
        <TextInput
          style={styles.input}
          value={status}
          onChangeText={setStatus}
          placeholder="Enter status"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Scheduled Date</Text>
        <TextInput
          style={styles.input}
          value={scheduledDate}
          onChangeText={setScheduledDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Scheduled Time</Text>
        <TextInput
          style={styles.input}
          value={scheduledTime}
          onChangeText={setScheduledTime}
          placeholder="HH:MM:SS"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Estimated Price ($)</Text>
        <TextInput
          style={styles.input}
          value={estimatedPrice}
          onChangeText={setEstimatedPrice}
          keyboardType="numeric"
          placeholder="Enter estimated price"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cleaning Type</Text>
        <TextInput
          style={styles.input}
          value={cleaningType}
          onChangeText={setCleaningType}
          placeholder="Enter cleaning type"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Bring Equipment</Text>
        <TextInput
          style={styles.input}
          value={bringEquipment}
          onChangeText={setBringEquipment}
          placeholder="Yes/No"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Estimated Hours</Text>
        <TextInput
          style={styles.input}
          value={estimatedHours}
          onChangeText={setEstimatedHours}
          keyboardType="numeric"
          placeholder="Enter estimated hours"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Schedule Mode</Text>
        <TextInput
          style={styles.input}
          value={scheduleMode}
          onChangeText={setScheduleMode}
          placeholder="Enter schedule mode"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Delete Task</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
    gap: 12,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#4E89CE',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorButton: {
    backgroundColor: '#4E89CE',
  },
});
