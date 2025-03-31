import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type TimePickerModalProps = {
  visible: boolean;
  title: string;
  type: 'start' | 'end';
  onClose: () => void;
  onConfirm: (selectedTime: Date) => void;
};

export default function TimePickerModal({
  visible,
  title,
  onClose,
  onConfirm,
}: TimePickerModalProps) {
  const [selectedTime, setSelectedTime] = useState(new Date());

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-4/5 bg-white rounded-lg p-4 items-center">
          <Text className="text-lg font-bold mb-4">{title}</Text>
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="spinner"
            is24Hour={true}
            onChange={(event, date) => {
              if (event.type === 'dismissed') {
                onClose();
              }
              if (date) {
                setSelectedTime(date);
              }
            }}
          />

          <View className="flex-row justify-end mt-5">
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-500 py-2 px-5 rounded mr-4 flex-1 items-center"
            >
              <Text className="text-white text-base">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onConfirm(selectedTime);
              }}
              className="bg-blue-500 py-2 px-5 rounded flex-1 items-center"
            >
              <Text className="text-white text-base">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
