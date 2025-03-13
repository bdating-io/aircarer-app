import { Stack } from "expo-router";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="houseOwner" options={{ headerShown: false }} />
      <Stack.Screen name="expectedPricing" options={{ headerShown: false }} />
    </Stack>
  );
}
