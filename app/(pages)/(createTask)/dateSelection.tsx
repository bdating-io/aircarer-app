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
import { Calendar } from 'react-native-calendars';
import Ionicons from '@expo/vector-icons/Ionicons';
import TimePickerModal from '../../../components/TimePickerModal/TimePickerModal';
import { supabase } from '@/clients/supabase';

type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

// 把 "8:00 AM" => 480 (分钟)，"12:30 PM" => 750
function parseTime12ToMinutes(timeString: string): number {
  const [hhmm, ampm] = timeString.split(' ');
  const [hh, mm] = hhmm.split(':');

  const hours = parseInt(hh, 10);
  const minutes = parseInt(mm, 10);
  const isAm = ampm.toUpperCase() === 'AM';
  if (isNaN(hours) || isNaN(minutes)) return 0;

  let hours24;
  if (hours === 12 && isAm) {
    // 12:xx AM => 0:xx
    hours24 = 0;
  } else if (hours === 12 && !isAm) {
    // 12:xx PM => 12:xx
    hours24 = 12;
  } else if (!isAm) {
    // PM 且不是12 => +12
    hours24 = hours + 12;
  } else {
    hours24 = hours;
  }
  return hours24 * 60 + minutes;
}

export default function DateSelection() {
  const router = useRouter();
  // 从路由参数拿到 taskId（和 propertyId）
  const { taskId, propertyId } = useLocalSearchParams<{
    taskId?: string;
    propertyId?: string;
  }>();

  // exact / before 两个模式
  const [dateOption, setDateOption] = useState<'Exact' | 'Before'>('Exact');

  // exact模式
  const [exactDate, setExactDate] = useState('');
  // before模式
  const [beforeDate, setBeforeDate] = useState('');

  // 下方time picker
  const [startTimeText, setStartTimeText] = useState('');
  const [endTimeText, setEndTimeText] = useState('');

  // 自动计算出的时长(小时)，仅 exact 模式
  const [calculatedHours, setCalculatedHours] = useState('');

  // before模式下: 上午/下午 + 预计时长
  const [dayPeriod, setDayPeriod] = useState<'morning' | 'afternoon'>(
    'morning',
  );
  const [estimatedHours, setEstimatedHours] = useState('');

  // 控制 TimePickerModal 显示
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // 点击 "Next" 时，更新 tasks 里对应行
  const handleSubmit = async () => {
    // 1) 确保有 taskId
    if (!taskId) {
      Alert.alert('Error', 'No taskId provided in route params.');
      return;
    }

    // 2) 如果是 EXACT
    if (dateOption === 'Exact') {
      if (!exactDate) {
        Alert.alert('Error', 'Please select a valid date.');
        return;
      }
      if (!startTimeText || !endTimeText || !calculatedHours) {
        Alert.alert(
          'Error',
          'Please select start/end time and ensure hours are calculated.',
        );
        return;
      }

      // 这里把 exactDate + startTimeText 组合成 timestamptz
      // 简化做法：只把 date + "T" + "00:00:00" 存起来
      // 或者真正把 startTimeText 解析成小时分钟后加到 exactDate
      const startTimeMinutes = parseTime12ToMinutes(startTimeText);
      // 计算当日 0点 + startTimeMinutes
      const [year, month, day] = exactDate.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day, 0, 0);
      dateObj.setMinutes(startTimeMinutes);
      // 这就是 scheduled_start_time

      // parseInt(estimated hours) or parseFloat
      const hoursNum = parseFloat(calculatedHours);

      try {
        // EXACT 模式更新：同时更新 scheduled_start_time 和 scheduled_start_date
        const { error } = await supabase
          .from('tasks')
          .update({
            schedule_mode: 'Exact',
            scheduled_start_time: dateObj.toISOString(),
            scheduled_start_date: exactDate, // 改为保存 exactDate
            scheduled_period: null,
            estimated_hours: hoursNum,
          })
          .eq('task_id', taskId)
          .select('*')
          .single();

        if (error) throw error;
        Alert.alert('Success', 'Updated with EXACT schedule!');

        // 跳转到下一步 takePhotoPage
        router.push({
          pathname: '/(pages)/(createTask)/takePhotoPage',
          params: { propertyId, taskId }, // 继续传给下个页面
        });
      } catch (err) {
        console.error(err);
        Alert.alert('Error updating tasks', 'Please try again.');
      }
    } else {
      // 3) 如果是 BEFORE
      if (!beforeDate) {
        Alert.alert('Error', "Please select a valid date for 'before'.");
        return;
      }
      if (
        !estimatedHours ||
        isNaN(Number(estimatedHours)) ||
        Number(estimatedHours) <= 0
      ) {
        Alert.alert('Error', 'Please enter a valid estimated time in hours.');
        return;
      }

      const hoursNum = parseFloat(estimatedHours);

      try {
        // BEFORE 模式更新：同时更新 scheduled_start_time 和 scheduled_start_date
        // scheduled_start_time 根据 dayPeriod 采用默认时间（morning 默认 "08:00:00"，afternoon 默认 "14:00:00"）
        const { error } = await supabase
          .from('tasks')
          .update({
            schedule_mode: 'Before',
            scheduled_start_time: new Date(
              beforeDate +
                'T' +
                (dayPeriod === 'morning' ? '08:00:00' : '14:00:00'),
            ).toISOString(),
            scheduled_start_date: beforeDate,
            scheduled_period: dayPeriod === 'morning' ? 'Morning' : 'Afternoon',
            estimated_hours: hoursNum,
          })
          .eq('task_id', taskId)
          .select('*')
          .single();

        if (error) throw error;
        Alert.alert('Success', 'Updated with BEFORE schedule!');

        // 跳转下一页
        router.push({
          pathname: '/(pages)/(createTask)/takePhotoPage',
          params: { propertyId, taskId },
        });
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to update tasks. Please try again.');
      }
    }
  };

  // TimePickerModal 点 OK 的回调
  const handleTimePicked = (access_time_data: {
    start_time: string;
    end_time: string;
  }) => {
    const { start_time, end_time } = access_time_data;
    setStartTimeText(start_time);
    setEndTimeText(end_time);

    // 解析成分钟
    const startMin = parseTime12ToMinutes(start_time);
    const endMin = parseTime12ToMinutes(end_time);
    const diffHours = (endMin - startMin) / 60;
    setCalculatedHours(diffHours.toFixed(1));

    setTimePickerVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 19, fontWeight: '600', marginBottom: 12 }}>
              Looking for an exact date?
            </Text>

            {/* exact / before 选项 */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setDateOption('Exact')}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: dateOption === 'Exact' ? '#4E89CE' : '#ccc',
                  marginRight: 4,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff' }}>Exact date & time</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDateOption('Before')}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: dateOption === 'Before' ? '#4E89CE' : '#ccc',
                  marginLeft: 4,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff' }}>Before a date</Text>
              </TouchableOpacity>
            </View>

            {dateOption === 'Exact' ? (
              // ========== EXACT模式 ==========
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{ fontWeight: '600', marginBottom: 8, fontSize: 18 }}
                >
                  Select Exact Date
                </Text>
                <Calendar
                  onDayPress={(day: DateObject) => setExactDate(day.dateString)}
                  markedDates={{
                    [exactDate]: {
                      selected: true,
                      marked: true,
                      selectedColor: '#4E89CE',
                    },
                  }}
                  minDate={new Date().toISOString().split('T')[0]}
                  theme={{
                    todayTextColor: '#FF7E7E',
                    arrowColor: '#4E89CE',
                  }}
                />
                <Text style={{ marginTop: 16, fontSize: 15 }}>
                  Selected Date: {exactDate || 'None'}
                </Text>

                {/* Time Range按钮 */}
                <View style={{ marginTop: 16 }}>
                  <Text
                    style={{
                      fontWeight: '600',
                      marginBottom: 10,
                      fontSize: 18,
                    }}
                  >
                    Select Time Range
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTimePickerVisible(true)}
                    style={{
                      backgroundColor: '#4E89CE',
                      padding: 12,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={{ color: '#fff' }}>
                      Select Start & End Time
                    </Text>
                  </TouchableOpacity>

                  {(startTimeText || endTimeText) && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={{ marginBottom: 6, fontSize: 15 }}>
                        Selected Time: {startTimeText} - {endTimeText}
                      </Text>
                      {calculatedHours && (
                        <Text style={{ fontSize: 15 }}>
                          The cleaning is expected to take{' '}
                          <Text style={{ fontWeight: 'bold' }}>
                            {calculatedHours} hours
                          </Text>
                          .
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            ) : (
              // ========== BEFORE模式 ==========
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{ fontWeight: '600', marginBottom: 8, fontSize: 18 }}
                >
                  Select Before Date
                </Text>
                <Calendar
                  onDayPress={(day: DateObject) =>
                    setBeforeDate(day.dateString)
                  }
                  markedDates={{
                    [beforeDate]: {
                      selected: true,
                      marked: true,
                      selectedColor: '#4E89CE',
                    },
                  }}
                  minDate={new Date().toISOString().split('T')[0]}
                  theme={{
                    todayTextColor: '#4E89CE',
                    arrowColor: '#4E89CE',
                  }}
                />
                <Text style={{ marginTop: 16, fontSize: 15 }}>
                  Selected Date: {beforeDate || 'None'}
                </Text>

                <Text
                  style={{ fontWeight: '600', marginTop: 16, fontSize: 18 }}
                >
                  Morning or Afternoon?
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => setDayPeriod('morning')}
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor:
                        dayPeriod === 'morning' ? '#4E89CE' : '#ccc',
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
                      backgroundColor:
                        dayPeriod === 'afternoon' ? '#4E89CE' : '#ccc',
                      marginLeft: 4,
                      borderRadius: 6,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff' }}>Afternoon</Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ marginTop: 16, fontSize: 15 }}>
                  How many hours is the cleaning expected to take?
                </Text>
                <TextInput
                  placeholder="e.g. 3"
                  placeholderTextColor="#999"
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
              </View>
            )}

            {/* 提交按钮 */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: '#4E89CE',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {timePickerVisible && (
        <TimePickerModal
          start_time_separation_data={{
            hours: '',
            minutes: '',
            is_am: true,
            is_pm: false,
          }}
          end_time_separation_data={{
            hours: '',
            minutes: '',
            is_am: true,
            is_pm: false,
          }}
          app_accessing_time_data={{
            agent_access_start_ts: null,
            agent_access_end_ts: null,
          }}
          time_modal_localization={{
            app_access_time_title: 'Select Time Range',
            start_time_title: 'Start Time',
            end_time_title: 'End Time',
            cancelButtonTxt: 'Cancel',
            okButtonText: 'OK',
          }}
          onPressOkFn={handleTimePicked}
          onPressCancelFn={() => setTimePickerVisible(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}
