import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/clients/supabase';
import KeyboardAwareView from './components/KeyboardAwareView';

export default function AddBankAccount() {
  const router = useRouter();
  const [bsb, setBsb] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveBankAccount = async () => {
    try {
      setIsLoading(true);

      // 基本验证
      if (!bsb || !accountNumber) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }

      // BSB 格式验证
      if (!/^\d{6}$/.test(bsb.replace(/-/g, ''))) {
        Alert.alert('Error', 'BSB must be 6 digits');
        return;
      }

      // 获取当前用户
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      // 创建支付方式记录
      const { error } = await supabase.from('payment_methods').insert({
        user_id: user.id,
        type: 'bsb',
        bsb: bsb,
        account_number_last4: accountNumber.slice(-4),
        is_default: isDefault,
      });

      if (error) throw error;

      Alert.alert('Success', 'Bank account added successfully');
      router.push('/(pages)/(account)/(payment)');
    } catch (error) {
      console.error('Error saving bank account:', error);
      Alert.alert('Error', 'Failed to save bank account');
    } finally {
      setIsLoading(false);
    }
  };

  // BSB格式化: XXX-XXX
  const handleBsbChange = (text: string) => {
    // 移除所有非数字字符
    const cleaned = text.replace(/\D/g, '');

    // 添加格式化
    if (cleaned.length <= 3) {
      setBsb(cleaned);
    } else {
      setBsb(`${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareView>
        <View className="flex-row items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold ml-4">Add Bank Account</Text>
        </View>

        <View className="flex-1 p-4">
          <Text className="text-sm text-gray-500 mb-1">BSB</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 mb-4"
            placeholder="123-456"
            value={bsb}
            onChangeText={handleBsbChange}
            keyboardType="number-pad"
            maxLength={7} // XXX-XXX
          />

          <Text className="text-sm text-gray-500 mb-1">Account Number</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 mb-4"
            placeholder="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="number-pad"
          />

          <TouchableOpacity
            className="flex-row items-center mb-6"
            onPress={() => setIsDefault(!isDefault)}
          >
            <View
              className={`w-5 h-5 border rounded mr-2 ${
                isDefault ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
              }`}
            >
              {isDefault && <AntDesign name="check" size={16} color="white" />}
            </View>
            <Text>Set this payment method as default</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareView>

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={saveBankAccount}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center">Save Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
