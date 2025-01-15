import { StyleSheet, TouchableOpacity, View, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

export default function PoliceHomeScreen() {
  const handleTipsPress = () => {
    router.push('/(auth)/login/tips');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userName', 'userEmail']);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome Officer!</ThemedText>
      
      {/* Add your other content here */}

      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={[styles.bottomButton, styles.tipsButton]}
          onPress={handleTipsPress}
        >
          <Ionicons name="document-text" size={24} color="white" />
          <ThemedText style={styles.bottomButtonText}>TIPS</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.bottomButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color="white" />
          <ThemedText style={styles.bottomButtonText}>LOGOUT</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Add padding to prevent content from being hidden behind buttons
  },
  bottomButtons: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: '48%',
  },
  tipsButton: {
    backgroundColor: '#4CAF50',
  },
  logoutButton: {
    backgroundColor: '#f44336',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 