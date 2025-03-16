import React from 'react';
import { View, Text } from 'react-native';
import ToggleButton from './ToggleButton';

interface SpecialRequirementsFormProps {
  petCleaning: boolean;
  setPetCleaning: (value: boolean) => void;
  carpetCleaning: boolean;
  setCarpetCleaning: (value: boolean) => void;
  rangeHoodCleaning: boolean;
  setRangeHoodCleaning: (value: boolean) => void;
  ovenCleaning: boolean;
  setOvenCleaning: (value: boolean) => void;
}

const SpecialRequirementsForm = ({
  petCleaning,
  setPetCleaning,
  carpetCleaning,
  setCarpetCleaning,
  rangeHoodCleaning,
  setRangeHoodCleaning,
  ovenCleaning,
  setOvenCleaning,
}: SpecialRequirementsFormProps) => (
  <View className="mt-6">
    <Text className="text-lg font-semibold mb-2">Special Requirements</Text>
    <View className="space-y-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600">Pet cleaning</Text>
        <ToggleButton value={petCleaning} onToggle={setPetCleaning} />
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600">Carpet cleaning</Text>
        <ToggleButton value={carpetCleaning} onToggle={setCarpetCleaning} />
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600">Range hood cleaning</Text>
        <ToggleButton
          value={rangeHoodCleaning}
          onToggle={setRangeHoodCleaning}
        />
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600">Oven cleaning</Text>
        <ToggleButton value={ovenCleaning} onToggle={setOvenCleaning} />
      </View>
    </View>
  </View>
);

export default SpecialRequirementsForm;
