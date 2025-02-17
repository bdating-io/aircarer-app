import { Stack } from "expo-router";
<<<<<<< HEAD
import { BookingProvider } from './components/BookingContext';
=======
>>>>>>> parent of ab556a4 (updated)

import "../global.css";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
<<<<<<< HEAD
    <BookingProvider>
      {/* Any screens/routes inside here can access useBookingContext */}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="launch" options={{ title: 'Create a task' }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="pages/createTask/placeDetails.tsx" options={{ title: 'Property Details' }} />
        <Stack.Screen name="pages/createTask/recyclingPage.tsx" options={{ title: 'Recycling' }} />
        <Stack.Screen name="pages/createTask/dateSelection.tsx" options={{ title: 'Choose a Time' }} />
        <Stack.Screen name="pages/createTask/takePhotoPage.tsx" options={{ title: 'Task Details' }} />
        <Stack.Screen name="pages/createTask/specialRequestPage.tsx" options={{ title: 'Special Request' }} />
        <Stack.Screen name="pages/createTask/budgetPage.tsx" options={{ title: 'Budget' }} />
        <Stack.Screen name="pages/createTask/paymentMethodScreen.tsx" options={{ title: 'Payment' }} />
      </Stack>
    </BookingProvider>
=======
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="launch" options={{ title: 'Create a task' }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="placeDetails" options={{ title: 'Property Details' }} />
      <Stack.Screen name="recyclingPage" options={{ title: 'Recycling' }} />
      <Stack.Screen name="dateSelection" options={{ title: 'Choose a Time' }} />
      <Stack.Screen name="takePhotoPage" options={{ title: 'Task Details' }} />
      <Stack.Screen name="specialRequestPage" options={{ title: 'Special Request' }} />
      <Stack.Screen name="budgetPage" options={{ title: 'Budget' }} />
      <Stack.Screen name="paymentMethodScreen" options={{ title: 'Payment' }} />
    </Stack>
>>>>>>> parent of ab556a4 (updated)
  );
}
