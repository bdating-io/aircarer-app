import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

type CalendarWithTitleProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  minDate?: string;
};

export default function CustomCalendar({
  selectedDate,
  onDateChange,
  minDate,
}: CalendarWithTitleProps) {
  return (
    <View className="mb-0">
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
      <Text className="mt-4 text-base">
        Date:
        {selectedDate && (
          <Text className="font-bold"> {selectedDate || 'None'}</Text>
        )}
      </Text>
    </View>
  );
}
