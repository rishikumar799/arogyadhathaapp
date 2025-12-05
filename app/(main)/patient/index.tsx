import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const quickAccess = [
  { label: "AI Symptom Checker", icon: require("@/assets/icons/heart.png"), route: "/symptom-checker" },
  { label: "Appointments", icon: require("@/assets/icons/calendar.png"), route: "/appointments" },
  { label: "Diagnostics", icon: require("@/assets/icons/testtube.png"), route: "/lab-reports" },
  { label: "My Medicines", icon: require("@/assets/icons/pill.png"), route: "/medicines" },
  { label: "Blood Bank", icon: require("@/assets/icons/blood.png"), route: "/blood-bank" },
  { label: "Crowd Funding", icon: require("@/assets/icons/gift.png"), route: "/community-fund" },
];

const organs = [
  { name: "Heart", score: 92, icon: require("@/assets/organs/heart.png") },
  { name: "Liver", score: 78, icon: require("@/assets/organs/liver.png") },
  { name: "Kidneys", score: 88, icon: require("@/assets/organs/kidney.png") },
];

export default function PatientDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.tagline}>
        Right disease for right doctor + Right Diet = 99% cure
      </Text>

      {/* QUICK ACCESS */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.grid}>
        {quickAccess.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(item.route)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ORGAN HEALTH */}
      <Text style={styles.sectionTitle}>Organ Health Overview</Text>
      <View style={styles.grid}>
        {organs.map((o, index) => (
          <View key={index} style={styles.organCard}>
            <Image source={o.icon} style={{ width: 40, height: 40 }} />
            <Text style={styles.organName}>{o.name}</Text>
            <Text style={styles.organScore}>{o.score}%</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f4f4f4",
  },
  tagline: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "30%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },

  organCard: {
    width: "30%",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },
  organName: {
    marginTop: 4,
    fontWeight: "700",
    fontSize: 12,
  },
  organScore: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "900",
    color: "#1fbf66",
  },
});
