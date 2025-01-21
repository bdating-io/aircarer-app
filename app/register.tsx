import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Picker } from 'react-native';
import { useRouter } from 'expo-router';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const router = useRouter();

const { addItemToList } = route.params || {};

  // 提交注册表单
  const handleRegister = () => {
    // 简单的验证逻辑
    if (!username || !email || !password || !confirmPassword || !phone || !gender || !birthday) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('错误', '密码和确认密码不一致');
      return;
    }

    // 在这里处理实际的注册逻辑
    Alert.alert('注册成功', `欢迎注册，${username}`);
    router.push('/login');  // 注册成功后跳转到登录页面
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-black text-3xl font-bold mb-6">注册</Text>

      {/* 用户名 */}
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded"
        placeholder="请输入用户名"
        value={username}
        onChangeText={setUsername}
      />

      {/* 邮箱 */}
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded"
        placeholder="请输入邮箱"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* 密码 */}
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded"
        placeholder="请输入密码"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* 确认密码 */}
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded"
        placeholder="确认密码"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* 手机号 */}
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded"
        placeholder="请输入手机号"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* 性别选择 */}
      <View className="w-full mb-4">
        <Text className="text-black">性别</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={{ height: 50, width: '100%' }}
        >
          <Picker.Item label="选择性别" value="" />
          <Picker.Item label="男" value="male" />
          <Picker.Item label="女" value="female" />
          <Picker.Item label="其他" value="other" />
        </Picker>
      </View>

      {/* 生日选择 */}
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded"
        placeholder="请输入生日（格式：YYYY-MM-DD）"
        keyboardType="default"
        value={birthday}
        onChangeText={setBirthday}
      />

      {/* 提交注册 */}
      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg"
        onPress={handleRegister}
      >
        <Text className="text-white text-lg text-center">注册</Text>
      </TouchableOpacity>

      {/* 登录页面链接 */}
      <TouchableOpacity onPress={() => router.push('/Login')} className="mt-4">
        <Text className="text-blue-500 text-lg">已有账号？登录</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
