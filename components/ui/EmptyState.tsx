import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function EmptyState({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <ThemedText type="title">{title ?? 'Nothing here'}</ThemedText>
      {subtitle ? <ThemedText>{subtitle}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { padding: 24, alignItems: 'center' } });
