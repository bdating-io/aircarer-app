import { Stack } from "expo-router";



export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="item" options={{ headerShown: false }} />
      <Stack.Screen name="itemlist" options={{ headerShown: false }} /> 
    </Stack>
  );
}
