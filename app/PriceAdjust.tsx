import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Slider from '@react-native-community/slider'; // 确保导入 Slider 组件

const PriceAdjust = () => {
  return (
    <ScrollView className="flex-1 bg-[#FAF9F6] p-6">
      <View className="mb-6">
        <Text className="text-3xl font-extrabold text-[#2C3E50] text-center">
          Price Adjustment
        </Text>
        <Text className="text-lg text-[#34495E] text-center mt-2">
          Assess the house condition and propose a new price.
        </Text>
      </View>

      <View className="bg-white p-6 rounded-lg shadow-lg">
        {/* Dirty Level */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#2C3E50] mb-2">
            Dirty Level
          </Text>
          <TextInput
            placeholder="Enter dirty level (e.g., light, moderate, heavy)"
            className="border border-[#D3D3D3] p-4 rounded-lg text-[#34495E] text-lg"
          />
        </View>

        {/* Slider for Condition */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-[#2C3E50] mb-2">
            Dirtiness Level (0-10)
          </Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={10}
            step={1}
            minimumTrackTintColor="#2C3E50"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#2C3E50"
          />
        </View>

        {/* Number of Rooms */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#2C3E50] mb-2">
            Number of Rooms
          </Text>
          <TextInput
            placeholder="Enter number of rooms"
            className="border border-[#D3D3D3] p-4 rounded-lg text-[#34495E] text-lg"
          />
        </View>

        {/* Price Adjustment */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#2C3E50] mb-2">
            Proposed Price
          </Text>
          <TextInput
            placeholder="Enter proposed price"
            className="border border-[#D3D3D3] p-4 rounded-lg text-[#34495E] text-lg"
          />
        </View>

        {/* Additional Notes */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#2C3E50] mb-2">
            Additional Notes
          </Text>
          <TextInput
            placeholder="Explain why price adjustment is needed"
            className="border border-[#D3D3D3] p-4 rounded-lg text-[#34495E] text-lg"
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity className="bg-[#e74c3c] py-4 rounded-lg mt-6 shadow-custom">
          <Text className="text-center text-white font-bold text-lg">
            Submit Adjustment
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PriceAdjust;
