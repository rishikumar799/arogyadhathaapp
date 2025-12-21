import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';

export default function BottomSheet({ visible, children, onRequestClose }: { visible: boolean; children?: React.ReactNode; onRequestClose?: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: 12, maxHeight: '80%' },
});
