import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Index: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-black text-3xl font-bold mb-6">欢迎来到 AIRCARER</Text>

      {/* 跳转到登录页面按钮 */}
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg mb-4"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-white text-lg">登录</Text>
      </TouchableOpacity>




      <TouchableOpacity
        className="bg-purple-500 p-4 rounded-lg"
        onPress={() => navigation.navigate('CreateUser')}
      >
        <Text className="text-white text-lg">注册流程</Text>
      </TouchableOpacity>


      <TouchableOpacity
        className="bg-purple-500 p-4 rounded-lg"
        onPress={() => navigation.navigate('TaskList')}
      >
        <Text className="text-white text-lg">Task </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-purple-500 p-4 rounded-lg"
        onPress={() => navigation.navigate('RecycleTask')}
      >
        <Text className="text-white text-lg">Recycle流程 </Text>
      </TouchableOpacity>



    </View>
  );
};

export default Index;
