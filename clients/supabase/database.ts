import { ProfileData } from '@/types/type';
import { supabase } from '.';

export const supabaseDBClient = {
  getUserById: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  getUserAddressesById: async (userId: string) => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'USER_ADDRESS');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  getUserProfileById: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, abn, role')
      .eq('user_id', userId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  getUserTermsStatusById: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('terms_accepted')
      .eq('user_id', userId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  acceptUserTermsById: async (userId: string) => {
    const { error } = await supabase.from('profiles').upsert({
      user_id: userId,
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
    });
    if (error) {
      throw new Error(error.message);
    }
  },

  updateUserProfile: async (userId: string, profileData: ProfileData) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        abn: profileData.abn,
        role: profileData.role,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
  },
};
