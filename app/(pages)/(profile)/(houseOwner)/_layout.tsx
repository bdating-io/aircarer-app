import React from 'react';
import { router, Stack } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen
        name="createProperty"
        options={{
          headerTitle: 'Create Property',
          headerTitleStyle: {
            fontSize: 20,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="expectedPricing" options={{ headerShown: false }} />
      <Stack.Screen name="editProperty" options={{ headerShown: false }} />
    </Stack>
  );
}
