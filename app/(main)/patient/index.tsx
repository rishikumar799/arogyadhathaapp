import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PatientTopNav from "@/components/patient/PatientTopNav";

const quickAccess = [
  {
    label: "AI Symptom Checker",
    icon: require("@/assets/icons/heart.png"),
    route: "/(main)/patient/symptom-checker",
  },
  {
    label: "Appointments",
    icon: require("@/assets/icons/calendar.png"),
    route: "/(main)/patient/appointments",
  },
  {
    label: "Diagnostics",
    icon: require("@/assets/icons/testtube.png"),
    route: "/(main)/patient/lab-reports",
  },
  {
    label: "My Medicines",
    icon: require("@/assets/icons/pill.png"),
    route: "/(main)/patient/medicines",
  },
  {
    label: "Blood Bank",
    icon: require("@/assets/icons/blood.png"),
    route: "/(main)/patient/blood-bank",
  },
  {
    label: "Crowd Funding",
    icon: require("@/assets/icons/gift.png"),
    route: "/(main)/patient/community-fund",
  },
];

const organs = [
  { name: "Heart", score: 92, icon: require("@/assets/icons/heart.png") },
  { name: "Liver", score: 78, icon: require("@/assets/icons/heart.png") },
  { name: "Kidneys", score: 88, icon: require("@/assets/icons/heart.png") },
];

export default function PatientDashboard() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      {/* ✅ TOP NAV (LOGOUT HANDLED THERE) */}
      <PatientTopNav />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* TAGLINE */}
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
              activeOpacity={0.85}
            >
              <View style={styles.iconWrap}>
                <Image source={item.icon} style={styles.icon} />
              </View>
              <Text style={styles.cardText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ORGAN HEALTH */}
        <Text style={styles.sectionTitle}>Organ Health Overview</Text>
        <View style={styles.grid}>
          {organs.map((o, index) => (
            <View key={index} style={styles.organCard}>
              <Image source={o.icon} style={styles.organIcon} />
              <Text style={styles.organName}>{o.name}</Text>
              <Text style={styles.organScore}>{o.score}%</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F6FAF8",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  tagline: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginVertical: 14,
    paddingHorizontal: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
    marginTop: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "30%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F7EF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  icon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },

  cardText: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    color: "#0F172A",
  },

  organCard: {
    width: "30%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  organIcon: {
    width: 38,
    height: 38,
    marginBottom: 4,
  },

  organName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },

  organScore: {
    fontSize: 13,
    fontWeight: "900",
    color: "#16A34A",
    marginTop: 2,
  },
});
