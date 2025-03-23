import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

type sessionState = {
  mySession?: Session;
  setMySession: (session: Session) => void;
  clearMySession: () => void;
};

export const useSessionModel = create<sessionState>((set) => ({
  session: undefined,
  setMySession: (session) => set({ mySession: session }),
  clearMySession: () => set({ mySession: undefined }),
}));
