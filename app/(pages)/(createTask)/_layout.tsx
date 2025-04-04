import React from 'react';
import { router, Stack } from 'expo-router';
import { BookingProvider } from '../../../components/BookingContext';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
// import "../global.css";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <BookingProvider>
      {/* Any screens/routes inside here can access useBookingContext */}
      <Stack>
        <Stack.Screen
          name="selectProperty"
          options={{
            headerTitle: 'Select Property',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.navigate('/(tabs)/houseOwnerTasks')}
              >
                <AntDesign name="left" size={20} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="recyclingPage" options={{ title: 'Recycling' }} />
        <Stack.Screen
          name="dateSelection"
          options={{ title: 'Choose date and time' }}
        />
        <Stack.Screen
          name="takePhotoPage"
          options={{ title: 'Task Details' }}
        />
        <Stack.Screen
          name="specialRequestPage"
          options={{ title: 'Special Request' }}
        />
        <Stack.Screen name="quotePage" options={{ title: 'Quote' }} />
        <Stack.Screen
          name="paymentMethodScreen"
          options={{ title: 'Payment' }}
        />
      </Stack>
    </BookingProvider>
  );
}
