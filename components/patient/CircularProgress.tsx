import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CircularProgress({ value }: { value: number }) {
  return (
    <View style={styles.box}>
      <Text style={styles.value}>{value}%</Text>
      <Text style={styles.label}>Health</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#ECFEFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    margin: 20,
  },
  value: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0891B2",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    color: "#555",
  },
});
