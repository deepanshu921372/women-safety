import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CitizenHomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome Citizen!</ThemedText>
      {/* Add your home screen content here */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 