// BookingContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IProperty } from '../mockData/mockData';

type CleaningType = 'express' | 'regular' | 'deep';

interface BookingData {
  property: IProperty | null;      // or just propertyId: string
  cleaningType: CleaningType | null;
  specialRequests: string[];       // just store the request titles
  customRequest: string;           // store custom text
  budget: string;                  // user-typed budget
}

interface BookingContextProps {
  bookingData: BookingData;
  setProperty: (property: IProperty) => void;
  setCleaningType: (cleaningType: CleaningType) => void;
  setSpecialRequests: (requests: string[], custom: string) => void;
  setBudget: (budget: string) => void;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData>({
    property: null,
    cleaningType: null,
    specialRequests: [],
    customRequest: '',
    budget: '',
  });

  const setProperty = (property: IProperty) => {
    setBookingData((prev) => ({ ...prev, property }));
  };

  const setCleaningType = (cleaningType: CleaningType) => {
    setBookingData((prev) => ({ ...prev, cleaningType }));
  };

  const setSpecialRequests = (requests: string[], custom: string) => {
    setBookingData((prev) => ({
      ...prev,
      specialRequests: requests,
      customRequest: custom,
    }));
  };

  const setBudget = (budget: string) => {
    setBookingData((prev) => ({ ...prev, budget }));
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setProperty,
        setCleaningType,
        setSpecialRequests,
        setBudget,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// Helper hook
export function useBookingContext() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
}
