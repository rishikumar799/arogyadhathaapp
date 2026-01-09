import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const COLORS = {
  primary: "#065f46",
  secondary: "#3B82F6",
  accent: "#8B5CF6",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#10B981",
  text: "#0F172A",
  textLight: "#334155",
  muted: "#64748B",
  border: "#E2E8F0",
  soft: "#ECFDF5",
  bg: "#FFFFFF",
};

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const PATIENTS = [
    { id: "1", name: "John Carter", age: 45, gender: "Male", lastVisit: "Today", prescriptions: 3, status: "Active" },
    { id: "2", name: "Emily Stone", age: 32, gender: "Female", lastVisit: "Yesterday", prescriptions: 5, status: "Active" },
    { id: "3", name: "Michael Ross", age: 58, gender: "Male", lastVisit: "2 days ago", prescriptions: 2, status: "Inactive" },
    { id: "4", name: "Sarah Johnson", age: 28, gender: "Female", lastVisit: "1 week ago", prescriptions: 4, status: "Active" },
    { id: "5", name: "David Brown", age: 62, gender: "Male", lastVisit: "3 days ago", prescriptions: 6, status: "Active" },
    { id: "6", name: "Lisa Taylor", age: 41, gender: "Female", lastVisit: "1 month ago", prescriptions: 1, status: "Inactive" },
  ];

  const handleViewPatient = (patient) => {
    Alert.alert("Patient Details", `Viewing ${patient.name}'s profile`);
  };

  const handleMessage = (patient) => {
    Alert.alert("Send Message", `Message ${patient.name}`);
  };

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity style={styles.patientCard} onPress={() => handleViewPatient(item)}>
      <View style={styles.patientHeader}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>{item.name.split(' ').map(n => n[0]).join('')}</ThemedText>
        </View>
        <View style={styles.patientInfo}>
          <View style={styles.nameRow}>
            <ThemedText style={styles.patientName}>{item.name}</ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#D1FAE5' : '#F3F4F6' }]}>
              <ThemedText style={[styles.statusText, { color: item.status === 'Active' ? COLORS.success : COLORS.muted }]}>
                {item.status}
              </ThemedText>
            </View>
          </View>
          <View style={styles.detailsRow}>
            <ThemedText style={styles.patientDetails}>{item.age} yrs • {item.gender}</ThemedText>
            <View style={styles.prescriptionBadge}>
              <Ionicons name="document-text" size={12} color={COLORS.primary} />
              <ThemedText style={styles.prescriptionCount}>{item.prescriptions} Rx</ThemedText>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.patientFooter}>
        <View style={styles.lastVisit}>
          <Ionicons name="calendar" size={12} color={COLORS.muted} />
          <ThemedText style={styles.lastVisitText}>Last visit: {item.lastVisit}</ThemedText>
        </View>
        <TouchableOpacity style={styles.messageButton} onPress={() => handleMessage(item)}>
          <Ionicons name="chatbubble" size={16} color={COLORS.primary} />
          <ThemedText style={styles.messageButtonText}>Message</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* HEADER */}
      <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Patients</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Manage patient records and medications</ThemedText>
          </View>
          <Link href="/prescriptions" asChild>
            <TouchableOpacity style={styles.newPatientButton}>
              <Ionicons name="person-add" size={20} color="#FFFFFF" />
              <ThemedText style={styles.newPatientButtonText}>Add Patient</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </LinearGradient>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{PATIENTS.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Patients</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{PATIENTS.filter(p => p.status === 'Active').length}</ThemedText>
          <ThemedText style={styles.statLabel}>Active</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>
            {PATIENTS.reduce((sum, p) => sum + p.prescriptions, 0)}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Rx</ThemedText>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.muted}
          />
        </View>
      </View>

      {/* FILTERS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        {["all", "active", "inactive", "senior", "pediatric"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, activeFilter === filter && styles.activeFilter]}
            onPress={() => setActiveFilter(filter)}
          >
            <ThemedText style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* PATIENTS LIST */}
      <View style={styles.contentSection}>
        <FlatList
          data={PATIENTS}
          renderItem={renderPatientCard}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 32, color: "#FFFFFF", fontWeight: "800", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.9)" },
  newPatientButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  newPatientButtonText: { fontSize: 14, color: "#FFFFFF", fontWeight: "600" },
  statsContainer: { flexDirection: "row", paddingHorizontal: 24, marginVertical: 20, gap: 12 },
  statCard: { flex: 1, backgroundColor: COLORS.soft, padding: 16, borderRadius: 16, alignItems: "center" },
  statValue: { fontSize: 28, fontWeight: "800", color: COLORS.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: COLORS.muted, fontWeight: "600" },
  searchSection: { paddingHorizontal: 24, marginBottom: 20 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.soft, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.text },
  filtersScroll: { paddingHorizontal: 24, marginBottom: 20 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.soft, borderRadius: 12, marginRight: 10 },
  activeFilter: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: COLORS.muted },
  activeFilterText: { color: "#FFFFFF" },
  contentSection: { paddingHorizontal: 24, paddingBottom: 40 },
  patientCard: { backgroundColor: COLORS.bg, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  patientHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary + '20', alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: "800", color: COLORS.primary },
  patientInfo: { flex: 1 },
  nameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  patientName: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "700" },
  detailsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  patientDetails: { fontSize: 14, color: COLORS.muted },
  prescriptionBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  prescriptionCount: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  patientFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  lastVisit: { flexDirection: "row", alignItems: "center", gap: 6 },
  lastVisitText: { fontSize: 12, color: COLORS.muted },
  messageButton: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.soft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  messageButtonText: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
});