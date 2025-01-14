import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const API_URL = 'http://localhost:5000'; 

export default function CitizenLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      email.trim() !== '' && 
      password.trim() !== '' &&
      validateEmail(email)
    );
  }, [email, password]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    try {
      if (!validateEmail(email)) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please enter a valid email address!',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30,
        });
        return;
      }

      const response = await axios.post(`${API_URL}/auth/citizen/login`, {
        email,
        password
      });

      if (response.data.success) {
        // Store the token
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userType', 'citizen');
        
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Logged in successfully!',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30,
        });
        
        // Navigate to home screen
        router.replace('/(citizen)/home');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Invalid credentials',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>Citizen Login</ThemedText>
      
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

      <TouchableOpacity 
        onPress={() => router.push('/signup/citizen')}
      >
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
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});