import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const API_URL = 'http://localhost:5000'; 

export default function CitizenSignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const handlePhoneChange = (text: string) => {
    // Only allow digits and limit to 10 characters
    const formattedNumber = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(formattedNumber);
    setIsPhoneValid(formattedNumber.length === 10);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setIsFormValid(
      fullName.trim() !== '' &&
      validateEmail(email) &&
      phoneNumber.length === 10 &&
      password.trim() !== '' &&
      confirmPassword.trim() !== ''
    );
  }, [fullName, email, phoneNumber, password, confirmPassword]);

  const handleSignup = async () => {
    try {
      if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "Passwords don't match!",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30,
        });
        return;
      }
      if (!isPhoneValid) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please enter a valid 10-digit phone number!',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30,
        });
        return;
      }
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

      const response = await axios.post(`${API_URL}/auth/citizen/signup`, {
        fullName,
        email,
        phoneNumber,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Signed up successfully!',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30,
        });
        router.push('/login/citizen');
      }
    } catch (error: any) {
      console.error('Signup Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Something went wrong!',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
      });
    }
  };

  return (
    <ThemedView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.heading}>Citizen Sign Up</ThemedText>
          
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
            style={[
              styles.input, 
              !isPhoneValid && phoneNumber.length > 0 && styles.inputError
            ]}
            placeholder="Phone Number (10 digits)"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {!isPhoneValid && phoneNumber.length > 0 && (
            <ThemedText style={styles.errorText}>
              Please enter a valid 10-digit phone number
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

          <TouchableOpacity 
            onPress={() => router.push('/login/citizen')}
          >
            <ThemedText style={styles.linkText}>Already have an account? Login</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    minHeight: SCREEN_HEIGHT,
  },
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
  inputError: {
    borderColor: 'red',
    marginBottom: 5, // Reduced to accommodate error text
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
