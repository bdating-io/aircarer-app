import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { supabase } from '@/clients/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'bsb';
  card_last4?: string;
  card_expiry?: string;
  bsb?: string;
  account_number_last4?: string;
  is_default: boolean;
}

export default function PaymentMethods() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      Alert.alert('Error', 'Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 更新本地列表
      setPaymentMethods((prevMethods) =>
        prevMethods.filter((method) => method.id !== id),
      );

      Alert.alert('Success', 'Payment method deleted successfully');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      Alert.alert('Error', 'Failed to delete payment method');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Text className="text-xl font-semibold flex-1">Payment Methods</Text>
        <AntDesign name="edit" size={20} color="#4A90E2" />
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : paymentMethods.length > 0 ? (
        <ScrollView className="flex-1 p-4">
          {paymentMethods.map((method) => (
            <View
              key={method.id}
              className="flex-row items-center border border-gray-200 rounded-lg p-4 mb-4"
            >
              {method.type === 'credit' ? (
                <View className="flex-row items-center flex-1">
                  <MaterialCommunityIcons
                    name="credit-card"
                    size={24}
                    color="#4A90E2"
                  />
                  <View className="ml-3">
                    <Text className="font-medium">
                      •••• •••• •••• {method.card_last4}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      Expires: {method.card_expiry}
                    </Text>
                  </View>
                  {method.is_default && (
                    <View className="ml-auto bg-blue-100 px-2 py-1 rounded">
                      <Text className="text-blue-600 text-xs">Default</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View className="flex-row items-center flex-1">
                  <Ionicons name="wallet-outline" size={24} color="#4A90E2" />
                  <View className="ml-3">
                    <Text className="font-medium">BSB: {method.bsb}</Text>
                    <Text className="text-gray-500 text-sm">
                      Account: •••• {method.account_number_last4}
                    </Text>
                  </View>
                  {method.is_default && (
                    <View className="ml-auto bg-blue-100 px-2 py-1 rounded">
                      <Text className="text-blue-600 text-xs">Default</Text>
                    </View>
                  )}
                </View>
              )}
              <TouchableOpacity
                className="ml-2"
                onPress={() => {
                  Alert.alert(
                    'Delete Payment Method',
                    'Are you sure you want to delete this payment method?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => deletePaymentMethod(method.id),
                      },
                    ],
                  );
                }}
                disabled={isDeleting}
              >
                <AntDesign name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-500 text-center mb-6">
            No payment methods saved yet
          </Text>
        </View>
      )}

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="border border-gray-300 rounded-lg p-4 mb-4 flex-row items-center justify-center"
          onPress={() =>
            router.push('/(pages)/(account)/(payment)/select-method')
          }
        >
          <AntDesign name="plus" size={20} color="#4A90E2" />
          <Text className="text-blue-500 ml-2">Add new payment method</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 mb-4"
          onPress={() =>
            router.push({
              pathname: '/(pages)/(account)/(payment)/stripe-payment',
              params: {
                amount: 2500, // $25.00，以分为单位
                description: 'Premium Subscription',
              },
            })
          }
        >
          <Text className="text-white text-center">Pay with Stripe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={() => router.push('/(tabs)/home')}
        >
          <Text className="text-white text-center">Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
