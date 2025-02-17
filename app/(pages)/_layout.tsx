import { Stack } from "expo-router";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="authentication" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ headerShown: false }} />
    </Stack>
  );
}
