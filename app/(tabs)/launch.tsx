// app/launch.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LaunchTaskPage() {
  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState('');

  const handleCreateTask = async () => {
    try {
      // 1) Store the taskTitle in AsyncStorage
      await AsyncStorage.setItem('TASK_TITLE', taskTitle);

      console.log('Task title saved:', taskTitle);

      // 2) Navigate to the next screen
      router.push('/placeDetails');
    } catch (error) {
      console.error('Error saving task title to AsyncStorage:', error);
    }
  };

  return (
    <>
      {/* Set screen title using expo-router's <Stack.Screen /> */}
      <Stack.Screen options={{ title: 'Create a task' }} />

      <View style={{ flex: 1, backgroundColor: '#4E89CE', padding: 24 }}>
        <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold' }}>
          Good day, adam
        </Text>
        <Text style={{ fontSize: 18, color: '#fff', marginBottom: 16 }}>
      
        </Text>

        <View style={{ backgroundColor: '#fff', borderRadius: 8, marginBottom: 12 }}>
          <TextInput
            style={{ padding: 10, fontSize: 16 }}
            placeholder="Please enter your task title"
            placeholderTextColor="#888"
            onChangeText={setTaskTitle}
            value={taskTitle}
          />
        </View>

        <TouchableOpacity
          onPress={handleCreateTask}
          style={{ backgroundColor: '#FF7E7E', borderRadius: 24, padding: 14 }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
            Get it done!
          </Text>
        </TouchableOpacity>


        
      </View>
    </>
  );
}
