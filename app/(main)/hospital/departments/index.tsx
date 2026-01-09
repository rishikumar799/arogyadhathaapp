import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#065F46",
  info: "#0EA5E9",
  warning: "#F59E0B",
  success: "#10B981",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const departments = [
  { name: "Cardiology", doctors: 8, patients: 245, icon: "heart", color: "#EF4444" },
  { name: "Pediatrics", doctors: 12, patients: 189, icon: "people", color: "#0EA5E9" },
  { name: "Orthopedics", doctors: 6, patients: 156, icon: "bandage", color: "#F59E0B" },
  { name: "Neurology", doctors: 5, patients: 98, icon: "brain", color: "#8B5CF6" },
  { name: "Oncology", doctors: 7, patients: 112, icon: "medkit", color: "#10B981" },
  { name: "Emergency", doctors: 10, patients: 324, icon: "medkit-outline", color: "#DC2626" },
];

export default function DepartmentsPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Departments</ThemedText>
          <ThemedText style={styles.subtitle}>Hospital Specialties</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>Add Department</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>15</ThemedText>
          <ThemedText style={styles.statLabel}>Total Departments</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>48</ThemedText>
          <ThemedText style={styles.statLabel}>Doctors</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>1,124</ThemedText>
          <ThemedText style={styles.statLabel}>Patients</ThemedText>
        </View>
      </View>

      <View style={styles.grid}>
        {departments.map((dept, idx) => (
          <TouchableOpacity key={idx} style={styles.deptCard}>
            <View style={[styles.deptIcon, { backgroundColor: dept.color + "20" }]}>
              <Ionicons name={dept.icon as any} size={28} color={dept.color} />
            </View>
            <ThemedText style={styles.deptName}>{dept.name}</ThemedText>
            <View style={styles.deptStats}>
              <View style={styles.deptStat}>
                <Ionicons name="people" size={14} color={COLORS.muted} />
                <ThemedText style={styles.deptStatText}>{dept.doctors} Doctors</ThemedText>
              </View>
              <View style={styles.deptStat}>
                <Ionicons name="person" size={14} color={COLORS.muted} />
                <ThemedText style={styles.deptStatText}>{dept.patients} Patients</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <ThemedText style={styles.viewButtonText}>View Details</ThemedText>
              <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
  grid: { paddingHorizontal: 24, flexDirection: "row", flexWrap: "wrap", gap: 16 },
  deptCard: { width: "47%", backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  deptIcon: { width: 60, height: 60, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  deptName: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  deptStats: { gap: 8, marginBottom: 16 },
  deptStat: { flexDirection: "row", alignItems: "center", gap: 6 },
  deptStatText: { fontSize: 12, color: COLORS.muted },
  viewButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
  viewButtonText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
});