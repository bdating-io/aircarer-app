import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

type CalendarWithTitleProps = {
  title: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  minDate?: string;
};

export default function CalendarWithTitle({
  title,
  selectedDate,
  onDateChange,
  minDate,
}: CalendarWithTitleProps) {
  return (
    <View className="mb-4">
      <Text className="font-semibold mb-2 text-lg">{title}</Text>
      <Calendar
        onDayPress={(day: DateData) => onDateChange(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: '#4E89CE',
          },
        }}
        minDate={minDate}
        theme={{
          todayTextColor: '#FF7E7E',
          arrowColor: '#4E89CE',
        }}
      />
      {selectedDate && (
        <Text className="mt-4 text-base">
          Selected Date: {selectedDate || 'None'}
        </Text>
      )}
    </View>
  );
}
