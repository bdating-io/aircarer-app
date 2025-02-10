import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, StyleSheet, ScrollView, KeyboardAvoidingView,  Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

// 如果分文件写PhotoGrid, 这里import
import PhotoGrid from '../components/PhotoGrid';

// 引入 mockData
import { mockProperties, IProperty } from '../mockData/mockData';

export default function TakePhotoWizard() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams<{ propertyId?: string }>();

  // 找到用户选择的那套 property
  const property = useMemo<IProperty | undefined>(
    () => mockProperties.find((p) => p.id === propertyId),
    [propertyId]
  );

  // 如果找不到property，就给个错误提示
  if (!property) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No property found with ID {propertyId}</Text>
      </View>
    );
  }

  // 1. 整理房间列表
  const roomList = useMemo(() => {
    const rooms: string[] = [];
    for (let i = 1; i <= property.bedrooms; i++) {
      rooms.push(`Bedroom ${i}`);
    }
    for (let i = 1; i <= property.bathrooms; i++) {
      rooms.push(`Bathroom ${i}`);
    }
    for (let i = 1; i <= property.kitchens; i++) {
      rooms.push(`Kitchen ${i}`);
    }
    for (let i = 1; i <= property.livingRooms; i++) {
      rooms.push(`Living Room ${i}`);
    }
    for (let i = 1; i <= property.courtYards; i++) {
      rooms.push(`Courtyard ${i}`);
    }
    // 加上 others 里的自定义房间
    if (property.others && property.others.length) {
      rooms.push(...property.others);
    }
    return rooms;
  }, [property]);

  // 2. 多步骤Wizard相关状态
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  // roomData 里存每个房间的数据： { images: string[], instruction: string }
  // 索引可以直接用房间名称做key，或者用数组；这里用对象方便查询
  const [roomData, setRoomData] = useState<Record<string, { images: string[]; instruction: string }>>({});

  const currentRoomName = roomList[currentRoomIndex];

  // 获取当前房间的数据，若还没初始化则给个默认
  const currentRoomData = roomData[currentRoomName] || { images: [], instruction: '' };

  // 更新图片
  const handleImagesChange = (newImages: string[]) => {
    setRoomData({
      ...roomData,
      [currentRoomName]: {
        ...currentRoomData,
        images: newImages,
      },
    });
  };

  // 更新指令
  const handleInstructionChange = (text: string) => {
    setRoomData({
      ...roomData,
      [currentRoomName]: {
        ...currentRoomData,
        instruction: text,
      },
    });
  };

  // 是否显示“拍照说明”的弹窗
  const [modalVisible, setModalVisible] = useState(false);

  // 下一步
  const handleNext = () => {
    // 简单的必填校验
    // if (!currentRoomData.instruction.trim()) {
    //   Alert.alert('Error', 'Task instruction is compulsory for this room.');
    //   return;
    // }
    // 如果还没到最后一个房间，则切换到下一个
    if (currentRoomIndex < roomList.length - 1) {
      setCurrentRoomIndex(currentRoomIndex + 1);
    } else {
      // 如果已经是最后一个房间，就提交
      handleSubmitAllRooms();
    }
  };

  // 上一步
  const handlePrev = () => {
    if (currentRoomIndex > 0) {
      setCurrentRoomIndex(currentRoomIndex - 1);
    }
  };

  // 最终提交
  const handleSubmitAllRooms = () => {
    const finalTaskData = {
      propertyId: property.id,
      propertyName: property.name,
      rooms: roomData,
    };
    console.log('Final Task Data:', finalTaskData);

    // 提交后跳转
    router.push('/specialRequestPage'); 
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#F8F9FA', padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Task Details: {property.name}
        </Text>

        {/* 蓝色提示框 */}
        <View style={{ backgroundColor: '#E0F7FA', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
            Take a photo for your task.
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#4E89CE' }}>Photo taking instructions</Text>
          </TouchableOpacity>
        </View>

        {/* 弹窗显示拍照说明 */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
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
                style={styles.modalCloseBtn}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 房间标题 */}
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>
          Room: {currentRoomName}
        </Text>

        {/* 九宫格图片上传 */}
        <PhotoGrid
          images={currentRoomData.images}
          onImagesChange={handleImagesChange}
          maxImages={9}
        />

        {/* 任务说明 */}
        <Text style={{ fontWeight: '600', marginBottom: 8, marginTop: 16 }}>Task Instruction (compulsory)</Text>
        <TextInput
          placeholder={`E.g. Clean ${currentRoomName} thoroughly`}
          value={currentRoomData.instruction}
          onChangeText={handleInstructionChange}
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

        {/* 上一步、下一步按钮 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {currentRoomIndex > 0 && (
            <TouchableOpacity
              onPress={handlePrev}
              style={[styles.navButton, { backgroundColor: '#aaa' }]}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Previous</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.navButton, { backgroundColor: '#4E89CE' }]}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {currentRoomIndex < roomList.length - 1 ? 'Next' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 一些样式
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalCloseBtn: {
    backgroundColor: '#4E89CE',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  navButton: {
    padding: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
});
