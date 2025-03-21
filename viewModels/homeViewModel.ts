import { supabaseAuthClient } from '@/clients/supabase/auth';
import { supabaseDBClient } from '@/clients/supabase/database';
import useStore from '@/utils/store';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export const useHomeViewModel = () => {
  const router = useRouter();
  const [hasAddress, setHasAddress] = useState<boolean>(false);
  const { myProfile, setMyProfile, mySession, setMySession } = useStore();
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    supabaseAuthClient.getSession().then((session) => {
      setLoading(true);
      setMySession(session);
      if (session?.user) {
        checkProfile(session.user.id);
        checkAddress(session.user.id);
        setUserEmail(session.user.email || '');
      }
      setLoading(false);
    });

    // Listen for auth changes
    supabaseAuthClient.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setMySession(session);
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
    } catch (error) {
      Alert.alert('Error signing out', (error as Error).message);
    }
    router.push('/');
  };

  // Create Task => Insert row => if successful, navigate
  const handleCreateTask = async (cleaningType: string) => {
    // 2) check if user is logged in
    if (!mySession?.user) {
      Alert.alert('Not logged in', 'Please log in first.');
      return;
    }

    try {
      // 2) Instead of .insert(), call the Postgres function
      const task = await supabaseDBClient.createTask(
        mySession.user.id,
        cleaningType,
      );

      // data will be an array of inserted rows
      if (!task) {
        Alert.alert('Error', 'Failed to create task via RPC');
        return;
      }

      // Navigate
      router.push(
        `/(pages)/(createTask)/selectProperty?taskId=${task.task_id}`,
      );
    } catch (err) {
      console.error('RPC error:', err);
      Alert.alert('Error', 'Failed to create task via RPC');
    }
  };

  return {
    loading,
    hasAddress,
    myProfile,
    mySession,
    userEmail,
    handleCreateTask,
    handleSignOut,
  };
};
