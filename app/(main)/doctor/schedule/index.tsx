import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const COLORS = {
  bg: "#FFFFFF", primary: "#10B981", text: "#0F172A", textLight: "#334155",
  muted: "#64748B", border: "#E2E8F0", soft: "#ECFDF5",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState("Mon");

  const appointments = {
    "Mon": { "10:00": "John Carter", "14:00": "Maria Garcia" },
    "Tue": { "09:00": "Robert Chen", "11:00": "Sarah Miller", "15:00": "David Brown" },
    "Wed": { "10:00": "James Wilson", "13:00": "Lisa Taylor" },
    "Thu": { "09:00": "Michael Ross", "16:00": "Emily Stone" },
    "Fri": { "11:00": "Thomas Lee", "14:00": "Amanda White" },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Schedule</ThemedText>
        <ThemedText style={styles.subtitle}>Manage your daily appointments</ThemedText>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysSelector}>
        {DAYS.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDay
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <ThemedText style={[
              styles.dayText,
              selectedDay === day && styles.selectedDayText
            ]}>
              {day}
            </ThemedText>
            <ThemedText style={[
              styles.dayNumber,
              selectedDay === day && styles.selectedDayNumber
            ]}>
              {day === "Mon" ? "15" : day === "Tue" ? "16" : day === "Wed" ? "17" : day === "Thu" ? "18" : day === "Fri" ? "19" : day === "Sat" ? "20" : "21"}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.scheduleContainer}>
          <View style={styles.timeColumn}>
            {TIME_SLOTS.map((time) => (
              <View key={time} style={styles.timeSlot}>
                <ThemedText style={styles.timeText}>{time}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.appointmentsColumn}>
            {TIME_SLOTS.map((time) => {
              const appointment = appointments[selectedDay]?.[time];
              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.appointmentSlot,
                    appointment && styles.bookedSlot
                  ]}
                >
                  {appointment ? (
                    <View style={styles.appointmentContent}>
                      <ThemedText style={styles.appointmentTime}>{time}</ThemedText>
                      <ThemedText style={styles.appointmentPatient}>{appointment}</ThemedText>
                      <ThemedText style={styles.appointmentType}>Consultation</ThemedText>
                      <View style={styles.appointmentStatus}>
                        <View style={styles.statusDot} />
                        <ThemedText style={styles.statusText}>Confirmed</ThemedText>
                      </View>
                    </View>
                  ) : (
                    <ThemedText style={styles.availableText}>Available</ThemedText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Upcoming Appointments</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAll}>View All →</ThemedText>
            </TouchableOpacity>
          </View>

          {[
            { patient: "John Carter", time: "10:00 AM", type: "Cardiology", room: "304" },
            { patient: "Maria Garcia", time: "02:00 PM", type: "Dental", room: "205" },
            { patient: "Robert Chen", time: "04:00 PM", type: "General", room: "112" },
          ].map((appointment, index) => (
            <TouchableOpacity key={index} style={styles.upcomingCard}>
              <View style={styles.upcomingTime}>
                <ThemedText style={styles.upcomingTimeText}>{appointment.time}</ThemedText>
              </View>
              <View style={styles.upcomingContent}>
                <View style={styles.upcomingHeader}>
                  <View style={styles.patientInfo}>
                    <View style={styles.avatar}>
                      <ThemedText style={styles.avatarText}>
                        {appointment.patient.split(' ').map(n => n[0]).join('')}
                      </ThemedText>
                    </View>
                    <View>
                      <ThemedText style={styles.patientName}>{appointment.patient}</ThemedText>
                      <ThemedText style={styles.appointmentType}>{appointment.type}</ThemedText>
                    </View>
                  </View>
                  <View style={styles.roomBadge}>
                    <Ionicons name="location" size={12} color={COLORS.primary} />
                    <ThemedText style={styles.roomText}>Room {appointment.room}</ThemedText>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="videocam" size={16} color={COLORS.primary} />
                    <ThemedText style={styles.actionText}>Video Call</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    <ThemedText style={[styles.actionText, { color: "#FFFFFF" }]}>Start</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.newAppointmentButton}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <ThemedText style={styles.newAppointmentText}>New Appointment</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.muted },
  daysSelector: { paddingHorizontal: 24, paddingVertical: 16 },
  dayButton: {
    alignItems: "center", paddingHorizontal: 16, paddingVertical: 12,
    marginRight: 8, borderRadius: 12, backgroundColor: COLORS.soft
  },
  selectedDay: { backgroundColor: COLORS.primary },
  dayText: { fontSize: 14, color: COLORS.text, fontWeight: "600", marginBottom: 4 },
  selectedDayText: { color: "#FFFFFF" },
  dayNumber: { fontSize: 18, color: COLORS.muted, fontWeight: "800" },
  selectedDayNumber: { color: "#FFFFFF" },
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  scheduleContainer: { flexDirection: "row", marginBottom: 32 },
  timeColumn: { width: 80 },
  timeSlot: { height: 80, justifyContent: "center" },
  timeText: { fontSize: 14, color: COLORS.muted, fontWeight: "600" },
  appointmentsColumn: { flex: 1 },
  appointmentSlot: {
    height: 80, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, marginBottom: 8, justifyContent: "center",
    alignItems: "center", padding: 8
  },
  bookedSlot: { 
    backgroundColor: COLORS.primary + "10", 
    borderColor: COLORS.primary + "30" 
  },
  appointmentContent: { flex: 1, width: "100%" },
  appointmentTime: { fontSize: 12, color: COLORS.muted, marginBottom: 4 },
  appointmentPatient: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  appointmentType: { fontSize: 12, color: COLORS.muted, marginBottom: 4 },
  appointmentStatus: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginRight: 4 },
  statusText: { fontSize: 11, color: COLORS.primary, fontWeight: "700" },
  availableText: { fontSize: 14, color: COLORS.muted },
  upcomingSection: { marginBottom: 24 },
  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 16 
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  viewAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  upcomingCard: {
    flexDirection: "row", backgroundColor: COLORS.soft,
    borderRadius: 16, padding: 16, marginBottom: 12
  },
  upcomingTime: { 
    alignItems: "center", 
    marginRight: 16, 
    minWidth: 80 
  },
  upcomingTimeText: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  upcomingContent: { flex: 1 },
  upcomingHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "flex-start",
    marginBottom: 12 
  },
  patientInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center", justifyContent: "center",
    marginRight: 12
  },
  avatarText: { fontSize: 14, color: COLORS.primary, fontWeight: "800" },
  patientName: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  appointmentType: { fontSize: 14, color: COLORS.muted },
  roomBadge: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, backgroundColor: "#FFFFFF", gap: 4
  },
  roomText: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  actionButtons: { flexDirection: "row", gap: 12 },
  actionButton: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 10, borderRadius: 8, backgroundColor: "#FFFFFF", gap: 8
  },
  primaryButton: { backgroundColor: COLORS.primary },
  actionText: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  newAppointmentButton: {
    position: "absolute", top: 24, right: 24,
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primary, paddingHorizontal: 20,
    paddingVertical: 16, borderRadius: 16, gap: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
  },
  newAppointmentText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
});