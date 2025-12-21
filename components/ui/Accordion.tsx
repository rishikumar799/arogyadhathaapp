import React, { useState, PropsWithChildren } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function Accordion({ children, title }: PropsWithChildren & { title: string }) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen((v) => !v)} style={styles.head}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {open ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({ head: { padding: 12 }, content: { padding: 8 } });
