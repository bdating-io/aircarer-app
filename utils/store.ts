import { AddressFormData } from '@/types/address';
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

  mySession: Session;
  setMySession: (newSession: Session) => void;

  myAddress: AddressFormData;
  setMyAddress: (newAddress: AddressFormData) => void;

  myWorkPreference: any;
  setMyWorkPreference: (newWorkPreference: any) => void;
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
  setMySession: (newSession: Session) => set({ mySession: newSession }),
  myWorkPreference: {},
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
  setMyWorkPreference: (newPreference: any) =>
    set({ myWorkPreference: newPreference }),
}));

export default useStore;
