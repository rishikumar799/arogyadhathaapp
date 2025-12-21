import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Slider({ value }: { value?: number }) {
  return (
    <View style={styles.wrap}>
      <Text>Value: {value ?? 0}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { padding: 8 } });
