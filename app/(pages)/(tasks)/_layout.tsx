import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="taskDetailScreen" />
      <Stack.Screen name="viewTaskDetail" />
    </Stack>
  );
}
