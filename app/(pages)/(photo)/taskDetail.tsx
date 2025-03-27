import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/clients/supabase';
import { Ionicons } from '@expo/vector-icons';

type RoomType = 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'other';

interface CleaningTip {
  roomType: RoomType;
  title: string;
  tips: string[];
}

export default function TaskDetail() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [beforePhotos, setBeforePhotos] = useState<any[]>([]);
  const { taskId } = useLocalSearchParams();

  useEffect(() => {
   
    fetchTaskData();
  }, [taskId]);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      // 获取最新的进行中任务
      const { data: tasks, error: taskError } = await supabase
        .from('tasks')
        .select()
        .eq('task_id', taskId)
        .limit(1);

      if (taskError) throw taskError;
      if (!tasks || tasks.length === 0) return;

      setTask(tasks[0]);

      // 获取任务相关的照片
      const { data: photos, error: photoError } = await supabase
        .from('room_photos')
        .select()
        .eq('task_id', taskId)
        .eq('photo_type', 'before');

      if (photoError) throw photoError;
      setBeforePhotos(photos || []);
    } catch (error) {
      console.error('Error fetching task data:', error + ", taskId="+ taskId);
    } finally {
      setLoading(false);
    }
  };

  // 清洁提示数据
  const cleaningTips: CleaningTip[] = [
    {
      roomType: 'living_room',
      title: 'Living Room',
      tips: [
        'Dust all surfaces including shelves, tables, and electronics',
        'Vacuum carpets and rugs thoroughly',
        'Mop hard floors with appropriate cleaner',
        'Clean mirrors and glass surfaces',
        'Organize and straighten items',
      ],
    },
    {
      roomType: 'bedroom',
      title: 'Bedroom',
      tips: [
        'Change bed linens if requested',
        'Dust all surfaces including nightstands and dressers',
        'Vacuum carpets and under the bed',
        'Clean mirrors and glass surfaces',
        'Organize visible items neatly',
      ],
    },
    {
      roomType: 'kitchen',
      title: 'Kitchen',
      tips: [
        'Clean all countertops and backsplash',
        'Clean outside of all appliances',
        'Clean inside microwave',
        'Clean sink and faucet',
        'Sweep and mop floor',
      ],
    },
    {
      roomType: 'bathroom',
      title: 'Bathroom',
      tips: [
        'Clean and sanitize toilet, sink, and shower/tub',
        'Clean mirrors and glass surfaces',
        'Wipe down all counters and fixtures',
        'Sweep and mop floor',
        'Replace towels if requested',
      ],
    },
    {
      roomType: 'other',
      title: 'General Tips',
      tips: [
        'Work from top to bottom in each room',
        'Use microfiber cloths to avoid streaks',
        'Use appropriate cleaners for different surfaces',
        'Ventilate rooms while cleaning',
        'Take before and after photos of each area',
      ],
    },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!task) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg text-gray-800 mb-4">No active task found</Text>
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg"
          onPress={() => router.push('/')}
        >
          <Text className="text-white font-bold">Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800">
            Cleaning Guide
          </Text>
          <Text className="text-gray-600 mt-1">
            Follow these tips for each room
          </Text>
        </View>

        {/* 任务信息 */}
        <View className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">
            {task.task_type || 'Task'}
          </Text>
          <Text className="text-gray-600 mt-1">
            {task.address || 'No address provided'}
          </Text>
          <Text className="text-gray-600 mt-1">
            {new Date(task.scheduled_start_time).toLocaleString()}
          </Text>
        </View>

        {/* 显示已上传的照片 */}
        {beforePhotos.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Before Photos
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {beforePhotos.map((photo, index) => (
                <View key={index} className="mr-2">
                  <Image
                    source={{ uri: photo.photo_url }}
                    style={{ width: 120, height: 120, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 清洁提示 */}
        {cleaningTips.map((roomTip) => (
          <View key={roomTip.roomType} className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-gray-800">
                {roomTip.title}
              </Text>
            </View>
            <View className="bg-white p-4 rounded-lg shadow-sm">
              {roomTip.tips.map((tip, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <View className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2" />
                  <Text className="text-gray-700 flex-1">{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* 按钮区域 */}
        <View className="mt-4 mb-8">
          <TouchableOpacity
            className="py-4 rounded-lg items-center bg-green-500"
            onPress={() => {
              router.push({
                pathname: '/afterClean',
                params: { taskId: taskId },
              })}
            }
          >
            <Text className="text-white font-bold">
              Complete Cleaning & Take Photos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 rounded-lg items-center bg-blue-500 mt-4"
            onPress={() => router.back()}
          >
            <Text className="text-white font-bold">Back to Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
