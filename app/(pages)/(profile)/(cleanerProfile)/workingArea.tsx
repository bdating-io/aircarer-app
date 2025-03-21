import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useProfileViewModel } from '@/viewModels/profileViewModel';

export default function WorkingArea() {
  const router = useRouter();
  const {
    coordinates,
    fetchCoordinatesFromMyAddress,
    workDistance,
    zoomDelta,
    getDBWorkPref,
    setWorkDistance,
    setZoomDelta,
    navigateToWorkingTime,
  } = useProfileViewModel();

  useEffect(() => {
    getDBWorkPref();
    fetchCoordinatesFromMyAddress();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">
            Select Working Area
          </Text>
        </View>
      </View>

      <View className="flex-1 px-4">
        <Text className="text-gray-600 mt-6 mb-4">
          Set your preferred maximum working distance
        </Text>

        <View>
          {coordinates?.latitude && coordinates?.longitude && (
            <MapView
              style={{ width: '100%', height: '70%' }} // MaoView only works with style not tailwind css classes
              region={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: workDistance / 50,
                longitudeDelta: workDistance / 50,
              }}
              provider={undefined}
            >
              <Marker
                coordinate={{
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                }}
              />
             {workDistance && (<Circle
                center={{
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                }}
                radius={workDistance * 1000}
                strokeColor="rgba(0,0,255,0.5)"
                fillColor="rgba(0,0,255,0.2)"
              />)}
            </MapView>
          )}

          <View className="ml-4">
            <MultiSlider
              min={3}
              max={100}
              values={[workDistance]}
              onValuesChangeFinish={(v) => {
                setWorkDistance(v[0]);
                setZoomDelta(v[0] / 50);
              }}
              onValuesChange={(v) => {
                setWorkDistance(v[0]);
                setZoomDelta(v[0] / 50);
              }}
            />
            <Text>{workDistance} KMs</Text>
          </View>
        </View>
      </View>

      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-lg py-4 items-center ${
            workDistance > 0 ? 'bg-[#4A90E2]' : 'bg-gray-200'
          }`}
          onPress={navigateToWorkingTime}
          disabled={workDistance < 0}
        >
          <Text
            className={`font-medium ${
              workDistance > 0 ? 'text-white' : 'text-gray-500'
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
