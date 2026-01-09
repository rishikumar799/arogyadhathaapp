import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#065F46",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const receptionStats = [
  { label: "Check-ins Today", value: "47", icon: "log-in", color: COLORS.primary },
  { label: "Pending Forms", value: "12", icon: "document-text", color: COLORS.warning },
  { label: "Walk-in Patients", value: "28", icon: "walk", color: COLORS.success },
  { label: "Waiting", value: "8", icon: "time", color: COLORS.info },
];

const pendingCheckins = [
  { name: "John Carter", time: "09:30 AM", purpose: "Consultation", status: "Waiting" },
  { name: "Emma Wilson", time: "10:15 AM", purpose: "Follow-up", status: "Processing" },
  { name: "Michael Brown", time: "11:00 AM", purpose: "Lab Test", status: "Waiting" },
];

const recentDischarges = [
  { name: "David Chen", room: "301", discharge: "10:45 AM" },
  { name: "Sophia Garcia", room: "205", discharge: "09:20 AM" },
  { name: "Robert Johnson", room: "412", discharge: "08:30 AM" },
];

export default function ReceptionPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Reception</ThemedText>
          <ThemedText style={styles.subtitle}>Front Desk Management</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>New Check-in</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        {receptionStats.map((stat, idx) => (
          <View key={idx} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + "20" }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Pending Check-ins</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {pendingCheckins.map((patient, idx) => (
            <View key={idx} style={styles.patientRow}>
              <View style={styles.patientInfo}>
                <ThemedText style={styles.patientName}>{patient.name}</ThemedText>
                <ThemedText style={styles.patientPurpose}>{patient.purpose}</ThemedText>
              </View>
              <View style={styles.patientRight}>
                <ThemedText style={styles.patientTime}>{patient.time}</ThemedText>
                <View style={[styles.statusBadge, { 
                  backgroundColor: patient.status === 'Waiting' ? COLORS.warning + '20' : COLORS.info + '20' 
                }]}>
                  <ThemedText style={[styles.statusText, { 
                    color: patient.status === 'Waiting' ? COLORS.warning : COLORS.info 
                  }]}>
                    {patient.status}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Discharges</ThemedText>
        <View style={styles.card}>
          {recentDischarges.map((patient, idx) => (
            <View key={idx} style={styles.dischargeRow}>
              <View style={styles.dischargeInfo}>
                <ThemedText style={styles.dischargeName}>{patient.name}</ThemedText>
                <ThemedText style={styles.dischargeRoom}>Room {patient.room}</ThemedText>
              </View>
              <View style={styles.dischargeRight}>
                <ThemedText style={styles.dischargeTime}>{patient.discharge}</ThemedText>
                <TouchableOpacity style={styles.printButton}>
                  <Ionicons name="print" size={16} color={COLORS.primary} />
                  <ThemedText style={styles.printText}>Print</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  newButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  newButtonText: { color: "#fff", fontWeight: "600" },
  stats: { paddingHorizontal: 20, flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  statCard: { width: "47%", backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  patientRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  patientPurpose: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  patientRight: { alignItems: "flex-end" },
  patientTime: { fontSize: 12, fontWeight: "500", color: COLORS.text, marginBottom: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "600" },
  dischargeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  dischargeInfo: { flex: 1 },
  dischargeName: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  dischargeRoom: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  dischargeRight: { alignItems: "flex-end" },
  dischargeTime: { fontSize: 12, fontWeight: "500", color: COLORS.text, marginBottom: 8 },
  printButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  printText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
});