import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
};

export default function ActionTile({ label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.8}>
      <ThemedText type="subtitle">{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    elevation: 1,
  },
});
