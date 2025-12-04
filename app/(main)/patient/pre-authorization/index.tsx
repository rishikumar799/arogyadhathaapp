import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function PreAuthorization() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Pre-Authorization</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { padding: 16 } });
