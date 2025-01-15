import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { showToast } from '@/utils/toast';

export default function PoliceHomeScreen() {
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      showToast.success('Logged out successfully');
      router.replace('/(auth)/login');
    } catch (error) {
      showToast.error('Error logging out');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome Officer!</ThemedText>
      
      <View style={styles.bottomGrid}>
        <TouchableOpacity 
          style={[styles.gridItem, styles.leftItem]} 
        //   onPress={() => router.push('/tips')}
        >
          <ThemedText style={styles.gridText}>View Tips</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.gridItem, styles.rightItem]}
          onPress={handleLogout}
        >
          <ThemedText style={styles.gridText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomGrid: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    height: 60,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  leftItem: {
    backgroundColor: '#4CAF50',
  },
  rightItem: {
    backgroundColor: '#f44336',
  },
  gridText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
}); 