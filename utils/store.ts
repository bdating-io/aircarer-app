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
}

const useStore = create<Store>((set) => ({
  myProfile: null,
  setMyProfile: (profile) => set({ myProfile: profile }),
}));

export default useStore; 