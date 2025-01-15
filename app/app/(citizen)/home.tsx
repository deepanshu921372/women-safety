import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://192.168.1.7:5000'; // Replace with your IP

interface Tip {
  id: string;
  time: string;
  location: string;
  status: 'Pending' | 'Solved';
}

interface UserData {
  name: string;
  email: string;
}

export default function CitizenHomeScreen() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [tips, setTips] = useState<Tip[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await requestLocationPermission();
      await loadUserData();
      await loadTips();
      startLocationUpdates();
    })();

    return () => {
      // Cleanup location updates if needed
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to function properly.',
          [{ text: 'OK' }]
        );
        return;
      }

      const initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation);
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setErrorMsg('Error accessing location');
    }
  };

  const startLocationUpdates = async () => {
    try {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    } catch (error) {
      console.error('Error watching location:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/(auth)/login');
        return;
      }

      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const userData: UserData = response.data.user;
        setUserName(userData.name);
        setUserEmail(userData.email);
        
        // Save to AsyncStorage for offline access
        await AsyncStorage.multiSet([
          ['userName', userData.name],
          ['userEmail', userData.email]
        ]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to AsyncStorage if API fails
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail');
      if (name) setUserName(name);
      if (email) setUserEmail(email);
    }
  };

  const loadTips = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/tips`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTips(response.data.tips);
      }
    } catch (error) {
      console.error('Error loading tips:', error);
    }
  };

  const handleSOS = async () => {
    try {
      if (!location) {
        Alert.alert('Error', 'Unable to get current location');
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      const currentTime = new Date().toLocaleString();
      
      const response = await axios.post(
        `${API_URL}/tips/sos`,
        {
          time: currentTime,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        Alert.alert('SOS Sent', 'Emergency services have been notified');
        loadTips(); // Reload tips to show new SOS
      }
    } catch (error) {
      console.error('Error sending SOS:', error);
      Alert.alert('Error', 'Failed to send SOS. Please try again.');
    }
  };

  const handleReload = () => {
    loadTips();
  };

  const handleReset = () => {
    setTips([]);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <View style={styles.userInfo}>
          <ThemedText style={styles.userName}>{userName}</ThemedText>
          <ThemedText style={styles.userEmail}>{userEmail}</ThemedText>
        </View>
      </View>

      {/* SOS Button */}
      <TouchableOpacity 
        style={styles.sosButton}
        onPress={handleSOS}
      >
        <ThemedText style={styles.sosText}>SOS</ThemedText>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.reloadButton]}
          onPress={handleReload}
        >
          <Ionicons name="reload" size={24} color="white" />
          <ThemedText style={styles.actionButtonText}>Reload</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.resetButton]}
          onPress={handleReset}
        >
          <Ionicons name="refresh" size={24} color="white" />
          <ThemedText style={styles.actionButtonText}>Reset All</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Tips List */}
      <ScrollView style={styles.tipsContainer}>
        {tips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipLeft}>
              <ThemedText style={styles.tipTime}>{tip.time}</ThemedText>
              <ThemedText style={styles.tipLocation}>{tip.location}</ThemedText>
            </View>
            <View style={styles.tipRight}>
              <View style={[
                styles.statusBadge,
                tip.status === 'Solved' ? styles.solvedBadge : styles.pendingBadge
              ]}>
                <ThemedText style={styles.statusText}>{tip.status}</ThemedText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  sosButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ff0000',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    justifyContent: 'center',
  },
  reloadButton: {
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  tipsContainer: {
    flex: 1,
  },
  tipCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  tipLeft: {
    flex: 1,
  },
  tipTime: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipLocation: {
    fontSize: 14,
    color: '#666',
  },
  tipRight: {
    justifyContent: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#FFC107',
  },
  solvedBadge: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 