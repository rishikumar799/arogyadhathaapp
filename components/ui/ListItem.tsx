import React from 'react';
import { TouchableOpacity, StyleSheet, ViewProps } from 'react-native';
import { ThemedText } from '@/components/themed-text';

type Props = ViewProps & {
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

export default function ListItem({ title, subtitle, onPress, style, ...rest }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.row, style]} {...rest}>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      {subtitle ? <ThemedText style={styles.sub}>{subtitle}</ThemedText> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  sub: { color: '#687076', marginTop: 4, fontSize: 13 },
});
