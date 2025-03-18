import { ProfileData } from '@/types/type';
import { supabase } from '.';
import { Property } from '@/types/property';
import { User } from '@supabase/auth-js';
import { AddressFormData } from '@/types/address';

export const supabaseDBClient = {
  getUserById: async (userId: string): Promise<User> => {
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

  getUserAddressById: async (userId: string): Promise<AddressFormData> => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'USER_ADDRESS')
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

  updateUserAddress: async (userId: string, addressData: AddressFormData) => {
    const { error } = await supabase
      .from('addresses')
      .upsert([
        {
          user_id: userId,
          ...addressData,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
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

  getUserPropertiesById: async (userId: string): Promise<Property[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  getUserPropertyById: async (propertyId: string): Promise<Property> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('property_id', propertyId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  addUserProperty: async (property: Property) => {
    const { error } = await supabase.from('properties').upsert([
      {
        ...property,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      throw new Error(error.message);
    }
  },

  deleteUserProperty: async (propertyId: string, userId: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('property_id', propertyId)
      .eq('user_id', userId);
    if (error) {
      throw new Error(error.message);
    }
  },

  updateUserProperty: async (
    propertyId: string,
    property: Partial<Property>,
  ) => {
    const { error } = await supabase
      .from('properties')
      .update({
        ...property,
        updated_at: new Date().toISOString(),
      })
      .eq('property_id', propertyId);
    if (error) {
      throw new Error(error.message);
    }
  },

  getUserWorkPreferenceById: async (userId: string) => {
    const { data, error } = await supabase
      .from('work_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};
