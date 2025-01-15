import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function CitizenLayout() {
  useAuth(true); // Require authentication

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
    </Stack>
  );
}