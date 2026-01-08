import { ThemedText } from "@/components/themed-text";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function IntegrationsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.title}>Integrations</ThemedText>
      <ThemedText style={styles.subtitle}>
        Connected services and supported integrations
      </ThemedText>

      {/* COMMUNICATION */}
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>
          Communication Services
        </ThemedText>

        <IntegrationRow
          name="Email Notifications"
          status="Active"
          desc="System emails for alerts and updates"
        />
        <IntegrationRow
          name="SMS Alerts"
          status="Planned"
          desc="Appointment and system notifications"
        />
        <IntegrationRow
          name="WhatsApp Messaging"
          status="Coming Soon"
          desc="Patient and hospital communication"
        />
      </View>

      {/* PAYMENTS */}
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>
          Payments & Billing
        </ThemedText>

        <IntegrationRow
          name="Online Payments"
          status="Planned"
          desc="Consultation and service payments"
        />
        <IntegrationRow
          name="Invoice Generation"
          status="Planned"
          desc="Hospital billing and receipts"
        />
      </View>

      {/* HEALTH SYSTEMS */}
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>
          Health & Medical Systems
        </ThemedText>

        <IntegrationRow
          name="Diagnostics Labs"
          status="Coming Soon"
          desc="Lab report integrations"
        />
        <IntegrationRow
          name="Medical Reports"
          status="Active"
          desc="Secure report uploads and downloads"
        />
      </View>

      {/* SYSTEM */}
      <View style={styles.cardMuted}>
        <ThemedText style={styles.cardTitle}>
          System Integrations
        </ThemedText>

        <IntegrationRow
          name="Firebase"
          status="Active"
          desc="Authentication, database, and storage"
        />
        <IntegrationRow
          name="Cloud Storage"
          status="Active"
          desc="Secure file and image storage"
        />
        <IntegrationRow
          name="Audit Logs"
          status="Coming Soon"
          desc="Admin and system activity tracking"
        />
      </View>
    </ScrollView>
  );
}

/* ---------------- SUB COMPONENT ---------------- */

function IntegrationRow({
  name,
  status,
  desc,
}: {
  name: string;
  status: "Active" | "Planned" | "Coming Soon";
  desc: string;
}) {
  const statusStyle =
    status === "Active"
      ? styles.active
      : status === "Planned"
      ? styles.planned
      : styles.coming;

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.rowTitle}>{name}</ThemedText>
        <ThemedText style={styles.rowDesc}>{desc}</ThemedText>
      </View>

      <View style={[styles.badge, statusStyle]}>
        <ThemedText style={styles.badgeText}>{status}</ThemedText>
      </View>
    </View>
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
    marginBottom: 14,
    color: "#0F172A",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },

  rowDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  active: {
    backgroundColor: "#DCFCE7",
  },

  planned: {
    backgroundColor: "#FEF9C3",
  },

  coming: {
    backgroundColor: "#E5E7EB",
  },
});
