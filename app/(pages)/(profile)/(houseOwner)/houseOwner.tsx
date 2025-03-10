import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '@/clients/supabase';
import * as Location from 'expo-location';

interface Property {
  property_id?: number;
  user_id?: string;
  address: string;
  pet_cleaning: boolean;
  carpet_cleaning: boolean;
  range_hood_cleaning: boolean;
  oven_cleaning: boolean;
  entry_method: string;
  bedrooms: string[];
  bathrooms: number;
  unit_number?: string;
  street_number: string;
  street_name: string;
  suburb: string;
  state: string;
  postal_code: string;
  created_at?: string;
  latitude?: number;
  longitude?: number;
}

const initialProperty: Property = {
  address: '',
  pet_cleaning: false,
  carpet_cleaning: false,
  range_hood_cleaning: false,
  oven_cleaning: false,
  entry_method: '',
  bedrooms: [''],
  bathrooms: 1,
  unit_number: '',
  street_number: '',
  street_name: '',
  suburb: '',
  state: '',
  postal_code: '',
  latitude: undefined,
  longitude: undefined,
};

interface ToggleButtonProps {
  value: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
}

const ToggleButton = ({ value, onToggle, label }: ToggleButtonProps) => (
  <View className="flex-row space-x-2">
    <TouchableOpacity
      className={`px-6 py-2 rounded-full border ${
        value ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
      }`}
      onPress={() => onToggle(true)}
    >
      <Text className={value ? 'text-white' : 'text-gray-600'}>YES</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className={`px-6 py-2 rounded-full border ${
        !value ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
      }`}
      onPress={() => onToggle(false)}
    >
      <Text className={!value ? 'text-white' : 'text-gray-600'}>No</Text>
    </TouchableOpacity>
  </View>
);

export default function HouseOwner() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([initialProperty]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState<boolean>(false);

  const currentProperty = properties[currentIndex];

  // 请求位置权限
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

  // 获取当前位置并转换为地址
  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);

      if (!locationPermission) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature',
          );
          setIsGettingLocation(false);
          return;
        }
        setLocationPermission(true);
      }

      // 获取当前位置
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // 通过逆地理编码获取地址信息
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];

        // 更新属性信息
        updateCurrentProperty({
          unit_number: address.name || '',
          street_number: address.streetNumber || '',
          street_name: address.street || '',
          suburb: address.city || address.district || '',
          state: address.region || '',
          postal_code: address.postalCode || '',
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert('Error', 'Could not determine your address');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get your current location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // 根据地址获取坐标
  const geocodeAddress = async () => {
    try {
      setIsGeocodingAddress(true);

      if (
        !currentProperty.street_number ||
        !currentProperty.street_name ||
        !currentProperty.suburb ||
        !currentProperty.state ||
        !currentProperty.postal_code
      ) {
        Alert.alert(
          'Incomplete Address',
          'Please fill in all required address fields',
        );
        setIsGeocodingAddress(false);
        return;
      }

      // 构建完整地址
      const fullAddress = `${
        currentProperty.unit_number ? currentProperty.unit_number + '/' : ''
      }${currentProperty.street_number} ${currentProperty.street_name}, ${
        currentProperty.suburb
      }, ${currentProperty.state} ${currentProperty.postal_code}`;

      // 使用 Google Geocoding API 或其他服务获取坐标
      // 注意：此功能需要 Google API Key，以下是使用 Expo Location 的替代方案
      const geocodeResults = await Location.geocodeAsync(fullAddress);

      if (geocodeResults && geocodeResults.length > 0) {
        const { latitude, longitude } = geocodeResults[0];
        updateCurrentProperty({
          latitude,
          longitude,
        });
        Alert.alert('Success', 'Address coordinates obtained successfully');
      } else {
        Alert.alert(
          'Error',
          'Could not determine coordinates for this address',
        );
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      Alert.alert('Error', 'Failed to get coordinates for this address');
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Get current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      // Validate required fields
      if (
        !currentProperty.street_number ||
        !currentProperty.street_name ||
        !currentProperty.suburb ||
        !currentProperty.state ||
        !currentProperty.postal_code ||
        !currentProperty.entry_method
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Construct full address
      const fullAddress = `${
        currentProperty.unit_number ? currentProperty.unit_number + '/' : ''
      }${currentProperty.street_number} ${currentProperty.street_name}, ${
        currentProperty.suburb
      }, ${currentProperty.state} ${currentProperty.postal_code}`;

      // 检查数据库结构
      console.log('Bedrooms data:', currentProperty.bedrooms);

      // 如果 bedrooms 是一个数组，但数据库期望一个单一的 smallint
      // 我们可以取第一个卧室的值或者计算总数
      const bedroomCount =
        currentProperty.bedrooms.length > 0 ? currentProperty.bedrooms[0] : 1;

      // 如果没有坐标，尝试获取坐标
      if (!currentProperty.latitude || !currentProperty.longitude) {
        try {
          // 自动尝试获取坐标
          const fullAddress = `${
            currentProperty.unit_number ? currentProperty.unit_number + '/' : ''
          }${currentProperty.street_number} ${currentProperty.street_name}, ${
            currentProperty.suburb
          }, ${currentProperty.state} ${currentProperty.postal_code}`;

          const geocodeResults = await Location.geocodeAsync(fullAddress);

          if (geocodeResults && geocodeResults.length > 0) {
            const { latitude, longitude } = geocodeResults[0];
            updateCurrentProperty({
              latitude,
              longitude,
            });
          }
        } catch (geocodeError) {
          console.error(
            'Error getting coordinates during submission:',
            geocodeError,
          );
          // 继续提交，即使没有坐标
        }
      }

      const { data, error } = await supabase.from('properties').insert([
        {
          address: fullAddress,
          bedrooms: bedroomCount, // 使用单个数字而不是数组
          pet_cleaning: currentProperty.pet_cleaning,
          carpet_cleaning: currentProperty.carpet_cleaning,
          range_hood_cleaning: currentProperty.range_hood_cleaning,
          oven_cleaning: currentProperty.oven_cleaning,
          entry_method: currentProperty.entry_method,
          user_id: user.id,
          bathrooms: currentProperty.bathrooms,
          unit_number: currentProperty.unit_number,
          street_number: currentProperty.street_number,
          street_name: currentProperty.street_name,
          suburb: currentProperty.suburb,
          state: currentProperty.state,
          postal_code: currentProperty.postal_code,
          latitude: currentProperty.latitude,
          longitude: currentProperty.longitude,
        },
      ]);

      if (error) throw error;
      Alert.alert('Success', 'Property added successfully!');

      // Navigate to propertyList page
      router.push('/(tabs)/propertyList');
    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert('Error', error?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addNewProperty = () => {
    setProperties([...properties, { ...initialProperty }]);
    setCurrentIndex(properties.length);
  };

  const updateCurrentProperty = (updates: Partial<Property>) => {
    const updatedProperties = [...properties];
    updatedProperties[currentIndex] = {
      ...currentProperty,
      ...updates,
    };
    setProperties(updatedProperties);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">
            Property {currentIndex + 1}
          </Text>
          <View style={{ width: 24 }} /> {/* Empty space for symmetry */}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4">
          {/* Address Details */}
          <View className="mt-6">
            <Text className="text-lg font-semibold mb-4">Property Address</Text>

            {/* Add button to get current location */}
            <TouchableOpacity
              className="mb-4 py-3 px-4 bg-blue-500 rounded-lg flex-row items-center justify-center"
              onPress={getCurrentLocation}
              disabled={isGettingLocation}
            >
              <AntDesign
                name="enviromento"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-medium">
                {isGettingLocation
                  ? 'Getting Location...'
                  : 'Use Current Location'}
              </Text>
              {isGettingLocation && (
                <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
              )}
            </TouchableOpacity>

            <View className="flex-row space-x-2 mb-4">
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">Unit/Apt (optional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Unit number"
                  value={currentProperty.unit_number}
                  onChangeText={(text) =>
                    updateCurrentProperty({ unit_number: text })
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">
                  Street Number <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Street number"
                  value={currentProperty.street_number}
                  onChangeText={(text) =>
                    updateCurrentProperty({ street_number: text })
                  }
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">
                Street Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="Street name"
                value={currentProperty.street_name}
                onChangeText={(text) =>
                  updateCurrentProperty({ street_name: text })
                }
              />
            </View>

            <View className="flex-row space-x-2 mb-4">
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">
                  Suburb <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Suburb"
                  value={currentProperty.suburb}
                  onChangeText={(text) =>
                    updateCurrentProperty({ suburb: text })
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">
                  State <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="State"
                  value={currentProperty.state}
                  onChangeText={(text) =>
                    updateCurrentProperty({ state: text })
                  }
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">
                Postal Code <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="Postal code"
                value={currentProperty.postal_code}
                onChangeText={(text) =>
                  updateCurrentProperty({ postal_code: text })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Add button to geocode address */}
            <TouchableOpacity
              className="mt-4 mb-4 py-3 px-4 bg-green-500 rounded-lg flex-row items-center justify-center"
              onPress={geocodeAddress}
              disabled={isGeocodingAddress}
            >
              <AntDesign
                name="search1"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-medium">
                {isGeocodingAddress
                  ? 'Getting Coordinates...'
                  : 'Get Address Coordinates'}
              </Text>
              {isGeocodingAddress && (
                <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
              )}
            </TouchableOpacity>

            {/* Display coordinates if available */}
            {currentProperty.latitude && currentProperty.longitude && (
              <View className="mt-2 p-3 bg-gray-50 rounded-lg mb-4">
                <Text className="text-gray-800 font-medium">Coordinates:</Text>
                <Text className="text-gray-800">
                  Latitude: {currentProperty.latitude.toFixed(6)}
                </Text>
                <Text className="text-gray-800">
                  Longitude: {currentProperty.longitude.toFixed(6)}
                </Text>
              </View>
            )}
          </View>

          {/* Preview Address */}
          {currentProperty.street_number &&
            currentProperty.street_name &&
            currentProperty.suburb && (
              <View className="mt-2 p-3 bg-gray-50 rounded-lg mb-4">
                <Text className="text-gray-800 font-medium">
                  Address Preview:
                </Text>
                <Text className="text-gray-800">
                  {currentProperty.unit_number
                    ? `${currentProperty.unit_number}/`
                    : ''}
                  {currentProperty.street_number} {currentProperty.street_name},{' '}
                  {currentProperty.suburb},
                  {currentProperty.state ? ` ${currentProperty.state}` : ''}
                  {currentProperty.postal_code
                    ? currentProperty.postal_code
                    : ''}
                </Text>
              </View>
            )}

          {/* Bedrooms */}
          <View className="mt-6">
            <Text className="text-gray-600 mb-2">Bedrooms</Text>
            {currentProperty.bedrooms.map((room, index) => (
              <TextInput
                key={index}
                className="border border-gray-300 rounded-lg p-3 mb-2"
                placeholder="1"
                value={room}
                onChangeText={(text) => {
                  const newBedrooms = [...currentProperty.bedrooms];
                  newBedrooms[index] = text;
                  updateCurrentProperty({ bedrooms: newBedrooms });
                }}
                keyboardType="numeric"
              />
            ))}
            <TouchableOpacity
              className="mt-2"
              onPress={() =>
                updateCurrentProperty({
                  bedrooms: [...currentProperty.bedrooms, ''],
                })
              }
            >
              <Text className="text-blue-500">+ Add another bedroom</Text>
            </TouchableOpacity>
          </View>

          {/* Bathrooms */}
          <View className="mt-6">
            <Text className="text-gray-600 mb-2">Bathrooms</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  if (currentProperty.bathrooms > 1) {
                    updateCurrentProperty({
                      bathrooms: currentProperty.bathrooms - 1,
                    });
                  }
                }}
              >
                <AntDesign name="minus" size={20} color="#4A90E2" />
              </TouchableOpacity>

              <Text className="mx-4 text-lg font-semibold">
                {currentProperty.bathrooms}
              </Text>

              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  updateCurrentProperty({
                    bathrooms: currentProperty.bathrooms + 1,
                  });
                }}
              >
                <AntDesign name="plus" size={20} color="#4A90E2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Special Requirements */}
          <View className="mt-6">
            <Text className="text-lg font-semibold mb-2">
              Special Requirements
            </Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Pet cleaning</Text>
                <ToggleButton
                  value={currentProperty.pet_cleaning}
                  onToggle={(value) =>
                    updateCurrentProperty({ pet_cleaning: value })
                  }
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Carpet cleaning</Text>
                <ToggleButton
                  value={currentProperty.carpet_cleaning}
                  onToggle={(value) =>
                    updateCurrentProperty({ carpet_cleaning: value })
                  }
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Range hood cleaning</Text>
                <ToggleButton
                  value={currentProperty.range_hood_cleaning}
                  onToggle={(value) =>
                    updateCurrentProperty({ range_hood_cleaning: value })
                  }
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Oven cleaning</Text>
                <ToggleButton
                  value={currentProperty.oven_cleaning}
                  onToggle={(value) =>
                    updateCurrentProperty({ oven_cleaning: value })
                  }
                />
              </View>
            </View>
          </View>

          {/* Entry Method */}
          <View className="mt-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-600">Entry Method</Text>
              <Text className="text-red-500 ml-2">*</Text>
              <Text className="text-gray-600 ml-2">(compulsory)</Text>
              <TouchableOpacity
                className="ml-2"
                onPress={() =>
                  Alert.alert(
                    'Entry Method',
                    'Please provide details on how the cleaner can access your property (e.g., key in mailbox, door code, etc.)',
                  )
                }
              >
                <AntDesign name="questioncircleo" size={16} color="gray" />
              </TouchableOpacity>
            </View>
            <TextInput
              className={`border ${
                !currentProperty.entry_method
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-lg p-3`}
              placeholder="Enter method details"
              value={currentProperty.entry_method}
              onChangeText={(text) =>
                updateCurrentProperty({ entry_method: text })
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {!currentProperty.entry_method && (
              <Text className="text-red-500 text-sm mt-1">
                This field is required
              </Text>
            )}
          </View>

          {/* Add New Property Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center border border-blue-500 rounded-lg p-4 mt-6 mb-6"
            onPress={addNewProperty}
          >
            <AntDesign name="plus" size={20} color="#4A90E2" />
            <Text className="text-blue-500 ml-2">Add New Property</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-3 items-center"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium">
              {currentIndex === properties.length - 1
                ? 'Submit'
                : 'Next Property'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
