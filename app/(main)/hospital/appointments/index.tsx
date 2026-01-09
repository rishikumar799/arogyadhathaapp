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
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const todayAppointments = [
  { time: "09:00 AM", patient: "John Carter", doctor: "Dr. James Smith", type: "Follow-up", status: "Confirmed" },
  { time: "10:30 AM", patient: "Emma Wilson", doctor: "Dr. Emily Davis", type: "New", status: "Confirmed" },
  { time: "02:15 PM", patient: "Michael Brown", doctor: "Dr. Robert Lee", type: "Consultation", status: "Pending" },
  { time: "04:45 PM", patient: "Sophia Garcia", doctor: "Dr. Sarah Miller", type: "Follow-up", status: "Confirmed" },
];

const upcomingAppointments = [
  { date: "Tomorrow", patient: "David Chen", doctor: "Dr. Michael Chen", time: "11:00 AM" },
  { date: "Jan 18", patient: "Olivia Taylor", doctor: "Dr. James Smith", time: "03:30 PM" },
  { date: "Jan 19", patient: "William Johnson", doctor: "Dr. Emily Davis", time: "10:00 AM" },
];

export default function AppointmentsPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Appointments</ThemedText>
          <ThemedText style={styles.subtitle}>Schedule Management</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>New Appointment</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>47</ThemedText>
          <ThemedText style={styles.statLabel}>Today</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>12</ThemedText>
          <ThemedText style={styles.statLabel}>Pending</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>35</ThemedText>
          <ThemedText style={styles.statLabel}>Confirmed</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Today's Schedule</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.scheduleCard}>
          {todayAppointments.map((apt, idx) => (
            <View key={idx} style={styles.appointmentRow}>
              <View style={styles.timeSlot}>
                <ThemedText style={styles.timeText}>{apt.time}</ThemedText>
              </View>
              <View style={styles.appointmentDetails}>
                <View style={styles.patientInfo}>
                  <ThemedText style={styles.patientName}>{apt.patient}</ThemedText>
                  <ThemedText style={styles.doctorName}>{apt.doctor}</ThemedText>
                </View>
                <View style={styles.appointmentMeta}>
                  <View style={styles.typeBadge}>
                    <ThemedText style={styles.typeText}>{apt.type}</ThemedText>
                  </View>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: apt.status === 'Confirmed' ? COLORS.success + '20' : COLORS.warning + '20' 
                  }]}>
                    <ThemedText style={[styles.statusText, { 
                      color: apt.status === 'Confirmed' ? COLORS.success : COLORS.warning 
                    }]}>
                      {apt.status}
                    </ThemedText>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section} >
        <ThemedText style={styles.sectionTitle }>Upcoming Appointments</ThemedText>
        <View style={styles.upcomingCard}>
          {upcomingAppointments.map((apt, idx) => (
            <View key={idx} style={styles.upcomingRow}>
              <View style={styles.dateBox}>
                <ThemedText style={styles.dateText}>{apt.date}</ThemedText>
              </View>
              <View style={styles.upcomingDetails}>
                <ThemedText style={styles.upcomingPatient}>{apt.patient}</ThemedText>
                <ThemedText style={styles.upcomingDoctor}>{apt.doctor}</ThemedText>
              </View>
              <ThemedText style={styles.upcomingTime}>{apt.time}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  newButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  newButtonText: { color: "#fff", fontWeight: "600" },
  stats: { paddingHorizontal: 24, flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statNumber: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  scheduleCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  appointmentRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  timeSlot: { width: 80 },
  timeText: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  appointmentDetails: { flex: 1, marginHorizontal: 16 },
  patientInfo: { marginBottom: 8 },
  patientName: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  doctorName: { fontSize: 12, color: COLORS.muted },
  appointmentMeta: { flexDirection: "row", gap: 8 },
  typeBadge: { backgroundColor: COLORS.border, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 10, fontWeight: "600", color: COLORS.muted },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: "600" },
  actionButton: { padding: 8 },
  upcomingCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  upcomingRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  dateBox: { backgroundColor: COLORS.primary + "10", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  dateText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
  upcomingDetails: { flex: 1, marginHorizontal: 16 },
  upcomingPatient: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  upcomingDoctor: { fontSize: 12, color: COLORS.muted },
  upcomingTime: { fontSize: 14, fontWeight: "600", color: COLORS.text },
});