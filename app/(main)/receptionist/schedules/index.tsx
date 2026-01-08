import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
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

const DOCTORS = [
  {
    id: "DOC-001",
    name: "Dr. Sharma",
    specialty: "Cardiology",
    schedule: [
      { day: "Mon", hours: "9:00 AM - 5:00 PM" },
      { day: "Tue", hours: "9:00 AM - 5:00 PM" },
      { day: "Thu", hours: "9:00 AM - 5:00 PM" },
      { day: "Fri", hours: "9:00 AM - 1:00 PM" },
    ],
    status: "available",
    patientsToday: 8,
  },
  {
    id: "DOC-002",
    name: "Dr. Gupta",
    specialty: "Orthopedics",
    schedule: [
      { day: "Mon", hours: "10:00 AM - 6:00 PM" },
      { day: "Wed", hours: "10:00 AM - 6:00 PM" },
      { day: "Fri", hours: "10:00 AM - 6:00 PM" },
      { day: "Sat", hours: "9:00 AM - 1:00 PM" },
    ],
    status: "busy",
    patientsToday: 12,
  },
  {
    id: "DOC-003",
    name: "Dr. Patel",
    specialty: "Pediatrics",
    schedule: [
      { day: "Tue", hours: "8:00 AM - 4:00 PM" },
      { day: "Wed", hours: "8:00 AM - 4:00 PM" },
      { day: "Thu", hours: "8:00 AM - 4:00 PM" },
      { day: "Fri", hours: "8:00 AM - 4:00 PM" },
    ],
    status: "available",
    patientsToday: 6,
  },
  {
    id: "DOC-004",
    name: "Dr. Singh",
    specialty: "Dermatology",
    schedule: [
      { day: "Mon", hours: "11:00 AM - 7:00 PM" },
      { day: "Tue", hours: "11:00 AM - 7:00 PM" },
      { day: "Thu", hours: "11:00 AM - 7:00 PM" },
    ],
    status: "on-leave",
    patientsToday: 0,
  },
];

export default function DoctorsSchedules() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const filteredDoctors = DOCTORS.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || doctor.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return COLORS.success;
      case 'busy': return COLORS.warning;
      case 'on-leave': return COLORS.danger;
      default: return COLORS.muted;
    }
  };

  const renderDoctorCard = (doctor: any) => {
    const statusColor = getStatusColor(doctor.status);
    
    return (
      <TouchableOpacity 
        key={doctor.id}
        style={styles.doctorCard}
        onPress={() => {
          setSelectedDoctor(doctor);
          setShowModal(true);
        }}
      >
        <View style={styles.doctorHeader}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {doctor.name.split(' ').map((n: string) => n[0]).join('')}
            </ThemedText>
          </View>
          
          <View style={styles.doctorInfo}>
            <ThemedText style={styles.doctorName}>{doctor.name}</ThemedText>
            <ThemedText style={styles.doctorSpecialty}>{doctor.specialty}</ThemedText>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <ThemedText style={[styles.statusText, { color: statusColor }]}>
              {doctor.status.toUpperCase()}
            </ThemedText>
          </View>
        </View>

        <View style={styles.doctorStats}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{doctor.patientsToday}</ThemedText>
            <ThemedText style={styles.statLabel}>Today</ThemedText>
          </View>
          
          <View style={styles.schedulePreview}>
            <Ionicons name="time" size={14} color={COLORS.muted} />
            <ThemedText style={styles.scheduleText}>
              {doctor.schedule.length} days/week
            </ThemedText>
          </View>
        </View>

        <View style={styles.doctorActions}>
          <TouchableOpacity 
            style={styles.scheduleButton}
            onPress={() => {
              setSelectedDoctor(doctor);
              setShowSchedule(true);
            }}
          >
            <Ionicons name="calendar" size={14} color={COLORS.primary} />
            <ThemedText style={styles.scheduleButtonText}>View Schedule</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.appointmentButton}
            onPress={() => console.log("New appointment with", doctor.name)}
          >
            <ThemedText style={styles.appointmentText}>Book</ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Doctors & Schedules</ThemedText>
          <ThemedText style={styles.subtitle}>Manage doctor schedules and availability</ThemedText>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => console.log("Add new doctor")}
        >
          <Ionicons name="person-add" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addText}>Add Doctor</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Search & Filters */}
      <View style={styles.controls}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            placeholder="Search doctors..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {["all", "available", "busy", "on-leave"].map((f) => (
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
                {f.replace('-', ' ').toUpperCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Doctors Grid */}
      <ScrollView style={styles.doctorsGrid} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {filteredDoctors.map(renderDoctorCard)}
        
        {filteredDoctors.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="medical" size={48} color={COLORS.border} />
            <ThemedText style={styles.emptyText}>No doctors found</ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Doctor Details Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Doctor Details</ThemedText>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {selectedDoctor && (
              <View style={styles.modalBody}>
                <View style={styles.modalAvatar}>
                  <ThemedText style={styles.modalAvatarText}>
                    {selectedDoctor.name.split(' ').map((n: string) => n[0]).join('')}
                  </ThemedText>
                </View>
                
                <ThemedText style={styles.modalDoctorName}>{selectedDoctor.name}</ThemedText>
                <ThemedText style={styles.modalSpecialty}>{selectedDoctor.specialty}</ThemedText>
                
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Doctor ID</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedDoctor.id}</ThemedText>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Status</ThemedText>
                    <View style={[styles.modalStatus, { 
                      backgroundColor: `${getStatusColor(selectedDoctor.status)}15` 
                    }]}>
                      <ThemedText style={[styles.modalStatusText, { 
                        color: getStatusColor(selectedDoctor.status) 
                      }]}>
                        {selectedDoctor.status.toUpperCase()}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Patients Today</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedDoctor.patientsToday}</ThemedText>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => console.log("Edit doctor")}
                  >
                    <Ionicons name="create" size={18} color={COLORS.primary} />
                    <ThemedText style={styles.editText}>Edit Profile</ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.scheduleActionButton}
                    onPress={() => {
                      setShowModal(false);
                      setShowSchedule(true);
                    }}
                  >
                    <Ionicons name="calendar" size={18} color="#FFFFFF" />
                    <ThemedText style={styles.scheduleActionText}>View Schedule</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Schedule Modal */}
      <Modal visible={showSchedule} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.scheduleModal}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {selectedDoctor?.name}'s Schedule
              </ThemedText>
              <TouchableOpacity onPress={() => setShowSchedule(false)}>
                <Ionicons name="close" size={24} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {selectedDoctor && (
              <View style={styles.scheduleBody}>
                {selectedDoctor.schedule.map((day: any, index: number) => (
                  <View key={index} style={styles.scheduleDay}>
                    <View style={styles.dayHeader}>
                      <ThemedText style={styles.dayName}>{day.day}</ThemedText>
                      <ThemedText style={styles.dayHours}>{day.hours}</ThemedText>
                    </View>
                    <View style={styles.timeSlot}>
                      <View style={styles.slotIndicator} />
                      <ThemedText style={styles.slotText}>Regular hours</ThemedText>
                    </View>
                  </View>
                ))}
                
                <View style={styles.scheduleActions}>
                  <TouchableOpacity style={styles.editScheduleButton}>
                    <Ionicons name="create" size={18} color={COLORS.primary} />
                    <ThemedText style={styles.editScheduleText}>Edit Schedule</ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.closeScheduleButton} onPress={() => setShowSchedule(false)}>
                    <ThemedText style={styles.closeScheduleText}>Close</ThemedText>
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
  
  controls: {
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
  },
  filterChip: {
    backgroundColor: COLORS.soft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  filterActive: {
    backgroundColor: COLORS.primaryDark,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  
  doctorsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  doctorCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  doctorHeader: {
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
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  
  doctorStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "600",
  },
  schedulePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scheduleText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  
  doctorActions: {
    flexDirection: "row",
    gap: 12,
  },
  scheduleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.soft,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  appointmentButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  appointmentText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
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
  scheduleModal: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    margin: 20,
    padding: 20,
    maxHeight: "80%",
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
  modalDoctorName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  modalSpecialty: {
    fontSize: 16,
    color: COLORS.muted,
    fontWeight: "600",
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
  modalStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: "700",
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
  scheduleActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  scheduleActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  
  scheduleBody: {
    flex: 1,
  },
  scheduleDay: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  dayHours: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  slotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  slotText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  scheduleActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  editScheduleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.soft,
    paddingVertical: 14,
    borderRadius: 12,
  },
  editScheduleText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  closeScheduleButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
  },
  closeScheduleText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.muted,
  },
});