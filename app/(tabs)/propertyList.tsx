import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { usePropertyViewModel } from '@/viewModels/propertyViewModel';
import PropertyCell from '@/components/property/PropertyCell';
import { Property } from '@/types/property';

export default function PropertyList() {
  const {
    properties,
    loading,
    currentUserId,
    fetchUserAndProperties,
    handleAddProperty,
    handleEditProperty,
    handleDeleteProperty,
    renderSpecialRequirements,
  } = usePropertyViewModel();

  useEffect(() => {
    fetchUserAndProperties();
  }, []);

  const renderItem = ({ item }: { item: Property }) => (
    <PropertyCell
      property={item}
      currentUserId={currentUserId}
      handleEditProperty={handleEditProperty}
      handleDeleteProperty={handleDeleteProperty}
      renderSpecialRequirements={renderSpecialRequirements}
    />
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-500 p-4 pt-16">
        <Text className="text-white text-2xl font-semibold">My Properties</Text>
      </View>

      {/* Property List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text className="mt-4 text-gray-600">Loading properties...</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <AntDesign name="home" size={60} color="#CCCCCC" />
              <Text className="text-lg text-gray-500 mt-4">
                No properties found
              </Text>
              <TouchableOpacity
                className="mt-6 bg-blue-500 px-6 py-3 rounded-full flex-row items-center"
                onPress={handleAddProperty}
              >
                <AntDesign name="plus" size={18} color="white" />
                <Text className="text-white ml-2 font-medium">
                  Add Property
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Floating Action Button (when properties exist) */}
      {properties.length > 0 && (
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            className="bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            onPress={handleAddProperty}
          >
            <AntDesign name="plus" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
