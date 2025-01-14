import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>Login / Sign up</ThemedText>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/login/police')}
      >
        <ThemedText style={styles.buttonText}>Police</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/login/citizen')}
      >
        <ThemedText style={styles.buttonText}>Citizen</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/login/tips')}
      >
        <ThemedText style={styles.buttonText}>Anonymous Tips</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});