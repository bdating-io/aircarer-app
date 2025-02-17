import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useBookingContext } from '../../components/BookingContext';

export default function SpecialRequestPage() {
  const router = useRouter();
  const { bookingData, setSpecialRequests } = useBookingContext();

  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState('');

  // 选项清单
  const requests = [
    'Pet fur cleaning',
    'Carpet steaming',
    'Range hood cleaning',
    'Oven cleaning',
    'Outdoor cleaning',
  ];

  const toggleRequest = (request: string) => {
    if (selectedRequests.includes(request)) {
      setSelectedRequests(selectedRequests.filter((item) => item !== request));
    } else {
      setSelectedRequests([...selectedRequests, request]);
    }
  };

  const handleNext = () => {
    if (selectedRequests.length === 0 && customRequest.trim() === '') {
      Alert.alert('Error', 'Please select at least one special request or enter a custom request.');
      return;
    }

    // Store in the global context
    setSpecialRequests(selectedRequests, customRequest.trim());

    // 跳转到下一页
    router.push('/budgetPage');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Special Request</Text>

      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Do you need any of the following?</Text>

      {/* 特殊请求选项按钮 */}
      {requests.map((request) => (
        <TouchableOpacity
          key={request}
          onPress={() => toggleRequest(request)}
          style={{
            padding: 12,
            backgroundColor: selectedRequests.includes(request) ? '#4E89CE' : '#ccc',
            borderRadius: 8,
            marginBottom: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{request}</Text>
        </TouchableOpacity>
      ))}

      {/* 自定义输入框 */}
      <Text style={{ fontWeight: '600', marginTop: 16, marginBottom: 4 }}>
        Please specify any other special requirements (maximum 250 words)
      </Text>
      <TextInput
        placeholder="Enter your custom request here..."
        value={customRequest}
        onChangeText={setCustomRequest}
        multiline
        numberOfLines={4}
        maxLength={250}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#fff',
          textAlignVertical: 'top',
          marginBottom: 16,
        }}
      />

      {/* 下一步按钮 */}
      <TouchableOpacity
        onPress={handleNext}
        style={{
          backgroundColor: '#4E89CE',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
