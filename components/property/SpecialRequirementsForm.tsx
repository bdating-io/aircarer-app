import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ToggleButton from './ToggleButton';

interface SpecialRequirementsFormProps {
  // 1) Boolean (Yes/No) fields
  petCleaning: boolean;
  setPetCleaning: (value: boolean) => void;
  carpetCleaning: boolean;
  setCarpetCleaning: (value: boolean) => void;
  rangeHoodCleaning: boolean;
  setRangeHoodCleaning: (value: boolean) => void;
  ovenCleaning: boolean;
  setOvenCleaning: (value: boolean) => void;
  dishwasherCleaning: boolean;
  setDishwasherCleaning: (value: boolean) => void;

  // 2) Numeric (count) fields
  glassCleaning: number;
  setGlassCleaning: (value: number) => void;
  wallStainRemoval: number;
  setWallStainRemoval: (value: number) => void;
}

const SpecialRequirementsForm = ({
  // Booleans
  petCleaning,
  setPetCleaning,
  carpetCleaning,
  setCarpetCleaning,
  rangeHoodCleaning,
  setRangeHoodCleaning,
  ovenCleaning,
  setOvenCleaning,
  dishwasherCleaning,
  setDishwasherCleaning,

  // Numerics
  glassCleaning,
  setGlassCleaning,
  wallStainRemoval,
  setWallStainRemoval,
}: SpecialRequirementsFormProps) => {
  return (
    <View className="mt-6">
      <Text className="text-lg font-semibold mb-2">Special Requirements</Text>
      <View className="space-y-4">

        {/* 1) Boolean Toggles */}
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
          <ToggleButton value={rangeHoodCleaning} onToggle={setRangeHoodCleaning} />
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Oven cleaning</Text>
          <ToggleButton value={ovenCleaning} onToggle={setOvenCleaning} />
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Dishwasher cleaning</Text>
          <ToggleButton value={dishwasherCleaning} onToggle={setDishwasherCleaning} />
        </View>

        {/* 2) Numeric Inputs */}
        {/* Glass Cleaning */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-600">Glass cleaning</Text>
            <Text className="text-xs text-gray-400">(charged per piece)</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
              onPress={() => {
                if (glassCleaning > 0) {
                  setGlassCleaning(glassCleaning - 1);
                }
              }}
            >
              <AntDesign name="minus" size={16} color="#4A90E2" />
            </TouchableOpacity>
            <Text className="mx-2 text-lg font-semibold">{glassCleaning}</Text>
            <TouchableOpacity
              className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
              onPress={() => {
                setGlassCleaning(glassCleaning + 1);
              }}
            >
              <AntDesign name="plus" size={16} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Wall Stain Removal */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-600">Wall stain removal</Text>
            <Text className="text-xs text-gray-400">(charged per wall)</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
              onPress={() => {
                if (wallStainRemoval > 0) {
                  setWallStainRemoval(wallStainRemoval - 1);
                }
              }}
            >
              <AntDesign name="minus" size={16} color="#4A90E2" />
            </TouchableOpacity>
            <Text className="mx-2 text-lg font-semibold">{wallStainRemoval}</Text>
            <TouchableOpacity
              className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
              onPress={() => {
                setWallStainRemoval(wallStainRemoval + 1);
              }}
            >
              <AntDesign name="plus" size={16} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
};

export default SpecialRequirementsForm;
