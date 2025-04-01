import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Property } from '@/types/property';

interface PropertyCellProps {
  property: Property;
  currentUserId: string | null;
  handleEditProperty: (userId: string, propertyId?: string) => void;
  handleDeleteProperty: (userId: string, propertyId?: string) => void;
}

const PropertyCell: React.FC<PropertyCellProps> = ({
  property,
  currentUserId,
  handleEditProperty,
  handleDeleteProperty,
}) => {
  return (
    <View
      key={property.property_id}
      className="bg-white rounded-lg mb-4 shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Property Header */}
      <View className="bg-blue-50 p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold">{property.address}</Text>
      </View>

      {/* Property Details */}
      <View className="p-4">
        <View className="flex-row mb-2">
          <View className="flex-row items-center mr-4">
            <FontAwesome name="bed" size={16} color="#4A90E2" />
            <Text className="ml-2 text-gray-700">
              {property.bedrooms} bedroom(s)
            </Text>
          </View>
          <View className="flex-row items-center">
            <FontAwesome name="bath" size={16} color="#4A90E2" />
            <Text className="ml-2 text-gray-700">
              {property.bathrooms} bathroom(s)
            </Text>
          </View>
        </View>

        <View className="mb-2">
          <Text className="text-gray-600 font-medium">Entry Method:</Text>
          <Text className="text-gray-700">{property.entry_method}</Text>
        </View>

        {/* Action Buttons - 只对房源所有者显示 */}
        {property.user_id === currentUserId && (
          <View className="flex-row mt-3">
            <TouchableOpacity
              className="flex-row items-center bg-amber-400 px-4 py-2 rounded-md mr-3"
              onPress={() =>
                handleEditProperty(property.user_id, property.property_id)
              }
            >
              <AntDesign name="edit" size={16} color="black" />
              <Text className="ml-2 font-medium">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center bg-red-500 px-4 py-2 rounded-md"
              onPress={() =>
                handleDeleteProperty(property.user_id, property.property_id)
              }
            >
              <AntDesign name="delete" size={16} color="white" />
              <Text className="ml-2 text-white font-medium">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default PropertyCell;
