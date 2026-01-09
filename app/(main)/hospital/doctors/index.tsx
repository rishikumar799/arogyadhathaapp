import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#065F46",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const doctors = [
  { id: "1", name: "Dr. James Smith", department: "Cardiology", experience: "15 years", patients: "1,248", rating: 4.8 },
  { id: "2", name: "Dr. Emily Davis", department: "Pediatrics", experience: "12 years", patients: "892", rating: 4.9 },
  { id: "3", name: "Dr. Robert Lee", department: "Orthopedics", experience: "18 years", patients: "2,134", rating: 4.7 },
  { id: "4", name: "Dr. Sarah Miller", department: "Neurology", experience: "10 years", patients: "756", rating: 4.6 },
  { id: "5", name: "Dr. Michael Chen", department: "Oncology", experience: "20 years", patients: "1,542", rating: 4.9 },
];

export default function DoctorsPage() {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Doctors</ThemedText>
          <ThemedText style={styles.subtitle}>Medical Professionals Team</ThemedText>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.addButtonText}>Add Doctor</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={doctors}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.doctorCard}>
            <View style={styles.doctorHeader}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>{item.name.charAt(0)}</ThemedText>
              </View>
              <View style={styles.doctorInfo}>
                <ThemedText style={styles.doctorName}>{item.name}</ThemedText>
                <ThemedText style={styles.doctorDept}>{item.department}</ThemedText>
              </View>
              <View style={styles.rating}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
              </View>
            </View>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <ThemedText style={styles.statValue}>{item.experience}</ThemedText>
                <ThemedText style={styles.statLabel}>Experience</ThemedText>
              </View>
              <View style={styles.stat}>
                <ThemedText style={styles.statValue}>{item.patients}</ThemedText>
                <ThemedText style={styles.statLabel}>Patients</ThemedText>
              </View>
              <TouchableOpacity style={styles.scheduleButton}>
                <Ionicons name="calendar" size={16} color="#065F46" />
                <ThemedText style={styles.scheduleText}>Schedule</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  addButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  addButtonText: { color: "#fff", fontWeight: "600" },
  list: { padding: 24, paddingTop: 0 },
  doctorCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  doctorHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#065F4620", alignItems: "center", justifyContent: "center", marginRight: 16 },
  avatarText: { fontSize: 24, fontWeight: "700", color: COLORS.primary },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  doctorDept: { fontSize: 14, color: COLORS.muted },
  rating: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  stats: { flexDirection: "row", alignItems: "center", gap: 16 },
  stat: { flex: 1 },
  statValue: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  scheduleButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
  scheduleText: { color: COLORS.primary, fontWeight: "600" },
});