import React from 'react';
import { ThemedText } from '@/components/themed-text';
import Modal from '@/components/ui/Modal';
import { ThemedView } from '@/components/themed-view';

export default function OrganHealthDialog({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <ThemedView>
        <ThemedText type="title">Organ Health</ThemedText>
        <ThemedText>Placeholder for organ health dialog — charts and details go here.</ThemedText>
      </ThemedView>
    </Modal>
  );
}
