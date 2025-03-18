import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import MapView, { Marker, Circle } from 'react-native-maps';
import useStore from '@/utils/store';
import { supabaseDBClient } from '@/clients/supabase/database';
import { SUPABASE_URL } from '@/clients/supabase';

export default function WorkingArea() {
  const router = useRouter();
  const { myAddress, mySession, setMyWorkPreference } = useStore();
  const params = useLocalSearchParams();
  const [workDistance, setWorkDistance] = useState(10);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [zoomDelta, setZoomDelta] = useState(0.2);

  const geocodeAddress = async (
    address: string,
  ): Promise<{ latitude: number; longitude: number }> => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/geodecode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mySession.access_token}`,
      },
      body: JSON.stringify({ address: address }),
    });
    const data = await response.json();
    return data;
  };

  const fetchCoordinatesFromMyAddress = async () => {
    try {
      const coords = await geocodeAddress(
        `${myAddress.street_number} ${myAddress.street_name}, ${myAddress.city}, ${myAddress.state}, ${myAddress.post_code}, ${myAddress.country}`,
      );
      setCoordinates(coords);
    } catch (error) {
      setCoordinates({ longitude: 0, latitude: 0 });
      console.error('Error geocoding address:', error);
    }
  };

  const getDBWorkPref = async (userId: string) => {
    const workPref = await supabaseDBClient.getUserWorkPreferenceById(userId);
    setMyWorkPreference(workPref);
    setWorkDistance(workPref.areas.distance);
    setZoomDelta(workPref.areas.distance / 50);
  };

  useEffect(() => {
    getDBWorkPref(mySession.user.id);
    fetchCoordinatesFromMyAddress();
  }, []);

  const handleNext = () => {
    if (!workDistance) return;

    const previousData = params.profileData
      ? JSON.parse(params.profileData as string)
      : {};

    const profileData = {
      ...previousData,
      workDistance: workDistance,
    };

    router.push({
      pathname: '/workingTime',
      params: { profileData: JSON.stringify(profileData) },
    });
  };

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
          {coordinates && (
            <MapView
              style={{ width: '100%', height: '70%' }} // MaoView only works with style not tailwind css classes
              region={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: zoomDelta,
                longitudeDelta: zoomDelta,
              }}
              provider={undefined}
            >
              <Marker
                coordinate={{
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                }}
              />
              <Circle
                center={{
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                }}
                radius={workDistance * 1000}
                strokeColor="rgba(0,0,255,0.5)"
                fillColor="rgba(0,0,255,0.2)"
              />
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
          onPress={handleNext}
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
