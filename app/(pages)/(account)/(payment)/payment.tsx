// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   Alert,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   AntDesign,
//   Ionicons,
//   FontAwesome,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";
// import { Camera, CameraType } from "expo-camera";
// import * as ImageManipulator from "expo-image-manipulator";
// import { supabase } from "@/clients/supabase";
// import { SafeAreaView } from "react-native-safe-area-context";

// type PaymentMethod = "bsb" | "credit" | null;

// interface CardInfo {
//   number: string;
//   expiry: string;
//   cvv: string;
//   bsb: string;
//   accountNumber: string;
//   cardHolderName: string;
//   isDefault: boolean;
//   id?: string;
//   type?: "credit" | "bsb";
//   last4?: string;
//   card_last4?: string;
//   card_expiry?: string;
//   account_number_last4?: string;
// }

// // 在组件外部定义常量
// const CAMERA_TYPE = "back" as CameraType;

// export default function Payment() {
//   const router = useRouter();
//   const [step, setStep] = useState(1);
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
//   const [cardInfo, setCardInfo] = useState<CardInfo>({
//     number: "",
//     expiry: "",
//     cvv: "",
//     bsb: "",
//     accountNumber: "",
//     cardHolderName: "",
//     isDefault: false,
//   });
//   const [savedPaymentMethods, setSavedPaymentMethods] = useState<CardInfo[]>(
//     []
//   );
//   const [isScanning, setIsScanning] = useState(false);
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showCVVInfo, setShowCVVInfo] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     // 加载保存的支付方式
//     fetchPaymentMethods();

//     // 请求相机权限
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const fetchPaymentMethods = async () => {
//     try {
//       setIsLoading(true);
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) throw new Error("User not authenticated");

//       const { data, error } = await supabase
//         .from("payment_methods")
//         .select("*")
//         .eq("user_id", user.id);

//       if (error) throw error;

//       setSavedPaymentMethods(data || []);
//     } catch (error) {
//       console.error("Error fetching payment methods:", error);
//       Alert.alert("Error", "Failed to load payment methods");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const savePaymentMethod = async () => {
//     try {
//       setIsLoading(true);
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) throw new Error("User not authenticated");

//       // 构建payment method数据
//       const paymentData: any = {
//         user_id: user.id,
//         type: paymentMethod,
//         is_default: cardInfo.isDefault,
//       };

//       // 根据支付方式类型添加相应字段
//       if (paymentMethod === "credit") {
//         paymentData.card_holder_name = cardInfo.cardHolderName;
//         paymentData.card_last4 = cardInfo.number.slice(-4);
//         paymentData.card_expiry = cardInfo.expiry;
//         // 注意: 不要存储完整的卡号和CVV
//       } else if (paymentMethod === "bsb") {
//         paymentData.bsb = cardInfo.bsb;
//         paymentData.account_number_last4 = cardInfo.accountNumber.slice(-4);
//       }

//       const { data, error } = await supabase
//         .from("payment_methods")
//         .insert(paymentData)
//         .select()
//         .single();

//       if (error) throw error;

//       Alert.alert("Success", "Payment method saved successfully");
//       await fetchPaymentMethods();
//       setStep(1); // 返回支付方式列表
//     } catch (error) {
//       console.error("Error saving payment method:", error);
//       Alert.alert("Error", "Failed to save payment method");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deletePaymentMethod = async (id: string) => {
//     try {
//       setIsDeleting(true);

//       const { error } = await supabase
//         .from("payment_methods")
//         .delete()
//         .eq("id", id);

//       if (error) throw error;

//       // 更新本地列表
//       setSavedPaymentMethods((prevMethods) =>
//         prevMethods.filter((method) => method.id !== id)
//       );

//       Alert.alert("Success", "Payment method deleted successfully");
//     } catch (error) {
//       console.error("Error deleting payment method:", error);
//       Alert.alert("Error", "Failed to delete payment method");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleCardNumberChange = (text: string) => {
//     // 格式化卡号为4位一组
//     const formattedText = text
//       .replace(/\s/g, "")
//       .replace(/(\d{4})/g, "$1 ")
//       .trim();
//     setCardInfo({ ...cardInfo, number: formattedText });
//   };

//   const handleExpiryChange = (text: string) => {
//     // 格式化有效期为MM/YY
//     const cleaned = text.replace(/[^\d]/g, "");
//     let formatted = cleaned;

//     if (cleaned.length > 2) {
//       formatted = cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
//     }

//     setCardInfo({ ...cardInfo, expiry: formatted });
//   };

//   const handleScanCard = async () => {
//     if (hasPermission !== true) {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert("Permission Required", "We need camera permission to scan cards");
//         return;
//       }
//       setHasPermission(true);
//     }
//     setIsScanning(true);
//   };

//   const cancelScanning = () => {
//     setIsScanning(false);
//   };

//   const handleCardScanned = (data: { number?: string; expiry?: string; name?: string }) => {
//     setIsScanning(false);

//     if (data.number) {
//       handleCardNumberChange(data.number);
//     }

//     if (data.expiry) {
//       setCardInfo(prev => ({ ...prev, expiry: data.expiry }));
//     }

//     if (data.name) {
//       setCardInfo(prev => ({ ...prev, cardHolderName: data.name }));
//     }

//     Alert.alert("Card Scanned", "Your card details have been filled automatically.");
//   };

//   const renderStep1 = () => (
//     <View className="flex-1 bg-white p-4">
//       <View className="flex-row items-center mb-6">
//         <TouchableOpacity onPress={() => router.back()}>
//           <AntDesign name="left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-lg font-semibold ml-4">Payment List</Text>
//         <TouchableOpacity className="ml-auto" onPress={() => {}}>
//           <AntDesign name="edit" size={20} color="black" />
//         </TouchableOpacity>
//       </View>

//       <Text className="text-lg mb-4">Payment methods</Text>

//       {isLoading ? (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#4A90E2" />
//         </View>
//       ) : savedPaymentMethods.length > 0 ? (
//         <ScrollView className="flex-1">
//           {savedPaymentMethods.map((method, index) => (
//             <View
//               key={method.id || index}
//               className="border border-gray-300 rounded-lg p-4 mb-4 flex-row items-center"
//             >
//               {method.type === "credit" ? (
//                 <View className="flex-row items-center flex-1">
//                   <MaterialCommunityIcons
//                     name="credit-card"
//                     size={24}
//                     color="#4A90E2"
//                   />
//                   <View className="ml-3">
//                     <Text className="font-medium">
//                       •••• •••• •••• {method.card_last4 || method.last4}
//                     </Text>
//                     <Text className="text-gray-500 text-sm">
//                       Expires: {method.card_expiry || method.expiry}
//                     </Text>
//                   </View>
//                   {method.isDefault && (
//                     <View className="ml-auto bg-blue-100 px-2 py-1 rounded">
//                       <Text className="text-blue-600 text-xs">Default</Text>
//                     </View>
//                   )}
//                 </View>
//               ) : (
//                 <View className="flex-row items-center flex-1">
//                   <Ionicons name="wallet-outline" size={24} color="#4A90E2" />
//                   <View className="ml-3">
//                     <Text className="font-medium">BSB: {method.bsb}</Text>
//                     <Text className="text-gray-500 text-sm">
//                       Account: •••• {method.account_number_last4}
//                     </Text>
//                   </View>
//                   {method.isDefault && (
//                     <View className="ml-auto bg-blue-100 px-2 py-1 rounded">
//                       <Text className="text-blue-600 text-xs">Default</Text>
//                     </View>
//                   )}
//                 </View>
//               )}
//               <TouchableOpacity
//                 className="ml-2"
//                 onPress={() => {
//                   Alert.alert(
//                     "Delete Payment Method",
//                     "Are you sure you want to delete this payment method?",
//                     [
//                       { text: "Cancel", style: "cancel" },
//                       {
//                         text: "Delete",
//                         style: "destructive",
//                         onPress: () => deletePaymentMethod(method.id || ""),
//                       },
//                     ]
//                   );
//                 }}
//                 disabled={isDeleting}
//               >
//                 <AntDesign name="delete" size={20} color="red" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </ScrollView>
//       ) : (
//         <Text className="text-gray-500 text-center py-6">
//           No payment methods saved yet
//         </Text>
//       )}

//       <TouchableOpacity
//         className="border border-gray-300 rounded-lg p-4 mb-4 flex-row items-center"
//         onPress={() => setStep(2)}
//       >
//         <AntDesign name="plus" size={20} color="#4A90E2" />
//         <Text className="text-blue-500 ml-2">Add new payment method</Text>
//       </TouchableOpacity>

//       <View className="mt-auto">
//         <TouchableOpacity
//           className="bg-blue-500 rounded-lg p-4"
//           onPress={() => router.push("/(tabs)/home")}
//         >
//           <Text className="text-white text-center">Next</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderStep2 = () => (
//     <View className="flex-1 bg-white p-4">
//       <View className="flex-row items-center mb-6">
//         <TouchableOpacity onPress={() => setStep(1)}>
//           <AntDesign name="left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-lg font-semibold ml-4">Payment Method</Text>
//       </View>

//       <Text className="text-lg mb-2">Payment Method</Text>
//       <Text className="text-gray-500 mb-6">
//         Choose your preferred payment method
//       </Text>

//       <TouchableOpacity
//         className="border border-gray-300 rounded-lg p-4 mb-4 flex-row items-center"
//         onPress={() => {
//           setPaymentMethod("bsb");
//           setStep(3);
//         }}
//       >
//         <Ionicons name="wallet-outline" size={24} color="#4A90E2" />
//         <Text className="ml-3">BSB and Account Number</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         className="border border-gray-300 rounded-lg p-4 mb-4 flex-row items-center"
//         onPress={() => {
//           setPaymentMethod("credit");
//           setStep(4);
//         }}
//       >
//         <MaterialCommunityIcons name="credit-card" size={24} color="#4A90E2" />
//         <Text className="ml-3">Credit Card</Text>
//       </TouchableOpacity>

//       <View className="mt-auto">
//         <TouchableOpacity
//           className="bg-blue-500 rounded-lg p-4"
//           onPress={() => setStep(1)}
//         >
//           <Text className="text-white text-center">Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderStep3 = () => (
//     <View className="flex-1 bg-white p-4">
//       <View className="flex-row items-center mb-6">
//         <TouchableOpacity onPress={() => setStep(2)}>
//           <AntDesign name="left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-lg font-semibold ml-4">
//           Add New Payment Method
//         </Text>
//       </View>

//       <Text className="text-sm text-gray-500 mb-4">BSB</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg p-4 mb-4"
//         placeholder="BSB"
//         value={cardInfo.bsb}
//         onChangeText={(text: string) => setCardInfo({ ...cardInfo, bsb: text })}
//         keyboardType="number-pad"
//         maxLength={6}
//       />

//       <Text className="text-sm text-gray-500 mb-4">Account Number</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg p-4 mb-4"
//         placeholder="Account Number"
//         value={cardInfo.accountNumber}
//         onChangeText={(text) =>
//           setCardInfo({ ...cardInfo, accountNumber: text })
//         }
//         keyboardType="number-pad"
//       />

//       <TouchableOpacity
//         className="flex-row items-center mb-6"
//         onPress={() =>
//           setCardInfo({ ...cardInfo, isDefault: !cardInfo.isDefault })
//         }
//       >
//         <View
//           className={`w-5 h-5 border rounded mr-2 ${
//             cardInfo.isDefault
//               ? "bg-blue-500 border-blue-500"
//               : "border-gray-300"
//           }`}
//         >
//           {cardInfo.isDefault && (
//             <AntDesign name="check" size={16} color="white" />
//           )}
//         </View>
//         <Text>Set this payment method as default</Text>
//       </TouchableOpacity>

//       <View className="mt-auto">
//         <TouchableOpacity
//           className="bg-blue-500 rounded-lg p-4"
//           onPress={savePaymentMethod}
//           disabled={isLoading || !cardInfo.bsb || !cardInfo.accountNumber}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text className="text-white text-center">Next</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderStep4 = () => (
//     <View className="flex-1 bg-white p-4">
//       <View className="flex-row items-center mb-6">
//         <TouchableOpacity onPress={() => setStep(2)}>
//           <AntDesign name="left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-lg font-semibold ml-4">
//           Add New Payment Method
//         </Text>
//       </View>

//       <Text className="text-sm text-gray-500 mb-1">16 digit number</Text>
//       <View className="flex-row items-center mb-4">
//         <TextInput
//           className="flex-1 border border-gray-300 rounded-lg p-4"
//           placeholder="1234 5678 9012 3456"
//           value={cardInfo.number}
//           onChangeText={handleCardNumberChange}
//           keyboardType="number-pad"
//           maxLength={19} // 16 digits + 3 spaces
//         />
//         <TouchableOpacity
//           className="ml-2 p-3 bg-blue-500 rounded-lg"
//           onPress={handleScanCard}
//         >
//           <AntDesign name="camera" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       <View className="flex-row space-x-4 mb-6">
//         <View className="flex-1">
//           <Text className="text-sm text-gray-500 mb-1">Expiration date</Text>
//           <TextInput
//             className="border border-gray-300 rounded-lg p-4"
//             placeholder="MM/YY"
//             value={cardInfo.expiry}
//             onChangeText={handleExpiryChange}
//             keyboardType="number-pad"
//             maxLength={5} // MM/YY
//           />
//         </View>

//         <View className="flex-1">
//           <View className="flex-row items-center mb-1">
//             <Text className="text-sm text-gray-500">CVV/CVC</Text>
//             <TouchableOpacity
//               className="ml-2"
//               onPress={() => setShowCVVInfo(true)}
//             >
//               <AntDesign name="questioncircleo" size={16} color="gray" />
//             </TouchableOpacity>
//           </View>
//           <TextInput
//             className="border border-gray-300 rounded-lg p-4"
//             placeholder="123"
//             value={cardInfo.cvv}
//             onChangeText={(text) => setCardInfo({ ...cardInfo, cvv: text })}
//             keyboardType="number-pad"
//             maxLength={4}
//             secureTextEntry
//           />
//         </View>
//       </View>

//       <Text className="text-sm text-gray-500 mb-1">Cardholder name</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg p-4 mb-4"
//         placeholder="Name on card"
//         value={cardInfo.cardHolderName}
//         onChangeText={(text) =>
//           setCardInfo({ ...cardInfo, cardHolderName: text })
//         }
//         autoCapitalize="words"
//       />

//       <TouchableOpacity
//         className="flex-row items-center mb-6"
//         onPress={() =>
//           setCardInfo({ ...cardInfo, isDefault: !cardInfo.isDefault })
//         }
//       >
//         <View
//           className={`w-5 h-5 border rounded mr-2 ${
//             cardInfo.isDefault
//               ? "bg-blue-500 border-blue-500"
//               : "border-gray-300"
//           }`}
//         >
//           {cardInfo.isDefault && (
//             <AntDesign name="check" size={16} color="white" />
//           )}
//         </View>
//         <Text>Set this payment method as default</Text>
//       </TouchableOpacity>

//       <View className="mt-auto">
//         <TouchableOpacity
//           className="bg-blue-500 rounded-lg p-4"
//           onPress={savePaymentMethod}
//           disabled={
//             isLoading ||
//             !cardInfo.number ||
//             !cardInfo.expiry ||
//             !cardInfo.cvv ||
//             !cardInfo.cardHolderName
//           }
//         >
//           {isLoading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text className="text-white text-center">Next</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderScanner = () => (
//     <View className="flex-1">
//       {hasPermission === true ? (
//         <Camera
//           className="flex-1"
//           type={CameraType.back}
//           onBarCodeScanned={({data}) => {
//             // 这里添加信用卡扫描逻辑
//             console.log("Scanned data:", data);

//             // 模拟扫描到的信用卡数据
//             handleCardScanned({
//               number: "4111 1111 1111 1111",
//               expiry: "12/25",
//               name: "JOHN DOE"
//             });
//           }}
//         >
//           <View className="flex-1 bg-black bg-opacity-50 p-4">
//             <View className="flex-row items-center mb-6">
//               <TouchableOpacity onPress={cancelScanning} className="bg-white rounded-full p-2">
//                 <AntDesign name="close" size={24} color="black" />
//               </TouchableOpacity>
//               <Text className="text-lg font-semibold ml-4 text-white">Scan Card</Text>
//             </View>

//             <View className="flex-1 justify-center items-center">
//               <View className="border-2 border-white h-48 w-72 rounded-lg">
//                 <Text className="text-white text-center mt-4">
//                   Position your card within the frame
//                 </Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               className="bg-white rounded-lg p-4 mb-6"
//               onPress={cancelScanning}
//             >
//               <Text className="text-center font-medium">Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </Camera>
//       ) : (
//         <View className="flex-1 justify-center items-center p-4">
//           <Text className="text-lg text-center mb-4">Camera permission is required to scan cards</Text>
//           <TouchableOpacity
//             className="bg-blue-500 rounded-lg p-4"
//             onPress={async () => {
//               const { status } = await Camera.requestCameraPermissionsAsync();
//               setHasPermission(status === 'granted');
//             }}
//           >
//             <Text className="text-white text-center">Grant Permission</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   const renderCVVInfo = () => (
//     <View className="flex-1 bg-white p-4">
//       <View className="flex-row items-center mb-6">
//         <TouchableOpacity onPress={() => setShowCVVInfo(false)}>
//           <AntDesign name="left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-lg font-semibold ml-4">
//           What is CVC/CVV code?
//         </Text>
//       </View>

//       <ScrollView>
//         <Text className="mb-4">
//           The CVC/CVV code (Card Verification Code/Value) is the 3 or 4 digit
//           number found on the back of your card or on the front for American
//           Express cards.
//         </Text>

//         <Image className="h-40 w-full rounded-lg mb-4" resizeMode="contain" />

//         <Text className="text-gray-700 mb-4">
//           This code provides an additional layer of security when making online
//           transactions and helps verify that you, the cardholder, are
//           authorizing the purchase.
//         </Text>

//         <Text className="font-medium mb-2">Where to find it:</Text>
//         <Text className="mb-4">
//           • Visa, Mastercard, Discover: 3 digits on the back of your card, to
//           the right of the signature strip.
//         </Text>
//         <Text className="mb-4">
//           • American Express: 4 digits on the front of your card, above and to
//           the right of your card number.
//         </Text>
//       </ScrollView>

//       <TouchableOpacity
//         className="bg-blue-500 rounded-lg p-4 mt-4"
//         onPress={() => setShowCVVInfo(false)}
//       >
//         <Text className="text-white text-center">Got it</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // 根据当前状态决定显示哪个页面
//   if (isScanning) {
//     return renderScanner();
//   }

//   if (showCVVInfo) {
//     return renderCVVInfo();
//   }

//   switch (step) {
//     case 1:
//       return renderStep1();
//     case 2:
//       return renderStep2();
//     case 3:
//       return renderStep3();
//     case 4:
//       return renderStep4();
//     default:
//       return renderStep1();
//   }
// }
