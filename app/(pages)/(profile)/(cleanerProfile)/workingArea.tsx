import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default function WorkingArea() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [workDistance, setWorkDistance] = useState(0);
 

  const handleNext = () => {
    if (!workDistance) return;

    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    const profileData = {
      ...previousData,
      workDistance: workDistance,
    };

    router.push({
      pathname: "/workingTime",
      params: { profileData: JSON.stringify(profileData) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">
            Select Working Areas
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <Text className="text-gray-600 mt-6 mb-4">
          Set your preferred maximum working distance
        </Text>
        <Text>{workDistance} KMs</Text>
        <MultiSlider
                        min={0}
                        max={100}
                        values={[workDistance]}
                        onValuesChangeFinish={(v) => { setWorkDistance(v[0]) }}
                        onValuesChange={(v) => { setWorkDistance(v[0]) }}
                    />
    
      </ScrollView>

      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-lg py-4 items-center ${
            workDistance > 0 ? "bg-[#4A90E2]" : "bg-gray-200"
          }`}
          onPress={handleNext}
          disabled={workDistance < 0}
        >
          <Text
            className={`font-medium ${
              workDistance > 0 ? "text-white" : "text-gray-500"
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
