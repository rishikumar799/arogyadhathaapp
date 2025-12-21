import React, { useState } from 'react';
import { FlatList } from 'react-native';
import Modal from '@/components/ui/Modal';
import ListItem from '@/components/ui/ListItem';
import { ThemedText } from '@/components/themed-text';

const DUMMY = [
  { id: '1', title: 'Appointment reminder', subtitle: 'Your appointment is tomorrow at 10:00' },
  { id: '2', title: 'Lab report ready', subtitle: 'Your blood test report is ready' },
];

export default function NotificationsDropdown({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <ThemedText type="title">Notifications</ThemedText>
      <FlatList data={DUMMY} keyExtractor={(i) => i.id} renderItem={({ item }) => <ListItem title={item.title} subtitle={item.subtitle} />} />
    </Modal>
  );
}
