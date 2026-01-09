import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 1024;

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

export default function HospitalDashboardWeb() {
  const [hospitalName, setHospitalName] = useState("General Hospital");
  const [dateTime, setDateTime] = useState("");

  /* ===== LOAD HOSPITAL DATA ===== */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async user => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setHospitalName(data?.hospitalName || data?.name || "General Hospital");
      }
    });
    return unsub;
  }, []);

  /* ===== LIVE CLOCK ===== */
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateTime(
        now.toLocaleString("en-US", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* ===== HEADER SECTION ===== */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.greeting}>Hospital Management Dashboard</ThemedText>
            <ThemedText style={styles.title}>{hospitalName}</ThemedText>
            <ThemedText style={styles.subtitle}>{dateTime}</ThemedText>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Ionicons name="location" size={18} color="rgba(255,255,255,0.8)" />
              <ThemedText style={styles.statText}>24/7 Emergency</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="call" size={18} color="rgba(255,255,255,0.8)" />
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
                <Ionicons name={kpi.icon as any} size={22} color={kpi.color} />
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
                <Ionicons name={action.icon as any} size={22} color="#fff" />
              </View>
              <ThemedText style={styles.actionText}>{action.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ===== DUAL CONTENT COLUMNS ===== */}
      <View style={styles.contentGrid}>
        {/* Emergency Cases */}
        <View style={styles.largeCard}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Emergency Cases</ThemedText>
            <View style={styles.badge}>
              <ThemedText style={[styles.badgeText, { color: COLORS.danger }]}>
                3 Active
              </ThemedText>
            </View>
          </View>
          {EMERGENCY_CASES.map((caseItem, index) => (
            <TouchableOpacity key={index} style={styles.caseRow}>
              <View style={styles.caseInfo}>
                <View style={[styles.priorityDot, { backgroundColor: caseItem.color }]} />
                <View>
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

        {/* Today's Appointments */}
        <View style={styles.largeCard}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Today's Appointments</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAll}>View Schedule →</ThemedText>
            </TouchableOpacity>
          </View>
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
                <View>
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

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingVertical: 36,
    paddingHorizontal: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 28,
  },
  headerContent: {
    flexDirection: isLargeScreen ? "row" : "column",
    justifyContent: "space-between",
    alignItems: isLargeScreen ? "center" : "flex-start",
    gap: 16,
  },
  greeting: { color: "rgba(255,255,255,0.9)", fontSize: 14, marginBottom: 4 },
  title: { color: "#fff", fontSize: isLargeScreen ? 36 : 32, fontWeight: "800", marginBottom: 6 },
  subtitle: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  headerStats: {
    flexDirection: "row",
    gap: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: { color: "rgba(255,255,255,0.9)", fontSize: 13 },

  kpiGrid: {
    paddingHorizontal: 32,
    display: "grid",
    gridTemplateColumns: isLargeScreen ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
    gap: 20,
    marginBottom: 32,
  },
  kpiCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  kpiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  kpiIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiTrend: { fontSize: 12, fontWeight: "700" },
  kpiValue: { fontSize: 28, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  kpiLabel: { fontSize: 13, color: COLORS.muted },

  section: { paddingHorizontal: 32, marginBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: isLargeScreen ? "repeat(6, 1fr)" : "repeat(3, 1fr)",
    gap: 16,
  },
  actionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
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
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionText: { fontSize: 13, fontWeight: "600", textAlign: "center" },

  contentGrid: {
    paddingHorizontal: 32,
    display: "grid",
    gridTemplateColumns: isLargeScreen ? "repeat(2, 1fr)" : "1fr",
    gap: 24,
    marginBottom: 32,
  },
  largeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.danger + "15" },
  badgeText: { fontSize: 12, fontWeight: "700" },

  caseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
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
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rowTitle: { fontSize: 15, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  rowSub: { fontSize: 13, color: COLORS.muted },
  rowTime: { fontSize: 13, color: COLORS.text, fontWeight: "500", marginBottom: 6 },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-end",
  },
  priorityText: { fontSize: 11, fontWeight: "700" },

  appointmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
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
  appointmentTime: { alignItems: "flex-end" },
  timeText: { fontSize: 14, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  statusText: { fontSize: 12, fontWeight: "700" },
});