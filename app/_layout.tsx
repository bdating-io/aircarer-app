import { Stack } from "expo-router";

import "../global.css";
import { LinenProvider } from "@/contexts/LinenContext";

export default function RootLayout() {
  return (
    <LinenProvider>
      <RootLayoutNav />
    </LinenProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="Linen-management/usedLinenRecycled" 
        options={{ title: "Linen Recycling" }} 
      />
      <Stack.Screen 
        name="Linen-management/linenHandover" 
        options={{ title: "Linen Collection" }} 
      />
      <Stack.Screen 
        name="Linen-management/linenProcessing" 
        options={{ title: "Linen Processing" }} 
      />
    </Stack>
  );
}
