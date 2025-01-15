import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

interface StepStatus {
  isCompleted: boolean;
  timestamp: string | null;
}

const UsedLinenRecycledScreen = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecycled, setIsRecycled] = useState(false);
  const [steps, setSteps] = useState<StepStatus[]>([
    { isCompleted: true, timestamp: null }, // 步骤1：装袋
    { isCompleted: true, timestamp: null }, // 步骤2：拍照
    { isCompleted: false, timestamp: null }, // 步骤3：提交
  ]);

  const updateStepStatus = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      isCompleted: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setSteps(newSteps);
  };

  const handleBaggingComplete = () => {
    updateStepStatus(0);
    Alert.alert("Completed", "Confirmed linen bagging");
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access in settings"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      updateStepStatus(1);
      Alert.alert("Success", "Photo uploaded successfully");
    }
  };

  const handleSubmit = () => {
    if (!photo) {
      Alert.alert("Notice", "Please upload a photo first");
      return;
    }

    setIsRecycled(true);
    updateStepStatus(2);
    Alert.alert("Success", "Linen recycling registration completed");
  };

  const StepIndicator = ({ step, title }: { step: number; title: string }) => (
    <View className="flex-row items-center mb-4">
      <View
        className={`
        w-8 h-8 rounded-full items-center justify-center
        ${steps[step - 1].isCompleted ? "bg-green-500" : "bg-gray-300"}
      `}
      >
        <Text className="text-white font-bold">{step}</Text>
      </View>
      <Text className="ml-3 text-base flex-1">{title}</Text>
      {steps[step - 1].timestamp && (
        <Text className="text-xs text-gray-500">
          完成于 {steps[step - 1].timestamp}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        <Text className="text-2xl font-bold mb-8 text-center text-gray-800">
          Linen Recycling Management
        </Text>

        {/* Step Indicators */}
        <View className="mb-6 bg-gray-50 p-4 rounded-lg">
          <StepIndicator step={1} title="Place used linen in laundry bag" />
          <StepIndicator step={2} title="Take photo of bag location" />
          <StepIndicator step={3} title="Confirm recycling submission" />
        </View>

        {/* Step 1: Confirm Bagging */}
        {!steps[0].isCompleted && (
          <TouchableOpacity
            className="mb-6 p-4 bg-blue-50 rounded-lg"
            onPress={handleBaggingComplete}
          >
            <Text className="text-blue-600 text-center">
              Click to confirm bagging completed
            </Text>
          </TouchableOpacity>
        )}

        {/* Step 2: Photo Upload Area */}
        <View className="h-[300px] bg-gray-100 rounded-xl mb-6 overflow-hidden">
          {photo ? (
            <View className="relative flex-1">
              <Image source={{ uri: photo }} className="w-full h-full" />
              <TouchableOpacity
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                onPress={handleTakePhoto}
              >
                <MaterialIcons name="refresh" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="flex-1 justify-center items-center border-2 border-dashed border-gray-300 rounded-xl"
              onPress={handleTakePhoto}
              disabled={!steps[0].isCompleted}
            >
              <MaterialIcons
                name="add-a-photo"
                size={40}
                color={steps[0].isCompleted ? "#666" : "#ccc"}
              />
              <Text
                className={`mt-2 text-base ${
                  steps[0].isCompleted ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {steps[0].isCompleted
                  ? "Upload bag photo"
                  : "Complete bagging first"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Step 3: Submit Button */}
        {steps[0].isCompleted && photo && (
          <TouchableOpacity
            className={`
              p-4 rounded-lg items-center mb-6
              ${isRecycled ? "bg-green-500" : "bg-blue-500"}
            `}
            onPress={handleSubmit}
            disabled={isRecycled}
          >
            <Text className="text-white text-lg font-bold">
              {isRecycled ? "Recycling Complete" : "Confirm Submit"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Completion Notice */}
        {isRecycled && (
          <View className="bg-green-50 p-4 rounded-lg">
            <Text className="text-green-700 text-center">
              All steps completed! Recycling information recorded.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default UsedLinenRecycledScreen;
