import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { showToast } from '@/utils/toast';

const API_URL = 'http://localhost:5000'; 

export default function PoliceSignupScreen() {
  const [fullName, setFullName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setIsFormValid(
      fullName.trim() !== '' &&
      badgeNumber.trim() !== '' &&
      email.trim() !== '' &&
      validateEmail(email) &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword
    );
  }, [fullName, badgeNumber, email, password, confirmPassword]);

  const handleSignup = async () => {
    try {
      if (!validateEmail(email)) {
        showToast.error('Please enter a valid email address');
        return;
      }

      if (password !== confirmPassword) {
        showToast.error("Passwords don't match!");
        return;
      }

      const response = await axios.post(`${API_URL}/auth/police/signup`, {
        fullName,
        badgeNumber,
        email,
        password
      });

      if (response.data.success) {
        showToast.success('Signed up successfully!');
        setTimeout(() => {
          router.push('/login/police');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error);
      showToast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.heading}>Police Sign Up</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Badge Number"
          value={badgeNumber}
          onChangeText={setBadgeNumber}
          autoCapitalize="none"
        />

        <TextInput
          style={[
            styles.input,
            email.length > 0 && !validateEmail(email) && styles.inputError
          ]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {email.length > 0 && !validateEmail(email) && (
          <ThemedText style={styles.errorText}>
            Please enter a valid email address
          </ThemedText>
        )}

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
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={!isFormValid}
        >
          <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login/police')}>
          <ThemedText style={styles.linkText}>Already have an account? Login</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  inputError: {
    borderColor: 'red',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
  button: {
    backgroundColor: '#007AFF',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
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
});
