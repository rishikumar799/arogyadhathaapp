import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  name: string;
  loading: boolean;
};

export default function PatientHeader({ name, loading }: Props) {
  // 🔑 wait for auth to resolve
  if (loading) return null;

  const safeName =
    name && name.trim().length > 0 && name !== "there"
      ? capitalize(name)
      : null;

  return (
    <LinearGradient
      colors={["#022C22", "#065F46", "#16A34A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <Text style={styles.greetingText}>
        Hello{safeName ? `, ${safeName}` : ""}
      </Text>

      <Text style={styles.heroTitle}>
        All your care in one app
      </Text>

      <Text style={styles.heroSub}>
        Book appointments, track reports and manage your medicines.
      </Text>
    </LinearGradient>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 70,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E6FFF5",
  },
  heroTitle: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  heroSub: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(236,253,245,0.9)",
    lineHeight: 18,
    maxWidth: "90%",
  },
});
