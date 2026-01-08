import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const COLORS = {
  primary: "#10B981",
  primaryLight: "#34D399",
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

export default function PrescriptionsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showNewRxModal, setShowNewRxModal] = useState(false);

  const PRESCRIPTIONS = {
    pending: [
      { id: "1", patient: "John Carter", doctor: "Dr. Smith", medication: "Amoxicillin 500mg", time: "09:30 AM", priority: "high", status: "Pending" },
      { id: "2", patient: "Emily Stone", doctor: "Dr. Johnson", medication: "Lisinopril 10mg", time: "11:00 AM", priority: "normal", status: "Pending" },
      { id: "3", patient: "Michael Ross", doctor: "Dr. Wilson", medication: "Metformin 850mg", time: "02:15 PM", priority: "high", status: "Processing" },
    ],
    ready: [
      { id: "4", patient: "Sarah Johnson", doctor: "Dr. Brown", medication: "Atorvastatin 20mg", time: "03:45 PM", priority: "normal", status: "Ready" },
      { id: "5", patient: "David Brown", doctor: "Dr. Miller", medication: "Levothyroxine 50mcg", time: "10:30 AM", priority: "normal", status: "Ready" },
    ],
    completed: [
      { id: "6", patient: "Lisa Taylor", doctor: "Dr. Davis", medication: "Albuterol Inhaler", time: "Yesterday", priority: "normal", status: "Completed" },
      { id: "7", patient: "Robert Chen", doctor: "Dr. Wilson", medication: "Omeprazole 40mg", time: "Yesterday", priority: "normal", status: "Completed" },
    ]
  };

  const handleProcessRx = (id) => {
    Alert.alert("Process Prescription", "Mark as processed?", [
      { text: "Cancel", style: "cancel" },
      { text: "Process", onPress: () => Alert.alert("Success", "Prescription processed!") }
    ]);
  };

  const handleDispense = (id) => {
    Alert.alert("Dispense Medication", "Mark as dispensed?", [
      { text: "Cancel", style: "cancel" },
      { text: "Dispense", onPress: () => Alert.alert("Success", "Medication dispensed!") }
    ]);
  };

  const renderPrescriptionCard = (item) => (
    <View key={item.id} style={styles.rxCard}>
      <View style={styles.rxHeader}>
        <View>
          <ThemedText style={styles.patientName}>{item.patient}</ThemedText>
          <ThemedText style={styles.doctorText}>Dr: {item.doctor}</ThemedText>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: item.priority === 'high' ? '#FEE2E2' : '#ECFDF5' }]}>
          <ThemedText style={[styles.priorityText, { color: item.priority === 'high' ? '#DC2626' : COLORS.primary }]}>
            {item.priority}
          </ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.medicationText}>{item.medication}</ThemedText>
      
      <View style={styles.rxFooter}>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={12} color={COLORS.muted} />
          <ThemedText style={styles.timeText}>{item.time}</ThemedText>
        </View>
        
        <View style={styles.actionButtons}>
          {item.status === 'Pending' && (
            <TouchableOpacity style={styles.processButton} onPress={() => handleProcessRx(item.id)}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
              <ThemedText style={styles.buttonText}>Process</ThemedText>
            </TouchableOpacity>
          )}
          
          {item.status === 'Processing' && (
            <TouchableOpacity style={styles.dispenseButton} onPress={() => handleDispense(item.id)}>
              <Ionicons name="medical" size={16} color={COLORS.success} />
              <ThemedText style={[styles.buttonText, { color: COLORS.success }]}>Dispense</ThemedText>
            </TouchableOpacity>
          )}
          
          <View style={[styles.statusBadge, { backgroundColor: 
            item.status === 'Ready' ? '#D1FAE5' : 
            item.status === 'Processing' ? '#E0F2FE' : 
            '#F3F4F6' 
          }]}>
            <ThemedText style={[styles.statusText, { color: 
              item.status === 'Ready' ? COLORS.success : 
              item.status === 'Processing' ? COLORS.secondary : 
              COLORS.muted 
            }]}>
              {item.status}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Prescriptions</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Manage and process medication orders</ThemedText>
          </View>
          <TouchableOpacity style={styles.newRxButton} onPress={() => setShowNewRxModal(true)}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <ThemedText style={styles.newRxButtonText}>New Rx</ThemedText>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* SEARCH & FILTER */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search prescriptions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.muted}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
          <Ionicons name="filter" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        {["pending", "ready", "completed"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <ThemedText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({PRESCRIPTIONS[tab].length})
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* PRESCRIPTIONS LIST */}
      <View style={styles.contentSection}>
        <FlatList
          data={PRESCRIPTIONS[activeTab]}
          renderItem={({ item }) => renderPrescriptionCard(item)}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* NEW PRESCRIPTION MODAL */}
      <Modal visible={showNewRxModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>New Prescription</ThemedText>
              <TouchableOpacity onPress={() => setShowNewRxModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            {/* Add form fields here */}
            <TouchableOpacity style={styles.submitButton}>
              <ThemedText style={styles.submitButtonText}>Create Prescription</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 32, color: "#FFFFFF", fontWeight: "800", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.9)" },
  newRxButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  newRxButtonText: { fontSize: 14, color: "#FFFFFF", fontWeight: "600" },
  searchSection: { paddingHorizontal: 24, marginVertical: 20, flexDirection: "row", gap: 12 },
  searchContainer: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: COLORS.soft, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.text },
  filterButton: { width: 50, height: 50, backgroundColor: COLORS.soft, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  tabsContainer: { flexDirection: "row", paddingHorizontal: 24, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: "600", color: COLORS.muted },
  activeTabText: { color: COLORS.primary },
  contentSection: { paddingHorizontal: 24 },
  rxCard: { backgroundColor: COLORS.bg, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  rxHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  patientName: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 4 },
  doctorText: { fontSize: 14, color: COLORS.muted },
  priorityBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  priorityText: { fontSize: 12, fontWeight: "700" },
  medicationText: { fontSize: 16, color: COLORS.text, marginBottom: 16, fontWeight: "600" },
  rxFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timeContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  timeText: { fontSize: 14, color: COLORS.muted },
  actionButtons: { flexDirection: "row", alignItems: "center", gap: 12 },
  processButton: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.soft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  dispenseButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#D1FAE5", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  buttonText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: "700" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: COLORS.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: "700", color: COLORS.text },
  submitButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  submitButtonText: { fontSize: 16, color: "#FFFFFF", fontWeight: "600" },
});