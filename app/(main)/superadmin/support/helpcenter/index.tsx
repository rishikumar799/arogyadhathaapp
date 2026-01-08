import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

/* ================= SCREEN ================= */

export default function SuperAdminHelpCenter() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      {/* HEADER */}
      <ThemedText style={styles.title}>Help Center</ThemedText>
      <ThemedText style={styles.subtitle}>
        Super Admin operational guide & system assistance
      </ThemedText>

      {/* SYSTEM OVERVIEW */}
      <Card>
        <CardTitle icon="shield-checkmark-outline" text="System Overview" />
        <HelpRow
          title="Role-Based Architecture"
          desc="Each user operates strictly within their assigned role. Role mismatches may cause access or data visibility issues."
        />
        <HelpRow
          title="Approval Flow"
          desc="All registrations must be approved. Approved requests are migrated to users or hospitals collections and logged."
        />
        <HelpRow
          title="Data Integrity"
          desc="Hospitals are stored separately from users. Never manually merge collections."
        />
      </Card>

      {/* OPERATIONS */}
      <Card>
        <CardTitle icon="settings-outline" text="Operational Actions" />
        <HelpRow
          title="User & Hospital Approvals"
          desc="Always verify role, email, and phone before approving. Incorrect approvals cannot be auto-reverted."
        />
        <HelpRow
          title="Announcements"
          desc="Use announcements for downtime alerts, policy updates, or critical system notices."
        />
        <HelpRow
          title="Audit Awareness"
          desc="All critical actions should be traceable through activity logs for accountability."
        />
      </Card>

      {/* TROUBLESHOOTING */}
      <Card muted>
        <CardTitle icon="alert-circle-outline" text="Troubleshooting Guide" />
        <HelpRow
          title="User Cannot Login"
          desc="Check approval status, role casing, and Firebase Auth existence."
        />
        <HelpRow
          title="Wrong Dashboard Data"
          desc="Dashboard counts rely on normalized roles. Suspect legacy casing issues first."
        />
        <HelpRow
          title="Announcement Not Visible"
          desc="Verify active status, target role, and valid start/end time window."
        />
      </Card>

      {/* SYSTEM STATUS */}
      <Card>
        <CardTitle icon="pulse-outline" text="System Health (Read-Only)" />
        <StatusRow label="Authentication" status="Operational" />
        <StatusRow label="Database (Firestore)" status="Operational" />
        <StatusRow label="File Storage" status="Operational" />
        <StatusRow label="Activity Logs" status="Enabled" />
      </Card>

      {/* SUPPORT */}
      <Card muted>
        <CardTitle icon="help-circle-outline" text="Support & Escalation" />
        <HelpRow
          title="When to Raise a Ticket"
          desc="Use Support Tickets for data corruption, access issues, or unexpected system behavior."
        />
        <HelpRow
          title="Include Details"
          desc="Always include user email, role, timestamp, and action performed."
        />
        <HelpRow
          title="Avoid Manual Fixes"
          desc="Do not modify Firestore data directly unless explicitly required."
        />
      </Card>
    </ScrollView>
  );
}

/* ================= COMPONENTS ================= */

function Card({ children, muted }: any) {
  return (
    <View style={[styles.card, muted && styles.cardMuted]}>
      {children}
    </View>
  );
}

function CardTitle({ icon, text }: any) {
  return (
    <View style={styles.cardTitleRow}>
      <Ionicons name={icon} size={18} color="#16A34A" />
      <ThemedText style={styles.cardTitle}>{text}</ThemedText>
    </View>
  );
}

function HelpRow({ title, desc }: any) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowTitle}>{title}</ThemedText>
      <ThemedText style={styles.rowDesc}>{desc}</ThemedText>
    </View>
  );
}

function StatusRow({ label, status }: any) {
  return (
    <View style={styles.statusRow}>
      <ThemedText style={styles.statusLabel}>{label}</ThemedText>
      <View style={styles.statusBadge}>
        <ThemedText style={styles.statusText}>{status}</ThemedText>
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
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  cardMuted: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  row: {
    marginBottom: 14,
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },

  rowDesc: {
    fontSize: 13,
    color: "#64748B",
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#166534",
  },
});
