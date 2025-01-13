// app/launch.tsx
import { Stack, useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';


export default function LaunchTaskPage() {
  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState('');

  const handleCreateTask = () => {
    console.log('Task title:', taskTitle);
    router.push('/placeDetails');
  };

  return (
    <>
      {/* 通过 expo-router 的 <Stack.Screen /> 配置当前页面标题 */}
      <Stack.Screen options={{ title: 'Create a task' }} />
      
      <View style={{ flex: 1, backgroundColor: '#007BFF', padding: 24 }}>
        <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold' }}>
          Good day, username!
        </Text>
        <Text style={{ fontSize: 18, color: '#fff', marginBottom: 16 }}>
          Need a hand? We’ve got you covered.
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
