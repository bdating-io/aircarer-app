import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// 示例支付方式
const paymentMethods = [
  { id: "1", label: "Add New Card (Stripe Placeholder)" },
  { id: "2", label: "BSB and Account Number" },
  { id: "3", label: "PayPal" },
];

export default function PaymentMethodScreen() {
  const router = useRouter();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("Add new payment method");

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    setDropdownOpen(false);
  };

  const handleNextPress = () => {
    // 这里可以将 selectedMethod 上传到数据库或执行别的逻辑
    // 未来可以在这里插入 Stripe 相关的处理，比如 createPaymentMethod, confirmPaymentIntent 等

    // 暂时先跳转回首页
    router.push("/(tabs)/home");
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
        In the future, we can integrate Stripe checkout or PaymentIntents here 
        to handle card details and confirm the payment securely.
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
