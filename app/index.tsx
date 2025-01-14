import { Link } from "expo-router";
import { View, Text } from "react-native";

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-black text-xl font-bold text-center">
      </Text>
      <Link href="/Linen-management/usedLinenRecycled">
        <Text>Used Linen Recycled</Text>
      </Link>
    </View>
  );
};

export default Home;
