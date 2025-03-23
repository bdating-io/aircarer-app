import { Profile } from '@/types/profile';
import { create } from 'zustand';

type ProfileState = {
  myProfile?: Profile;
  setMyProfile: (profile: Profile) => void;
  clearMyProfile: () => void;
};

export const useProfileModel = create<ProfileState>((set) => ({
  profile: undefined,
  setMyProfile: (profile) => set({ myProfile: profile }),
  clearMyProfile: () => set({ myProfile: undefined }),
}));
