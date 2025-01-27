import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PlaceDetails() {
  const router = useRouter();

  const properties = ['Property A', 'Property B', 'Property C'];
  const [selectedProperty, setSelectedProperty] = useState('');
  const [cleaningType, setCleaningType] = useState('');
  const [cleaningLevel, setCleaningLevel] = useState('');
  const [equipmentProvided, setEquipmentProvided] = useState<'tasker' | 'owner'>('tasker');

  const handleContinue = () => {
    const payload = {
      selectedProperty,
      cleaningType,
      cleaningLevel,
      equipmentProvided,
    };

    console.log('Form data:', payload);
    router.push('/dateSelection');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F8F9FA', padding: 16 }}>
      {/* 标题 */}
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Task Detail</Text>

      {/* 选择房源 */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Select your property</Text>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          backgroundColor: '#fff',
        }}
        onPress={() => console.log('Property selection pressed')}
      >
        <Text style={{ color: selectedProperty ? '#000' : '#888' }}>
          {selectedProperty || 'Select your property here'}
        </Text>
      </TouchableOpacity>

      {/* 清洁类型 */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>What kind of clean is this?</Text>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          backgroundColor: '#fff',
        }}
        onPress={() => console.log('Cleaning type selection pressed')}
      >
        <Text style={{ color: cleaningType ? '#000' : '#888' }}>
          {cleaningType || 'Select cleaning type here'}
        </Text>
      </TouchableOpacity>

      {/* 清洁级别 */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>What cleaning level?</Text>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          backgroundColor: '#fff',
        }}
        onPress={() => console.log('Cleaning level selection pressed')}
      >
        <Text style={{ color: cleaningLevel ? '#000' : '#888' }}>
          {cleaningLevel || 'Select cleaning level here'}
        </Text>
      </TouchableOpacity>

      {/* 清洁工具 */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>
        Does the cleaner need to bring equipment and supplies?
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => setEquipmentProvided('tasker')}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: equipmentProvided === 'tasker' ? '#007BFF' : '#ccc',
            marginRight: 8,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Yes, tasker brings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEquipmentProvided('owner')}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: equipmentProvided === 'owner' ? '#007BFF' : '#ccc',
            marginLeft: 8,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>No, I will provide</Text>
        </TouchableOpacity>
      </View>

      {/* 下一步按钮 */}
      <TouchableOpacity
        onPress={handleContinue}
        style={{
          backgroundColor: '#007BFF',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
