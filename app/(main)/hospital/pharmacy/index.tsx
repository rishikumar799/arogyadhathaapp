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

const pharmacyStats = [
  { label: "Total Medicines", value: "1,248", icon: "medkit", color: COLORS.primary },
  { label: "Prescriptions Today", value: "86", icon: "document-text", color: COLORS.success },
  { label: "Low Stock", value: "12", icon: "alert-circle", color: COLORS.warning },
  { label: "Categories", value: "36", icon: "layers", color: COLORS.info },
];

const recentPrescriptions = [
  { patient: "John Carter", doctor: "Dr. James Smith", time: "10:30 AM", status: "Dispensed" },
  { patient: "Emma Wilson", doctor: "Dr. Emily Davis", time: "11:45 AM", status: "Pending" },
  { patient: "Michael Brown", doctor: "Dr. Robert Lee", time: "02:15 PM", status: "Processing" },
];

const popularMedicines = [
  { name: "Paracetamol 500mg", category: "Pain Relief", stock: 124 },
  { name: "Amoxicillin 250mg", category: "Antibiotics", stock: 89 },
  { name: "Omeprazole 20mg", category: "Gastro", stock: 67 },
];

export default function PharmacyPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Pharmacy</ThemedText>
          <ThemedText style={styles.subtitle}>Medication Management</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>New Prescription</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        {pharmacyStats.map((stat, idx) => (
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
          <ThemedText style={styles.sectionTitle}>Recent Prescriptions</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {recentPrescriptions.map((prescription, idx) => (
            <View key={idx} style={styles.prescriptionRow}>
              <View style={styles.prescriptionInfo}>
                <ThemedText style={styles.prescriptionPatient}>{prescription.patient}</ThemedText>
                <ThemedText style={styles.prescriptionDoctor}>{prescription.doctor}</ThemedText>
                <ThemedText style={styles.prescriptionTime}>{prescription.time}</ThemedText>
              </View>
              <View style={styles.prescriptionRight}>
                <View style={[styles.statusBadge, { 
                  backgroundColor: prescription.status === 'Dispensed' ? COLORS.success + '20' : 
                                  prescription.status === 'Processing' ? COLORS.info + '20' : COLORS.warning + '20' 
                }]}>
                  <ThemedText style={[styles.statusText, { 
                    color: prescription.status === 'Dispensed' ? COLORS.success : 
                           prescription.status === 'Processing' ? COLORS.info : COLORS.warning 
                  }]}>
                    {prescription.status}
                  </ThemedText>
                </View>
                <TouchableOpacity style={styles.dispenseButton}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  <ThemedText style={styles.dispenseText}>Dispense</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Popular Medicines</ThemedText>
        <View style={styles.medicinesCard}>
          {popularMedicines.map((medicine, idx) => (
            <TouchableOpacity key={idx} style={styles.medicineRow}>
              <View style={styles.medicineIcon}>
                <Ionicons name="medical" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.medicineInfo}>
                <ThemedText style={styles.medicineName}>{medicine.name}</ThemedText>
                <ThemedText style={styles.medicineCategory}>{medicine.category}</ThemedText>
              </View>
              <View style={styles.medicineStock}>
                <ThemedText style={styles.stockValue}>{medicine.stock}</ThemedText>
                <ThemedText style={styles.stockLabel}>in stock</ThemedText>
              </View>
            </TouchableOpacity>
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
  prescriptionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  prescriptionInfo: { flex: 1 },
  prescriptionPatient: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  prescriptionDoctor: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  prescriptionTime: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  prescriptionRight: { alignItems: "flex-end" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  statusText: { fontSize: 11, fontWeight: "600" },
  dispenseButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  dispenseText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
  medicinesCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  medicineRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  medicineIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primary + "20", alignItems: "center", justifyContent: "center", marginRight: 12 },
  medicineInfo: { flex: 1 },
  medicineName: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  medicineCategory: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  medicineStock: { alignItems: "center" },
  stockValue: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  stockLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
});