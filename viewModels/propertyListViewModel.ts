import { supabase } from '@/clients/supabase';
import { Property } from '@/types/property';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const usePropertyListViewModel = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

  return {
    currentUserId,
    properties,
    loading,
    fetchUserAndProperties,
    handleDeleteProperty,
    handleEditProperty,
    handleAddProperty,
    renderSpecialRequirements,
  };
};
