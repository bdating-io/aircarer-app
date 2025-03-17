import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { usePropertyViewModel } from '@/viewModels/propertyViewModel';
import PropertyAddressForm from '@/components/property/PropertyAddressForm';
import BedroomsBathroomsForm from '@/components/property/BedroomsBathroomsForm';
import SpecialRequirementsForm from '@/components/property/SpecialRequirementsForm';
import EntryMethodForm from '@/components/property/EntryMethodForm';

export default function CreateProperty() {
  const {
    unitNumber,
    streetNumber,
    streetName,
    suburb,
    state,
    postalCode,
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
    addProperty,
  } = usePropertyViewModel();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4">
          {/* Address Details */}

          <PropertyAddressForm
            unitNumber={unitNumber}
            streetNumber={streetNumber}
            streetName={streetName}
            suburb={suburb}
            state={state}
            postalCode={postalCode}
            isGettingLocation={isGettingLocation}
            setUnitNumber={setUnitNumber}
            setStreetNumber={setStreetNumber}
            setStreetName={setStreetName}
            setSuburb={setSuburb}
            setState={setState}
            setPostalCode={setPostalCode}
            getCurrentLocation={getCurrentLocation}
          />

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

          {/* Bedrooms & Bathrooms */}
          <BedroomsBathroomsForm
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
          />

          {/* Special Requirements */}
          <SpecialRequirementsForm
            petCleaning={petCleaning}
            setPetCleaning={setPetCleaning}
            carpetCleaning={carpetCleaning}
            setCarpetCleaning={setCarpetCleaning}
            rangeHoodCleaning={rangeHoodCleaning}
            setRangeHoodCleaning={setRangeHoodCleaning}
            ovenCleaning={ovenCleaning}
            setOvenCleaning={setOvenCleaning}
          />

          {/* Entry Method */}
          <EntryMethodForm
            entryMethod={entryMethod}
            setEntryMethod={setEntryMethod}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-3 items-center"
          onPress={addProperty}
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
