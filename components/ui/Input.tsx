import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export default function Input(props: TextInputProps) {
  return <TextInput style={[styles.input, props.style]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
