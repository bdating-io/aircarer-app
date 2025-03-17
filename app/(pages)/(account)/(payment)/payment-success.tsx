import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function PaymentSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // 从路由参数获取金额
  const amount = params.amount ? Number(params.amount) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AntDesign name="checkcircle" size={80} color="#4CD964" />
        
        <Text style={styles.title}>Payment Successful</Text>
        
        <Text style={styles.amount}>${(amount / 100).toFixed(2)}</Text>
        
        <Text style={styles.message}>
          Thank you for your payment. Your transaction has been completed successfully.
        </Text>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/home')}
        >
          <Text style={styles.buttonText}>Return Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 24
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24
  },
  footer: {
    padding: 16
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
}); 