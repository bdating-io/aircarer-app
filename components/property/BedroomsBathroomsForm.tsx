import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface BedroomsBathroomsFormProps {
  bedrooms: number;
  setBedrooms: (value: number) => void;
  bathrooms: number;
  setBathrooms: (value: number) => void;
  livingRooms: number;
  setLivingRooms: (value: number) => void;
}

const BedroomsBathroomsForm = ({
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  livingRooms,
  setLivingRooms,
}: BedroomsBathroomsFormProps) => (
  <>
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

    <View className="mt-6">
      <Text className="text-gray-600 mb-2">Living Rooms</Text>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
          onPress={() => {
            if (livingRooms > 1) {
              setLivingRooms(livingRooms - 1);
            }
          }}
        >
          <AntDesign name="minus" size={20} color="#4A90E2" />
        </TouchableOpacity>
        <Text className="mx-4 text-lg font-semibold">{livingRooms}</Text>
        <TouchableOpacity
          className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
          onPress={() => {
            setLivingRooms(livingRooms + 1);
          }}
        >
          <AntDesign name="plus" size={20} color="#4A90E2" />
        </TouchableOpacity>
      </View>
    </View>
  </>
);

export default BedroomsBathroomsForm;
