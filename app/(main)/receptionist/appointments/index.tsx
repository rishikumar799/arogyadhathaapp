import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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

const APPOINTMENTS = [
  {
    id: "APT-001",
    patient: "John Carter",
    doctor: "Dr. Sharma",
    time: "10:30 AM",
    date: "Today",
    type: "Consultation",
    status: "confirmed",
    duration: "30 min",
  },
  {
    id: "APT-002",
    patient: "Emily Johnson",
    doctor: "Dr. Gupta",
    time: "11:15 AM",
    date: "Today",
    type: "Follow-up",
    status: "confirmed",
    duration: "20 min",
  },
  {
    id: "APT-003",
    patient: "Robert Chen",
    doctor: "Dr. Patel",
    time: "02:45 PM",
    date: "Today",
    type: "Check-up",
    status: "pending",
    duration: "45 min",
  },
  {
    id: "APT-004",
    patient: "Sarah Williams",
    doctor: "Dr. Singh",
    time: "04:30 PM",
    date: "Today",
    type: "Consultation",
    status: "confirmed",
    duration: "30 min",
  },
  {
    id: "APT-005",
    patient: "Michael Brown",
    doctor: "Dr. Kumar",
    time: "09:00 AM",
    date: "Tomorrow",
    type: "Emergency",
    status: "confirmed",
    duration: "60 min",
  },
];

export default function Appointments() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const filteredAppointments = APPOINTMENTS.filter(appt => {
    const matchesSearch = 
      appt.patient.toLowerCase().includes(search.toLowerCase()) ||
      appt.doctor.toLowerCase().includes(search.toLowerCase());
    const matchesDate = filter === "all" || appt.date.toLowerCase().includes(filter);
    const matchesStatus = statusFilter === "all" || appt.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return COLORS.success;
      case 'pending': return COLORS.warning;
      case 'cancelled': return COLORS.danger;
      default: return COLORS.muted;
    }
  };

  const renderAppointment = ({ item }: any) => {
    const statusColor = getStatusColor(item.status);
    
    return (
      <TouchableOpacity 
        style={styles.appointmentCard}
        onPress={() => {
          setSelectedAppointment(item);
          setShowModal(true);
        }}
      >
        <View style={styles.appointmentHeader}>
          <View style={styles.timeSlot}>
            <ThemedText style={styles.time}>{item.time}</ThemedText>
            <ThemedText style={styles.duration}>{item.duration}</ThemedText>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
            <ThemedText style={[styles.statusText, { color: statusColor }]}>
              {item.status}
            </ThemedText>
          </View>
        </View>

        <View style={styles.appointmentBody}>
          <ThemedText style={styles.patientName}>{item.patient}</ThemedText>
          <View style={styles.appointmentDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="medical" size={14} color={COLORS.muted} />
              <ThemedText style={styles.detailText}>{item.doctor}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="document-text" size={14} color={COLORS.muted} />
              <ThemedText style={styles.detailText}>{item.type}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.appointmentFooter}>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar" size={12} color={COLORS.muted} />
            <ThemedText style={styles.dateText}>{item.date}</ThemedText>
          </View>
          
          {item.status === "pending" && (
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => console.log("Confirm", item.id)}
            >
              <ThemedText style={styles.confirmText}>Confirm</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Appointments</ThemedText>
          <ThemedText style={styles.subtitle}>Manage patient appointments</ThemedText>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowNewAppointment(true)}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addText}>New Appointment</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Search & Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            placeholder="Search appointments..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
        
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {["today", "tomorrow", "week", "all"].map((f) => (
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
          </ScrollView>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilterRow}>
            {["all", "confirmed", "pending", "cancelled"].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setStatusFilter(s)}
                style={[
                  styles.statusChip,
                  statusFilter === s && { backgroundColor: getStatusColor(s) },
                ]}
              >
                <ThemedText style={[
                  styles.statusFilterText,
                  statusFilter === s && styles.statusFilterTextActive,
                ]}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Appointments List */}
      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
  
  filterContainer: {
    gap: 12,
  },
  filterRow: {
    flexDirection: "row",
  },
  filterChip: {
    backgroundColor: COLORS.soft,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
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
  
  statusFilterRow: {
    flexDirection: "row",
  },
  statusChip: {
    backgroundColor: COLORS.soft,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  statusFilterText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statusFilterTextActive: {
    color: "#FFFFFF",
  },
  
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  
  appointmentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timeSlot: {
    alignItems: "flex-start",
  },
  time: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  
  appointmentBody: {
    marginBottom: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  appointmentDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  
  appointmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});