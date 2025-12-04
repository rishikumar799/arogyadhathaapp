import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Icon from '@/components/icons/Icon';
import { useRouter } from 'expo-router';
import GlobalSearch from './GlobalSearch';

export default function AppHeader({ title, showSearch = false }: { title?: string; showSearch?: boolean }) {
  const router = useRouter();

  return (
    <ThemedView style={styles.header}>
      <View style={styles.left}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Icon name="chevron-left" size={22} />
        </TouchableOpacity>
        <ThemedText type="title">{title ?? 'Arogyadhatha'}</ThemedText>
      </View>

      <View style={styles.right}>
        {showSearch ? <GlobalSearch /> : null}
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(main)/patient/notifications')}>
          <Icon name="bell" size={20} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { padding: 6 },
});
