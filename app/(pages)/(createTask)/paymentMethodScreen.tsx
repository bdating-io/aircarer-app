import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStripe, PaymentSheetError } from "@stripe/stripe-react-native";
import useStore from '@/utils/store';
import { SUPABASE_URL } from '@/clients/supabase';

// 示例支付方式
const paymentMethods = [
  { id: "1", label: "Credit Card" },
  { id: "2", label: "Direct Deposit" },
  { id: "3", label: "PayPal" },
];

const PAYMENT_API_URL = `${SUPABASE_URL}/functions/v1/payments`;

export default function PaymentMethodScreen() {
  const router = useRouter();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("Add new payment method");
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { mySession } = useStore();

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Aircarer",
      defaultBillingDetails: {
        address: {
          country: 'AU',
        },
      },
      returnURL: 'aircarer://stripe-redirect',
      intentConfiguration: {
        mode: {
          amount: 1099,
          currencyCode: 'AUD',
          captureMethod: 'Automatic'
        },
        confirmHandler: confirmHandler
      }
    });
    if (error) {
      console.error("Error initializing PaymentSheet:", error);
    }
  };

  const confirmHandler = async (paymentMethod, shouldSavePaymentMethod, intentCreationCallback) => {
    console.log('confirmHandler', paymentMethod, shouldSavePaymentMethod);
    const response = await fetch(`${PAYMENT_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mySession.access_token}`
      },
      body: JSON.stringify(
        {
          action: 'create-payment-intent',
          paymentMethod,
          amount: 1099,
          currency: 'AUD',
          paymentMethodType: 'card',
          paymentMethodOptions: {}
        }
      )
    });
    // Call the `intentCreationCallback` with your server response's client secret or error
    const { clientSecret, error } = await response.json();
    // console.error('client_secret', clientSecret);
    if(error) console.error('error', error);
    if (clientSecret) {
      intentCreationCallback({ clientSecret: clientSecret });
    } else {
      intentCreationCallback({ error });
    }
  }

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    setDropdownOpen(false);
  };

  const handleNextPress = async () => {
    // 这里可以将 selectedMethod 上传到数据库或执行别的逻辑
    // 未来可以在这里插入 Stripe 相关的处理，比如 createPaymentMethod, confirmPaymentIntent 等

    // 暂时先跳转回首页
    //router.push("/(tabs)/home");
    if (selectedMethod === "Credit Card") {
      const { error } = await presentPaymentSheet();

      if (error) {
        console.error("Error:", error);
        if (error.code === PaymentSheetError.Canceled) {
          // Customer canceled - you should probably do nothing.
        } else {
          // PaymentSheet encountered an unrecoverable error. You can display the error to the user, log it, etc.
        }
      } else {
        // Payment completed - show a confirmation screen.
      }

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.dropdownText}>{selectedMethod}</Text>
        <Ionicons
          name={isDropdownOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#000"
        />
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdownMenu}>
          <FlatList
            data={paymentMethods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectMethod(item.label)}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* 在这留个位置给以后接入 Stripe */}
      <Text style={styles.infoText}>
        {/* In the future, we can integrate Stripe checkout or PaymentIntents here
        to handle card details and confirm the payment securely. */}
      </Text>

      {/* Next button => push to homepage */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 你可以自定义样式，也可保留原先的 styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#4E89CE",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#000",
  },
  infoText: {
    fontStyle: "italic",
    color: "#444",
    marginVertical: 16,
  },
  nextButton: {
    backgroundColor: "#4E89CE",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
