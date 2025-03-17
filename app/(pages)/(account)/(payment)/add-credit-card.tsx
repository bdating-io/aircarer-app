import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";

export default function AddCreditCard() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardNumberChange = (text: string) => {
    // 格式化卡号为4位一组
    const formattedText = text
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setCardNumber(formattedText);
  };

  const handleExpiryChange = (text: string) => {
    // 格式化为MM/YY
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      setExpiry(cleaned);
    } else {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    }
  };

  const saveCreditCard = async () => {
    try {
      setIsLoading(true);

      // 基本验证
      if (!cardNumber || !expiry || !cvv || !cardHolderName) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      // 获取当前用户
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // 创建支付方式记录
      const { error } = await supabase.from("payment_methods").insert({
        user_id: user.id,
        type: "credit",
        card_last4: cardNumber.replace(/\s/g, "").slice(-4),
        card_expiry: expiry,
        card_holder_name: cardHolderName,
        is_default: isDefault,
      });

      if (error) throw error;

      Alert.alert("Success", "Credit card added successfully");
      router.push("/(pages)/(account)/(payment)");
    } catch (error) {
      console.error("Error saving credit card:", error);
      Alert.alert("Error", "Failed to save credit card");
    } finally {
      setIsLoading(false);
    }
  };

  const showCVVInfo = () => {
    router.push("/(pages)/(account)/(payment)/cvv-info");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">Add Credit Card</Text>
      </View>

      <View className="flex-1 p-4">
        <Text className="text-sm text-gray-500 mb-1">16 digit number</Text>

        <View className="flex-row space-x-4 mb-6">
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1">Expiration date</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4"
              placeholder="MM/YY"
              value={expiry}
              onChangeText={handleExpiryChange}
              keyboardType="number-pad"
              maxLength={5} // MM/YY
            />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-sm text-gray-500">CVV/CVC</Text>
              <TouchableOpacity className="ml-2" onPress={showCVVInfo}>
                <AntDesign name="questioncircleo" size={16} color="gray" />
              </TouchableOpacity>
            </View>
            <TextInput
              className="border border-gray-300 rounded-lg p-4"
              placeholder="123"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <Text className="text-sm text-gray-500 mb-1">Cardholder name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          placeholder="Name on card"
          value={cardHolderName}
          onChangeText={setCardHolderName}
          autoCapitalize="words"
        />

        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => setIsDefault(!isDefault)}
        >
          <View
            className={`w-5 h-5 border rounded mr-2 ${
              isDefault ? "bg-blue-500 border-blue-500" : "border-gray-300"
            }`}
          >
            {isDefault && <AntDesign name="check" size={16} color="white" />}
          </View>
          <Text>Set this payment method as default</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={saveCreditCard}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center">Save Card</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
