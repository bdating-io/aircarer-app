import { View, Text, FlatList } from "react-native";

const chatList = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you?', time: '2m ago' },
  { id: '2', name: 'Jane Smith', lastMessage: 'Thanks for your help!', time: '1h ago' },
  // Add more chat items as needed
];

export default function Chat() {
  return (
    <View className="flex-1 bg-gray-100">
      <View className="pt-12 px-4">
        <Text className="text-2xl font-bold mb-6">Messages</Text>
        <FlatList
          data={chatList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 mb-2 rounded-lg">
              <Text className="font-bold text-lg">{item.name}</Text>
              <Text className="text-gray-600">{item.lastMessage}</Text>
              <Text className="text-gray-400 text-sm">{item.time}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
} 