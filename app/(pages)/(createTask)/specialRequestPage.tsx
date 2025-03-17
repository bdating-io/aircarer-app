import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/clients/supabase';

export default function SpecialRequestPage() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams() as { taskId?: string };

  const requests = [
    'Pet fur cleaning',
    'Carpet steaming',
    'Range hood cleaning',
    'Oven cleaning',
    'Outdoor cleaning',
  ];

  const requestColumns: Record<string, string> = {
    'Pet fur cleaning': 'pet_cleaning',
    'Carpet steaming': 'carpet_steaming',
    'Range hood cleaning': 'rangehood_cleaning',
    'Oven cleaning': 'oven_cleaning',
    'Outdoor cleaning': 'outdoor_cleaning',
  };

  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState('');

  const toggleRequest = (request: string) => {
    if (selectedRequests.includes(request)) {
      setSelectedRequests(selectedRequests.filter((item) => item !== request));
    } else {
      setSelectedRequests([...selectedRequests, request]);
    }
  };

  const handleNext = async () => {
    if (!taskId) {
      Alert.alert('Error', 'No taskId provided in route params.');
      return;
    }

    if (selectedRequests.length === 0 && !customRequest.trim()) {
      Alert.alert(
        'Error',
        'Please select at least one special request or enter a custom request.',
      );
      return;
    }

    try {
      const updateObj: Record<string, any> = {
        pet_cleaning: false,
        carpet_steaming: false,
        rangehood_cleaning: false,
        oven_cleaning: false,
        outdoor_cleaning: false,
        special_requirement: customRequest.trim(),
      };

      selectedRequests.forEach((req) => {
        const colName = requestColumns[req];
        if (colName) {
          updateObj[colName] = true;
        }
      });

      const { error } = await supabase
        .from('tasks')
        .update(updateObj)
        .eq('task_id', taskId);

      if (error) throw error;

      Alert.alert('Success', 'Your special requests have been saved!');
      router.push(`/(pages)/(createTask)/budgetPage?taskId=${taskId}`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Special Request</Text>
        <Text style={styles.subtitle}>Do you need any of the following?</Text>

        {requests.map((request) => {
          const selected = selectedRequests.includes(request);
          return (
            <TouchableOpacity
              key={request}
              onPress={() => toggleRequest(request)}
              style={[
                styles.requestButton,
                { backgroundColor: selected ? '#4E89CE' : '#ccc' },
              ]}
            >
              <Text style={styles.requestText}>{request}</Text>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.customLabel}>
          Please specify any other special requirements (maximum 250 words)
        </Text>
        <TextInput
          placeholder="Enter your custom request here..."
          value={customRequest}
          onChangeText={setCustomRequest}
          multiline
          numberOfLines={4}
          maxLength={250}
          style={styles.customInput}
        />

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  requestButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  requestText: {
    color: '#fff',
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
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#4E89CE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
