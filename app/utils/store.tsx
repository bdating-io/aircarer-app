import { create } from 'zustand';

// Define the type for the store's state
interface StoreState {
    myProfile: any;
    myAddress: any;
    myWorkPreference: any;
    setMyProfile: (newProfile: any) => void;
    setMyAddress: (newAddress: any) => void;
    setMyWorkPreference: (newWorkPreference: any) => void;
}

// Create the store with TypeScript types
const useStore = create<StoreState>((set) => ({
  myProfile: {}, // Initial state
  myWorkPreference: {},
  myAddress: {},
  setMyProfile: (newProfile: any) => set({ myProfile: newProfile }), // Action to update the state
  setMyAddress: (newAddress: any) => set({ myAddress: newAddress }),
  setMyWorkPreference: (newPreference: any) => set({ myWorkPreference: newPreference }),
}));

export default useStore;