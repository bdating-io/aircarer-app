<<<<<<< Updated upstream
=======
import { Link, Redirect } from "expo-router";
>>>>>>> Stashed changes
import { View, Text } from "react-native";

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-black text-xl font-bold text-center">
<<<<<<< Updated upstream
        Aircarer
=======
        <Redirect href="/pages/authentication/home" />
>>>>>>> Stashed changes
      </Text>
    </View>
  );
};

export default Home;
