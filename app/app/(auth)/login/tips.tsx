import { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { showToast } from '@/utils/toast';

const API_URL = 'http://localhost:5000'; 

export default function TipsScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (text: string) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Update phone state with only numbers
    setPhone(numericValue);

    // Validate length
    if (numericValue.length > 0 && numericValue.length !== 10) {
      setPhoneError('Phone number must be 10 digits');
    } else {
      setPhoneError('');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!name || !phone || !time || !location || !title || !description) {
        showToast.error('Please fill all required fields');
        return;
      }

      if (phone.length !== 10) {
        showToast.error('Please enter a valid 10-digit phone number');
        return;
      }

      const response = await axios.post(`${API_URL}/tips/submit`, {
        name,
        phone,
        time,
        location,
        title,
        description,
        media
      });

      if (response.data.success) {
        showToast.success('Tip submitted successfully');
        // Clear form
        setName('');
        setPhone('');
        setTime('');
        setLocation('');
        setTitle('');
        setDescription('');
        setMedia('');
        
        // Navigate back
        setTimeout(() => {
            router.push('/login');
        }, 1500);
      }
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Error submitting tip');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.heading}>Anonymous Tip</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[
            styles.input,
            phoneError ? styles.inputError : null
          ]}
          placeholder="Phone Number"
          value={phone}
          onChangeText={validatePhone}
          keyboardType="numeric"
          maxLength={10}
        />
        {phoneError ? (
          <ThemedText style={styles.errorText}>{phoneError}</ThemedText>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Time of Incident"
          value={time}
          onChangeText={setTime}
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity 
          style={styles.mediaButton}
          onPress={pickImage}
        >
          <ThemedText style={styles.mediaButtonText}>
            {media ? 'Media Selected' : 'Add Media'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <ThemedText style={styles.submitButtonText}>Submit Tip</ThemedText>
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
    padding: 20,
  },
  heading: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
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
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: '5%',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  mediaButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  mediaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
