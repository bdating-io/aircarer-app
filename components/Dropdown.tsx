import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { View, StyleSheet } from 'react-native';

export function Dropdown({ selectedValue, onValueChange, items, placeholder }) {
  const pickerItems = items.map((item) => ({ label: item, value: item })); // 确保格式正确

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={pickerItems}
        value={selectedValue}
        placeholder={{ label: placeholder, value: null }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false} // 避免 Android 上原生样式问题
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
};

