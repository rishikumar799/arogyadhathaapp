import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function DoctorSchedule() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title'>Schedule</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { padding: 16 } });
