import { Address } from '@/types/address';
import { create } from 'zustand';

type addressState = {
  myAddress?: Address;
  setMyAddress: (address: Address) => void;
};

export const useAddressModel = create<addressState>((set) => ({
  myAddress: undefined,
  setMyAddress: (address) => set({ myAddress: address }),
}));
