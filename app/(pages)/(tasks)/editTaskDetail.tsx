import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '@/clients/supabase';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  special_requirements?: any; // 新增字段，存储 special requirements
}

export default function EditTaskDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  const taskDataString = params.taskData as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Full Task object (for map & summary display)
  const [task, setTask] = useState<Task | null>(null);

  // Form fields
  const [scheduledDate, setScheduledDate] = useState(''); // "YYYY-MM-DD"
  const [scheduledTime, setScheduledTime] = useState(''); // "HH:MM"
  const [address, setAddress] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [cleaningType, setCleaningType] = useState('');
  const [bringEquipment, setBringEquipment] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [scheduleMode, setScheduleMode] = useState('');

  // Special Requirements States
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

  // Toggle options for special requirements
  const toggleOptions = [
    { label: 'Pet fur cleaning', key: 'pet_fur_cleaning' },
    { label: 'Carpet steaming', key: 'carpet_steaming' },
    { label: 'Range hood cleaning', key: 'rangehood_cleaning' },
    { label: 'Oven cleaning', key: 'oven_cleaning' },
    { label: 'Outdoor cleaning', key: 'outdoor_cleaning' },
    { label: 'Dishwasher cleaning', key: 'dishwasher_cleaning' },
  ];

  const toggleSpecialOption = (key: string) => {
    setSpecialToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // For property selection
  const { loading: propLoading, properties, fetchUserAndProperties } =
    usePropertyViewModel();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Toggles for calendar/time modals
  const [showCalendar, setShowCalendar] = useState(false);

  // For the time picker, we use a custom modal
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempTime, setTempTime] = useState<Date>(new Date());

  useEffect(() => {
    // Fetch properties
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

  // Fetch from DB
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

  // Initialize fields
  const initializeForm = (data: Task) => {
    setScheduledDate(data.scheduled_start_date || '');
    if (data.scheduled_start_time) {
      try {
        const dt = new Date(data.scheduled_start_time);
        const hh = dt.getHours().toString().padStart(2, '0');
        const mm = dt.getMinutes().toString().padStart(2, '0');
        setScheduledTime(`${hh}:${mm}`); // e.g. "08:00"
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

    // Property selection
    if (data.property_id) {
      const existingProp = properties.find((p) => p.property_id === data.property_id);
      if (existingProp) {
        setSelectedProperty(existingProp);
      }
    }

    // Initialize special requirements
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
    } else {
      // 默认值
      setSpecialToggles({
        oven_cleaning: false,
        carpet_steaming: false,
        outdoor_cleaning: false,
        pet_fur_cleaning: false,
        rangehood_cleaning: false,
        dishwasher_cleaning: false,
      });
      setGlassCleaning(0);
      setWallStainRemoval(0);
      setSpecialCustom('');
    }
  };

  // Save
  const handleSave = async () => {
    if (!taskId) return;

    try {
      setSaving(true);

      // Combine date + time => ISO
      let combinedDateTime: string | null = null;
      if (scheduledDate && scheduledTime) {
        combinedDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
      }

      const updateData = {
        scheduled_start_date: scheduledDate,
        scheduled_start_time: combinedDateTime,
        estimated_price: parseFloat(estimatedPrice) || 0,
        cleaning_type: cleaningType,
        bring_equipment: bringEquipment,
        estimated_hours: parseFloat(estimatedHours) || 0,
        schedule_mode: scheduleMode,
        // property info
        property_id: selectedProperty?.property_id,
        address: selectedProperty?.address,
        latitude: selectedProperty?.latitude,
        longitude: selectedProperty?.longitude,
        // special requirements
        special_requirements: {
          toggles: specialToggles,
          numeric: {
            glass_cleaning: glassCleaning,
            wall_stain_removal: wallStainRemoval,
          },
          custom: specialCustom.trim(),
        },
      };

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('task_id', taskId);

      if (error) throw error;

      Alert.alert(
        'Success',
        'Task updated successfully',
        [{ text: 'OK', onPress: () => router.navigate('/(tabs)/houseOwnerTasks') }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = () => {
    if (!taskId) return;
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
              const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('task_id', taskId);
              if (error) throw error;
              Alert.alert('Success', 'Task deleted successfully');
              router.navigate('/(tabs)/houseOwnerTasks');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete task');
              setDeleting(false);
            }
          },
        },
      ]
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
  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Task not found</Text>
        <TouchableOpacity
          style={[styles.button, styles.errorButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // For display in top section
  let displayDateTime = '';
  try {
    if (task.scheduled_start_time) {
      const dt = new Date(task.scheduled_start_time);
      displayDateTime = format(dt, 'PPP p'); // e.g. Mar 20, 2025 5:00 AM
    }
  } catch {
    // ignore
  }

  // For map display
  const lat = selectedProperty?.latitude ?? task.latitude;
  const lng = selectedProperty?.longitude ?? task.longitude;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
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

          {/* -------------- Property Selection -------------- */}
          <View style={styles.formGroup}>
            {propLoading ? (
              <ActivityIndicator />
            ) : (
              <Dropdown
                title="Select Property"
                titleStyle={styles.label}
                options={properties.map((p) => p.address ?? 'No address')}
                selectedOption={selectedProperty?.address ?? ''}
                onSelect={(address) => {
                  const found = properties.find((p) => p.address === address);
                  setSelectedProperty(found ?? null);
                }}
                placeholder={address || "Select your property"}
              />
            )}
          </View>

          {/* Cleaning Type */}
          <View style={styles.formGroup}>
            <Dropdown
              title="Select Cleaning Type"
              titleStyle={styles.label}
              options={["AirBnB", "End-of-Lease/Sale"]}
              selectedOption={cleaningType}
              onSelect={(option) => setCleaningType(option)}
              placeholder="Select cleaning type"
            />
          </View>

          {/* Bring Equipment */}
          <View style={styles.formGroup}>
            <Dropdown
              title="Select Bring Equipment"
              titleStyle={styles.label}
              options={["Yes", "No"]}
              selectedOption={bringEquipment}
              onSelect={(option) => setBringEquipment(option)}
              placeholder="Yes"
            />
          </View>

          {/* Schedule Mode */}
          <View style={styles.formGroup}>
            <Dropdown
              title="Select Schedule Mode"
              titleStyle={styles.label}
              options={["Exact Date", "Before a Date"]}
              selectedOption={scheduleMode}
              onSelect={(option) => setScheduleMode(option)}
              placeholder="Select Schedule Mode"
            />
          </View>

          {/* Scheduled Date */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Scheduled Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowCalendar(true)}
            >
              <Text>{scheduledDate || 'YYYY-MM-DD'}</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Modal */}
          <Modal visible={showCalendar} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <Calendar
                  onDayPress={(day) => {
                    setScheduledDate(day.dateString);
                    setShowCalendar(false);
                  }}
                  markedDates={
                    scheduledDate
                      ? {
                          [scheduledDate]: {
                            selected: true,
                            marked: true,
                            selectedColor: '#4E89CE',
                          },
                        }
                      : {}
                  }
                  minDate={new Date().toISOString().split('T')[0]}
                  theme={{
                    todayTextColor: '#4E89CE',
                    arrowColor: '#4E89CE',
                  }}
                />
                <TouchableOpacity
                  style={[styles.button, { marginTop: 16, backgroundColor: '#ccc' }]}
                  onPress={() => setShowCalendar(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Scheduled Time */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Scheduled Start Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                if (scheduledTime) {
                  const [h, m] = scheduledTime.split(':');
                  const newDate = new Date();
                  newDate.setHours(Number(h));
                  newDate.setMinutes(Number(m));
                  newDate.setSeconds(0);
                  setTempTime(newDate);
                } else {
                  setTempTime(new Date());
                }
                setShowTimeModal(true);
              }}
            >
              <Text>{scheduledTime || 'HH:MM'}</Text>
            </TouchableOpacity>
          </View>

          {/* Time Modal */}
          <Modal
            visible={showTimeModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowTimeModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Start Time</Text>
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  display="spinner"
                  is24Hour={true}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setTempTime(selectedDate);
                    }
                  }}
                />
                <View style={{ flexDirection: 'row', marginTop: 16 }}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { flex: 1, marginRight: 8, backgroundColor: '#ccc' },
                    ]}
                    onPress={() => setShowTimeModal(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { flex: 1, backgroundColor: '#4E89CE' }]}
                    onPress={() => {
                      const hours = tempTime.getHours().toString().padStart(2, '0');
                      const minutes = tempTime.getMinutes().toString().padStart(2, '0');
                      setScheduledTime(`${hours}:${minutes}`);
                      setShowTimeModal(false);
                    }}
                  >
                    <Text style={styles.buttonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/*
          <View style={styles.formGroup}>
            <Text style={styles.label}>Estimated Price ($)</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                Alert.prompt(
                  'Edit Estimated Price',
                  '',
                  (text) => setEstimatedPrice(text),
                  'plain-text',
                  estimatedPrice
                );
              }}
            >
              <Text>{estimatedPrice || 'Tap to edit price'}</Text>
            </TouchableOpacity>
          </View>
          */}

          {/* Estimated Hours*/}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Estimated Hours</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => setEstimatedHours(text)}
              value={estimatedHours}
              placeholder="Enter estimated hours"
            />
          </View>


          {/* Special Requirements */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { marginBottom: 8 }]}>Special Requirements</Text>

            {toggleOptions.map(option => {
              const selected = specialToggles[option.key];
              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => toggleSpecialOption(option.key)}
                  style={[
                    styles.requestButton,
                    { backgroundColor: selected ? '#4E89CE' : '#ccc', marginBottom: 8 },
                  ]}
                >
                  <Text style={styles.requestText}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Glass Cleaning */}
            <View style={styles.numericContainer}>
              <View>
                <Text style={styles.optionLabel}>Glass Cleaning</Text>
                <Text style={styles.numericHint}>(charged per piece)</Text>
              </View>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={() =>
                    setGlassCleaning(glassCleaning > 0 ? glassCleaning - 1 : 0)
                  }
                  style={styles.counterButton}
                >
                  <AntDesign name="minus" size={16} color="#4E89CE" />
                </TouchableOpacity>
                <Text style={styles.counterText}>{glassCleaning}</Text>
                <TouchableOpacity
                  onPress={() => setGlassCleaning(glassCleaning + 1)}
                  style={styles.counterButton}
                >
                  <AntDesign name="plus" size={16} color="#4E89CE" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Wall Stain Removal */}
            <View style={styles.numericContainer}>
              <View>
                <Text style={styles.optionLabel}>Wall Stain Removal</Text>
                <Text style={styles.numericHint}>(charged per wall)</Text>
              </View>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={() =>
                    setWallStainRemoval(wallStainRemoval > 0 ? wallStainRemoval - 1 : 0)
                  }
                  style={styles.counterButton}
                >
                  <AntDesign name="minus" size={16} color="#4E89CE" />
                </TouchableOpacity>
                <Text style={styles.counterText}>{wallStainRemoval}</Text>
                <TouchableOpacity
                  onPress={() => setWallStainRemoval(wallStainRemoval + 1)}
                  style={styles.counterButton}
                >
                  <AntDesign name="plus" size={16} color="#4E89CE" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Custom Request */}
            <Text style={[styles.customLabel, { marginTop: 12 }]}>
              Please specify any other special requirements (maximum 250 words)
            </Text>
            <TextInput
              placeholder="Enter your custom request here..."
              value={specialCustom}
              onChangeText={setSpecialCustom}
              multiline
              numberOfLines={4}
              maxLength={250}
              style={styles.customInput}
            />
          </View>

          {/* Buttons */}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingRight: 16,
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
  errorButton: {
    backgroundColor: '#4E89CE',
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
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    justifyContent: 'center',
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  // Special Requirements Styles
  requestButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestText: {
    color: '#fff',
    fontWeight: 'bold',
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
  numericHint: {
    fontSize: 12,
    color: '#666',
  },
  counterContainer: {
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
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});
