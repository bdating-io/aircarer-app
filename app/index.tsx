import { Link, Redirect } from "expo-router";

import { View, Text } from "react-native";

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Redirect href="/pages/profile/userProfile" />
    </View>
  );
};

export default Home;
