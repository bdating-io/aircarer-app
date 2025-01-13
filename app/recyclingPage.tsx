import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function RecyclingPage() {
  const router = useRouter();

  const [method, setMethod] = useState<'propertyCabinet' | 'cleaningCompany'>('propertyCabinet');
  const [address, setAddress] = useState('');
  const [instruction, setInstruction] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 选择图片
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (instruction.length < 25) {
      alert('Please provide at least 25 words for the instructions.');
      return;
    }

    const recyclingData = {
      method,
      address,
      instruction,
      imageUri,
    };

    console.log('Recycling data:', recyclingData);

    // 跳转到下一页或提交数据
    router.push('/dateSelection');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Recycling</Text>

      {/* Method for recycling */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Method for recycling</Text>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setMethod('propertyCabinet')}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: method === 'propertyCabinet' ? '#007BFF' : '#ccc',
            marginRight: 8,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff' }}>Property Cabinet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMethod('cleaningCompany')}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: method === 'cleaningCompany' ? '#007BFF' : '#ccc',
            marginLeft: 8,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff' }}>Cleaning Company</Text>
        </TouchableOpacity>
      </View>

      {/* Address */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Address</Text>
      <TextInput
        placeholder="Please enter the address here"
        value={address}
        onChangeText={setAddress}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#fff',
          marginBottom: 16,
        }}
      />

      {/* Upload photo */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Upload Photo</Text>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 24,
          borderRadius: 8,
          backgroundColor: '#f0f0f0',
          marginBottom: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 100, height: 100, borderRadius: 8 }}
          />
        ) : (
          <Text style={{ color: '#888', fontSize: 16 }}>+</Text>
        )}
      </TouchableOpacity>

      {/* Instruction */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Instruction for recycling: </Text>
      <TextInput
        placeholder="E.g. Ground floor"
        value={instruction}
        onChangeText={setInstruction}
        multiline
        numberOfLines={4}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#fff',
          marginBottom: 16,
        }}
      />
      <Text style={{ color: '#888', marginBottom: 16 }}>Minimum 25 words</Text>

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleNext}
        style={{
          backgroundColor: '#007BFF',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
