import { Profile } from '@/types/profile';
import { supabase } from '.';
import { Property } from '@/types/property';
import { User } from '@supabase/auth-js';
import { Address } from '@/types/address';
import { WorkPreference } from '@/types/workPreferences';
import { Task } from '@/types/task';
import { BackgroundCheckStatus } from "@/types/backgroundChecks";

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
    // 1. 查询是否已有地址记录
    const { data: existing, error: fetchError } = await supabase
        .from('addresses')
        .select('id')
        .eq('user_id', userId)
        .eq('type', 'USER_ADDRESS')
        .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);

    let error;
    if (existing) {
      // 2. 已存在就 update
      const res = await supabase
          .from('addresses')
          .update({
            ...addressData,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .eq('type', 'USER_ADDRESS');
      error = res.error;
    } else {
      // 3. 不存在就 insert
      const res = await supabase
          .from('addresses')
          .insert([
            {
              user_id: userId,
              ...addressData,
              updated_at: new Date().toISOString(),
            },
          ]);
      error = res.error;
    }
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

  getVerificationStatus: async (userId: string): Promise<BackgroundCheckStatus> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('verification_status')
        .eq('user_id', userId)
        .single();

    if (error) {
      throw new Error(error.message);
    }
    return data.verification_status as BackgroundCheckStatus;
  },

  updateVerificationStatus: async (userId: string, status: BackgroundCheckStatus) => {
    const { error } = await supabase
        .from('profiles')
        .update({
          verification_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
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

  getTasks: async (): Promise<Task[]> => {
    // 查询条件：
    // 1. cleaner_id 为 null (未分配给清洁工)
    // 2. customer_id 不等于当前用户ID (不是当前用户创建的任务)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .is('cleaner_id', null) // 未分配给清洁工
      .eq('status', 'Pending')
      .eq('payment_status', 'Completed')
      .order('scheduled_start_time', { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  createTask: async (
    customerId: string,
    cleaningType: string,
  ): Promise<Task> => {
    const { data, error } = await supabase.rpc('create_task', {
      p_customer_id: customerId,
      p_cleaning_type: cleaningType,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  updateTaskById: async (taskId: string, taskData: Partial<Task>) => {
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

  getTaskById: async (taskId: string): Promise<Task> => {
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
