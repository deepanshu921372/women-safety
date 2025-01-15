import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { showToast } from '@/utils/toast';

const API_URL = 'http://localhost:5000'; 

export default function PoliceLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setIsFormValid(
      email.trim() !== '' && 
      validateEmail(email) &&
      password.trim() !== ''
    );
  }, [email, password]);

  const handleLogin = async () => {
    try {
      if (!validateEmail(email)) {
        showToast.error('Please enter a valid email address');
        return;
      }

      const response = await axios.post(`${API_URL}/auth/police/login`, {
        email,
        password
      });

      if (response.data.success) {
        await AsyncStorage.multiSet([
          ['userToken', response.data.token],
          ['userType', 'police'],
          ['isPolice', 'true']
        ]);
        
        showToast.success('Logged in successfully');
        
        setTimeout(() => {
          router.replace('/(police)/home');
        }, 1000);
      }
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>Police Login</ThemedText>
      
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

      <TouchableOpacity 
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!isFormValid}
      >
        <ThemedText style={styles.buttonText}>Login</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup/police')}>
        <ThemedText style={styles.linkText}>Don't have an account? Sign up</ThemedText>
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
});
