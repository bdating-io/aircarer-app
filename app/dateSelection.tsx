// app/dateSelection.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';


export default function DateSelection() {
  const router = useRouter();

  // 选项： 'exact' or 'before'
  const [dateOption, setDateOption] = useState<'exact' | 'before'>('exact');

  // 当用户选 'exact' 时，可以输入具体日期/时间区间
  const [exactDate, setExactDate] = useState('');
  const [timeRange, setTimeRange] = useState('');

  // 当用户选 'before' 时，可以输入截止日期 + 早上/下午
  const [beforeDate, setBeforeDate] = useState('');
  const [dayPeriod, setDayPeriod] = useState<'morning' | 'afternoon'>('morning');

  // 预估时长
  const [estimatedHours, setEstimatedHours] = useState('');

  const handleSubmit = () => {
    const isValidDate = (dateString: string): boolean => {
      const regex = /^\d{2}\/\d{2}\/\d{4}$/; // 检查是否符合 DD/MM/YYYY 格式
      if (!regex.test(dateString)) return false;
    
      const [day, month, year] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    };
    

    if (dateOption === 'exact' && !isValidDate(exactDate)) {
      Alert.alert('Error', 'Please enter a valid exact date in DD/MM/YYYY format.');
      return;
    }
    if (dateOption === 'before' && !isValidDate(beforeDate)) {
      Alert.alert('Error', 'Please enter a valid before date in DD/MM/YYYY format.');
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
        dayPeriod,
        estimatedHours,
      };
    }

    console.log('Selected time data:', timeData);

    // TODO: 这里可以把 timeData 发送到后端，或存到全局状态

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
        /* 如果选了 Exact，就显示这块表单 */
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '600' }}>Exact date</Text>
          <TextInput
            placeholder="DD/MM/YYYY"
            value={exactDate}
            onChangeText={setExactDate}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 6,
              marginVertical: 8,
            }}
          />

          <Text style={{ fontWeight: '600' }}>Time range (e.g. 9AM - 12PM)</Text>
          <TextInput
            placeholder="e.g. 9:00 - 12:00"
            value={timeRange}
            onChangeText={setTimeRange}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 6,
              marginVertical: 8,
            }}
          />
        </View>
      ) : (
        /* 如果选了 Before a date，就显示这块表单 */
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '600' }}>Before date</Text>
          <TextInput
            placeholder="DD/MM/YYYY"
            value={beforeDate}
            onChangeText={setBeforeDate}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 6,
              marginVertical: 8,
            }}
          />

          <Text style={{ fontWeight: '600' }}>Morning or Afternoon?</Text>
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

      {/* 预估时长 */}
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
