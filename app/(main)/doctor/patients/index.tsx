import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const COLORS = {
  bg: "#FFFFFF", primary: "#10B981", text: "#0F172A", textLight: "#334155",
  muted: "#64748B", border: "#E2E8F0", soft: "#ECFDF5",
};

export default function Patients() {
  const [search, setSearch] = useState("");

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Patients</ThemedText>
        <ThemedText style={styles.subtitle}>Manage your patients</ThemedText>
      </View>

      <View style={styles.searchBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={COLORS.muted} />
          <TextInput
            style={styles.input}
            placeholder="Search patients..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={COLORS.muted}
          />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addButtonText}>New Patient</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>124</ThemedText>
          <ThemedText style={styles.statLabel}>Total Patients</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>18</ThemedText>
          <ThemedText style={styles.statLabel}>Active Today</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>6</ThemedText>
          <ThemedText style={styles.statLabel}>Needs Review</ThemedText>
        </View>
      </View>

    <ScrollView
  style={styles.content}
  contentContainerStyle={{ paddingBottom: 120 }}
  showsVerticalScrollIndicator={false}
>

        <View style={styles.recentPatients}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Patients</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAll}>View All →</ThemedText>
            </TouchableOpacity>
          </View>

          {[
            { name: "Robert Chen", condition: "Hypertension", lastVisit: "2 hours ago", status: "Stable", age: 45, gender: "Male" },
            { name: "Maria Garcia", condition: "Diabetes Type 2", lastVisit: "Yesterday", status: "Improving", age: 52, gender: "Female" },
            { name: "James Wilson", condition: "Asthma", lastVisit: "2 days ago", status: "Needs Review", age: 38, gender: "Male" },
            { name: "Lisa Taylor", condition: "Migraine", lastVisit: "1 week ago", status: "Recovered", age: 29, gender: "Female" },
          ].map((patient, index) => (
            <TouchableOpacity key={index} style={styles.patientCard}>
              <View style={styles.patientHeader}>
                <View style={styles.avatar}>
                  <ThemedText style={styles.avatarText}>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </ThemedText>
                </View>
                <View style={styles.patientInfo}>
                  <ThemedText style={styles.patientName}>{patient.name}</ThemedText>
                  <ThemedText style={styles.patientMeta}>
                    {patient.age} yrs • {patient.gender}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.patientDetails}>
                <ThemedText style={styles.patientCondition}>{patient.condition}</ThemedText>
                <View style={styles.patientStatus}>
                  <ThemedText style={styles.lastVisit}>{patient.lastVisit}</ThemedText>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: 
                      patient.status === 'Stable' ? '#D1FAE5' : 
                      patient.status === 'Improving' ? '#FEF3C7' : '#FEE2E2'
                    }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: 
                        patient.status === 'Stable' ? COLORS.primary : 
                        patient.status === 'Improving' ? COLORS.warning : COLORS.danger
                      }
                    ]} />
                    <ThemedText style={[
                      styles.statusText,
                      { color: 
                        patient.status === 'Stable' ? COLORS.primary : 
                        patient.status === 'Improving' ? COLORS.warning : COLORS.danger
                      }
                    ]}>
                      {patient.status}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.allPatients}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>All Patients</ThemedText>
            <View style={styles.filterButtons}>
              <TouchableOpacity style={[styles.filterBtn, styles.activeFilter]}>
                <ThemedText style={styles.filterText}>All</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}>
                <ThemedText style={styles.filterText}>Active</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}>
                <ThemedText style={styles.filterText}>Inactive</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.patientsGrid}>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <TouchableOpacity key={index} style={styles.gridCard}>
                <View style={styles.gridAvatar}>
                  <ThemedText style={styles.gridAvatarText}>P{index + 1}</ThemedText>
                </View>
                <ThemedText style={styles.gridName}>Patient {index + 1}</ThemedText>
                <ThemedText style={styles.gridCondition}>Condition</ThemedText>
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
    paddingBottom: 16, 
    gap: 12 
  },
  statCard: {
    flex: 1, backgroundColor: COLORS.soft, borderRadius: 16,
    padding: 16, alignItems: "center"
  },
  statNumber: { fontSize: 24, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: COLORS.muted, textAlign: "center" },
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  recentPatients: { marginBottom: 32 },
  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 16 
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  viewAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  patientCard: {
    backgroundColor: COLORS.soft, borderRadius: 16,
    padding: 16, marginBottom: 12
  },
  patientHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center", justifyContent: "center",
    marginRight: 12
  },
  avatarText: { fontSize: 16, color: COLORS.primary, fontWeight: "800" },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  patientMeta: { fontSize: 14, color: COLORS.muted },
  patientDetails: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  patientCondition: {
    fontSize: 14, color: COLORS.textLight, fontWeight: "600",
    backgroundColor: "#F1F5F9", paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 8
  },
  patientStatus: { flexDirection: "row", alignItems: "center", gap: 12 },
  lastVisit: { fontSize: 13, color: COLORS.muted },
  statusBadge: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, gap: 6
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: "700" },
  allPatients: { marginBottom: 32 },
  filterButtons: { flexDirection: "row", gap: 8 },
  filterBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: COLORS.soft
  },
  activeFilter: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 12, color: COLORS.text, fontWeight: "600" },
  patientsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridCard: {
    width: "30%", alignItems: "center",
    backgroundColor: COLORS.soft, padding: 16,
    borderRadius: 16
  },
  gridAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center", justifyContent: "center",
    marginBottom: 8
  },
  gridAvatarText: { fontSize: 18, color: COLORS.primary, fontWeight: "800" },
  gridName: { fontSize: 14, fontWeight: "600", color: COLORS.text, textAlign: "center" },
  gridCondition: { fontSize: 12, color: COLORS.muted, textAlign: "center" },
});