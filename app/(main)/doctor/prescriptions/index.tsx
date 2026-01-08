import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const COLORS = {
  bg: "#FFFFFF", primary: "#10B981", text: "#0F172A", textLight: "#334155",
  muted: "#64748B", border: "#E2E8F0", soft: "#ECFDF5",
};

export default function Prescriptions() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Prescriptions</ThemedText>
        <ThemedText style={styles.subtitle}>Manage patient medications</ThemedText>
      </View>

      <View style={styles.searchBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={COLORS.muted} />
          <TextInput
            style={styles.input}
            placeholder="Search prescriptions..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={COLORS.muted}
          />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addButtonText}>New Prescription</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>48</ThemedText>
          <ThemedText style={styles.statLabel}>Active</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>124</ThemedText>
          <ThemedText style={styles.statLabel}>This Month</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>3</ThemedText>
          <ThemedText style={styles.statLabel}>Pending</ThemedText>
        </View>
      </View>

      <ScrollView
  style={styles.content}
  contentContainerStyle={{ paddingBottom: 120 }}
  showsVerticalScrollIndicator={false}
>
        <View style={styles.activeSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Active Prescriptions</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAll}>View All →</ThemedText>
            </TouchableOpacity>
          </View>

          {[
            { patient: "John Carter", medication: "Atorvastatin 20mg", dosage: "Once daily", time: "Night", status: "Active" },
            { patient: "Maria Garcia", medication: "Metformin 500mg", dosage: "Twice daily", time: "Morning & Evening", status: "Active" },
            { patient: "Robert Chen", medication: "Lisinopril 10mg", dosage: "Once daily", time: "Morning", status: "Active" },
            { patient: "Sarah Miller", medication: "Levothyroxine 50mcg", dosage: "Once daily", time: "Morning", status: "Active" },
          ].map((prescription, index) => (
            <TouchableOpacity key={index} style={styles.prescriptionCard}>
              <View style={styles.prescriptionHeader}>
                <View style={styles.medicationIcon}>
                  <Ionicons name="medical" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.medicationInfo}>
                  <ThemedText style={styles.medicationName}>{prescription.medication}</ThemedText>
                  <ThemedText style={styles.patientName}>{prescription.patient}</ThemedText>
                </View>
                <View style={styles.statusBadge}>
                  <ThemedText style={styles.statusText}>{prescription.status}</ThemedText>
                </View>
              </View>

              <View style={styles.prescriptionDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="speedometer" size={14} color={COLORS.muted} />
                  <ThemedText style={styles.detailText}>Dosage: {prescription.dosage}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={14} color={COLORS.muted} />
                  <ThemedText style={styles.detailText}>Time: {prescription.time}</ThemedText>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="refresh" size={16} color={COLORS.primary} />
                  <ThemedText style={styles.actionText}>Renew</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                  <Ionicons name="create" size={16} color="#FFFFFF" />
                  <ThemedText style={[styles.actionText, { color: "#FFFFFF" }]}>Edit</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Prescriptions</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAll}>View All →</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.recentGrid}>
            {[
              { medication: "Antibiotics", count: 24 },
              { medication: "Pain Relief", count: 18 },
              { medication: "Cardiac", count: 12 },
              { medication: "Diabetes", count: 16 },
              { medication: "Hypertension", count: 22 },
              { medication: "Others", count: 32 },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.gridCard}>
                <View style={styles.gridIcon}>
                  <Ionicons name="medical" size={24} color={COLORS.primary} />
                </View>
                <ThemedText style={styles.gridMedication}>{item.medication}</ThemedText>
                <ThemedText style={styles.gridCount}>{item.count} scripts</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.muted },
  searchBar: { 
    flexDirection: "row", 
    paddingHorizontal: 24, 
    paddingVertical: 16, 
    gap: 12 
  },
  searchBox: {
    flex: 1, flexDirection: "row", alignItems: "center", 
    backgroundColor: COLORS.soft, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: COLORS.border
  },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.text },
  addButton: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primary, paddingHorizontal: 16,
    paddingVertical: 12, borderRadius: 12, gap: 8
  },
  addButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  stats: { 
    flexDirection: "row", 
    paddingHorizontal: 24, 
    paddingVertical: 16, 
    gap: 12 
  },
  statCard: {
    flex: 1, backgroundColor: COLORS.soft, borderRadius: 16,
    padding: 16, alignItems: "center"
  },
  statNumber: { fontSize: 24, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: COLORS.muted, textAlign: "center" },
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  activeSection: { marginBottom: 32 },
  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 16 
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  viewAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  prescriptionCard: {
    backgroundColor: COLORS.soft, borderRadius: 16,
    padding: 16, marginBottom: 12
  },
  prescriptionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  medicationIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
    marginRight: 12
  },
  medicationInfo: { flex: 1 },
  medicationName: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  patientName: { fontSize: 14, color: COLORS.muted },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: "#D1FAE5", borderRadius: 8
  },
  statusText: { fontSize: 12, color: "#059669", fontWeight: "700" },
  prescriptionDetails: { marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  detailText: { fontSize: 14, color: COLORS.textLight, marginLeft: 8 },
  actionButtons: { flexDirection: "row", gap: 12 },
  actionButton: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 10, borderRadius: 8, backgroundColor: "#F1F5F9", gap: 8
  },
  editButton: { backgroundColor: COLORS.primary },
  actionText: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  recentSection: { marginBottom: 32 },
  recentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridCard: {
    width: "30%", alignItems: "center",
    backgroundColor: COLORS.soft, padding: 16,
    borderRadius: 16
  },
  gridIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center", justifyContent: "center",
    marginBottom: 8
  },
  gridMedication: { fontSize: 12, fontWeight: "600", color: COLORS.text, textAlign: "center", marginBottom: 4 },
  gridCount: { fontSize: 11, color: COLORS.muted, textAlign: "center" },
});