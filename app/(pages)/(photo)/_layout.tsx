import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="beforeClean" options={{ headerShown: false }} />
      <Stack.Screen name="task" options={{ headerShown: false }} />
      <Stack.Screen name="taskDetails" options={{ headerShown: false }} />
    </Stack>
  );
}
