import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '@/clients/supabase';
import { format } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';
import Dropdown from '@/components/Dropdown';
import { usePropertyViewModel } from '@/viewModels/propertyViewModel';
import { Property } from '@/types/property';

interface Task {
  task_id: number;
  customer_id: string;
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
  special_requirements?: any;
}

export default function EditTaskDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  const taskDataString = params.taskData as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 存放完整的任务数据
  const [task, setTask] = useState<Task | null>(null);

  // 只读字段
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [address, setAddress] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [cleaningType, setCleaningType] = useState('');
  const [bringEquipment, setBringEquipment] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [scheduleMode, setScheduleMode] = useState('');

  // Special Requirements（只读状态）
  const [specialToggles, setSpecialToggles] = useState({
    oven_cleaning: false,
    carpet_steaming: false,
    outdoor_cleaning: false,
    pet_fur_cleaning: false,
    rangehood_cleaning: false,
    dishwasher_cleaning: false,
  });
  const [glassCleaning, setGlassCleaning] = useState(0);
  const [wallStainRemoval, setWallStainRemoval] = useState(0);
  const [specialCustom, setSpecialCustom] = useState('');

  // Toggle options（用于显示标签）
  const toggleOptions = [
    { label: 'Pet fur cleaning', key: 'pet_fur_cleaning' },
    { label: 'Carpet steaming', key: 'carpet_steaming' },
    { label: 'Range hood cleaning', key: 'rangehood_cleaning' },
    { label: 'Oven cleaning', key: 'oven_cleaning' },
    { label: 'Outdoor cleaning', key: 'outdoor_cleaning' },
    { label: 'Dishwasher cleaning', key: 'dishwasher_cleaning' },
  ];

  // 只读属性选择
  const { loading: propLoading, properties, fetchUserAndProperties } =
    usePropertyViewModel();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetchUserAndProperties();

    if (taskDataString) {
      try {
        const parsedTask = JSON.parse(taskDataString) as Task;
        initializeForm(parsedTask);
        setTask(parsedTask);
        setLoading(false);
      } catch (err) {
        console.error('Error parsing task data:', err);
        fetchTask();
      }
    } else if (taskId) {
      fetchTask();
    } else {
      setError('No task information provided');
      setLoading(false);
    }
  }, [taskDataString, taskId]);

  const fetchTask = async () => {
    if (!taskId) {
      setError('No task ID provided');
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('task_id', taskId)
        .single();
      if (error) throw error;
      if (!data) {
        setError('Task not found');
      } else {
        setTask(data);
        initializeForm(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  const initializeForm = (data: Task) => {
    setScheduledDate(data.scheduled_start_date || '');
    if (data.scheduled_start_time) {
      try {
        const dt = new Date(data.scheduled_start_time);
        const hh = dt.getHours().toString().padStart(2, '0');
        const mm = dt.getMinutes().toString().padStart(2, '0');
        setScheduledTime(`${hh}:${mm}`);
      } catch {
        setScheduledTime('');
      }
    } else {
      setScheduledTime('');
    }
    setAddress(data.address || '');
    setEstimatedPrice(data.estimated_price?.toString() || '');
    setCleaningType(data.cleaning_type || '');
    setBringEquipment(data.bring_equipment || '');
    setEstimatedHours(data.estimated_hours?.toString() || '');
    setScheduleMode(data.schedule_mode || '');

    if (data.property_id) {
      const existingProp = properties.find((p) => p.property_id === data.property_id);
      if (existingProp) {
        setSelectedProperty(existingProp);
      }
    }

    // 初始化 special requirements
    if (data.special_requirements) {
      let specReq = data.special_requirements;
      if (typeof specReq === 'string') {
        try {
          specReq = JSON.parse(specReq);
        } catch (e) {
          console.error('Error parsing special_requirements:', e);
          specReq = {};
        }
      }
      setSpecialToggles(
        specReq.toggles || {
          oven_cleaning: false,
          carpet_steaming: false,
          outdoor_cleaning: false,
          pet_fur_cleaning: false,
          rangehood_cleaning: false,
          dishwasher_cleaning: false,
        }
      );
      setGlassCleaning(specReq.numeric?.glass_cleaning ?? 0);
      setWallStainRemoval(specReq.numeric?.wall_stain_removal ?? 0);
      setSpecialCustom(specReq.custom || '');
    }
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
      </View>
    );
  }
  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  let displayDateTime = '';
  try {
    if (task.scheduled_start_time) {
      const dt = new Date(task.scheduled_start_time);
      displayDateTime = format(dt, 'PPP p');
    }
  } catch {
    // ignore
  }

  const lat = selectedProperty?.latitude ?? task.latitude;
  const lng = selectedProperty?.longitude ?? task.longitude;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Task Details (Read-Only)</Text>
      </View>

      <View style={styles.contentContainer}>
        {task.latitude && task.longitude && (
          <View style={styles.mapContainer}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: task.latitude,
                longitude: task.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: task.latitude, longitude: task.longitude }}
                title={task.address}
              />
            </MapView>
          </View>
        )}

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Top Info */}
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>
              {task.cleaning_type || 'Cleaning Task'}
            </Text>
            <Text style={styles.taskAddress}>{task.address}</Text>
            {displayDateTime ? (
              <Text style={styles.taskAddress}>{displayDateTime}</Text>
            ) : null}
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{task.status}</Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Price</Text>
                <Text style={styles.infoValue}>
                  ${task.estimated_price?.toFixed(2) ?? 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Property (Read-Only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Property</Text>
            <Text style={styles.readOnlyText}>
              {selectedProperty?.address || address || 'N/A'}
            </Text>
          </View>

          {/* Cleaning Type (Read-Only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cleaning Type</Text>
            <Text style={styles.readOnlyText}>{cleaningType || 'N/A'}</Text>
          </View>

          {/* Bring Equipment (Read-Only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Bring Equipment</Text>
            <Text style={styles.readOnlyText}>{bringEquipment || 'N/A'}</Text>
          </View>

          {/* Schedule Mode (Read-Only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Schedule Mode</Text>
            <Text style={styles.readOnlyText}>{scheduleMode || 'N/A'}</Text>
          </View>

          {/* Scheduled Date (Read-Only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Scheduled Date</Text>
            <Text style={styles.readOnlyText}>{scheduledDate || 'N/A'}</Text>
          </View>

          {/* Scheduled Time (Read-Only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Scheduled Start Time</Text>
            <Text style={styles.readOnlyText}>{scheduledTime || 'N/A'}</Text>
          </View>

          {/* Estimated Hours (Read-Only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Estimated Hours</Text>
            <Text style={styles.readOnlyText}>{estimatedHours || 'N/A'}</Text>
          </View>

          {/* Special Requirements (Read-Only) */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { marginBottom: 8 }]}>Special Requirements</Text>
            {/* Toggles */}
            <View style={styles.toggleContainer}>
              {toggleOptions.map(option => {
                const selected = specialToggles[option.key];
                return (
                  <View
                    key={option.key}
                    style={[
                      styles.requestButton,
                      { backgroundColor: selected ? '#4E89CE' : '#ccc', marginRight: 8, marginBottom: 8 },
                    ]}
                  >
                    <Text style={styles.requestText}>{option.label}</Text>
                  </View>
                );
              })}
            </View>

            {/* Glass Cleaning */}
            <View style={styles.numericContainer}>
              <Text style={styles.optionLabel}>Glass Cleaning</Text>
              <View style={styles.readOnlyCounterContainer}>
                <View style={styles.counterButton}>
                  <AntDesign name="minus" size={16} color="#4E89CE" />
                </View>
                <Text style={styles.counterText}>{glassCleaning}</Text>
                <View style={styles.counterButton}>
                  <AntDesign name="plus" size={16} color="#4E89CE" />
                </View>
              </View>
            </View>

            {/* Wall Stain Removal */}
            <View style={styles.numericContainer}>
              <Text style={styles.optionLabel}>Wall Stain Removal</Text>
              <View style={styles.readOnlyCounterContainer}>
                <View style={styles.counterButton}>
                  <AntDesign name="minus" size={16} color="#4E89CE" />
                </View>
                <Text style={styles.counterText}>{wallStainRemoval}</Text>
                <View style={styles.counterButton}>
                  <AntDesign name="plus" size={16} color="#4E89CE" />
                </View>
              </View>
            </View>

            {/* Custom */}
            <Text style={[styles.customLabel, { marginTop: 12 }]}>Custom Requirements</Text>
            <View style={styles.customReadOnlyContainer}>
              <Text style={styles.customReadOnlyText}>{specialCustom || 'N/A'}</Text>
            </View>
          </View>

          {/* 本页面为只读展示，无保存按钮 */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4E89CE',
  },
  headerContainer: {
    backgroundColor: '#4E89CE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    height: 200,
    width: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  taskInfo: {
    padding: 16,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskAddress: {
    marginTop: 4,
    fontSize: 16,
    color: '#555',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#333',
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  requestButton: {
    padding: 12,
    borderRadius: 8,
  },
  requestText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  numericContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  optionLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readOnlyCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#ccc',
    padding: 6,
    borderRadius: 4,
  },
  counterText: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  customLabel: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
    fontSize: 16,
  },
  customReadOnlyContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f2f2f2',
  },
  customReadOnlyText: {
    fontSize: 16,
    color: '#333',
  },
});
