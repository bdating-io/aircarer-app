import { supabaseAuthClient } from '@/clients/supabase/auth';
import { supabaseDBClient } from '@/clients/supabase/database';
import { useProfileModel } from '@/models/profileModel';
import { useSessionModel } from '@/models/sessionModel';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export const useHomeViewModel = () => {
  const router = useRouter();
  const [hasAddress, setHasAddress] = useState<boolean>(false);
  const { myProfile, setMyProfile, clearMyProfile } = useProfileModel();
  const { mySession, setMySession, clearMySession } = useSessionModel();
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetailFetched, setUserDetailFetched] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    supabaseAuthClient.getSession().then((session) => {
      if (session) {
        setMySession(session);
        checkUserDetails(session.user.id)
          .then(() => {
            setUserDetailFetched(true);
          })
          .finally(() => {
            setLoading(false);
          });
        setUserEmail(session.user.email || '');
      }
    });

    // Listen for auth changes
    supabaseAuthClient.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setMySession(session);
        checkUserDetails(session.user.id)
          .then(() => {
            setUserDetailFetched(true);
          })
          .finally(() => {
            setLoading(false);
          });
        setUserEmail(session.user.email || '');
      }
    });
    setLoading(false);
  }, []);

  const checkUserDetails = async (userId: string) => {
    try {
      const [profile, addresses] = await Promise.all([
        supabaseDBClient.getUserProfileById(userId),
        supabaseDBClient.getUserAddressesById(userId),
      ]);
      setMyProfile(profile);
      setHasAddress(!!addresses);
    } catch (error) {
      Alert.alert('Error checking user details', (error as Error).message);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabaseAuthClient.signOut();
      clearMyProfile();
      clearMySession();
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

    if (!cleaningType) {
      Alert.alert('Oops', 'Please select a cleaning type.');
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
    userDetailFetched,
    loading,
    hasAddress,
    myProfile,
    mySession,
    userEmail,
    handleCreateTask,
    handleSignOut,
  };
};
