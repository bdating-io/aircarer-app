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
<<<<<<< Updated upstream
=======
      <Stack.Screen
        name="pages/taskPreparation/taskPrepare.tsx"
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="pages/taskPreparation/taskAccept.tsx"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="pages/taskPreparation/taskDetail.tsx"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="pages/taskPreparation/taskHeading.tsx"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="pages/authentication/home.tsx"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="pages/authentication/profile.tsx"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="pages/authentication/login.tsx"
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="pages/authentication/signup.tsx"
        options={{ headerShown: true }}
      />
>>>>>>> Stashed changes
    </Stack>
  );
}
