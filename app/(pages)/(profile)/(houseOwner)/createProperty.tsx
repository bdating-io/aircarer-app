import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { usePropertyViewModel } from '@/viewModels/propertyViewModel';
import PropertyAddressForm from '@/components/property/PropertyAddressForm';
import BedroomsBathroomsForm from '@/components/property/BedroomsBathroomsForm';
import EntryMethodForm from '@/components/property/EntryMethodForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function CreateProperty() {
  const {
    // Address
    unitNumber,
    streetNumber,
    streetName,
    suburb,
    state,
    postalCode,
    propertyType,
    setUnitNumber,
    setStreetNumber,
    setStreetName,
    setSuburb,
    setState,
    setPostalCode,
    setPropertyType,
    // Rooms
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    livingRooms,
    setLivingRooms,

    // Entry method
    entryMethod,
    setEntryMethod,

    // Others
    loading,
    getCurrentLocation,
    isGettingLocation,
    addProperty,
  } = usePropertyViewModel();

  return (
      <SafeAreaView className="flex-1 bg-white">
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
            unitNumber={unitNumber}
            streetNumber={streetNumber}
            streetName={streetName}
            suburb={suburb}
            state={state}
            postalCode={postalCode}
            propertyType={propertyType}
            isGettingLocation={isGettingLocation}
            
            setUnitNumber={setUnitNumber}
            setStreetNumber={setStreetNumber}
            setStreetName={setStreetName}
            setSuburb={setSuburb}
            setState={setState}
            setPostalCode={setPostalCode}
            setPropertyType={setPropertyType}
            getCurrentLocation={getCurrentLocation}
          />

          {/* Preview Address */}
          {streetNumber && streetName && suburb && (
            <View className="mt-2 p-3 bg-gray-50 rounded-lg mb-4">
              <Text className="text-gray-800 font-medium">
                Address Preview:
              </Text>
              <Text className="text-gray-800">
                {unitNumber ? `${unitNumber} ` : ''}
                {streetNumber} {streetName}, {suburb},{state ? ` ${state}` : ''}
                {postalCode ? ` ${postalCode}` : ''}
              </Text>
            </View>
          )}

          {/* Bedrooms, Bathrooms & Living Rooms */}
          <BedroomsBathroomsForm
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            livingRooms={livingRooms}
            setLivingRooms={setLivingRooms}
          />

          {/* Entry Method */}
          <EntryMethodForm
            entryMethod={entryMethod}
            setEntryMethod={setEntryMethod}
          />
        </KeyboardAwareScrollView>

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
            <Text className="text-white font-medium">Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
