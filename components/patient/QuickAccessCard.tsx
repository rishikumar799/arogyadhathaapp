import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import QuickItem from "./QuickItem";

export default function QuickAccessCard() {
  const router = useRouter();

  const items = [
    { label: "AI Symptom Checker", icon: "heart-pulse", color: "#00B4A6", route: "/(main)/patient/symptom-checker" },
    { label: "Appointments", icon: "calendar-check", color: "#4F46E5", route: "/(main)/patient/appointments" },
    { label: "Diagnostics", icon: "test-tube", color: "#9333EA", route: "/(main)/patient/lab-reports" },
    { label: "Medicines", icon: "pill", color: "#16A34A", route: "/(main)/patient/medicines" },
    { label: "Blood Bank", icon: "water", color: "#DC2626", route: "/(main)/patient/blood-bank" },
    { label: "Crowd Funding", icon: "gift", color: "#EA580C", route: "/(main)/patient/community-fund" },
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Quick Access</Text>
      <View style={styles.grid}>
        {items.map((item, i) => (
          <QuickItem
            key={i}
            label={item.label}
            icon={item.icon}
            color={item.color}
            onPress={() => router.push(item.route)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
