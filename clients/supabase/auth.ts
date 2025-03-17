import { UserAttributes } from '@supabase/supabase-js';
import { supabase } from '.';

export const supabaseAuthClient = {
  signInWithEmail: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
  },
  signInWithPhone: async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) {
      throw new Error(error.message);
    }
  },

  verifyPhone: async (phone: string, verificationCode: string) => {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: verificationCode,
      type: 'sms',
    });
    if (error) {
      throw new Error(error.message);
    }
  },

  getSession: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  signUp: async (phone: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      phone,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
  },

  updateUser: async (attributes: UserAttributes) => {
    const { error } = await supabase.auth.updateUser(attributes);
    if (error) {
      throw new Error(error.message);
    }
  },

  resendVerificationCode: async (phone: string) => {
    const { error } = await supabase.auth.resend({
      phone,
      type: 'sms',
    });
    if (error) {
      throw new Error(error.message);
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  getUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error(
        `User not authenticated, please sign in, error:${error?.message}`,
      );
    }
    return user;
  },
};
