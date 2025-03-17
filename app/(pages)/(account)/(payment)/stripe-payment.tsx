import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";

// API配置 (实际环境中应从环境变量或配置文件获取)
const API_URL = "https://your-backend-api.com";

export default function StripePayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(true);

  // 从路由参数获取金额
  const amount = params.amount ? Number(params.amount) : 0;
  const description = (params.description as string) || "Payment";

  useEffect(() => {
    if (amount > 0) {
      initializePayment();
    } else {
      Alert.alert("Invalid amount", "Please provide a valid payment amount");
      router.back();
    }
  }, [amount]);

  const createPaymentIntent = async (
    amount: number,
    currency: string = "aud"
  ) => {
    try {
      const response = await axios.post(`${API_URL}/create-payment-intent`, {
        amount,
        currency,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  };

  const initializePayment = async () => {
    try {
      setLoading(true);

      // 从后端获取PaymentIntent
      const { clientSecret } = await createPaymentIntent(amount);

      // 初始化支付表单
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Your App Name",
        defaultBillingDetails: {
          name: "", // 可从用户数据预填
        },
      });

      if (error) {
        Alert.alert("Error", error.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // 打开支付表单
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code !== "Canceled") {
          Alert.alert("Error", error.message);
        }
        // 用户取消不显示错误
      } else {
        router.push({
          pathname: "/(pages)/(account)/(payment)/payment-success",
          params: { amount },
        });
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Payment Summary</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Item:</Text>
            <Text style={styles.value}>{description}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.amount}>${(amount / 100).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.disabledButton]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay ${(amount / 100).toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
  },
  amount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A90E2",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },
  payButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A0BFE0",
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
