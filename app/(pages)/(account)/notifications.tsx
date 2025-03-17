import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const sampleNotifications = [
  {
    id: '1',
    title: 'New Cleaning Request',
    message: 'You have received a new cleaning request in your area',
    type: 'task',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of $120 has been processed for your last service',
    type: 'payment',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '3',
    title: 'New Message',
    message: 'John Smith: When will you arrive?',
    type: 'message',
    is_read: true,
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
];

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(sampleNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return 'mail-outline';
      case 'task':
        return 'clipboard-outline';
      case 'payment':
        return 'card-outline';
      default:
        return 'notifications-outline';
    }
  };

  const renderNotification = ({
    item,
  }: {
    item: (typeof sampleNotifications)[0];
  }) => (
    <TouchableOpacity
      className={`p-4 border-b border-gray-100 ${
        !item.is_read ? 'bg-blue-50' : ''
      }`}
      onPress={() => {
        setNotifications(
          notifications.map((n) =>
            n.id === item.id ? { ...n, is_read: true } : n,
          ),
        );
      }}
    >
      <View className="flex-row">
        <View className="w-10 h-10 bg-[#4A90E2] rounded-full items-center justify-center">
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={20}
            color="white"
          />
        </View>
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-base">{item.title}</Text>
          <Text className="text-gray-600 mt-1">{item.message}</Text>
          <Text className="text-gray-400 text-sm mt-2">
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
        {!item.is_read && (
          <View className="w-2 h-2 rounded-full bg-[#4A90E2]" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold mr-6">
          Notifications
        </Text>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="notifications-off-outline" size={48} color="#666" />
            <Text className="text-gray-500 mt-4">No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
