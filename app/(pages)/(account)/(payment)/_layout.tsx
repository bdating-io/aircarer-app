import { Stack } from "expo-router";

export default function PaymentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="select-method" options={{ headerShown: false }} />
      <Stack.Screen name="add-credit-card" options={{ headerShown: false }} />
      <Stack.Screen name="add-bank-account" options={{ headerShown: false }} />
      <Stack.Screen
        name="card-scanner"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="cvv-info"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen name="pay-with-saved-method" options={{ headerShown: false }} />
    </Stack>
  );
}
