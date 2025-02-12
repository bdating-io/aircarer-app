import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function TaskList() {
  return (
    <View className="flex-1 bg-gray-100">
      <Link href="/(pages)/(tasks)/task">Tasks</Link>
    </View>
  );
}
