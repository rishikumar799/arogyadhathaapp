import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function Checkbox({ checked = false, onToggle }: { checked?: boolean; onToggle?: () => void }) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.box} activeOpacity={0.8}>
      {checked ? <IconSymbol name="check" size={16} /> : <View style={styles.empty} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({ box: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' }, empty: { width: 14, height: 14 } });
