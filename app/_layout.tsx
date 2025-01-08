import { Stack } from "expo-router";

import "../global.css";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="pages/taskPreparation/taskPrepare.tsx"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="pages/taskPreparation/taskHeading.tsx"
        options={{ headerShown: true }}
      />
    </Stack>
  );
}
