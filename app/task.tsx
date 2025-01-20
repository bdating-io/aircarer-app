import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  CheckBox,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TaskList() {
  const navigation = useNavigation();

  const [tasks, setTasks] = useState([
    { id: '1', name: 'Living Room', description: 'Brief description', done: false },
    { id: '2', name: 'Kitchen', description: 'Brief description', done: false },
    { id: '3', name: 'Room 1', description: 'Brief description', done: false },
    { id: '4', name: 'Bath Room 1', description: 'Brief description', done: false },
    { id: '5', name: 'Special Request', description: 'Brief description', done: false },
  ]);

  const toggleDone = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const handlePhotoClick = (task) => {
    navigation.navigate('cleaningTools', { task });
  };

  const renderItem = ({ item }) => (
    <View className="flex-row justify-between items-center bg-gray-100 p-4 mb-2 rounded-lg border border-gray-300">
      <TouchableOpacity
        className="w-16 h-16 bg-gray-300 rounded-lg justify-center items-center mr-4"
        onPress={() => handlePhotoClick(item)}
      >
        <Text className="text-gray-600">Photo1</Text>
      </TouchableOpacity>

      <View className="flex-1">
        <Text className="text-black text-lg font-bold">{item.name}</Text>
        <Text className="text-gray-600 text-sm">{item.description}</Text>
      </View>

      <View className="flex-row items-center">
        <CheckBox
          value={item.done}
          onValueChange={() => toggleDone(item.id)}
        />
        <Text className="text-black ml-2">Done</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <Text className="text-blue-700 text-2xl font-bold mb-4">Task List</Text>

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-lg mt-6"
        onPress={() => navigation.navigate('booking')}
      >
        <Text className="text-white text-center text-lg">Next</Text>
      </TouchableOpacity>

      <TouchableOpacity
          className="bg-blue-600 p-4 rounded-lg shadow-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white text-center text-lg font-bold">Back</Text>
        </TouchableOpacity>
        
    </View>
    
  );
}
