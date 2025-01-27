import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';

type DateObject = {
  dateString: string; // 日期字符串，格式为 YYYY-MM-DD
  day: number;        // 日期中的日（1-31）
  month: number;      // 日期中的月（1-12）
  year: number;       // 日期中的年（完整年份）
  timestamp: number;  // 时间戳
};

export default function DateSelection() {
  const router = useRouter();

  const [dateOption, setDateOption] = useState<'exact' | 'before'>('exact');
  const [exactDate, setExactDate] = useState('');
  const [beforeDate, setBeforeDate] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [dayPeriod, setDayPeriod] = useState<'morning' | 'afternoon'>('morning'); // 新增

  const handleSubmit = () => {
    if (!exactDate && dateOption === 'exact') {
      Alert.alert('Error', 'Please select a valid date.');
      return;
    }
    if (!beforeDate && dateOption === 'before') {
      Alert.alert('Error', 'Please select a valid date.');
      return;
    }
    if (!estimatedHours || isNaN(Number(estimatedHours)) || Number(estimatedHours) <= 0) {
      Alert.alert('Error', 'Please enter a valid estimated time in hours.');
      return;
    }

    let timeData;
    if (dateOption === 'exact') {
      timeData = {
        dateOption: 'exact',
        exactDate,
        timeRange,
        estimatedHours,
      };
    } else {
      timeData = {
        dateOption: 'before',
        beforeDate,
        dayPeriod, // 新增
        estimatedHours,
      };
    }

    console.log('Selected time data:', timeData);
    router.push('/takePhotoPage');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
        Please select your cleaning time
      </Text>

      {/* 两个选项按钮： exact / before */}
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setDateOption('exact')}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: dateOption === 'exact' ? '#007BFF' : '#ccc',
            marginRight: 4,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff' }}>Exact date & time</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setDateOption('before')}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: dateOption === 'before' ? '#007BFF' : '#ccc',
            marginLeft: 4,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff' }}>Before a date</Text>
        </TouchableOpacity>
      </View>

      {dateOption === 'exact' ? (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Select Exact Date</Text>
          <Calendar
            onDayPress={(day: DateObject) => setExactDate(day.dateString)}
            markedDates={{
              [exactDate]: { selected: true, marked: true, selectedColor: '#007BFF' },
            }}
            theme={{
              todayTextColor: '#FF7E7E',
              arrowColor: '#007BFF',
            }}
          />
          <Text style={{ marginTop: 16, fontSize: 16 }}>
            Selected Date: {exactDate || 'None'}
          </Text>
          <Text style={{ fontWeight: '600', marginTop: 16 }}>Time range (e.g. 9AM - 12PM)</Text>
          <TextInput
            placeholder="e.g. 9:00 - 12:00"
            value={timeRange}
            onChangeText={setTimeRange}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 6,
              marginTop: 8,
            }}
          />
        </View>
      ) : (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Select Before Date</Text>
          <Calendar
            onDayPress={(day: DateObject) => setBeforeDate(day.dateString)}
            markedDates={{
              [beforeDate]: { selected: true, marked: true, selectedColor: '#007BFF' },
            }}
            theme={{
              todayTextColor: '#FF7E7E',
              arrowColor: '#007BFF',
            }}
          />
          <Text style={{ marginTop: 16, fontSize: 16 }}>
            Selected Date: {beforeDate || 'None'}
          </Text>

          {/* Morning or Afternoon Buttons */}
          <Text style={{ fontWeight: '600', marginTop: 16 }}>Morning or Afternoon?</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => setDayPeriod('morning')}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: dayPeriod === 'morning' ? '#007BFF' : '#ccc',
                marginRight: 4,
                borderRadius: 6,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff' }}>Morning</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDayPeriod('afternoon')}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: dayPeriod === 'afternoon' ? '#007BFF' : '#ccc',
                marginLeft: 4,
                borderRadius: 6,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff' }}>Afternoon</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Estimated Time */}
      <Text style={{ fontWeight: '600' }}>How long do you expect the cleaning will take? (hours)</Text>
      <TextInput
        placeholder="e.g. 3"
        value={estimatedHours}
        onChangeText={setEstimatedHours}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          borderRadius: 6,
          marginVertical: 8,
        }}
        keyboardType="numeric"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: '#28A745',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
