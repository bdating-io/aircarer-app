import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export function NextButton({ onPress, title = 'Next' }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#4E89CE',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{title}</Text>
    </TouchableOpacity>
  );
}
