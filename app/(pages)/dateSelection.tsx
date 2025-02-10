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
import TimePickerModal from '../components/TimePickerModal/TimePickerModal'; 

type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

// 把 "8:00 AM" => 480 (分钟)，"12:30 PM" => 750 等等
function parseTime12ToMinutes(timeString: string): number {
  // timeString 一般是 "8:00 AM" / "9:30 PM" 格式
  const [hhmm, ampm] = timeString.split(' ');
  const [hh, mm] = hhmm.split(':');

  const hours = parseInt(hh, 10);
  const minutes = parseInt(mm, 10);
  const isAm = ampm.toUpperCase() === 'AM';

  if (isNaN(hours) || isNaN(minutes)) {
    return 0; // 防御处理
  }

  let hours24;
  if (hours === 12 && isAm) {
    // 12:xx AM => 0:xx
    hours24 = 0;
  } else if (hours === 12 && !isAm) {
    // 12:xx PM => 12:xx
    hours24 = 12;
  } else if (!isAm) {
    // PM 且 不是12 => +12
    hours24 = hours + 12;
  } else {
    // 普通AM => 就是 hours
    hours24 = hours;
  }
  return hours24 * 60 + minutes;
}

export default function DateSelection() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams<{ propertyId?: string }>();

  // exact / before 两个模式
  const [dateOption, setDateOption] = useState<'exact' | 'before'>('exact');

  // exact模式
  const [exactDate, setExactDate] = useState('');
  // before模式
  const [beforeDate, setBeforeDate] = useState('');

  // 下方time picker
  const [startTimeText, setStartTimeText] = useState('');
  const [endTimeText, setEndTimeText] = useState('');

  // 计算出来的差值(小时)，只在 exact 模式使用
  const [calculatedHours, setCalculatedHours] = useState('');

  // before模式下的：上午/下午 + 预计时长
  const [dayPeriod, setDayPeriod] = useState<'morning' | 'afternoon'>('morning'); 
  const [estimatedHours, setEstimatedHours] = useState('');

  // 是否显示 TimePickerModal
  const [timePickerVisible, setTimePickerVisible] = useState(false);


  // 提交逻辑
  const handleSubmit = () => {
    if (dateOption === 'exact') {
      // 1) 校验日期是否选了
      if (!exactDate) {
        Alert.alert('Error', 'Please select a valid date.');
        return;
      }
      // 2) 校验是否选了开始结束时间
      if (!startTimeText || !endTimeText) {
        Alert.alert('Error', 'Please select start & end time.');
        return;
      }
      // 3) 校验是否成功计算到时长(若想再严谨点，可以判断 calculatedHours)
      if (!calculatedHours) {
        Alert.alert('Error', 'Time range is invalid or not set.');
        return;
      }

      // 组装 timeData
      const timeData = {
        dateOption: 'exact',
        exactDate,
        startTimeText,
        endTimeText,
        // 这里把自动计算好的小时数也一起存：
        calculatedHours,
      };

      console.log('Selected time data (exact):', timeData);
      
      router.push({
        pathname: '/takePhotoPage',
        params: { propertyId },
      });
      
    } else {
      // before 模式
      if (!beforeDate) {
        Alert.alert('Error', 'Please select a valid date.');
        return;
      }
      // before模式 需要“预计时长”输入
      if (!estimatedHours || isNaN(Number(estimatedHours)) || Number(estimatedHours) <= 0) {
        Alert.alert('Error', 'Please enter a valid estimated time in hours.');
        return;
      }
      const timeData = {
        dateOption: 'before',
        beforeDate,
        dayPeriod,
        estimatedHours,
      };
      console.log('Selected time data (before):', timeData);
      
      router.push({
        pathname: '/takePhotoPage',
        params: { propertyId },
      });
      
    }
  };

  // 当用户在 TimePickerModal 点 OK 的回调
  const handleTimePicked = (access_time_data: { start_time: string; end_time: string }) => {
    const { start_time, end_time } = access_time_data;
    setStartTimeText(start_time);
    setEndTimeText(end_time);

    // 解析成分钟，做差得到小时
    const startMin = parseTime12ToMinutes(start_time);
    const endMin = parseTime12ToMinutes(end_time);
    const diff = (endMin - startMin) / 60; // 可能得到小数

    // 这里你可以把它格式化一下，比如保留1位小数 or 向上取整 
    // 比如保留一位小数:
    const diffFormatted = diff.toFixed(1);
    setCalculatedHours(diffFormatted);

    // 关闭弹窗
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
                onPress={() => setDateOption('exact')}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: dateOption === 'exact' ? '#4E89CE' : '#ccc',
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
                  backgroundColor: dateOption === 'before' ? '#4E89CE' : '#ccc',
                  marginLeft: 4,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff' }}>Before a date</Text>
              </TouchableOpacity>
            </View>

            {/* ========== EXACT模式 ========== */}
            {dateOption === 'exact' ? (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: '600', marginBottom: 8, fontSize: 18 }}>Select Exact Date</Text>
                <Calendar
                  onDayPress={(day: DateObject) => setExactDate(day.dateString)}
                  markedDates={{
                    [exactDate]: { selected: true, marked: true, selectedColor: '#4E89CE' },
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

                {/* 选择Time Range按钮 */}
                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontWeight: '600', marginBottom: 10, fontSize: 18 }}>Select Time Range</Text>
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
                    <Ionicons name="time-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#fff' }}>Select Start & End Time</Text>
                  </TouchableOpacity>

                  {/* 展示选好的 start-end time + 计算时长 */}
                  {!!startTimeText || !!endTimeText ? (
                    <View style={{ marginTop: 8 }}>
                      <Text style={{ marginBottom: 6, fontSize: 15 }}>
                        Selected Time: {startTimeText} - {endTimeText}
                      </Text>
                      {calculatedHours ? (
                        <Text style={{ fontSize: 15 }}>
                          The cleaning is expected to take{' '}
                          <Text style={{ fontWeight: 'bold' }}>{calculatedHours} hours</Text>.
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            ) : (
              /* ========== BEFORE模式 ========== */
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: '600', marginBottom: 8, fontSize: 18 }}>Select Before Date</Text>
                <Calendar
                  onDayPress={(day: DateObject) => setBeforeDate(day.dateString)}
                  markedDates={{
                    [beforeDate]: { selected: true, marked: true, selectedColor: '#4E89CE' },
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

                <Text style={{ fontWeight: '600', marginTop: 16, fontSize: 18 }}>Morning or Afternoon?</Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => setDayPeriod('morning')}
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor: dayPeriod === 'morning' ? '#4E89CE' : '#ccc',
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
                      backgroundColor: dayPeriod === 'afternoon' ? '#4E89CE' : '#ccc',
                      marginLeft: 4,
                      borderRadius: 6,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff' }}>Afternoon</Text>
                  </TouchableOpacity>
                </View>

                {/* before模式下依旧让用户手填预计时长 */}
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

      {/* ========== TimePickerModal 弹窗 ========== */}
      {timePickerVisible && (
        <TimePickerModal
          // 让初始值为空
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
          // 如果你不想用这个数据，可以删除
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
          // 用户点OK以后
          onPressOkFn={handleTimePicked}
          // 用户点Cancel时，如果想关闭弹窗
          onPressCancelFn={() => setTimePickerVisible(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}
