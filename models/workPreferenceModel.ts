import { WorkPreference } from '@/types/workPreferences';
import { create } from 'zustand';

type workPreferenceState = {
  myWorkPreference?: WorkPreference;
  setMyWorkPreference: (workPreference: WorkPreference) => void;
};

export const useWorkPreferenceModel = create<workPreferenceState>((set) => ({
  myWorkPreference: undefined,
  setMyWorkPreference: (workPreference) =>
    set({ myWorkPreference: workPreference }),
}));
