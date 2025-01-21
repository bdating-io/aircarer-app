import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "注册" }} />
      <Stack.Screen name="Booking" options={{ title: "清洁预约和图片上传" }} />
      <Stack.Screen name="BookingAndCleaning" options={{ title: "预约清洁" }} />
      <Stack.Screen name="CreateUser" options={{ title: "Create Profile" }} />
      <Stack.Screen name="ProvideHome" options={{ title: "Provide Home Details" }} />
      <Stack.Screen name="RecycleTask" options={{ title: "Recycle Task" }} />
      <Stack.Screen name="ReDetail" options={{ title: "ReDetail" }} />
      <Stack.Screen name="RetaskDetail" options={{ title: "Recycle Task Detail" }} />
    
    </Stack>
  );
}
