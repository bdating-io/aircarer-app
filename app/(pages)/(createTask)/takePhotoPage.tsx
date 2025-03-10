import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/clients/supabase';
import PhotoGrid from '@/components/PhotoGrid'; // 你的九宫格上传组件

type RoomData = {
  images: string[];
  instruction: string;
};

// JSON 对象结构: { "Bedroom 1": { images:[], instruction:"" }, "Kitchen": {...} }
type RoomsJson = Record<string, RoomData>;

export default function TakePhotoPage() {
  const router = useRouter();
  // 只需要拿到 taskId
  const { taskId } = useLocalSearchParams() as {
    taskId?: string;
  };

  // 这两个是从 properties 表里获取到的
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);

  // 加载状态
  const [loading, setLoading] = useState(true);

  // 说明弹窗
  const [modalVisible, setModalVisible] = useState(false);

  // Wizard 状态
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [roomsData, setRoomsData] = useState<RoomsJson>({});

  // 1) 获取 tasks 表 => 找到 property_id => 再查 properties
  useEffect(() => {
    if (!taskId) {
      Alert.alert('Error', 'No taskId provided');
      return;
    }
    fetchTaskAndProperty(taskId);
  }, [taskId]);

  const fetchTaskAndProperty = async (taskIdVal: string) => {
    try {
      // 先查 tasks 表，拿到 property_id
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('property_id')
        .eq('task_id', taskIdVal)
        .single();

      if (taskError) throw taskError;
      if (!taskData?.property_id) {
        Alert.alert('Error', 'No property_id found in tasks table');
        setLoading(false);
        return;
      }

      const propId = taskData.property_id;

      // 再用 property_id 查 properties 表
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('bedrooms,bathrooms')
        .eq('property_id', propId)
        .single();

      if (propError) throw propError;

      // 如果查到
      setBedrooms(propData?.bedrooms || 0);
      setBathrooms(propData?.bathrooms || 0);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2) 根据 bedrooms/bathrooms + 默认房间 构建房间列表
  const roomList = useMemo(() => {
    const rooms: string[] = [];
    for (let i = 1; i <= bedrooms; i++) {
      rooms.push(`Bedroom ${i}`);
    }
    for (let i = 1; i <= bathrooms; i++) {
      rooms.push(`Bathroom ${i}`);
    }
    // 默认各1个
    rooms.push('Living Room');
    rooms.push('Kitchen');
    rooms.push('Courtyard');
    rooms.push('Balcony');

    return rooms;
  }, [bedrooms, bathrooms]);

  // 当前房间名称
  const currentRoomName = roomList[currentRoomIndex] || '';

  // 当前房间数据
  const currentRoomData: RoomData = roomsData[currentRoomName] || {
    images: [],
    instruction: '',
  };

  // 修改当前房间 images
  const handleImagesChange = (newImages: string[]) => {
    setRoomsData((prev) => ({
      ...prev,
      [currentRoomName]: {
        ...currentRoomData,
        images: newImages,
      },
    }));
  };

  // 修改当前房间 instruction
  const handleInstructionChange = (text: string) => {
    setRoomsData((prev) => ({
      ...prev,
      [currentRoomName]: {
        ...currentRoomData,
        instruction: text,
      },
    }));
  };

  // 下一步
  const handleNext = () => {
    if (currentRoomIndex < roomList.length - 1) {
      setCurrentRoomIndex((prev) => prev + 1);
    } else {
      // 已经是最后一个 => 提交
      handleSubmitAllRooms();
    }
  };

  // 上一步
  const handlePrev = () => {
    if (currentRoomIndex > 0) {
      setCurrentRoomIndex((prev) => prev - 1);
    }
  };

  // 用户跳过该房间 => 清空
  const handleSkip = () => {
    // 不存任何指令 / 图片
    setRoomsData((prev) => ({
      ...prev,
      [currentRoomName]: {
        images: [],
        instruction: '',
      },
    }));
    handleNext();
  };

  // 提交
  const handleSubmitAllRooms = async () => {
    if (!taskId) {
      Alert.alert('Error', 'No taskId provided');
      return;
    }

    try {
      // 将 roomsData 存到 tasks 表的 JSONB 列 (例如 rooms)
      const { error } = await supabase
        .from('tasks')
        .update({ rooms: roomsData })
        .eq('task_id', taskId);

      if (error) throw error;

      Alert.alert('Success', 'Rooms data saved!');
      router.push(`/(pages)/(createTask)/specialRequestPage?taskId=${taskId}`); // 跳转下一个页面
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading property info...</Text>
      </View>
    );
  }

  if (!roomList || roomList.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No rooms found for this property.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F8F9FA', padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Modal: 拍照指令示例 */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}
              >
                Photo Taking Instructions
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 16 }}>
                1. Take clear, well-lit photos.
                {'\n'}2. Ensure the area is fully visible.
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

        {/* Header */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Room: {currentRoomName}
        </Text>

        {/* 提示框 + 弹窗查看详情 */}
        <View
          style={{
            backgroundColor: '#E0F7FA',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
            Take a photo for {currentRoomName}.
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#4E89CE' }}>Photo taking instructions</Text>
          </TouchableOpacity>
        </View>

        {/* 图片九宫格 */}
        <PhotoGrid
          images={currentRoomData.images}
          onImagesChange={handleImagesChange}
          maxImages={5}
        />

        {/* 指令输入 */}
        <Text style={{ fontWeight: '600', marginBottom: 8, marginTop: 16 }}>
          Task Instruction
        </Text>
        <TextInput
          placeholder={`E.g. Clean the ${currentRoomName} thoroughly`}
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

        {/* 导航按钮 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={handleSkip}
            style={[styles.navButton, { backgroundColor: '#bbb' }]}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Skip</Text>
          </TouchableOpacity>

          {currentRoomIndex > 0 && (
            <TouchableOpacity
              onPress={handlePrev}
              style={[styles.navButton, { backgroundColor: '#aaa' }]}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                Previous
              </Text>
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
    minWidth: 90,
    alignItems: 'center',
  },
});
