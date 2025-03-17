import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/clients/supabase';

export default function AddPayment() {
  const router = useRouter();
  const [type, setType] = useState<'credit' | 'bsb'>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [bsb, setBsb] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSave = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const paymentData =
        type === 'credit'
          ? {
              type: 'credit',
              card_last4: cardNumber.slice(-4),
              user_id: user.id,
            }
          : {
              type: 'bsb',
              bsb: bsb,
              account_number_last4: accountNumber.slice(-4),
              user_id: user.id,
            };

      const { error } = await supabase
        .from('payment_methods')
        .insert(paymentData);

      if (error) throw error;

      Alert.alert('Success', 'Payment method added');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save payment method');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold mt-2">Add Payment Method</Text>
      </View>

      <View className="p-4">
        <View className="flex-row mb-4">
          <TouchableOpacity
            className={`flex-1 p-4 ${type === 'credit' ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => setType('credit')}
          >
            <Text className={type === 'credit' ? 'text-white' : 'text-black'}>
              Credit Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-4 ${type === 'bsb' ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => setType('bsb')}
          >
            <Text className={type === 'bsb' ? 'text-white' : 'text-black'}>
              Bank Account
            </Text>
          </TouchableOpacity>
        </View>

        {type === 'credit' ? (
          <TextInput
            className="border p-4 rounded-lg mb-4"
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
          />
        ) : (
          <>
            <TextInput
              className="border p-4 rounded-lg mb-4"
              placeholder="BSB"
              value={bsb}
              onChangeText={setBsb}
              keyboardType="number-pad"
            />
            <TextInput
              className="border p-4 rounded-lg mb-4"
              placeholder="Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="number-pad"
            />
          </>
        )}

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mt-4"
          onPress={handleSave}
        >
          <Text className="text-white text-center">Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
