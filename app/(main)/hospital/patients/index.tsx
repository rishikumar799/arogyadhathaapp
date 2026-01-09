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

const patients = [
  { id: "1", name: "John Carter", age: 45, gender: "Male", blood: "O+", lastVisit: "2024-01-15" },
  { id: "2", name: "Emma Wilson", age: 32, gender: "Female", blood: "A+", lastVisit: "2024-01-14" },
  { id: "3", name: "Michael Brown", age: 58, gender: "Male", blood: "B+", lastVisit: "2024-01-13" },
  { id: "4", name: "Sophia Garcia", age: 29, gender: "Female", blood: "AB+", lastVisit: "2024-01-12" },
  { id: "5", name: "David Chen", age: 67, gender: "Male", blood: "O-", lastVisit: "2024-01-11" },
];

export default function PatientsPage() {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Patients</ThemedText>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.addButtonText}>New Patient</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>1,248</ThemedText>
          <ThemedText style={styles.statLabel}>Total Patients</ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>47</ThemedText>
          <ThemedText style={styles.statLabel}>Today</ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>28</ThemedText>
          <ThemedText style={styles.statLabel}>Admitted</ThemedText>
        </View>
      </View>

      <FlatList 
        data={patients}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.patientCard}>
            <View style={styles.patientHeader}>
              <ThemedText style={styles.patientName}>{item.name}</ThemedText>
              <View style={[styles.badge, { backgroundColor: item.gender === 'Male' ? '#3B82F620' : '#EC489920' }]}>
                <ThemedText style={[styles.badgeText, { color: item.gender === 'Male' ? '#3B82F6' : '#EC4899' }]}>
                  {item.gender}
                </ThemedText>
              </View>
            </View>
            <View style={styles.patientDetails}>
              <View style={styles.detail}>
                <ThemedText style={styles.detailLabel}>Age:</ThemedText>
                <ThemedText style={styles.detailValue}>{item.age} years</ThemedText>
              </View>
              <View style={styles.detail}>
                <ThemedText style={styles.detailLabel}>Blood:</ThemedText>
                <ThemedText style={styles.detailValue}>{item.blood}</ThemedText>
              </View>
              <View style={styles.detail}>
                <ThemedText style={styles.detailLabel}>Last Visit:</ThemedText>
                <ThemedText style={styles.detailValue}>{item.lastVisit}</ThemedText>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye" size={16} color="#065F46" />
                <ThemedText style={styles.actionText}>View</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="create" size={16} color="#065F46" />
                <ThemedText style={styles.actionText}>Edit</ThemedText>
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
  addButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  addButtonText: { color: "#fff", fontWeight: "600" },
  stats: { flexDirection: "row", paddingHorizontal: 24, gap: 16, marginBottom: 24 },
  stat: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  list: { padding: 24, paddingTop: 0 , paddingBottom:120},
  patientCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  patientHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  patientName: { fontSize: 18, fontWeight: "700" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  patientDetails: { flexDirection: "row", gap: 20, marginBottom: 16 },
  detail: { flex: 1 },
  detailLabel: { fontSize: 12, color: COLORS.muted, marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 12 },
  actionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
  actionText: { color: COLORS.primary, fontWeight: "600" },
});