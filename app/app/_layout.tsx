import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../config/toast.config';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      setIsLoading(false);
    } catch (error) {
      console.error('Initial auth check error:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(citizen)" />
        <Stack.Screen name="(police)" />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}