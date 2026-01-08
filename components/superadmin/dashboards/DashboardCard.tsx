import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function DashboardCard({ title, value, subtitle }: Props) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
      {subtitle && (
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,

    // web shadow
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // android fallback
    elevation: 2,
  },

  title: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6,
  },

  value: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#16A34A",
  },
});
