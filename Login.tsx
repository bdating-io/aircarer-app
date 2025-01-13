import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('错误', '请输入邮箱和密码');
      return;
    }

    // 在这里处理实际的登录逻辑
    Alert.alert('登录成功', `欢迎回来，${email}`);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-black text-3xl font-bold mb-6">登录</Text>

      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded"
        placeholder="请输入邮箱"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="w-full p-4 mb-6 border border-gray-300 rounded"
        placeholder="请输入密码"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg text-center">登录</Text>
      </TouchableOpacity>

      {/* 跳转到注册页面 */}
      <TouchableOpacity onPress={() => router.push('/register')} className="mt-4">
        <Text className="text-blue-500 text-lg">没有账号？注册</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
