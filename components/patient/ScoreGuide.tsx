// components/patient/ScoreGuide.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ScoreGuide() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Health Score Guide</Text>
      <Text style={styles.note}>This guide helps you understand the scores. Consult a qualified doctor if needed.</Text>

      <View style={styles.rows}>
        <View style={styles.row}><Text style={styles.range}>90% - 100%</Text><Text style={styles.label}>Excellent</Text></View>
        <View style={styles.row}><Text style={styles.range}>80% - 89%</Text><Text style={styles.label}>Good</Text></View>
        <View style={styles.row}><Text style={styles.range}>70% - 79%</Text><Text style={styles.label}>Somewhat Good</Text></View>
        <View style={styles.row}><Text style={styles.range}>50% - 69%</Text><Text style={styles.label}>Needs Consultation</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12, borderRadius: 16, padding: 12, backgroundColor: "#FFFFFF", elevation: 4 },
  title: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  note: { fontSize: 12, color: "#475569", marginTop: 6 },
  rows: { marginTop: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 1, borderTopColor: "#EEF2F7" },
  range: { fontSize: 12, color: "#334155" },
  label: { fontSize: 12, color: "#0F172A", fontWeight: "700" },
});
