import { supabaseAuthClient } from '@/clients/supabase/auth';
import { supabaseDBClient } from '@/clients/supabase/database';
import { Property } from '@/types/property';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

export const usePropertyViewModel = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [property, setProperty] = useState<Property>();
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);

  //New Property Form State
  const [unitNumber, setUnitNumber] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [petCleaning, setPetCleaning] = useState(false);
  const [carpetCleaning, setCarpetCleaning] = useState(false);
  const [rangeHoodCleaning, setRangeHoodCleaning] = useState(false);
  const [ovenCleaning, setOvenCleaning] = useState(false);
  const [entryMethod, setEntryMethod] = useState('');

  // 请求位置权限
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

  const fetchUserAndProperties = async () => {
    try {
      setLoading(true);

      // 获取当前登录用户
      const user = await supabaseAuthClient.getUser();

      // 保存当前用户ID
      setCurrentUserId(user.id);

      // 获取用户的房源
      const properties = await supabaseDBClient.getUserPropertiesById(user.id);
      setProperties(properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      Alert.alert(
        'Error',
        (error as Error).message || 'Failed to fetch properties',
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProperty = async (property_id: string) => {
    try {
      setLoading(true);
      const property = await supabaseDBClient.getUserPropertyById(property_id);
      if (property) {
        setProperty(property);
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (userId: string, propertyId?: string) => {
    // 检查当前用户是否是房源所有者
    const user = await supabaseAuthClient.getUser();
    if (userId !== user.id) {
      Alert.alert('Error', "You don't have permission to delete this property");
      return;
    }
    if (!propertyId) {
      Alert.alert('Error', 'There was an error deleting this property');
      return;
    }

    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabaseDBClient.deleteUserProperty(propertyId, userId);
              Alert.alert('Success', 'Property deleted!');
              router.push('/(tabs)/propertyList');
            } catch (error) {
              Alert.alert(
                'Error',
                (error as Error).message || 'Failed to delete property',
              );
            } finally {
              await fetchUserAndProperties();
            }
          },
        },
      ],
    );
  };

  const handleEditProperty = async (userId: string, propertyId?: string) => {
    // 检查当前用户是否是房源所有者
    const user = await supabaseAuthClient.getUser();
    if (userId !== user.id) {
      Alert.alert('Error', "You don't have permission to edit this property");
      return;
    }

    if (!propertyId) {
      Alert.alert('Error', 'There was an error deleting this property');
      return;
    }

    router.push(
      `/(pages)/(profile)/(houseOwner)/editProperty?propertyId=${propertyId}`,
    );
  };

  const editProperty = async () => {
    // Validate required fields
    if (
      !property ||
      !property.street_number ||
      !property.street_name ||
      !property.suburb ||
      !property.state ||
      !property.postal_code ||
      !property.entry_method
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (!property.property_id) {
      throw new Error('Property ID not found');
    }
    try {
      setLoading(true);

      await supabaseDBClient.updateUserProperty(property.property_id, {
        ...property,
      });

      Alert.alert('Success', 'Property updated successfully!');
      router.push('/(tabs)/propertyList');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      await fetchUserAndProperties();
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    router.push('/(pages)/(profile)/(houseOwner)/createProperty');
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
        setUnitNumber(address.name || '');
        setStreetNumber(address.streetNumber || '');
        setStreetName(address.street || '');
        setSuburb(address.city || address.district || '');
        setState(address.region || '');
        setPostalCode(address.postalCode || '');
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
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

  const addProperty = async () => {
    try {
      setLoading(true);
      // Get current user ID
      const user = await supabaseAuthClient.getUser();
      // Validate required fields
      if (
        !streetNumber ||
        !streetName ||
        !suburb ||
        !state ||
        !postalCode ||
        !entryMethod
      ) {
        Alert.alert(
          'Incomplete Address',
          'Please fill in all required address fields',
        );
        return;
      }

      const fullAddress = `${
        unitNumber ? unitNumber + '/' : ''
      }${streetNumber} ${streetName}, ${suburb}, ${state} ${postalCode}`;

      // 如果没有坐标，尝试获取坐标
      if (!latitude || !longitude) {
        try {
          // 自动尝试获取坐标
          const geocodeResults = await Location.geocodeAsync(fullAddress);

          if (geocodeResults && geocodeResults.length > 0) {
            const { latitude, longitude } = geocodeResults[0];
            setLatitude(latitude);
            setLongitude(longitude);
          }
        } catch (geocodeError) {
          console.error(
            'Error getting coordinates during submission:',
            geocodeError,
          );
          // 继续提交，即使没有坐标
        }
      }

      // Create new property object
      const newProperty: Property = {
        address: fullAddress,
        unit_number: unitNumber,
        street_number: streetNumber,
        street_name: streetName,
        suburb,
        state,
        postal_code: postalCode,
        latitude,
        longitude,
        bedrooms,
        bathrooms,
        pet_cleaning: petCleaning,
        carpet_cleaning: carpetCleaning,
        range_hood_cleaning: rangeHoodCleaning,
        oven_cleaning: ovenCleaning,
        entry_method: entryMethod,
        user_id: user.id,
      };

      await supabaseDBClient.addUserProperty(newProperty);
      Alert.alert('Success', 'Property added successfully!');

      // Navigate to propertyList page
      router.push('/(tabs)/propertyList');
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Error',
        (error as Error).message || 'An unexpected error occurred',
      );
    } finally {
      await fetchUserAndProperties();
      setLoading(false);
    }
  };

  return {
    // Values
    property,
    properties,
    loading,
    currentUserId,
    locationPermission,
    isGettingLocation,
    unitNumber,
    streetNumber,
    streetName,
    suburb,
    state,
    postalCode,
    latitude,
    longitude,
    bedrooms,
    bathrooms,
    petCleaning,
    carpetCleaning,
    rangeHoodCleaning,
    ovenCleaning,
    entryMethod,

    // Setters
    setProperty,
    setUnitNumber,
    setStreetNumber,
    setStreetName,
    setSuburb,
    setState,
    setPostalCode,
    setLatitude,
    setLongitude,
    setBedrooms,
    setBathrooms,
    setPetCleaning,
    setCarpetCleaning,
    setRangeHoodCleaning,
    setOvenCleaning,
    setEntryMethod,

    // Functions
    fetchProperty,
    fetchUserAndProperties,
    handleDeleteProperty,
    handleEditProperty,
    handleAddProperty,
    renderSpecialRequirements,
    getCurrentLocation,
    addProperty,
    editProperty,
  };
};
