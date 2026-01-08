import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#10B981",
  primaryLight: "#34D399",
  primaryDark: "#065F46",
  soft: "#ECFDF5",
  warning: "#F59E0B",
  info: "#3B82F6",
  success: "#10B981",
  danger: "#EF4444",
  muted: "#64748B",
  text: "#0F172A",
  border: "#E2E8F0",
};

const PATIENTS = [
  {
    id: "PAT-001",
    name: "John Carter",
    age: 45,
    gender: "Male",
    lastVisit: "Today",
    phone: "+91 9876543210",
    status: "active",
  },
  {
    id: "PAT-002",
    name: "Emily Johnson",
    age: 32,
    gender: "Female",
    lastVisit: "Yesterday",
    phone: "+91 9876543211",
    status: "active",
  },
  {
    id: "PAT-003",
    name: "Robert Chen",
    age: 58,
    gender: "Male",
    lastVisit: "2 days ago",
    phone: "+91 9876543212",
    status: "inactive",
  },
  {
    id: "PAT-004",
    name: "Sarah Williams",
    age: 29,
    gender: "Female",
    lastVisit: "1 week ago",
    phone: "+91 9876543213",
    status: "active",
  },
  {
    id: "PAT-005",
    name: "Michael Brown",
    age: 65,
    gender: "Male",
    lastVisit: "2 weeks ago",
    phone: "+91 9876543214",
    status: "active",
  },
];

export default function Patients() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewPatient, setShowNewPatient] = useState(false);

  const filteredPatients = PATIENTS.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || patient.status === filter;
    return matchesSearch && matchesFilter;
  });

  const renderPatient = ({ item }: any) => {
    return (
      <TouchableOpacity 
        style={styles.patientCard}
        onPress={() => {
          setSelectedPatient(item);
          setShowModal(true);
        }}
      >
        <View style={styles.patientHeader}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {item.name.split(' ').map(n => n[0]).join('')}
            </ThemedText>
          </View>
          
          <View style={styles.patientInfo}>
            <ThemedText style={styles.patientName}>{item.name}</ThemedText>
            <View style={styles.patientDetails}>
              <ThemedText style={styles.patientDetail}>{item.age}y • {item.gender}</ThemedText>
              <ThemedText style={styles.patientId}>{item.id}</ThemedText>
            </View>
          </View>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === "active" ? COLORS.soft : `${COLORS.muted}15` }
          ]}>
            <ThemedText style={[
              styles.statusText,
              { color: item.status === "active" ? COLORS.success : COLORS.muted }
            ]}>
              {item.status}
            </ThemedText>
          </View>
        </View>

        <View style={styles.patientFooter}>
          <View style={styles.contactInfo}>
            <Ionicons name="call" size={14} color={COLORS.muted} />
            <ThemedText style={styles.phoneText}>{item.phone}</ThemedText>
          </View>
          
          <View style={styles.lastVisit}>
            <Ionicons name="calendar" size={14} color={COLORS.muted} />
            <ThemedText style={styles.lastVisitText}>Last: {item.lastVisit}</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Patients</ThemedText>
          <ThemedText style={styles.subtitle}>Manage patient records</ThemedText>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowNewPatient(true)}
        >
          <Ionicons name="person-add" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addText}>New Patient</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            placeholder="Search patients by name or ID..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
        
        <View style={styles.filterRow}>
          {["all", "active", "inactive"].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterChip,
                filter === f && styles.filterActive,
              ]}
            >
              <ThemedText style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Patients List */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={COLORS.border} />
            <ThemedText style={styles.emptyText}>No patients found</ThemedText>
          </View>
        }
      />

      {/* Patient Details Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Patient Details</ThemedText>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {selectedPatient && (
              <View style={styles.modalBody}>
                <View style={styles.modalAvatar}>
                  <ThemedText style={styles.modalAvatarText}>
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </ThemedText>
                </View>
                
                <ThemedText style={styles.modalPatientName}>
                  {selectedPatient.name}
                </ThemedText>
                
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Patient ID</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedPatient.id}</ThemedText>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Age & Gender</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {selectedPatient.age}y • {selectedPatient.gender}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Phone</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedPatient.phone}</ThemedText>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Last Visit</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedPatient.lastVisit}</ThemedText>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Status</ThemedText>
                    <ThemedText style={[
                      styles.detailValue,
                      { color: selectedPatient.status === "active" ? COLORS.success : COLORS.muted }
                    ]}>
                      {selectedPatient.status.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => console.log("Edit patient")}
                  >
                    <Ionicons name="create" size={18} color={COLORS.primary} />
                    <ThemedText style={styles.editText}>Edit</ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.appointmentButton}
                    onPress={() => console.log("New appointment")}
                  >
                    <Ionicons name="calendar" size={18} color="#FFFFFF" />
                    <ThemedText style={styles.appointmentText}>New Appointment</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  searchInput: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
    color: COLORS.text,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterChip: {
    backgroundColor: COLORS.soft,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterActive: {
    backgroundColor: COLORS.primaryDark,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  
  patientCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.soft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  patientDetails: {
    flexDirection: "row",
    gap: 12,
  },
  patientDetail: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  patientId: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  patientFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phoneText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  lastVisit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lastVisitText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.muted,
    fontWeight: "600",
    marginTop: 12,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  modalBody: {
    alignItems: "center",
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.soft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalAvatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
  },
  modalPatientName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 20,
  },
  detailGrid: {
    width: "100%",
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.soft,
    paddingVertical: 14,
    borderRadius: 12,
  },
  editText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  appointmentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  appointmentText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});