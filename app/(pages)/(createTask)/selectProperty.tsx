import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import Dropdown from '@/components/Dropdown';
import { usePropertyViewModel } from '@/viewModels/propertyViewModel';
import { Property } from '@/types/property';
import { supabaseDBClient } from '@/clients/supabase/database';

export default function SelectProperty() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams() as { taskId?: string };

  const [selectedProperty, setSelectedProperty] = useState<
    Property | undefined
  >(undefined);
  const [propertiesFetched, setPropertiesFetched] = useState(false);

  const { loading, properties, fetchUserAndProperties } =
    usePropertyViewModel();

  // ------------------ Load session & fetch properties ------------------
  useEffect(() => {
    const fetchProperties = async () => {
      await fetchUserAndProperties();
      setPropertiesFetched(true);
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (propertiesFetched && properties.length === 0) {
      Alert.alert('No properties found', 'Please add a property first.');
      router.navigate('/(tabs)/propertyList');
    }
  }, [propertiesFetched, properties]);

  // ------------------ Submit => Update existing task & go next ------------------
  const handleSubmit = async () => {
    if (!taskId) {
      throw new Error('No taskId provided in route params.');
    }

    // Check property
    if (!selectedProperty) {
      Alert.alert('Property required', 'Please select a property first.');
      return;
    }

    try {
      await supabaseDBClient.updateTaskById(taskId, {
        property_id: selectedProperty.property_id,
        address: selectedProperty.address,
        // 新增：更新 tasks 表里的经纬度（从 properties 表获取）
        latitude: selectedProperty.latitude,
        longitude: selectedProperty.longitude,
      });

      console.debug('Task updated successfully');
      router.push(`/(pages)/(createTask)/dateSelection?taskId=${taskId}`);
    } catch (err) {
      console.error('Error updating task:', err);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  // ------------------ Render Logic ------------------
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <ActivityIndicator size="large" />
        <Text>Loading properties...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Select Property */}
      <Dropdown
        title="Which property do you want to clean?"
        options={properties.map((prop) => prop.address || 'No address')}
        selectedOption={selectedProperty?.address || ''}
        onSelect={(address) => {
          const prop = properties.find((p) => p.address === address);
          setSelectedProperty(prop);
        }}
        placeholder={'Select your property here'}
      />

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-600 p-4 rounded-lg items-center mt-4"
      >
        <Text className="text-white font-bold">Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
