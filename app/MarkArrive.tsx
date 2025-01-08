import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

const MarkArrive = () => {
  return (
    <ScrollView className="flex-1 bg-[#F5F5DC] p-6">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-[#2C3E50] text-center">
          Mark Arrival
        </Text>
        <Text className="text-lg text-[#34495E] text-center mt-2">
          Please provide the necessary details for your arrival.
        </Text>
      </View>

      <View className="bg-white p-6 rounded-lg shadow-lg">
        {/* Arrival Time */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#2C3E50] mb-2">
            Arrival Time
          </Text>
          <TextInput
            placeholder="Enter arrival time (e.g., 10:00 AM)"
            className="border border-[#D3D3D3] p-4 rounded-lg text-[#34495E] text-lg"
          />
        </View>

        {/* Tools Brought */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#2C3E50] mb-2">
            Tools Brought
          </Text>
          <TextInput
            placeholder="List tools brought (e.g., vacuum, mop)"
            className="border border-[#D3D3D3] p-4 rounded-lg text-[#34495E] text-lg"
          />
        </View>

        {/* Cleaning Feasibility */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#2C3E50] mb-2">
            Feasibility
          </Text>
          <TextInput
            placeholder="Can cleaning be performed? (Yes/No)"
            className="border border-[#D3D3D3] p-4 rounded-lg text-[#34495E] text-lg"
          />
        </View>

        {/* Number of Rooms */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#2C3E50] mb-2">
            Number of Rooms
          </Text>
          <TextInput
            placeholder="Enter the number of rooms"
            className="border border-[#D3D3D3] p-4 rounded-lg text-[#34495E] text-lg"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity className="bg-[#2C3E50] py-4 rounded-lg mt-6 shadow-custom">
          <Text className="text-center text-white font-bold text-lg">
            Submit Details
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MarkArrive;
