import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function RupeeIcon({ size = 18, color = '#111' }: { size?: number; color?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, { fontSize: size, color }]}>₹</Text>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center' }, text: { fontWeight: '700' } });
