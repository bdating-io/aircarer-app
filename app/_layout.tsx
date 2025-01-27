import { Stack } from "expo-router";

import "../global.css";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="launch" options={{ title: 'Create a task' }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="placeDetails" options={{ title: 'Property Details' }} />
      <Stack.Screen name="recyclingPage" options={{ title: 'Recycling' }} />
      <Stack.Screen name="dateSelection" options={{ title: 'Choose a Time' }} />
      <Stack.Screen name="takePhotoPage" options={{ title: 'Task Details' }} />
      <Stack.Screen name="specialRequestPage" options={{ title: 'Special Request' }} />
      <Stack.Screen name="budgetPage" options={{ title: 'Budget' }} />
      
    </Stack>
  );
}
