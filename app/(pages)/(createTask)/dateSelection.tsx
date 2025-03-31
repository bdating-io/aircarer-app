import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import TimePickerModal from '@/components/timePickerModal';
import CalendarWithTitle from '@/components/CalendarWithTitle';
import { useTaskViewModel } from '@/viewModels/taskViewModel';

export default function DateSelection() {
  const router = useRouter();
  const { taskId, propertyId } = useLocalSearchParams<{
    taskId?: string;
    propertyId?: string;
  }>();

  const [dateOption, setDateOption] = useState<'Exact Date' | 'Before a Date'>(
    'Exact Date',
  );

  const [exactDate, setExactDate] = useState('');
  const [beforeDate, setBeforeDate] = useState('');
  const [timePickerType, setTimePickerType] = useState<'start' | 'end'>(
    'start',
  );
  const [startTime, setStartTime] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState<Date | undefined>();
  const [calculatedHours, setCalculatedHours] = useState('');
  const [dayPeriod, setDayPeriod] = useState<'morning' | 'afternoon'>(
    'morning',
  );
  const [estimatedHours, setEstimatedHours] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);

  const { updateTask } = useTaskViewModel();

  const handleSubmit = async () => {
    if (!taskId) {
      return Alert.alert('Error', 'No taskId provided in route params.');
    }

    if (dateOption === 'Exact Date') {
      if (!exactDate || !startTime || !endTime || !calculatedHours) {
        return Alert.alert(
          'Error',
          'Please select a valid date, start/end time, and ensure hours are calculated.',
        );
      }

      const startTimeMinutes =
        startTime.getHours() * 60 + startTime.getMinutes();
      const [year, month, day] = exactDate.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day, 0, 0);
      dateObj.setMinutes(startTimeMinutes);

      await updateTask(taskId, {
        schedule_mode: 'Exact Date',
        scheduled_start_time: dateObj.toISOString(),
        scheduled_start_date: exactDate,
        scheduled_period: null,
        estimated_hours: parseFloat(calculatedHours),
      });
    } else {
      if (
        !beforeDate ||
        !estimatedHours ||
        isNaN(Number(estimatedHours)) ||
        Number(estimatedHours) <= 0
      ) {
        return Alert.alert(
          'Error',
          'Please select a valid date and enter a valid estimated time in hours.',
        );
      }

      await updateTask(taskId, {
        schedule_mode: 'Before a Date',
        scheduled_start_time: new Date(
          beforeDate +
            'T' +
            (dayPeriod === 'morning' ? '08:00:00' : '14:00:00'),
        ).toISOString(),
        scheduled_start_date: beforeDate,
        scheduled_period: dayPeriod === 'morning' ? 'Morning' : 'Afternoon',
        estimated_hours: parseFloat(estimatedHours),
      });
    }
    router.push({
      pathname: '/(pages)/(createTask)/takePhotoPage',
      params: { propertyId, taskId },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="flex-1 bg-gray-100">
          <View className="p-4">
            <Text className="text-lg font-semibold mb-3">
              Looking for an exact date?
            </Text>

            <View className="flex-row mb-4">
              <TouchableOpacity
                onPress={() => setDateOption('Exact Date')}
                className={`flex-1 p-3 rounded-lg items-center ${
                  dateOption === 'Exact Date' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <Text className="text-white">Exact date & time</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDateOption('Before a Date')}
                className={`flex-1 p-3 rounded-lg items-center ml-1 ${
                  dateOption === 'Before a Date' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <Text className="text-white">Before a date</Text>
              </TouchableOpacity>
            </View>

            {dateOption === 'Exact Date' ? (
              <View className="mb-4">
                <CalendarWithTitle
                  title="Select Exact Date"
                  selectedDate={exactDate}
                  onDateChange={setExactDate}
                  minDate={new Date().toISOString().split('T')[0]}
                />

                <View className="mt-4">
                  <Text className="font-semibold mb-2 text-lg">
                    Select Start & End Time
                  </Text>

                  {/* Button to select Start Time */}
                  <TouchableOpacity
                    onPress={() => {
                      setShowTimeModal(true);
                      setTimePickerType('start'); // Set type to 'start'
                    }}
                    className="bg-blue-500 p-3 rounded-md flex-row items-center justify-center mb-2"
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-white">
                      {startTime
                        ? `Start Time: ${startTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}`
                        : 'Select Start Time'}
                    </Text>
                  </TouchableOpacity>

                  {/* Button to select End Time */}
                  <TouchableOpacity
                    onPress={() => {
                      setShowTimeModal(true);
                      setTimePickerType('end'); // Set type to 'end'
                    }}
                    className="bg-blue-500 p-3 rounded-md flex-row items-center justify-center"
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-white">
                      {endTime
                        ? `End Time: ${endTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}`
                        : 'Select End Time'}
                    </Text>
                  </TouchableOpacity>

                  {/* Display calculated hours if both times are selected */}
                  {startTime && endTime && (
                    <View className="mt-2">
                      <Text className="mb-1 text-base">
                        {`Selected Time: ${startTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })} - ${endTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}`}
                      </Text>
                      {calculatedHours && (
                        <Text className="text-base">
                          The cleaning is expected to take{' '}
                          <Text className="font-bold">
                            {calculatedHours} hours
                          </Text>
                          .
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                {/* TimePickerModal */}
                <TimePickerModal
                  visible={showTimeModal}
                  title="Select Time"
                  type={timePickerType} // Pass the type prop
                  onClose={() => setShowTimeModal(false)}
                  onConfirm={(selectedDate) => {
                    if (timePickerType === 'start') {
                      // Set start time
                      setStartTime(selectedDate);
                    } else if (timePickerType === 'end') {
                      // Set end time
                      setEndTime(selectedDate);

                      // Calculate hours difference
                      const diffHours =
                        (startTime
                          ? selectedDate.getTime() - startTime.getTime()
                          : 0) / 3600000;
                      // Set calculated hours
                      setCalculatedHours(diffHours.toFixed(1));
                    }

                    setShowTimeModal(false);
                  }}
                />
              </View>
            ) : (
              <View className="mb-4">
                <CalendarWithTitle
                  title="Select Before Date"
                  selectedDate={beforeDate}
                  onDateChange={setBeforeDate}
                  minDate={new Date().toISOString().split('T')[0]}
                />

                <Text className="font-semibold mt-4 text-lg">
                  Morning or Afternoon?
                </Text>
                <View className="flex-row mt-2">
                  <TouchableOpacity
                    onPress={() => setDayPeriod('morning')}
                    className={`flex-1 p-3 rounded-md items-center ${
                      dayPeriod === 'morning' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <Text className="text-white">Morning</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setDayPeriod('afternoon')}
                    className={`flex-1 p-3 rounded-md items-center ml-1 ${
                      dayPeriod === 'afternoon' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <Text className="text-white">Afternoon</Text>
                  </TouchableOpacity>
                </View>

                <Text className="mt-4 text-base">
                  How many hours is the cleaning expected to take?
                </Text>
                <TextInput
                  placeholder="e.g. 3"
                  placeholderTextColor="#999"
                  value={estimatedHours}
                  onChangeText={setEstimatedHours}
                  className="border border-gray-300 p-2 rounded-md mt-2"
                  keyboardType="numeric"
                />
              </View>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-500 p-4 rounded-lg items-center mt-4"
            >
              <Text className="text-white font-bold">Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
