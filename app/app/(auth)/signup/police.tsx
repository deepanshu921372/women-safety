import { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function PoliceSignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [rank, setRank] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // TODO: Implement signup logic
    console.log('Police signup:', {
      email,
      password,
      fullName,
      badgeNumber,
      department,
      rank,
    });
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.heading}>Police Sign Up</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Badge Number"
          value={badgeNumber}
          onChangeText={setBadgeNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="Department"
          value={department}
          onChangeText={setDepartment}
        />

        <TextInput
          style={styles.input}
          placeholder="Rank"
          value={rank}
          onChangeText={setRank}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSignup}
        >
          <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/login/police')}
        >
          <ThemedText style={styles.linkText}>Already have an account? Login</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.disclaimer}>
          Note: Your account will need to be verified by the department before activation.
        </ThemedText>
      </ThemedView>
    </ScrollView>
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
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
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
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    marginBottom: 20,
  },
  disclaimer: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 40,
  },
});
