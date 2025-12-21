import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function PendingScreen() {
  const router = useRouter();

  useEffect(() => {
    // Placeholder for pending approval flows
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Approval</Text>
      <Text style={styles.text}>Your account is pending verification.</Text>
      <Button title="Go Home" onPress={() => router.replace('/sign-in')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  text: { marginBottom: 12 },
});
