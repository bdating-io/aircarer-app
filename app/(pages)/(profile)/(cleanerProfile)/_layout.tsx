import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="cleanerProfile"
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="experience"
        options={{
          title: 'Experience',
        }}
      />
      <Stack.Screen
        name="pricing"
        options={{
          title: 'Set Your Price',
        }}
      />
      <Stack.Screen
        name="workingArea"
        options={{
          title: 'Working Area',
        }}
      />
      <Stack.Screen
        name="workingTime"
        options={{
          title: 'Working Hours',
        }}
      />{' '}
    </Stack>
  );
}
