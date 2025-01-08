import { Redirect } from "expo-router";
import { View, Text } from "react-native";

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-black text-xl font-bold text-center">
        <Redirect href="/pages/taskPreparation/taskPrepare" />
      </Text>
    </View>
  );
};

export default Home;
