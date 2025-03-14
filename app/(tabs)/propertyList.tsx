import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { usePropertyViewModel } from '@/viewModels/propertyViewModel';

export default function PropertyList() {
  const {
    properties,
    loading,
    currentUserId,
    fetchUserAndProperties,
    handleAddProperty,
    handleEditProperty,
    renderSpecialRequirements,
    handleDeleteProperty,
  } = usePropertyViewModel();

  useEffect(() => {
    fetchUserAndProperties();
  }, []);

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
        <ScrollView className="flex-1 px-4 pt-4">
          {properties.length === 0 ? (
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
          ) : (
            properties.map((property) => (
              <View
                key={property.property_id}
                className="bg-white rounded-lg mb-4 shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Property Header */}
                <View className="bg-blue-50 p-4 border-b border-gray-200">
                  <Text className="text-lg font-semibold">
                    {property.address}
                  </Text>
                </View>

                {/* Property Details */}
                <View className="p-4">
                  <View className="flex-row mb-2">
                    <View className="flex-row items-center mr-4">
                      <AntDesign name="home" size={16} color="#4A90E2" />
                      <Text className="ml-2 text-gray-700">
                        {property.bedrooms} bedroom(s)
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <AntDesign name="dashboard" size={16} color="#4A90E2" />
                      <Text className="ml-2 text-gray-700">
                        {property.bathrooms} bathroom(s)
                      </Text>
                    </View>
                  </View>

                  <View className="mb-2">
                    <Text className="text-gray-600 font-medium">
                      Special Requirements:
                    </Text>
                    <Text className="text-gray-700">
                      {renderSpecialRequirements(property)}
                    </Text>
                  </View>

                  <View className="mb-2">
                    <Text className="text-gray-600 font-medium">
                      Entry Method:
                    </Text>
                    <Text className="text-gray-700">
                      {property.entry_method}
                    </Text>
                  </View>

                  {/* Action Buttons - 只对房源所有者显示 */}
                  {property.user_id === currentUserId && (
                    <View className="flex-row mt-3">
                      <TouchableOpacity
                        className="flex-row items-center bg-amber-400 px-4 py-2 rounded-md mr-3"
                        onPress={() =>
                          handleEditProperty(
                            property.user_id,
                            property.property_id,
                          )
                        }
                      >
                        <AntDesign name="edit" size={16} color="black" />
                        <Text className="ml-2 font-medium">Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-row items-center bg-red-500 px-4 py-2 rounded-md"
                        onPress={() =>
                          handleDeleteProperty(
                            property.user_id,
                            property.property_id,
                          )
                        }
                      >
                        <AntDesign name="delete" size={16} color="white" />
                        <Text className="ml-2 text-white font-medium">
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
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
