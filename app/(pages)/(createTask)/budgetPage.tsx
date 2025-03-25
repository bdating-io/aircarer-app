import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/clients/supabase';

export default function BudgetPage() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams() as { taskId?: string };

  // from tasks table
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<
    'Quick Cleaning' | 'Regular Cleaning' | 'Deep Cleaning' | null
  >(null);

  // from properties table
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);

  // Calculated price
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  // loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) {
      Alert.alert('Error', 'No taskId provided.');
      return;
    }
    fetchTaskAndProperty(taskId);
  }, [taskId]);

  const fetchTaskAndProperty = async (id: string) => {
    try {
      // 1) get property_id, task_type from tasks
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('property_id, task_type')
        .eq('task_id', id)
        .single();
      if (taskError) throw taskError;
      if (!taskData?.property_id) {
        throw new Error('No property_id found in tasks table.');
      }

      setPropertyId(taskData.property_id);
      setTaskType(taskData.task_type || null);

      // 2) get bedrooms, bathrooms from properties
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('bedrooms, bathrooms')
        .eq('property_id', taskData.property_id)
        .single();
      if (propError) throw propError;

      setBedrooms(propData?.bedrooms || 0);
      setBathrooms(propData?.bathrooms || 0);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  //  compute estimatedPrice
  useEffect(() => {
    if (loading) return;
    const basePrice = 40 + 20 * (bedrooms + bathrooms);
    let multiplier = 1;
    if (taskType === 'Regular Cleaning') multiplier = 2;
    if (taskType === 'Deep Cleaning') multiplier = 3;
    const result = basePrice * multiplier;
    setEstimatedPrice(result);
  }, [bedrooms, bathrooms, taskType, loading]);

  const handleNext = async () => {
    if (!taskId) {
      Alert.alert('Error', 'No taskId provided.');
      return;
    }
    const userBudgetNum = estimatedPrice;

    /*
    Job status:
    New: waiting for owner to complete details and pay
    Pending: details completed, payment may not be done
    */
    try {
      // update tasks table
      const { error } = await supabase
        .from('tasks')
        .update({
          estimated_price: estimatedPrice,
          budget: userBudgetNum,
          payment_status: 'Not Paid',
          approval_status: 'Pending',
          status: 'Pending',
          is_confirmed: false,
        })
        .eq('task_id', taskId);

      if (error) throw error;

      console.debug('task updated successfully');
      router.push(`/(pages)/(createTask)/paymentMethodScreen?taskId=${taskId}`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.header}>Cleaning Fee Estimate</Text>
        <Text style={styles.subHeader}>
          {/* Don’t worry, you can always negotiate the final price later. */}
        </Text>

        {/* show estimated price */}
        {estimatedPrice > 0 && (
          <Text style={{ marginBottom: 8 }}>
            We estimate your cleaning job will cost:
            <Text style={{ fontWeight: 'bold' }}> ${estimatedPrice}</Text>
          </Text>
        )}

        {/* Next button */}
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#E0F7FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#4E89CE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalCloseBtn: {
    marginTop: 16,
    backgroundColor: '#4E89CE',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
});
