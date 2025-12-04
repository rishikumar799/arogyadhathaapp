import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Toast({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    padding: 12,
    backgroundColor: '#111',
    borderRadius: 8,
    opacity: 0.9,
  },
  text: { color: '#fff', textAlign: 'center' },
});
