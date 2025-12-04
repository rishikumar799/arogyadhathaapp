import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '@/components/ui/Input';

export default function GlobalSearch() {
  const [q, setQ] = useState('');

  return (
    <View style={styles.wrap}>
      <Input placeholder="Search services, doctors, medicines..." value={q} onChangeText={setQ} />
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { width: 220 } });
