import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MedicineAssistance({ aiIcon, pillIcon }) {
  return (
    <View style={{ marginTop: 18 }}>
      <Text style={styles.title}>Medicine Assistance</Text>

      {/* AI Assistant */}
      <View style={styles.card}>
        <View style={styles.left}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(34,197,94,0.08)" }]}>
            <Image source={aiIcon} style={styles.icon}/>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.cardTitle}>AI Medicine Assistant</Text>
          <Text style={styles.sub}>Instant answers about medication & safety.</Text>
        </View>

        <TouchableOpacity style={styles.greyBtn}>
          <Text style={styles.greenText}>Ask AI</Text>
        </TouchableOpacity>
      </View>

      {/* Pharmacist */}
      <View style={styles.card}>
        <View style={styles.left}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(6,182,212,0.1)" }]}>
            <Image source={pillIcon} style={styles.icon}/>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.cardTitle}>Pharmacist Consultation</Text>
          <Text style={styles.sub}>Talk to a licensed pharmacist for expert help.</Text>
        </View>

        <TouchableOpacity style={[styles.blueBtn]}>
          <Text style={styles.whiteText}>Consult</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  card: {
    marginTop: 12,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    elevation: 4,
    alignItems: "center",
  },
  left: { width: 48, alignItems: "center" },
  iconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  icon: { width: 22, height: 22, resizeMode: "contain" },
  body: { flex: 1, marginLeft: 8 },
  cardTitle: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 12, color: "#6B7280", marginTop: 4 },

  greyBtn: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  blueBtn: {
    backgroundColor: "#06B6D4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  greenText: { color: "#16A34A", fontWeight: "700" },
  whiteText: { color: "#fff", fontWeight: "700" },
});
