import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Input from './Input';

type Props = {
  label?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
};

export default function FormField({ label, value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.row}>
      {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
      <Input value={value} onChangeText={onChangeText} placeholder={placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: '600' },
});
