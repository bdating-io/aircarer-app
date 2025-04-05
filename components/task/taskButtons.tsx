import { Task } from '@/types/task';
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export const UnacceptedTaskButtons = ({
  onDecline,
  onAccept,
}: {
  onDecline: () => void;
  onAccept: () => void;
}) => (
  <View className="flex-row space-x-4">
    <TouchableOpacity
      className="flex-1 bg-gray-500 py-4 rounded-lg items-center"
      onPress={onDecline}
    >
      <Text className="text-white font-bold">Decline</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className="flex-1 bg-blue-500 py-4 rounded-lg items-center"
      onPress={onAccept}
    >
      <Text className="text-white font-bold">Accept</Text>
    </TouchableOpacity>
  </View>
);

export const AcceptedTaskButtons = ({
  task,
  canCheckIn,
  hasCheckedIn,
  hasArrived,
  distanceToTask,
  onConfirmTask,
  onNavigate,
  onCheckIn,
  onConfirmArrived,
  onTakeBeforePhotos,
  onCancelTask,
}: {
  task: Task;
  canCheckIn: boolean;
  hasCheckedIn: boolean;
  hasArrived: boolean;
  distanceToTask?: number;
  onConfirmTask: () => void;
  onNavigate: () => void;
  onCheckIn: () => void;
  onConfirmArrived: () => void;
  onTakeBeforePhotos: () => void;
  onCancelTask: () => void;
}) => (
  <View>
    {!task.is_confirmed && (
      <TouchableOpacity
        className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
        onPress={onConfirmTask}
      >
        <Text className="text-white font-bold">Confirm Task</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity
      className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
      onPress={onNavigate}
    >
      <Text className="text-white font-bold">Navigate to Location</Text>
    </TouchableOpacity>
    {canCheckIn && !hasCheckedIn && (
      <TouchableOpacity
        className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
        onPress={onCheckIn}
      >
        <Text className="text-white font-bold">Check In</Text>
      </TouchableOpacity>
    )}
    {task.is_confirmed && !hasArrived && (
      <TouchableOpacity
        className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
        onPress={onConfirmArrived}
      >
        <Text className="text-white font-bold">
          Confirm Arrived & Take Photos
        </Text>
      </TouchableOpacity>
    )}
    {hasCheckedIn && (
      <View className="bg-green-100 py-4 px-4 rounded-lg mb-4">
        <Text className="text-green-800 font-semibold text-center">
          You have checked in for this task
        </Text>
        {distanceToTask !== undefined && (
          <Text className="text-green-700 text-center mt-1">
            Distance to location: {distanceToTask.toFixed(1)} km
          </Text>
        )}
      </View>
    )}
    {hasArrived && (
      <TouchableOpacity
        className="bg-blue-500 py-4 px-4 rounded-lg items-center mb-4"
        onPress={onTakeBeforePhotos}
      >
        <Text className="text-white font-bold">Take Before Photos</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity
      className="bg-red-500 py-4 px-4 rounded-lg items-center mt-4"
      onPress={onCancelTask}
    >
      <Text className="text-white font-bold">Cancel Task</Text>
    </TouchableOpacity>
  </View>
);
