import { AddressFormData } from '@/types/address';
import { WorkPreference } from '@/types/workPreferences';
import { Session } from '@supabase/supabase-js';
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

  mySession: Session | null;
  setMySession: (newSession: Session | null) => void;

  myAddress: AddressFormData;
  setMyAddress: (newAddress: AddressFormData) => void;

  myWorkPreference: WorkPreference;
  setMyWorkPreference: (newWorkPreference: WorkPreference) => void;
}

const useStore = create<Store>((set) => ({
  myProfile: null,
  setMyProfile: (profile) => set({ myProfile: profile }),
  mySession: {
    access_token: '',
    refresh_token: '',
    expires_in: 0,
    token_type: '',
    user: {
      id: '',
      aud: '',
      email: '',
      created_at: '',
      confirmed_at: '',
      last_sign_in_at: '',
      role: '',
      app_metadata: {
        provider: '',
        provider_id: '',
      },
      user_metadata: {
        full_name: '',
        phone_number: '',
      },
    },
  },
  setMySession: (newSession: Session | null) => set({ mySession: newSession }),
  myWorkPreference: {
    id: '',
    user_id: '',
    areas: '',
    time: '',
    experience: '',
    pricing: '',
    created_at: '',
    updated_at: '',
  },
  setMyAddress: (newAddress: AddressFormData) => set({ myAddress: newAddress }),
  myAddress: {
    user_id: '',
    type: 'USER_ADDRESS',
    street_number: '',
    street_name: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Australia',
  },
  setMyWorkPreference: (newPreference: WorkPreference) =>
    set({ myWorkPreference: newPreference }),
}));

export default useStore;
