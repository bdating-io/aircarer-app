import React from 'react';
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
import { AntDesign } from '@expo/vector-icons';
import { usePropertyViewModel } from '@/viewModels/propertyViewModel';

interface ToggleButtonProps {
  value: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
}

const ToggleButton = ({ value, onToggle }: ToggleButtonProps) => (
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

export default function CreateProperty() {
  const {
    unitNumber,
    streetNumber,
    streetName,
    suburb,
    state,
    postalCode,
    latitude,
    longitude,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    petCleaning,
    setPetCleaning,
    carpetCleaning,
    setCarpetCleaning,
    rangeHoodCleaning,
    setRangeHoodCleaning,
    ovenCleaning,
    setOvenCleaning,
    entryMethod,
    setEntryMethod,
    setUnitNumber,
    setStreetNumber,
    setStreetName,
    setSuburb,
    setState,
    setPostalCode,
    loading,
    getCurrentLocation,
    isGettingLocation,
    geocodeAddress,
    isGeocodingAddress,
    handleSubmit,
  } = usePropertyViewModel();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4">
          {/* Address Details */}
          <View className="mt-4">
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
                  value={unitNumber}
                  onChangeText={setUnitNumber}
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">
                  Street Number <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Street number"
                  value={streetName}
                  onChangeText={setStreetNumber}
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
                value={streetName}
                onChangeText={setStreetName}
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
                  value={suburb}
                  onChangeText={setSuburb}
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 mb-2">
                  State <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="State"
                  value={state}
                  onChangeText={setState}
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
                value={postalCode}
                onChangeText={setPostalCode}
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
            {latitude && longitude && (
              <View className="mt-2 p-3 bg-gray-50 rounded-lg mb-4">
                <Text className="text-gray-800 font-medium">Coordinates:</Text>
                <Text className="text-gray-800">
                  Latitude: {latitude.toFixed(6)}
                </Text>
                <Text className="text-gray-800">
                  Longitude: {longitude.toFixed(6)}
                </Text>
              </View>
            )}
          </View>

          {/* Preview Address */}
          {streetNumber && streetName && suburb && (
            <View className="mt-2 p-3 bg-gray-50 rounded-lg mb-4">
              <Text className="text-gray-800 font-medium">
                Address Preview:
              </Text>
              <Text className="text-gray-800">
                {unitNumber ?? ''}
                {streetNumber} {streetName}, {suburb},{state ?? ''}
                {postalCode ?? ''}
              </Text>
            </View>
          )}

          {/* Bedrooms */}
          <View className="mt-6">
            <Text className="text-gray-600 mb-2">Bedrooms</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  if (bedrooms > 1) {
                    setBedrooms(bedrooms - 1);
                  }
                }}
              >
                <AntDesign name="minus" size={20} color="#4A90E2" />
              </TouchableOpacity>

              <Text className="mx-4 text-lg font-semibold">{bedrooms}</Text>

              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  setBedrooms(bedrooms + 1);
                }}
              >
                <AntDesign name="plus" size={20} color="#4A90E2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bathrooms */}
          <View className="mt-6">
            <Text className="text-gray-600 mb-2">Bathrooms</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  if (bathrooms > 1) {
                    setBathrooms(bathrooms - 1);
                  }
                }}
              >
                <AntDesign name="minus" size={20} color="#4A90E2" />
              </TouchableOpacity>

              <Text className="mx-4 text-lg font-semibold">{bathrooms}</Text>

              <TouchableOpacity
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => {
                  setBathrooms(bathrooms + 1);
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
                  value={petCleaning}
                  onToggle={(value) => setPetCleaning(value)}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Carpet cleaning</Text>
                <ToggleButton
                  value={carpetCleaning}
                  onToggle={(value) => setCarpetCleaning(value)}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Range hood cleaning</Text>
                <ToggleButton
                  value={rangeHoodCleaning}
                  onToggle={(value) => setRangeHoodCleaning(value)}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Oven cleaning</Text>
                <ToggleButton
                  value={ovenCleaning}
                  onToggle={(value) => setOvenCleaning(value)}
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
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Enter method details"
              value={entryMethod}
              onChangeText={(text) => setEntryMethod(text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
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
            <Text className="text-white font-medium">{'Submit'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
