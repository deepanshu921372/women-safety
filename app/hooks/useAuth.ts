import { useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '@/utils/toast';

export const useAuth = (requireAuth: boolean = false) => {
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userType = await AsyncStorage.getItem('userType');

      if (token && userType) {
        // User is logged in
        if (pathname.includes('(auth)')) {
          // If user tries to access auth pages while logged in
          showToast.info('You are already logged in');
          if (userType === 'citizen') {
            router.replace('/(citizen)/home');
          } else if (userType === 'police') {
            // router.replace('/(police)/home');
          }
        }
      } else if (requireAuth) {
        // No token and auth is required, redirect to login
        showToast.error('Please login to continue');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (requireAuth) {
        showToast.error('Authentication error');
        router.replace('/(auth)/login');
      }
    }
  };
}; 