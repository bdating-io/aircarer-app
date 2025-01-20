import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { ClerkLoaded } from "@clerk/clerk-expo";

import "../global.css";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    >
      <ClerkLoaded>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />

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
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
