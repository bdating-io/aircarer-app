import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '@/clients/supabase';

interface Property {
  property_id: string;
  user_id: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  pet_cleaning: boolean;
  carpet_cleaning: boolean;
  range_hood_cleaning: boolean;
  oven_cleaning: boolean;
  entry_method: string;
  unit_number?: string;
  street_number?: string;
  street_name?: string;
  suburb?: string;
  state?: string;
  postal_code?: string;
}

export default function PropertyList() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAndProperties();
  }, []);

  const fetchUserAndProperties = async () => {
    try {
      setLoading(true);

      // 获取当前登录用户
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        Alert.alert('Error', 'Please login first');
        router.push('/');
        return;
      }

      // 保存当前用户ID
      setCurrentUserId(user.id);

      // 获取用户的房源
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      Alert.alert('Error', error?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string, userId: string) => {
    // 检查当前用户是否是房源所有者
    if (userId !== currentUserId) {
      Alert.alert('Error', "You don't have permission to delete this property");
      return;
    }

    try {
      Alert.alert(
        'Delete Property',
        'Are you sure you want to delete this property?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              setLoading(true);
              const { error } = await supabase
                .from('properties')
                .delete()
                .eq('property_id', propertyId)
                .eq('user_id', currentUserId); // 添加用户ID条件确保安全

              if (error) {
                Alert.alert('Error', error.message);
                return;
              }

              Alert.alert('Success', 'Property deleted!');
              fetchUserAndProperties();
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to delete property');
    }
  };

  const handleEditProperty = (propertyId: string, userId: string) => {
    // 检查当前用户是否是房源所有者
    if (userId !== currentUserId) {
      Alert.alert('Error', "You don't have permission to edit this property");
      return;
    }

    router.push(`/(pages)/(profile)/editProperty?propertyId=${propertyId}`);
  };

  const handleAddProperty = () => {
    router.push('/(pages)/(profile)/(houseOwner)/houseOwner');
  };

  const renderSpecialRequirements = (property: Property) => {
    const requirements = [];
    if (property.pet_cleaning) requirements.push('Pet Cleaning');
    if (property.carpet_cleaning) requirements.push('Carpet Cleaning');
    if (property.range_hood_cleaning) requirements.push('Range Hood Cleaning');
    if (property.oven_cleaning) requirements.push('Oven Cleaning');

    if (requirements.length === 0) return 'None';
    return requirements.join(', ');
  };

  const canEditProperty = (userId: string) => {
    return userId === currentUserId;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold ml-4">My Properties</Text>
          </View>
          <TouchableOpacity
            onPress={handleAddProperty}
            className="bg-blue-500 rounded-full p-2"
          >
            <AntDesign name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
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
                  {canEditProperty(property.user_id) && (
                    <View className="flex-row mt-3">
                      <TouchableOpacity
                        className="flex-row items-center bg-amber-400 px-4 py-2 rounded-md mr-3"
                        onPress={() =>
                          handleEditProperty(
                            property.property_id,
                            property.user_id,
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
                            property.property_id,
                            property.user_id,
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

          <View className="h-20" />
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
    </SafeAreaView>
  );
}
