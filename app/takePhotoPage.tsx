import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function TakePhotoPage() {
  const router = useRouter();

  const [instruction, setInstruction] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 选择照片
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
    if (!instruction || instruction.trim().length === 0) {
      Alert.alert('Error', 'Task instruction is compulsory.');
      return;
    }

    const taskData = {
      instruction,
      imageUri,
    };

    console.log('Task data:', taskData);

    // 跳转到下一页
    router.push('/specialRequestPage');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Task Details</Text>

      {/* 蓝色提示框 */}
      <View
        style={{
          backgroundColor: '#E0F7FA',
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
          Take a photo for your task.
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ color: '#007BFF' }}>Photo taking instructions</Text>
        </TouchableOpacity>
      </View>

      {/* 弹窗显示说明 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              Photo Taking Instructions
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 16 }}>
              1. Take clear and well-lit photos.
              {'\n'}2. Ensure the task area is fully visible.
              {'\n'}3. Avoid blurry images.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#007BFF',
                padding: 12,
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 照片上传 */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Snap a photo</Text>
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

      {/* 任务说明 */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Task Instruction (compulsory)</Text>
      <TextInput
        placeholder="E.g. Clean the kitchen thoroughly"
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

      {/* 下一步按钮 */}
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
