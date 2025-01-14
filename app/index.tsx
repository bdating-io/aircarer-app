import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type RouteType = 
  | "Linen-management/usedLinenRecycled"
  | "Linen-management/linenHandover"
  | "Linen-management/linenProcessing";

export default function Home() {
  const router = useRouter();

  const menuItems: Array<{
    title: string;
    route: RouteType;
    description: string;
  }> = [
    {
      title: "Linen Recycling",
      route: "Linen-management/usedLinenRecycled",
      description: "Record used linen for recycling",
    },
    {
      title: "Linen Collection",
      route: "Linen-management/linenHandover",
      description: "Manage linen collection by cleaning company",
    },
    {
      title: "Linen Processing",
      route: "Linen-management/linenProcessing",
      description: "Track cleaning and return status",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-5">
      <Text className="text-2xl font-bold mb-8 text-center text-gray-800">
        Linen Management System
      </Text>

      <View className="space-y-4">
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            className="bg-white p-4 rounded-lg shadow-sm"
            onPress={() => router.push(item.route as any)}
          >
            <Text className="text-lg font-semibold text-gray-800 mb-1">
              {item.title}
            </Text>
            <Text className="text-gray-600">{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
