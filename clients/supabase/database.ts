import { Profile } from '@/types/profile';
import { supabase } from '.';
import { Property } from '@/types/property';
import { User } from '@supabase/auth-js';
import { Address } from '@/types/address';
import { WorkPreference } from '@/types/workPreferences';
import { HouseOwnerTask } from '@/types/task';

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

  getUserAddressById: async (userId: string): Promise<Address | undefined> => {
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

  updateUserAddress: async (userId: string, addressData: Address) => {
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

  getUserProfileById: async (userId: string): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
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

  updateUserProfile: async (userId: string, profileData: Partial<Profile>) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        ...profileData,
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
    console.log('property', property);
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

  updateUserWorkPreference: async (workPreference: WorkPreference) => {
    const { error } = await supabase.from('work_preferences').upsert([
      {
        ...workPreference,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      throw new Error(error.message);
    }
  },

  createTask: async (
    customerId: string,
    cleaningType: string,
  ): Promise<HouseOwnerTask> => {
    const { data, error } = await supabase.rpc('create_task', {
      p_customer_id: customerId,
      p_cleaning_type: cleaningType,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  updateTaskById: async (taskId: string, taskData: Partial<HouseOwnerTask>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('task_id', taskId)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  getTaskById: async (taskId: string): Promise<HouseOwnerTask> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_id', taskId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};
