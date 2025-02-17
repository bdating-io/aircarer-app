import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
<<<<<<< HEAD:app/(pages)/(createTask)/placeDetails.tsx
import { Button } from 'react-native-paper';
import { mockProperties, IProperty } from '../../mockData/mockData'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
=======
import { Button } from 'react-native-paper';  // 如果想保留 paper 的按钮样式可继续使用
import { mockProperties, IProperty } from '../mockData/mockData'; 
>>>>>>> parent of ab556a4 (updated):app/placeDetails.tsx

export default function PlaceDetails() {
  const router = useRouter();

  const cleaningTypes = ['Regular Cleaning', 'End of Lease Cleaning'];
  const cleaningLevels = ['Quick Cleaning', 'Regular Cleaning', 'Deep Cleaning'];

  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);
  const [cleaningType, setCleaningType] = useState('');
  const [cleaningLevel, setCleaningLevel] = useState('');
  const [equipmentProvided, setEquipmentProvided] = useState<'tasker' | 'owner'>('tasker');

  // 下面三个状态分别控制每个下拉菜单的打开/关闭
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);

  // 点击“Next”按钮
  const handleSubmit = () => {
    const payload = {
      selectedPropertyId: selectedProperty?.id || null,
      cleaningType,
      cleaningLevel,
      equipmentProvided,
    };
    console.log('Form data:', payload);

    router.push({
      pathname: '/dateSelection',
      params: { propertyId: selectedProperty?.id },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Task Detail</Text>

      {/* Select Property */}
      <Text style={styles.label}>Select your property</Text>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setPropertyOpen(!propertyOpen)}
        >
          <Text style={styles.dropdownText}>
            {selectedProperty ? selectedProperty.name : 'Select your property here'}
          </Text>
          <Ionicons
            name={propertyOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
        
        {propertyOpen && (
          <View style={styles.dropdownMenu}>
            {mockProperties.map((propertyItem) => (
              <TouchableOpacity
                key={propertyItem.id}
                style={styles.dropdownItem}
                onPress={() => {
                  // 直接将整条数据赋给 selectedProperty
                  setSelectedProperty(propertyItem);
                  setPropertyOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{propertyItem.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Cleaning Type */}
      <Text style={styles.label}>What kind of clean is this?</Text>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setTypeOpen(!typeOpen)}
        >
          <Text style={styles.dropdownText}>
            {cleaningType || 'Select cleaning type here'}
          </Text>
          <Ionicons
            name={typeOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
        {typeOpen && (
          <View style={styles.dropdownMenu}>
            {cleaningTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownItem}
                onPress={() => {
                  setCleaningType(type);
                  setTypeOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Cleaning Level */}
      <Text style={styles.label}>What cleaning level?</Text>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setLevelOpen(!levelOpen)}
        >
          <Text style={styles.dropdownText}>
            {cleaningLevel || 'Select cleaning level here'}
          </Text>
          <Ionicons
            name={levelOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
        {levelOpen && (
          <View style={styles.dropdownMenu}>
            {cleaningLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={styles.dropdownItem}
                onPress={() => {
                  setCleaningLevel(level);
                  setLevelOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Equipment Provided */}
      <Text style={styles.label}>Does the cleaner need to bring equipment and supplies?</Text>
      <View style={styles.equipmentContainer}>
        <Button
          mode={equipmentProvided === 'tasker' ? 'contained' : 'outlined'}
          onPress={() => setEquipmentProvided('tasker')}
          style={
            equipmentProvided === 'tasker'
              ? [styles.buttonBase, styles.selectedButton]
              : [styles.buttonBase, styles.unselectedButton]
          }
          labelStyle={
            equipmentProvided === 'tasker'
              ? styles.selectedLabel
              : styles.unselectedLabel
          }
        >
          Yes, tasker brings
        </Button>

        <Button
          mode={equipmentProvided === 'owner' ? 'contained' : 'outlined'}
          onPress={() => setEquipmentProvided('owner')}
          style={
            equipmentProvided === 'owner'
              ? [styles.buttonBase, styles.selectedButton]
              : [styles.buttonBase, styles.unselectedButton]
          }
          labelStyle={
            equipmentProvided === 'owner'
              ? styles.selectedLabel
              : styles.unselectedLabel
          }
        >
          No, I will provide
        </Button>
      </View>

      
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: '#4E89CE',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  equipmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#4E89CE',
    padding: 10,
  },

  // ====== 自定义下拉框的相关样式 ======
  dropdownWrapper: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#4E89CE',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopWidth: 0, // 让下拉菜单与按钮衔接
    borderRadius: 4,
    marginTop: -1, // 去除与触发按钮的边缝
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },

  // ====== 下面是按钮的关键样式 ======
  buttonBase: {
    // 取消 flex:1 避免文字被压缩
    // 或者可改成固定宽度/最小宽度来保证不截断
    minWidth: 150,
    marginHorizontal: 4,
  },
  selectedButton: {
    // 被选中（Contained）的按钮底色
    backgroundColor: '#4E89CE',
  },
  unselectedButton: {
    // 未选中（Outlined）按钮的描边颜色（在 paper v5+ 可以自动处理）
    borderColor: '#4E89CE',
    borderWidth: 1,
  },
  selectedLabel: {
    // Contained 按钮文本颜色
    color: '#fff',
    fontSize: 14,
  },
  unselectedLabel: {
    // Outlined 按钮文本颜色
    color: '#000',
    fontSize: 14,
  },
});
