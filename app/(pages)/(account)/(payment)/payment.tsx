import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

type PaymentMethod = "bsb" | "credit" | null;

export default function Payment() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
    bsb: "",
    accountNumber: "",
  });

  const renderStep1 = () => (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">Create Profile</Text>
      </View>

      <Text className="text-lg mb-4">Payment Method</Text>
      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-4 mb-4"
        onPress={() => setStep(2)}
      >
        <Text className="text-blue-500">+ Add new payment method</Text>
      </TouchableOpacity>

      <View className="mt-auto">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={() => setStep(2)}
        >
          <Text className="text-white text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => setStep(1)}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">Create Profile</Text>
      </View>

      <Text className="text-lg mb-4">Payment Method</Text>
      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-4 mb-4"
        onPress={() => {
          setPaymentMethod("bsb");
          setStep(3);
        }}
      >
        <Text>BSB and Account Number</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-4 mb-4"
        onPress={() => {
          setPaymentMethod("credit");
          setStep(4);
        }}
      >
        <Text>Credit Card</Text>
      </TouchableOpacity>

      <View className="mt-auto">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={() => setStep(3)}
        >
          <Text className="text-white text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => setStep(2)}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">Create Profile</Text>
      </View>

      <Text className="text-lg mb-4">BSB</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="BSB"
        value={cardInfo.bsb}
        onChangeText={(text: string) => setCardInfo({ ...cardInfo, bsb: text })}
      />

      <Text className="text-lg mb-4">Account Number</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Account Number"
        value={cardInfo.accountNumber}
        onChangeText={(text) =>
          setCardInfo({ ...cardInfo, accountNumber: text })
        }
      />

      <View className="mt-auto">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={() => setStep(5)}
        >
          <Text className="text-white text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => setStep(2)}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">Create Profile</Text>
      </View>

      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="16 digits number"
        value={cardInfo.number}
        onChangeText={(text) => setCardInfo({ ...cardInfo, number: text })}
      />

      <View className="flex-row space-x-4">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg p-4"
          placeholder="Expiration date"
          value={cardInfo.expiry}
          onChangeText={(text) => setCardInfo({ ...cardInfo, expiry: text })}
        />
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg p-4"
          placeholder="CVV/CVC"
          value={cardInfo.cvv}
          onChangeText={(text) => setCardInfo({ ...cardInfo, cvv: text })}
        />
      </View>

      <View className="mt-auto">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={() => setStep(5)}
        >
          <Text className="text-white text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => setStep(paymentMethod === "bsb" ? 3 : 4)}
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">Create Profile</Text>
      </View>

      <Text className="text-lg mb-4">Payment Method</Text>
      {paymentMethod === "credit" && (
        <View className="flex-row items-center border border-gray-300 rounded-lg p-4">
          <AntDesign name="creditcard" size={24} color="black" />
          <Text className="ml-4">•••• {cardInfo.number.slice(-4)}</Text>
        </View>
      )}

      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-4 mt-4"
        onPress={() => setStep(2)}
      >
        <Text className="text-blue-500">+ Add new payment method</Text>
      </TouchableOpacity>

      <View className="mt-auto">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text className="text-white text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  switch (step) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    case 3:
      return renderStep3();
    case 4:
      return renderStep4();
    case 5:
      return renderStep5();
    default:
      return renderStep1();
  }
}
