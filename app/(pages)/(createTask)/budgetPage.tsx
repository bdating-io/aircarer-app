import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
<<<<<<< HEAD:app/(pages)/(createTask)/budgetPage.tsx
import { useBookingContext } from '../../components/BookingContext';
import { calculateCleaningPrice } from '../../utilities/priceCalculator';
=======
>>>>>>> parent of ab556a4 (updated):app/budgetPage.tsx

export default function BudgetPage() {
  const router = useRouter();
  const [budget, setBudget] = useState('');

  const handleNext = () => {
    // 验证预算输入
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget greater than $0.');
      return;
    }

    console.log('Budget:', budget);

    // 跳转到下一页
    router.push('/paymentMethodScreen');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Enter your budget</Text>
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>
        Don’t worry, you can always negotiate the final price later.
      </Text>

      {/* 预算输入框 */}
      <TextInput
        placeholder="$0"
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#fff',
          fontSize: 18,
          textAlign: 'center',
          marginBottom: 24,
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
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
