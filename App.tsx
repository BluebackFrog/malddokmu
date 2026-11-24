import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>말똑무</Text>
      <Text style={styles.greeting}>{'어흥~ 놀라셨슈?\n저 수다 떨러 왔어유.'}</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7ef',
    padding: 24,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#344c3b', fontSize: 34, fontWeight: '700' },
  greeting: { color: '#383c34', fontSize: 24, textAlign: 'center' },
});
