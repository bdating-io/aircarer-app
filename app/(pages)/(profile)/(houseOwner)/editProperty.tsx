import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import PropertyAddressForm from '@/components/property/PropertyAddressForm';
import BedroomsBathroomsForm from '@/components/property/BedroomsBathroomsForm';
import { usePropertyViewModel } from '@/viewModels/propertyViewModel';
import EntryMethodForm from '@/components/property/EntryMethodForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function EditProperty() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();
  const {
    property,
    loading,
    fetchProperty,
    handleDeleteProperty,
    setProperty,
    editProperty,
  } = usePropertyViewModel();

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId as string);
    }
  }, [propertyId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="mt-4 text-gray-600">Loading property details...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <AntDesign name="exclamationcircleo" size={50} color="#FF4D4F" />
        <Text className="mt-4 text-lg font-semibold">Property Not Found</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-2 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Edit Property</Text>
          <TouchableOpacity
            onPress={() =>
              handleDeleteProperty(property.user_id, property.property_id)
            }
          >
            <AntDesign name="delete" size={24} color="#FF4D4F" />
          </TouchableOpacity>
        </View>
      </View>

        <KeyboardAwareScrollView
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={50}
            keyboardOpeningTime={0}
            enableResetScrollToCoords={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            viewIsInsideTabBar={true}
        >
          {/* Address Details */}
          <PropertyAddressForm
            unitNumber={property.unit_number ?? ''}
            streetNumber={property.street_number}
            streetName={property.street_name}
            suburb={property.suburb}
            state={property.state}
            postalCode={property.postal_code}
            setUnitNumber={(text) =>
              setProperty({ ...property, unit_number: text })
            }
            setStreetNumber={(text) =>
              setProperty({ ...property, street_number: text })
            }
            setStreetName={(text) =>
              setProperty({ ...property, street_name: text })
            }
            setSuburb={(text) => setProperty({ ...property, suburb: text })}
            setState={(text) => setProperty({ ...property, state: text })}
            setPostalCode={(text) =>
              setProperty({ ...property, postal_code: text })
            }
          />

          {/* Preview Address */}
          {property.street_number &&
            property.street_name &&
            property.suburb && (
              <View className="mt-2 p-3 bg-gray-50 rounded-lg mb-4">
                <Text className="text-gray-800 font-medium">
                  Address Preview:
                </Text>
                <Text className="text-gray-800">
                  {property.unit_number ? `${property.unit_number}/` : ''}
                  {property.street_number} {property.street_name},{' '}
                  {property.suburb},{property.state ? ` ${property.state}` : ''}
                  {property.postal_code ? property.postal_code : ''}
                </Text>
              </View>
            )}

          {/* Bedrooms, Bathrooms and Living Rooms */}
          <BedroomsBathroomsForm
            bedrooms={property.bedrooms}
            setBedrooms={(value) =>
              setProperty({ ...property, bedrooms: value })
            }
            bathrooms={property.bathrooms}
            setBathrooms={(value) =>
              setProperty({ ...property, bathrooms: value })
            }
            livingRooms={property.living_rooms}
            setLivingRooms={(value) =>
              setProperty({ ...property, living_rooms: value })
            }
          />

          {/* Entry Method */}
          <EntryMethodForm
            entryMethod={property.entry_method}
            setEntryMethod={(value) =>
              setProperty({ ...property, entry_method: value })
            }
          />
        </KeyboardAwareScrollView>

      {/* Update Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-3 items-center"
          onPress={editProperty}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium">Update Property</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
