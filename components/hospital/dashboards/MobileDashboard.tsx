import { ThemedText } from "@/components/themed-text";
import { loadSession } from "@/lib/authPersist";
import { loadWebSession } from "@/lib/webPersist";
import { Ionicons } from "@expo/vector-icons";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";


import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";





/* ================= HOSPITAL THEME ================= */

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#065F46",
  primaryLight: "#34D399",
  primaryDark: "#064E3B",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  soft: "#ECFDF5",
  secondary: "#8B5CF6",
};

/* ================= DATA ================= */

const KPI = [
  { label: "Total Patients", value: "342", icon: "people", color: COLORS.primary, trend: "+12%" },
  { label: "Today's Appointments", value: "47", icon: "calendar", color: COLORS.success, trend: "+8%" },
  { label: "Emergency Cases", value: "9", icon: "medkit", color: COLORS.danger, trend: "High" },
  { label: "Available Beds", value: "23", icon: "bed", color: COLORS.info, trend: "18%" },
];

const QUICK_ACTIONS = [
  { label: "New Patient", icon: "person-add", color: COLORS.primary },
  { label: "Schedule", icon: "calendar", color: COLORS.success },
  { label: "Emergency", icon: "medkit", color: COLORS.danger },
  { label: "Staff", icon: "people", color: COLORS.info },
  { label: "Lab Reports", icon: "document-text", color: COLORS.secondary },
  { label: "Billing", icon: "card", color: COLORS.warning },
];

const EMERGENCY_CASES = [
  { name: "Robert Johnson", condition: "Cardiac Arrest", time: "09:45 AM", priority: "Critical", color: COLORS.danger },
  { name: "Sarah Miller", condition: "Multiple Fractures", time: "10:20 AM", priority: "High", color: COLORS.warning },
  { name: "David Chen", condition: "Stroke Symptoms", time: "11:05 AM", priority: "Critical", color: COLORS.danger },
];

const TODAY_APPOINTMENTS = [
  { patient: "Emma Wilson", doctor: "Dr. James Smith", time: "10:30 AM", status: "Confirmed" },
  { patient: "Michael Brown", doctor: "Dr. Emily Davis", time: "2:15 PM", status: "Pending" },
  { patient: "Sophia Garcia", doctor: "Dr. Robert Lee", time: "4:45 PM", status: "Confirmed" },
];

/* ================= MAIN COMPONENT ================= */

export default function HospitalDashboardMobile() {
  const [hospitalName, setHospitalName] = useState("General Hospital");
  const [dateTime, setDateTime] = useState("");
 const [loadingHospital, setLoadingHospital] = useState(true);

useEffect(() => {
  setDateTime(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
}, []);




useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      const session =
        Platform.OS === "web"
          ? await loadWebSession() // ✅ await added
          : await loadSession();

      console.log("HOSPITAL SESSION ✅", session);

      if (!mounted) return;

      if (session?.role === "hospital" && session?.name) {
        setHospitalName(session.name); // ✅ THIS IS THE ONLY SOURCE
      } else {
        setHospitalName("Hospital");
      }
    } catch (e) {
      console.error("SESSION LOAD FAILED ❌", e);
      setHospitalName("Hospital");
    } finally {
      setLoadingHospital(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, []);



  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}  contentContainerStyle={{ paddingBottom: 120 }}>
      {/* ===== HEADER SECTION ===== */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.greeting}>Hospital Management Dashboard</ThemedText>
            <ThemedText style={styles.title}>{hospitalName}</ThemedText>
            <ThemedText style={styles.subtitle}>{dateTime}</ThemedText>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Ionicons name="location" size={16} color="rgba(255,255,255,0.9)" />
              <ThemedText style={styles.statText}>24/7 Emergency</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="call" size={16} color="rgba(255,255,255,0.9)" />
              <ThemedText style={styles.statText}>Emergency: 108</ThemedText>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ===== KPI CARDS ===== */}
      <View style={styles.kpiGrid}>
        {KPI.map((kpi, index) => (
          <View key={index} style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIcon, { backgroundColor: kpi.color + "15" }]}>
                <Ionicons name={kpi.icon as any} size={20} color={kpi.color} />
              </View>
              <ThemedText style={[styles.kpiTrend, { color: kpi.color }]}>
                {kpi.trend}
              </ThemedText>
            </View>
            <ThemedText style={styles.kpiValue}>{kpi.value}</ThemedText>
            <ThemedText style={styles.kpiLabel}>{kpi.label}</ThemedText>
          </View>
        ))}
      </View>

      {/* ===== QUICK ACTIONS ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All →</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={20} color="#fff" />
              </View>
              <ThemedText style={styles.actionText}>{action.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ===== EMERGENCY CASES ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Emergency Cases</ThemedText>
          <View style={styles.badge}>
            <ThemedText style={[styles.badgeText, { color: COLORS.danger }]}>
              3 Active
            </ThemedText>
          </View>
        </View>
        <View style={styles.card}>
          {EMERGENCY_CASES.map((caseItem, index) => (
            <TouchableOpacity key={index} style={styles.caseRow}>
              <View style={styles.caseInfo}>
                <View style={[styles.priorityDot, { backgroundColor: caseItem.color }]} />
                <View style={styles.caseDetails}>
                  <ThemedText style={styles.rowTitle}>{caseItem.name}</ThemedText>
                  <ThemedText style={styles.rowSub}>{caseItem.condition}</ThemedText>
                </View>
              </View>
              <View>
                <ThemedText style={styles.rowTime}>{caseItem.time}</ThemedText>
                <View style={[styles.priorityBadge, { backgroundColor: caseItem.color + "20" }]}>
                  <ThemedText style={[styles.priorityText, { color: caseItem.color }]}>
                    {caseItem.priority}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ===== TODAY'S APPOINTMENTS ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Today's Appointments</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View Schedule →</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {TODAY_APPOINTMENTS.map((appointment, index) => (
            <View key={index} style={styles.appointmentRow}>
              <View style={styles.appointmentInfo}>
                <View style={[styles.statusIndicator, { 
                  backgroundColor: appointment.status === 'Confirmed' ? COLORS.success + '20' : COLORS.warning + '20'
                }]}>
                  <Ionicons 
                    name={appointment.status === 'Confirmed' ? "checkmark-circle" : "time"} 
                    size={16} 
                    color={appointment.status === 'Confirmed' ? COLORS.success : COLORS.warning} 
                  />
                </View>
                <View style={styles.appointmentDetails}>
                  <ThemedText style={styles.rowTitle}>{appointment.patient}</ThemedText>
                  <ThemedText style={styles.rowSub}>{appointment.doctor}</ThemedText>
                </View>
              </View>
              <View style={styles.appointmentTime}>
                <ThemedText style={styles.timeText}>{appointment.time}</ThemedText>
                <ThemedText style={[styles.statusText, { 
                  color: appointment.status === 'Confirmed' ? COLORS.success : COLORS.warning 
                }]}>
                  {appointment.status}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ================= MOBILE STYLES ================= */

const styles = StyleSheet.create({
  page: { 
    flex: 1, 
    backgroundColor: COLORS.bg 
  },

  // Header
  header: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 24,
  },
  headerContent: {
    gap: 20,
  },
  headerTextContainer: {
    gap: 6,
  },
  greeting: { 
    color: "rgba(255,255,255,0.9)", 
    fontSize: 13, 
    marginBottom: 2 
  },
  title: { 
    color: "#fff", 
    fontSize: 28, 
    fontWeight: "800", 
    marginBottom: 4 
  },
  subtitle: { 
    color: "rgba(255,255,255,0.8)", 
    fontSize: 12 
  },
  headerStats: {
    flexDirection: "row",
    gap: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: { 
    color: "rgba(255,255,255,0.9)", 
    fontSize: 12 
  },

  // KPI Grid
  kpiGrid: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    width: "47%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  kpiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiTrend: { 
    fontSize: 11, 
    fontWeight: "700" 
  },
  kpiValue: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: COLORS.text, 
    marginBottom: 2 
  },
  kpiLabel: { 
    fontSize: 11, 
    color: COLORS.muted 
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: COLORS.text 
  },
  seeAll: { 
    fontSize: 12, 
    color: COLORS.primary, 
    fontWeight: "600" 
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "31%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionText: { 
    fontSize: 12, 
    fontWeight: "600", 
    textAlign: "center" 
  },

  // Cards
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // Emergency Cases
  badge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 20, 
    backgroundColor: COLORS.danger + "15" 
  },
  badgeText: { 
    fontSize: 11, 
    fontWeight: "700" 
  },
  caseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + "80",
  },
  caseInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  caseDetails: {
    flex: 1,
  },
  rowTitle: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: COLORS.text, 
    marginBottom: 2 
  },
  rowSub: { 
    fontSize: 12, 
    color: COLORS.muted 
  },
  rowTime: { 
    fontSize: 11, 
    color: COLORS.text, 
    fontWeight: "500", 
    marginBottom: 4 
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priorityText: { 
    fontSize: 10, 
    fontWeight: "700" 
  },

  // Appointments
  appointmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + "80",
  },
  appointmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  statusIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTime: { 
    alignItems: "flex-end" 
  },
  timeText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: COLORS.text, 
    marginBottom: 2 
  },
  statusText: { 
    fontSize: 11, 
    fontWeight: "700" 
  },
});