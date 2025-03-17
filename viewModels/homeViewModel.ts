import { supabase } from '@/clients/supabase';
import { supabaseAuthClient } from '@/clients/supabase/auth';
import { supabaseDBClient } from '@/clients/supabase/database';
import useStore from '@/utils/store';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export const useHomeViewModel = () => {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [hasAddress, setHasAddress] = useState<boolean>(false);
  const { myProfile, setMyProfile, mySession, setMySession } = useStore();
  const [userEmail, setUserEmail] = useState<string>('');

  // Store the task title
  const [taskTitle, setTaskTitle] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setMySession(session);
      if (session?.user) {
        checkProfile(session.user.id);
        checkAddress(session.user.id);
        setUserEmail(session.user.email || '');
      }
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setMySession(session);
      if (session?.user) {
        checkProfile(session.user.id);
        checkAddress(session.user.id);
        setUserEmail(session.user.email || '');
      }
    });
  }, []);

  const checkProfile = async (userId: string) => {
    try {
      const profile = await supabaseDBClient.getUserProfileById(userId);
      setMyProfile(profile);
      setHasProfile(!!profile?.first_name);
    } catch (error) {
      Alert.alert('Error checking profile', (error as Error).message);
    }
  };

  // Check address
  const checkAddress = async (userId: string) => {
    try {
      const addresses = await supabaseDBClient.getUserAddressesById(userId);
      setHasAddress(!!addresses);
    } catch (error) {
      Alert.alert('Error checking address', (error as Error).message);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabaseAuthClient.signOut();
      setMyProfile(null);
      setMySession(null);
      setHasProfile(false);
    } catch (error) {
      Alert.alert('Error signing out', (error as Error).message);
    }
    router.push('/');
  };

  // Create Task => Insert row => if successful, navigate
  const handleCreateTask = async () => {
    // 1) check if user typed a non-empty taskTitle
    if (!taskTitle.trim()) {
      Alert.alert('Missing title', 'Please enter a task title first.');
      return;
    }

    // 2) check if user is logged in
    if (!mySession?.user) {
      Alert.alert('Not logged in', 'Please log in first.');
      return;
    }

    try {
      // 2) Instead of .insert(), call the Postgres function
      const { data, error } = await supabase.rpc('create_task', {
        p_customer_id: mySession.user.id,
        p_task_title: taskTitle.trim(),
      });
      if (error) throw error;

      // data will be an array of inserted rows (should be length 1)
      if (!data || data.length === 0) {
        Alert.alert('Error', 'No task returned from create_task RPC.');
        return;
      }

      // The newly created task is data[0]
      const newTask = data[0];
      Alert.alert('Task Created!', `Task ID = ${newTask.task_id}`);

      // Navigate
      router.push(
        `/(pages)/(createTask)/placeDetails?taskId=${newTask.task_id}`,
      );
    } catch (err) {
      console.error('RPC error:', err);
      Alert.alert('Error', 'Failed to create task via RPC');
    }
  };

  return {
    hasProfile,
    hasAddress,
    myProfile,
    mySession,
    userEmail,
    taskTitle,
    setTaskTitle,
    handleCreateTask,
    handleSignOut,
  };
};
