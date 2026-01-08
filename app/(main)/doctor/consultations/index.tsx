import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const COLORS = {
  bg: "#FFFFFF", primary: "#10B981", text: "#0F172A", textLight: "#334155",
  muted: "#64748B", border: "#E2E8F0", soft: "#ECFDF5",
};

export default function Consultations() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Consultations</ThemedText>
        <ThemedText style={styles.subtitle}>Manage patient consultations</ThemedText>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>18</ThemedText>
          <ThemedText style={styles.statLabel}>Today</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>124</ThemedText>
          <ThemedText style={styles.statLabel}>This Week</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>45 min</ThemedText>
          <ThemedText style={styles.statLabel}>Avg Duration</ThemedText>
        </View>
      </View>

   <ScrollView
  style={styles.content}
  contentContainerStyle={{ paddingBottom: 120 }}
  showsVerticalScrollIndicator={false}
>

        <View style={styles.todaySection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Today's Consultations</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAll}>View All →</ThemedText>
            </TouchableOpacity>
          </View>

          {[
            { name: "John Carter", time: "09:30 AM", type: "Cardiology", status: "upcoming", duration: "30 min" },
            { name: "Emily Stone", time: "11:00 AM", type: "Dental Surgery", status: "active", duration: "2 hrs" },
            { name: "Michael Ross", time: "02:15 PM", type: "Cardiac Review", status: "upcoming", duration: "45 min" },
            { name: "Sarah Johnson", time: "03:45 PM", type: "Orthopedic", status: "upcoming", duration: "20 min" },
          ].map((consultation, index) => (
            <TouchableOpacity key={index} style={styles.consultationCard}>
              <View style={styles.consultationTime}>
                <ThemedText style={styles.timeText}>{consultation.time}</ThemedText>
                <ThemedText style={styles.durationText}>{consultation.duration}</ThemedText>
              </View>
              
              <View style={styles.consultationContent}>
                <View style={styles.consultationHeader}>
                  <View style={styles.patientInfo}>
                    <View style={styles.avatar}>
                      <ThemedText style={styles.avatarText}>
                        {consultation.name.split(' ').map(n => n[0]).join('')}
                      </ThemedText>
                    </View>
                    <View>
                      <ThemedText style={styles.patientName}>{consultation.name}</ThemedText>
                      <ThemedText style={styles.consultationType}>{consultation.type}</ThemedText>
                    </View>
                  </View>
                  
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: consultation.status === 'active' ? '#D1FAE5' : '#ECFDF5' }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: consultation.status === 'active' ? COLORS.primary : '#059669' }
                    ]} />
                    <ThemedText style={[
                      styles.statusText,
                      { color: consultation.status === 'active' ? COLORS.primary : '#059669' }
                    ]}>
                      {consultation.status === 'active' ? 'In Progress' : 'Upcoming'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Consultations</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAll}>View All →</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.consultationsGrid}>
            {[
              { type: "Cardiology", count: 24, color: "#10B981" },
              { type: "Orthopedic", count: 18, color: "#22C55E" },
              { type: "Pediatrics", count: 12, color: "#0EA5E9" },
              { type: "Dental", count: 8, color: "#8B5CF6" },
              { type: "Dermatology", count: 15, color: "#EC4899" },
              { type: "General", count: 32, color: "#F59E0B" },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.gridCard}>
                <View style={[styles.gridIcon, { backgroundColor: item.color + '20' }]}>
                  <ThemedText style={[styles.gridIconText, { color: item.color }]}>
                    {item.type.charAt(0)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.gridType}>{item.type}</ThemedText>
                <ThemedText style={styles.gridCount}>{item.count} consults</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.newButton}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <ThemedText style={styles.newButtonText}>New Consultation</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.muted },
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
  todaySection: { marginBottom: 32 },
  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 16 
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  viewAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  consultationCard: {
    flexDirection: "row", backgroundColor: COLORS.soft,
    borderRadius: 16, padding: 16, marginBottom: 12
  },
  consultationTime: { 
    alignItems: "center", 
    marginRight: 16, 
    minWidth: 80 
  },
  timeText: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 6 },
  durationText: {
    fontSize: 12, color: COLORS.muted, backgroundColor: "#F1F5F9",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontWeight: "600"
  },
  consultationContent: { flex: 1 },
  consultationHeader: { 
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
  consultationType: { fontSize: 14, color: COLORS.muted },
  statusIndicator: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, gap: 6
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: "700" },
  recentSection: { marginBottom: 32 },
  consultationsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridCard: {
    width: "30%", alignItems: "center",
    backgroundColor: COLORS.soft, padding: 16,
    borderRadius: 16
  },
  gridIcon: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: "center", justifyContent: "center",
    marginBottom: 8
  },
  gridIconText: { fontSize: 20, fontWeight: "800" },
  gridType: { fontSize: 14, fontWeight: "600", color: COLORS.text, textAlign: "center", marginBottom: 4 },
  gridCount: { fontSize: 12, color: COLORS.muted, textAlign: "center" },
  newButton: {
    position: "absolute", top: 24, right: 24,
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primary, paddingHorizontal: 20,
    paddingVertical: 16, borderRadius: 16, gap: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
  },
  newButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
  
});