import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

export default function Header({ title }: { title?: string }) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Feather name="chevron-left" size={22} color="#0a7ea4" />
      </TouchableOpacity>
      <ThemedText type="title">{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  back: { padding: 6 },
});
