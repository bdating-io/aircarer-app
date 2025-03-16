import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

interface PropertyAddressFormProps {
  unitNumber: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postalCode: string;
  isGettingLocation?: boolean;
  setUnitNumber: (text: string) => void;
  setStreetNumber: (text: string) => void;
  setStreetName: (text: string) => void;
  setSuburb: (text: string) => void;
  setState: (text: string) => void;
  setPostalCode: (text: string) => void;
  getCurrentLocation?: () => void;
}

const PropertyAddressForm = ({
  unitNumber,
  streetNumber,
  streetName,
  suburb,
  state,
  postalCode,
  isGettingLocation,
  setUnitNumber,
  setStreetNumber,
  setStreetName,
  setSuburb,
  setState,
  setPostalCode,
  getCurrentLocation,
}: PropertyAddressFormProps) => (
  <View className="mt-4">
    <Text className="text-lg font-semibold mb-4">Property Address</Text>

    {/* Add button to get current location */}
    {getCurrentLocation && (
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
          {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
        </Text>
        {isGettingLocation && (
          <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
        )}
      </TouchableOpacity>
    )}

    <View className="flex-row space-x-2 mb-4">
      <View className="flex-1">
        <Text className="text-gray-600 mb-2">Unit/Apt (optional)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Unit number"
          value={unitNumber}
          onChangeText={setUnitNumber}
        />
      </View>
      <View className="flex-1">
        <Text className="text-gray-600 mb-2">Street Number</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Street number"
          value={streetNumber}
          onChangeText={setStreetNumber}
        />
      </View>
    </View>
    <View className="mb-4">
      <Text className="text-gray-600 mb-2">Street Name</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3"
        placeholder="Street name"
        value={streetName}
        onChangeText={setStreetName}
      />
    </View>
    <View className="flex-row space-x-2 mb-4">
      <View className="flex-1">
        <Text className="text-gray-600 mb-2">Suburb</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Suburb"
          value={suburb}
          onChangeText={setSuburb}
        />
      </View>
      <View className="flex-1">
        <Text className="text-gray-600 mb-2">State</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="State"
          value={state}
          onChangeText={setState}
        />
      </View>
    </View>
    <View className="mb-4">
      <Text className="text-gray-600 mb-2">Postal Code</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3"
        placeholder="Postal code"
        value={postalCode}
        onChangeText={setPostalCode}
        keyboardType="numeric"
      />
    </View>
  </View>
);

export default PropertyAddressForm;
