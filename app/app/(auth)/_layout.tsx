import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AuthLayout() {
  useAuth(false); // Check auth but don't require it

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="login/citizen" />
      <Stack.Screen name="login/police" />
      <Stack.Screen name="login/tips" />
      <Stack.Screen name="signup/citizen" />
      <Stack.Screen name="signup/police" />
    </Stack>
  );
}