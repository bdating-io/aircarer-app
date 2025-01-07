import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function TabOneScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-red-500 text-5xl font-bold text-center">
        Hello World
      </Text>
    </View>
  );
}
