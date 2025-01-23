import { View } from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Redirect href="/pages/authentication/home" />
    </View>
  );
}
