import { Stack } from 'expo-router';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="userTerms" options={{ headerShown: false }} />
      <Stack.Screen name="createUserProfile" options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ headerShown: false }} />
      <Stack.Screen name="propertyList" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(cleanerProfile)" options={{ headerShown: false }} />
      <Stack.Screen name="(houseOwner)" options={{ headerShown: false }} />
      <Stack.Screen name="editProperty" options={{ headerShown: false }} />
    </Stack>
  );
}
