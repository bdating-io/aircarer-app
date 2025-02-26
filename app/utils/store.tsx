import { create } from 'zustand';

// Define the type for the store's state
interface StoreState {
    mySession: any;
    myProfile: any;
    myAddress: any;
    myWorkPreference: any;
    setMySession: (newSession: any) => void;
    setMyProfile: (newProfile: any) => void;
    setMyAddress: (newAddress: any) => void;
    setMyWorkPreference: (newWorkPreference: any) => void;
}

// Create the store with TypeScript types
const useStore = create<StoreState>((set) => ({
  mySession: {},
  myProfile: {},  // Initial state
  myWorkPreference: {},
  myAddress: {},
  setMySession: (newSession: any) => set({ mySession: newSession }), // Action to update the state
  setMyProfile: (newProfile: any) => set({ myProfile: newProfile }), 
  setMyAddress: (newAddress: any) => set({ myAddress: newAddress }),
  setMyWorkPreference: (newPreference: any) => set({ myWorkPreference: newPreference }),
}));

export default useStore;