import React from 'react';
import { Modal as RNModal, View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';

type Props = {
  visible: boolean;
  children?: React.ReactNode;
  onRequestClose?: () => void;
};

export default function Modal({ visible, children, onRequestClose }: Props) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 12,
    padding: 16,
  },
});
