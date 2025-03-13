import { create } from 'zustand';

interface Profile {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  abn?: string;
  role?: string;
  updated_at?: string;
}

interface Store {
  myProfile: Profile | null;
  setMyProfile: (profile: Profile | null) => void;

  mySession: any;
  setMySession: (newSession: any) => void;

  myAddress: any;
  setMyAddress: (newAddress: any) => void;

  myWorkPreference: any;
  setMyWorkPreference: (newWorkPreference: any) => void;
}

const useStore = create<Store>((set) => ({
  myProfile: null,
  setMyProfile: (profile) => set({ myProfile: profile }),
  mySession: {}, 
  setMySession: (newSession: any) => set({ mySession: newSession }),  
  myWorkPreference: {},
  setMyAddress: (newAddress: any) => set({ myAddress: newAddress }),
  myAddress: {},
  setMyWorkPreference: (newPreference: any) => set({ myWorkPreference: newPreference }),
}));

export default useStore; 