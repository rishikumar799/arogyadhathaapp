import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const COLORS = {
  bg: "#FFFFFF", primary: "#10B981", text: "#0F172A", textLight: "#334155",
  muted: "#64748B", border: "#E2E8F0", soft: "#ECFDF5",
};

export default function Profile() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Profile</ThemedText>
        <ThemedText style={styles.subtitle}>Manage your account</ThemedText>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>AG</ThemedText>
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={styles.doctorName}>Dr. Alexander Green</ThemedText>
            <ThemedText style={styles.specialty}>Cardiologist</ThemedText>
            <ThemedText style={styles.hospital}>MedCare General Hospital</ThemedText>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create" size={20} color={COLORS.primary} />
            <ThemedText style={styles.editButtonText}>Edit</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>8.9</ThemedText>
            <ThemedText style={styles.statLabel}>Rating</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>1,240</ThemedText>
            <ThemedText style={styles.statLabel}>Patients</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>5</ThemedText>
            <ThemedText style={styles.statLabel}>Years Exp</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>98%</ThemedText>
            <ThemedText style={styles.statLabel}>Satisfaction</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Email</ThemedText>
            <ThemedText style={styles.infoValue}>alex.green@medcare.com</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Phone</ThemedText>
            <ThemedText style={styles.infoValue}>+1 (555) 123-4567</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>License No</ThemedText>
            <ThemedText style={styles.infoValue}>MD-123456</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>NPI Number</ThemedText>
            <ThemedText style={styles.infoValue}>1234567890</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Date of Birth</ThemedText>
            <ThemedText style={styles.infoValue}>March 15, 1985</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Gender</ThemedText>
            <ThemedText style={styles.infoValue}>Male</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.specialtiesSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medkit" size={24} color={COLORS.primary} />
          <ThemedText style={styles.sectionTitle}>Specialties & Services</ThemedText>
        </View>

        <View style={styles.specialtiesGrid}>
          {["Cardiology", "Internal Medicine", "Echocardiography", "Stress Testing", "Holter Monitoring", "Cardiac Rehab"].map((specialty, index) => (
            <View key={index} style={styles.specialtyItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
              <ThemedText style={styles.specialtyText}>{specialty}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.availabilitySection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={24} color={COLORS.primary} />
          <ThemedText style={styles.sectionTitle}>Availability</ThemedText>
        </View>

        <View style={styles.availabilityGrid}>
          {[
            { day: "Monday", hours: "9:00 AM - 6:00 PM" },
            { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
            { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
            { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
            { day: "Friday", hours: "9:00 AM - 5:00 PM" },
            { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
            { day: "Sunday", hours: "Emergency Only" },
          ].map((item, index) => (
            <View key={index} style={styles.availabilityItem}>
              <ThemedText style={styles.availabilityDay}>{item.day}</ThemedText>
              <ThemedText style={styles.availabilityHours}>{item.hours}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications" size={20} color={COLORS.text} />
          <ThemedText style={styles.actionButtonText}>Notification Settings</ThemedText>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.text} />
          <ThemedText style={styles.actionButtonText}>Privacy & Security</ThemedText>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-text" size={20} color={COLORS.text} />
          <ThemedText style={styles.actionButtonText}>Documents & Certificates</ThemedText>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle" size={20} color={COLORS.text} />
          <ThemedText style={styles.actionButtonText}>Help & Support</ThemedText>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.muted },
  profileSection: { 
    backgroundColor: COLORS.soft, marginHorizontal: 24,
    borderRadius: 20, padding: 24, marginBottom: 24
  },
  profileHeader: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
    marginRight: 16
  },
  avatarText: { fontSize: 32, color: "#FFFFFF", fontWeight: "800" },
  profileInfo: { flex: 1 },
  doctorName: { fontSize: 24, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  specialty: { fontSize: 18, color: COLORS.primary, fontWeight: "600", marginBottom: 4 },
  hospital: { fontSize: 14, color: COLORS.muted },
  editButton: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: "#FFFFFF", borderRadius: 10,
    gap: 6
  },
  editButtonText: { color: COLORS.primary, fontWeight: "600", fontSize: 14 },
  stats: { flexDirection: "row", gap: 12 },
  statItem: {
    flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12,
    padding: 12, alignItems: "center"
  },
  statValue: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: COLORS.muted, textAlign: "center" },
  infoSection: { paddingHorizontal: 24, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginLeft: 12 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  infoItem: {
    width: "48%", backgroundColor: COLORS.soft,
    padding: 16, borderRadius: 12
  },
  infoLabel: { fontSize: 12, color: COLORS.muted, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  specialtiesSection: { paddingHorizontal: 24, marginBottom: 24 },
  specialtiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  specialtyItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.soft, paddingHorizontal: 16,
    paddingVertical: 12, borderRadius: 12, gap: 8
  },
  specialtyText: { fontSize: 14, color: COLORS.text, fontWeight: "600" },
  availabilitySection: { paddingHorizontal: 24, marginBottom: 24 },
  availabilityGrid: { backgroundColor: COLORS.soft, borderRadius: 12, overflow: "hidden" },
  availabilityItem: {
    flexDirection: "row", justifyContent: "space-between",
    padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border
  },
  availabilityDay: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  availabilityHours: { fontSize: 14, color: COLORS.muted },
  actionsSection: { paddingHorizontal: 24, marginBottom: 24 },
  actionButton: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.soft, padding: 16,
    borderRadius: 12, marginBottom: 12
  },
  actionButtonText: { 
    flex: 1, fontSize: 16, color: COLORS.text,
    fontWeight: "600", marginLeft: 12 
  },
});