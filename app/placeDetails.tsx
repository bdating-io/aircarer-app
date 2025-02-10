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
import { Button } from 'react-native-paper';
import { mockProperties, IProperty } from '../mockData/mockData'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlaceDetails() {
  const router = useRouter();

  const cleaningTypes = ['Regular Cleaning', 'End of Lease Cleaning'];
  const cleaningLevels = ['Quick Cleaning', 'Regular Cleaning', 'Deep Cleaning'];

  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);
  const [cleaningType, setCleaningType] = useState('');
  const [cleaningLevel, setCleaningLevel] = useState('');
  const [equipmentProvided, setEquipmentProvided] = useState<'tasker' | 'owner'>('tasker');

  // Control the open/close state for each dropdown
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);

  // Save data to AsyncStorage and navigate
  const handleSubmit = async () => {
    const payload = {
      selectedPropertyId: selectedProperty?.id || null,
      cleaningType,
      cleaningLevel,
      equipmentProvided,
    };
    console.log('Form data:', payload);

    try {
      // Save the payload in AsyncStorage under the key PLACE_DETAILS
      await AsyncStorage.setItem('PLACE_DETAILS', JSON.stringify(payload));
      console.log('PLACE_DETAILS saved to AsyncStorage!');
    } catch (error) {
      console.error('Error saving PLACE_DETAILS:', error);
    }

    // Navigate to dateSelection
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

      {/* Next Button */}
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

// ===================== STYLES =====================
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

  // ====== Dropdown Styles ======
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
    borderTopWidth: 0,
    borderRadius: 4,
    marginTop: -1,
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

  // ====== Buttons ======
  buttonBase: {
    minWidth: 150,
    marginHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: '#4E89CE',
  },
  unselectedButton: {
    borderColor: '#4E89CE',
    borderWidth: 1,
  },
  selectedLabel: {
    color: '#fff',
    fontSize: 14,
  },
  unselectedLabel: {
    color: '#000',
    fontSize: 14,
  },
});
