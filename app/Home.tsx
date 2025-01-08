import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/back.jpg")} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-6">
        {/* Title */}
        <Text className="text-4xl font-extrabold text-primary mb-4">
          Welcome to Adam's Work
        </Text>
        <Text className="text-lg text-secondary text-center mb-8">
          Navigate to different screens and explore our features!
        </Text>

        {/* Button to Navigate to Mark Arrive */}
        <TouchableOpacity
          onPress={() => navigation.navigate("MarkArrive")}
          className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-custom mb-4"
        >
          <Text className="text-lg text-center">Go to Mark Arrival</Text>
        </TouchableOpacity>

        {/* Button to Navigate to Price Adjust */}
        <TouchableOpacity
          onPress={() => navigation.navigate("PriceAdjust")}
          className="bg-accent hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-custom"
        >
          <Text className="text-lg text-center">Go to Price Adjustment</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Home;
