import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { WebView } from "react-native-webview";
import { useState } from "react";

export default function MapNavigation() {
  const [searchLocation, setSearchLocation] = useState("123 Main St, City");

  const handleNavigate = () => {
    console.log("Navigate to:", searchLocation);
  };

  return (
    <View className="flex-1">
      {/* Search Bar */}
      <View className="p-4 bg-white shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-2">
          <Text>📍</Text>
          <TextInput
            className="flex-1 ml-2 text-gray-700"
            value={searchLocation}
            onChangeText={setSearchLocation}
            placeholder="Your Location"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity>
            <Text>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map View */}
      <View className="flex-1">
        <WebView
          source={{ uri: "https://maps.google.com" }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Navigation Button */}
      <View className="p-4 bg-white">
        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-lg"
          onPress={handleNavigate}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Navigate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
