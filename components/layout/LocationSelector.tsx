import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Modal from '@/components/ui/Modal';
import { ThemedView } from '@/components/themed-view';

export default function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('Hyderabad');

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.btn}>
        <ThemedText>{location}</ThemedText>
      </TouchableOpacity>

      <Modal visible={open} onRequestClose={() => setOpen(false)}>
        <ThemedView>
          <ThemedText type="title">Select Location</ThemedText>
          {/* Placeholder: replace with selectable list */}
          <TouchableOpacity onPress={() => { setLocation('Hyderabad'); setOpen(false); }} style={{ marginTop: 12 }}>
            <ThemedText>Hyderabad</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({ btn: { padding: 8 } });
