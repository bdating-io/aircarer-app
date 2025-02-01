import { create } from 'zustand';

// Define the type for the store's state
interface StoreState {
    myProfile: any;
    setMyProfile: (newProfile: any) => void;
}

// Create the store with TypeScript types
const useStore = create<StoreState>((set) => ({
  myProfile: '', // Initial state
  setMyProfile: (newProfile: any) => set({ myProfile: newProfile }), // Action to update the state
}));

export default useStore;