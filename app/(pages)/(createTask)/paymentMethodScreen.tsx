import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/styles"; 
import NextButton from "../../styles/nextButton";

import { NavigationProp } from "@react-navigation/native";

const PaymentMethodScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("Add new payment method");

  const paymentMethods = [
    { id: "1", label: "BSB and Account Number" },
    { id: "2", label: "Credit Card" },
    { id: "3", label: "PayPal" },
  ];

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    setDropdownOpen(false);
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

      <NextButton
        title="Next"
        onPress={() => navigation.navigate("NextScreen")}
        style={styles.nextButton}
      />
    </View>
  );
};

export default PaymentMethodScreen;
