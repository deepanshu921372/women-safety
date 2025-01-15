import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function PoliceLayout() {
  useAuth(true); // Require authentication

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
    </Stack>
  );
}