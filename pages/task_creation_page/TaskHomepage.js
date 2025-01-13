// screens/HomeScreen.js
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../theme';

export default function HomeScreen() {
  const [taskTitle, setTaskTitle] = React.useState('');

  const handleCreateTask = () => {
    // 点击 "Get it done!" 的逻辑
    // 这里先只是输出一下，后面会与后台或 Firebase 对接
    console.log('Task title: ', taskTitle);
  };

  return (
    <View style={styles.container}>
      {/* 顶部区域：App 名称 */}
      <View style={styles.headerContainer}>
        <Text style={styles.appTitle}>AirCarer</Text>
      </View>
      
      {/* 中间蓝色块部分 */}
      <View style={styles.mainSection}>
        <Text style={styles.greetingText}>Good day, username!</Text>
        <Text style={styles.mainTitle}>Need a hand? We’ve got you covered.</Text>
        
        <TextInput
          style={styles.taskInput}
          placeholder="Task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        
        <TouchableOpacity style={styles.submitButton} onPress={handleCreateTask}>
          <Text style={styles.buttonText}>Get it done!</Text>
        </TouchableOpacity>
      </View>
      
      {/* 底部导航示例 */}
      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>Need a hand</Text>
        <Text style={styles.navItem}>Browse</Text>
        <Text style={styles.navItem}>My Tasks</Text>
        <Text style={styles.navItem}>Account</Text>
      </View>
    </View>
  );
}

// 样式部分
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    // 只要一个简单的顶部标题区域即可
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  appTitle: {
    fontSize: SIZES.header,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  mainSection: {
    // “蓝色块”主体区域
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  greetingText: {
    fontSize: SIZES.subheader,
    color: COLORS.white,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 28,
    color: COLORS.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  taskInput: {
    backgroundColor: COLORS.white,
    width: '80%',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: SIZES.body,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#FF7E7E', // 你想用哪个粉色可以在 theme.js 里加
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: 'bold',
  },
  bottomNav: {
    // 底部导航栏示例
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    color: COLORS.primary,
    fontSize: 14,
  },
});
