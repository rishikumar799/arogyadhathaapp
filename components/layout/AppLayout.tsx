import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from './AppHeader';
import { ThemedView } from '@/components/themed-view';

type Props = {
  title?: string;
  children?: React.ReactNode;
};

export default function AppLayout({ title, children }: Props) {
  return (
    <ThemedView style={styles.page}>
      <AppHeader title={title} showSearch />
      <View style={styles.content}>{children}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ page: { flex: 1 }, content: { flex: 1 } });
