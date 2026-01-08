import { ThemedText } from "@/components/themed-text";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function SecurityScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.title}>Security</ThemedText>
      <ThemedText style={styles.subtitle}>
        System-wide security policies and protections
      </ThemedText>

      {/* SESSION SECURITY */}
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>
          Session Security
        </ThemedText>
        <ThemedText style={styles.text}>
          • Secure login sessions across web and mobile
        </ThemedText>
        <ThemedText style={styles.text}>
          • Role-based session validation
        </ThemedText>
        <ThemedText style={styles.text}>
          • Automatic logout on invalid access
        </ThemedText>
      </View>

      {/* ROLE SAFETY */}
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>
          Role & Access Control
        </ThemedText>
        <ThemedText style={styles.text}>
          • Strict role-based dashboard access
        </ThemedText>
        <ThemedText style={styles.text}>
          • Hospitals, doctors, patients isolated by role
        </ThemedText>
        <ThemedText style={styles.text}>
          • Super Admin privileges protected
        </ThemedText>
      </View>

      {/* ADMIN PROTECTION */}
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>
          Admin Protection
        </ThemedText>
        <ThemedText style={styles.text}>
          • Super Admin routes secured
        </ThemedText>
        <ThemedText style={styles.text}>
          • Unauthorized access automatically blocked
        </ThemedText>
        <ThemedText style={styles.text}>
          • Critical actions limited to Admin only
        </ThemedText>
      </View>

      {/* AUDIT LOGS (FUTURE) */}
      <View style={styles.cardMuted}>
        <ThemedText style={styles.cardTitle}>
          Audit & Monitoring
        </ThemedText>
        <ThemedText style={styles.muted}>
          • Activity logs (coming soon)
        </ThemedText>
        <ThemedText style={styles.muted}>
          • Security event tracking
        </ThemedText>
        <ThemedText style={styles.muted}>
          • Admin action history
        </ThemedText>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 14,
  },

  cardMuted: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#0F172A",
  },

  text: {
    fontSize: 14,
    marginBottom: 6,
    color: "#334155",
  },

  muted: {
    fontSize: 14,
    marginBottom: 6,
    color: "#64748B",
  },
});
