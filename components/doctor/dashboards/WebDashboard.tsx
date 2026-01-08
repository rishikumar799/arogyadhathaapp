import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";


import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width } = Dimensions.get('window');

/* ================= GREEN THEME ================= */

const COLORS = {
  bg: "#FFFFFF",
  card: "#FFFFFF",
  primary: "#10B981",          // Emerald Green
  primaryLight: "#34D399",     // Light Emerald
  primaryDark: "#059669",      // Dark Emerald
  secondary: "#22C55E",        // Green
  secondaryLight: "#4ADE80",   // Light Green
  accent: "#84CC16",           // Lime Green
  warning: "#F59E0B",          // Amber
  danger: "#EF4444",           // Red
  text: "#0F172A",             // Slate 900
  textLight: "#334155",        // Slate 700
  muted: "#64748B",            // Slate 500
  border: "#E2E8F0",           // Slate 200
  soft: "#ECFDF5",             // Emerald 50
  softLight: "#F0FDFA",        // Teal 50
  success: "#10B981",          // Emerald 500
  successLight: "#A7F3D0",     // Emerald 200
  info: "#0EA5E9",             // Sky 500
  purple: "#8B5CF6",           // Violet 500
  pink: "#EC4899",             // Pink 500
  cyan: "#06B6D4",             // Cyan 500
  gradientStart: "#10B981",
  gradientEnd: "#34D399",
   bannerMid: "#065F46",        // Mid Emerald
};

/* ================= DATA ================= */

const QUICK_ACTIONS = [
  { label: "New Patient", icon: "person-add", color: "#FFFFFF", bg: COLORS.primary },
  { label: "Prescription", icon: "document-text", color: "#FFFFFF", bg: COLORS.secondary },
  { label: "Lab Order", icon: "flask", color: "#FFFFFF", bg: COLORS.accent },
  { label: "Telemedicine", icon: "videocam", color: "#FFFFFF", bg: COLORS.info },
  { label: "Reports", icon: "stats-chart", color: "#FFFFFF", bg: COLORS.purple },
  { label: "Schedule", icon: "calendar", color: "#FFFFFF", bg: COLORS.pink },
  { label: "Notes", icon: "document", color: "#FFFFFF", bg: COLORS.cyan },
  { label: "Messages", icon: "chatbubble", color: "#FFFFFF", bg: COLORS.warning },
];

const KPI_DATA = [
  { 
    label: "Total Patients", 
    value: "2,540", 
    icon: "people", 
    change: "+12%",
    subLabel: "Active this month",
    trend: "up",
    gradient: ["#10B981", "#34D399"]
  },
  { 
    label: "Today Appointments", 
    value: "68", 
    icon: "calendar", 
    change: "+6%",
    subLabel: "8 in waiting",
    trend: "up",
    gradient: ["#22C55E", "#4ADE80"]
  },
  { 
    label: "Critical Cases", 
    value: "12", 
    icon: "alert-circle", 
    change: "+2",
    subLabel: "Require attention",
    trend: "up",
    gradient: ["#F59E0B", "#FBBF24"]
  },
  { 
    label: "Avg Consult Time", 
    value: "18 min", 
    icon: "time", 
    change: "-3 min",
    subLabel: "Improved efficiency",
    trend: "down",
    gradient: ["#0EA5E9", "#38BDF8"]
  },
];

const CLINICAL_METRICS = [
  { 
    title: "Consultations", 
    value: "1,240", 
    icon: "chatbubble",
    trend: "up",
    color: COLORS.primary,
    gradient: ["#ECFDF5", "#D1FAE5"]
  },
  { 
    title: "Follow-ups", 
    value: "320", 
    icon: "return-up-back",
    trend: "stable",
    color: COLORS.secondary,
    gradient: ["#F0FDF4", "#DCFCE7"]
  },
  { 
    title: "Prescriptions", 
    value: "860", 
    icon: "document-text",
    trend: "up",
    color: COLORS.accent,
    gradient: ["#F7FEE7", "#ECFCCB"]
  },
  { 
    title: "Procedures", 
    value: "48", 
    icon: "medkit",
    trend: "up",
    color: COLORS.info,
    gradient: ["#F0F9FF", "#E0F2FE"]
  },
  { 
    title: "Discharges", 
    value: "284", 
    icon: "checkmark-circle",
    trend: "up",
    color: COLORS.success,
    gradient: ["#ECFDF5", "#D1FAE5"]
  },
  { 
    title: "Referrals", 
    value: "23", 
    icon: "share",
    trend: "down",
    color: COLORS.warning,
    gradient: ["#FFFBEB", "#FEF3C7"]
  },
];

const TODAY_SCHEDULE = [
  { 
    id: "1",
    name: "John Carter", 
    time: "09:30 AM", 
    type: "Cardiology Consultation", 
    status: "upcoming",
    priority: "normal",
    room: "304",
    duration: "30 min",
    avatarColor: COLORS.primary
  },
  { 
    id: "2",
    name: "Emily Stone", 
    time: "11:00 AM", 
    type: "Dental Surgery", 
    status: "active",
    priority: "high",
    room: "OT-2",
    duration: "2 hrs",
    avatarColor: COLORS.secondary
  },
  { 
    id: "3",
    name: "Michael Ross", 
    time: "02:15 PM", 
    type: "Cardiac Review", 
    status: "upcoming",
    priority: "normal",
    room: "205",
    duration: "45 min",
    avatarColor: COLORS.accent
  },
  { 
    id: "4",
    name: "Sarah Johnson", 
    time: "03:45 PM", 
    type: "Orthopedic Follow-up", 
    status: "upcoming",
    priority: "medium",
    room: "112",
    duration: "20 min",
    avatarColor: COLORS.info
  },
];

const RECENT_PATIENTS = [
  { 
    name: "Robert Chen", 
    condition: "Hypertension", 
    lastVisit: "2 hours ago",
    status: "Stable",
    color: COLORS.success,
    initials: "RC",
    age: "45",
    gender: "Male"
  },
  { 
    name: "Maria Garcia", 
    condition: "Diabetes Type 2", 
    lastVisit: "Yesterday",
    status: "Improving",
    color: COLORS.secondary,
    initials: "MG",
    age: "52",
    gender: "Female"
  },
  { 
    name: "James Wilson", 
    condition: "Asthma", 
    lastVisit: "2 days ago",
    status: "Needs Review",
    color: COLORS.warning,
    initials: "JW",
    age: "38",
    gender: "Male"
  },
  { 
    name: "Lisa Taylor", 
    condition: "Migraine", 
    lastVisit: "1 week ago",
    status: "Recovered",
    color: COLORS.success,
    initials: "LT",
    age: "29",
    gender: "Female"
  },
];

const MEDICATION_REMINDERS = [
  {
    id: "1",
    patient: "David Brown",
    medication: "Metformin 500mg",
    time: "08:00 AM",
    status: "Pending",
    color: COLORS.warning,
    dosage: "Twice daily"
  },
  {
    id: "2",
    patient: "Sarah Miller",
    medication: "Lisinopril 10mg",
    time: "12:00 PM",
    status: "Administered",
    color: COLORS.success,
    dosage: "Once daily"
  },
  {
    id: "3",
    patient: "Thomas Lee",
    medication: "Atorvastatin 20mg",
    time: "06:00 PM",
    status: "Pending",
    color: COLORS.warning,
    dosage: "Once at night"
  },
];

const STATS_CHART = [
  { day: "Mon", value: 45 },
  { day: "Tue", value: 52 },
  { day: "Wed", value: 48 },
  { day: "Thu", value: 60 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 40 },
  { day: "Sun", value: 35 },
];
// ================= DOCTOR DATA BACKEND  ================= */


/* ================= GRADIENT COMPONENT ================= */


const GradientCard = ({ children, colors, style }) => (
  <LinearGradient
    colors={colors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.gradientCard, style]}
  >
    {children}
  </LinearGradient>
);

/* ================= COMPONENT ================= */

export default function DoctorDashboard() {

  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [dateTime, setDateTime] = useState("");

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const data = snap.data();
      setDoctorName(data?.name ?? "");
      setSpecialization(data?.specialization ?? "");
    }
  });

  return unsubscribe;
}, []);

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



  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* ===== HEADER WITH GRADIENT ===== */}
  <View style={styles.header}>
  <View style={styles.gradientHeader}>
    <View style={styles.headerContent}>
      <View>
        <ThemedText style={styles.greeting}>
          {new Date().getHours() < 12
            ? "Good Morning"
            : new Date().getHours() < 18
            ? "Good Afternoon"
            : "Good Evening"}
        </ThemedText>

        <ThemedText style={styles.doctorName}>
          {doctorName ? `Dr. ${doctorName}` : "Doctor"}
        </ThemedText>

        {specialization ? (
          <ThemedText style={styles.specialty}>
            {specialization}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.headerStats}>
        <View style={styles.statBadge}>
          <ThemedText style={styles.statValue}>8</ThemedText>
          <ThemedText style={styles.statLabel}>Today</ThemedText>
        </View>

        <View style={styles.statBadge}>
          <ThemedText style={styles.statValue}>42</ThemedText>
          <ThemedText style={styles.statLabel}>This Week</ThemedText>
        </View>
      </View>
    </View>

    <ThemedText style={styles.date}>
      {dateTime}
    </ThemedText>
  </View>
</View>



      {/* ===== QUICK ACTIONS ===== */}
      <View style={styles.quickActionsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.viewAll}>View All →</ThemedText>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScroll}
          contentContainerStyle={styles.quickActionsContainer}
        >
          {QUICK_ACTIONS.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <View style={[styles.actionIconContainer, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== KPI DASHBOARD ===== */}
      <View style={styles.kpiSection}>
        {KPI_DATA.map((kpi, index) => (
          <GradientCard key={index} colors={kpi.gradient} style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <View style={styles.kpiIconContainer}>
                <Ionicons name={kpi.icon as any} size={22} color="#FFFFFF" />
              </View>
              <View style={[
                styles.trendBadge,
                { backgroundColor: kpi.trend === 'up' ? 'rgba(255,255,255,0.2)' : 'rgba(239,68,68,0.2)' }
              ]}>
                <Ionicons 
                  name={kpi.trend === 'up' ? "trending-up" : "trending-down"} 
                  size={12} 
                  color="#FFFFFF" 
                />
                <ThemedText style={styles.trendText}>
                  {kpi.change}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.kpiContent}>
              <ThemedText style={styles.kpiValue}>{kpi.value}</ThemedText>
              <ThemedText style={styles.kpiLabel}>{kpi.label}</ThemedText>
              <ThemedText style={styles.kpiSubLabel}>{kpi.subLabel}</ThemedText>
            </View>
          </GradientCard>
        ))}
      </View>

      {/* ===== CLINICAL METRICS ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Clinical Performance</ThemedText>
          <TouchableOpacity style={styles.filterButton}>
            <ThemedText style={styles.filterText}>This Month</ThemedText>
            <Ionicons name="chevron-down" size={14} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.metricsGrid}>
          {CLINICAL_METRICS.map((metric, index) => (
            <View key={index} style={[styles.metricCard, { backgroundColor: metric.gradient[0] }]}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                  <Ionicons name={metric.icon as any} size={18} color={metric.color} />
                </View>
                <View style={styles.trendIndicator}>
                  <Ionicons 
                    name={metric.trend === 'up' ? "arrow-up" : metric.trend === 'down' ? "arrow-down" : "remove"} 
                    size={12} 
                    color={metric.trend === 'up' ? COLORS.success : metric.trend === 'down' ? COLORS.danger : COLORS.muted} 
                  />
                </View>
              </View>
              
              <ThemedText style={styles.metricValue}>{metric.value}</ThemedText>
              <ThemedText style={styles.metricLabel}>{metric.title}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* ===== MAIN DASHBOARD GRID ===== */}
      <View style={styles.dashboardGrid}>
        {/* TODAY'S SCHEDULE */}
        <View style={[styles.dashboardCard, styles.largeCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <ThemedText style={styles.cardTitle}>Today's Schedule</ThemedText>
              <View style={styles.scheduleBadge}>
                <ThemedText style={styles.scheduleCount}>8</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scheduleList}>
            {TODAY_SCHEDULE.map((appointment) => (
              <TouchableOpacity key={appointment.id} style={styles.appointmentItem}>
                <View style={styles.appointmentTime}>
                  <ThemedText style={styles.timeText}>{appointment.time}</ThemedText>
                  <ThemedText style={styles.durationText}>{appointment.duration}</ThemedText>
                </View>
                
                <View style={styles.appointmentContent}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.patientInfo}>
                      <View style={[styles.patientAvatar, { backgroundColor: appointment.avatarColor + '20' }]}>
                        <ThemedText style={[styles.avatarText, { color: appointment.avatarColor }]}>
                          {appointment.name.split(' ').map(n => n[0]).join('')}
                        </ThemedText>
                      </View>
                      <View>
                        <ThemedText style={styles.patientName}>{appointment.name}</ThemedText>
                        <ThemedText style={styles.appointmentType}>{appointment.type}</ThemedText>
                      </View>
                    </View>
                    
                    <View style={[
                      styles.priorityTag,
                      { 
                        backgroundColor: appointment.priority === 'high' ? '#FEE2E2' : 
                                       appointment.priority === 'medium' ? '#FEF3C7' : 
                                       '#ECFDF5'
                      }
                    ]}>
                      <View style={[
                        styles.priorityDot,
                        { 
                          backgroundColor: appointment.priority === 'high' ? '#DC2626' : 
                                        appointment.priority === 'medium' ? '#D97706' : 
                                        COLORS.primary
                        }
                      ]} />
                      <ThemedText style={[
                        styles.priorityText,
                        { 
                          color: appointment.priority === 'high' ? '#DC2626' : 
                                 appointment.priority === 'medium' ? '#D97706' : 
                                 COLORS.primary
                        }
                      ]}>
                        {appointment.priority}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.appointmentFooter}>
                    <View style={styles.roomInfo}>
                      <Ionicons name="location" size={12} color={COLORS.muted} />
                      <ThemedText style={styles.roomText}>Room {appointment.room}</ThemedText>
                    </View>
                    
                    <View style={[
                      styles.statusIndicator,
                      { backgroundColor: appointment.status === 'active' ? '#D1FAE5' : '#ECFDF5' }
                    ]}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: appointment.status === 'active' ? COLORS.success : COLORS.primary }
                      ]} />
                      <ThemedText style={[
                        styles.statusText,
                        { color: appointment.status === 'active' ? COLORS.success : COLORS.primary }
                      ]}>
                        {appointment.status === 'active' ? 'In Progress' : 'Upcoming'}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* RIGHT SIDE COLUMN */}
        <View style={styles.rightColumn}>
          {/* RECENT PATIENTS */}
          <View style={styles.dashboardCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>Recent Patients</ThemedText>
              <TouchableOpacity>
                <Ionicons name="refresh" size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.patientsList}>
              {RECENT_PATIENTS.map((patient, index) => (
                <TouchableOpacity key={index} style={styles.patientItem}>
                  <View style={styles.patientHeader}>
                    <View style={[styles.patientAvatar, { backgroundColor: patient.color + '20' }]}>
                      <ThemedText style={[styles.avatarText, { color: patient.color }]}>
                        {patient.initials}
                      </ThemedText>
                    </View>
                    <View style={styles.patientInfo}>
                      <ThemedText style={styles.patientName}>{patient.name}</ThemedText>
                      <ThemedText style={styles.patientMeta}>
                        {patient.age} yrs • {patient.gender}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.patientDetails}>
                    <ThemedText style={styles.patientCondition}>{patient.condition}</ThemedText>
                    <View style={styles.patientStatus}>
                      <ThemedText style={styles.lastVisit}>{patient.lastVisit}</ThemedText>
                      <View style={[styles.statusBadge, { backgroundColor: patient.color + '20' }]}>
                        <View style={[styles.statusDotSmall, { backgroundColor: patient.color }]} />
                        <ThemedText style={[styles.statusText, { color: patient.color }]}>
                          {patient.status}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* STATISTICS CHART */}
          <View style={styles.dashboardCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>Weekly Statistics</ThemedText>
              <TouchableOpacity>
                <Ionicons name="stats-chart" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.chartContainer}>
              <View style={styles.chartBars}>
                {STATS_CHART.map((day, index) => (
                  <View key={index} style={styles.chartBarContainer}>
                    <View style={styles.chartBarWrapper}>
                      <View 
                        style={[
                          styles.chartBar, 
                          { 
                            height: day.value * 1.5,
                            backgroundColor: day.value > 50 ? COLORS.primary : COLORS.primaryLight 
                          }
                        ]} 
                      />
                    </View>
                    <ThemedText style={styles.chartLabel}>{day.day}</ThemedText>
                  </View>
                ))}
              </View>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                  <ThemedText style={styles.legendText}>Patient Visits</ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ===== MEDICATION REMINDERS ===== */}
      <View style={styles.dashboardCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <ThemedText style={styles.cardTitle}>Medication Reminders</ThemedText>
            <View style={styles.reminderBadge}>
              <ThemedText style={styles.reminderCount}>3</ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.addReminderButton}>
            <Ionicons name="add" size={16} color={COLORS.primary} />
            <ThemedText style={styles.addReminderText}>Add Reminder</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.medicationsGrid}>
          {MEDICATION_REMINDERS.map((medication) => (
            <View key={medication.id} style={styles.medicationCard}>
              <View style={styles.medicationHeader}>
                <View style={styles.medicationIcon}>
                  <Ionicons name="medical" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.medicationInfo}>
                  <ThemedText style={styles.medicationPatient}>{medication.patient}</ThemedText>
                  <ThemedText style={styles.medicationName}>{medication.medication}</ThemedText>
                  <ThemedText style={styles.medicationDosage}>{medication.dosage}</ThemedText>
                </View>
              </View>
              
              <View style={styles.medicationTime}>
                <View style={styles.timeContainer}>
                  <Ionicons name="time" size={14} color={COLORS.muted} />
                  <ThemedText style={styles.timeText}>{medication.time}</ThemedText>
                </View>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: medication.color + '20', borderColor: medication.color + '40' }
                ]}>
                  <View style={[styles.statusDotSmall, { backgroundColor: medication.color }]} />
                  <ThemedText style={[styles.statusText, { color: medication.color }]}>
                    {medication.status}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.bg,
    flex: 1,
  },

  /* ===== GRADIENT CARD ===== */
  gradientCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  /* ===== HEADER WITH GRADIENT ===== */
  header: {
    marginBottom: 24,
  },

  gradientHeader: {
    backgroundColor: COLORS.bannerMid,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
        paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    marginBottom: 4,
  },

  doctorName: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "800",
    marginBottom: 4,
  },

  specialty: {
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },

  headerStats: {
    flexDirection: "row",
    gap: 12,
  },

  statBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 70,
  },

  statValue: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "800",
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },

  date: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },

  /* ===== SECTIONS ===== */
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  viewAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.soft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  filterText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },

  /* ===== QUICK ACTIONS ===== */
  quickActionsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  quickActionsScroll: {
    marginTop: 20,
  },

  quickActionsContainer: {
    paddingRight: 24,
  },

  actionCard: {
    alignItems: "center",
    marginRight: 20,
    width: 80,
  },

  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  actionLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "center",
  },

  /* ===== KPI SECTION ===== */
  kpiSection: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },

  kpiCard: {
    flex: 1,
  },

  kpiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  kpiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },

  trendText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  kpiContent: {},
  
  kpiValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  kpiLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    marginBottom: 4,
  },

  kpiSubLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },

  /* ===== METRICS GRID ===== */
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  metricCard: {
    flex: 1,
    minWidth: "15%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },

  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  trendIndicator: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },

  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },

  metricLabel: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    fontWeight: "600",
  },

  /* ===== DASHBOARD GRID ===== */
  dashboardGrid: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },

  dashboardCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },

  largeCard: {
    flex: 2,
  },

  rightColumn: {
    flex: 1,
    gap: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },

  scheduleBadge: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  scheduleCount: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.soft,
    borderRadius: 10,
  },

  viewAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },

  /* ===== SCHEDULE ===== */
  scheduleList: {
    gap: 16,
  },

  appointmentItem: {
    flexDirection: "row",
    backgroundColor: COLORS.softLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  appointmentTime: {
    alignItems: "center",
    marginRight: 20,
    minWidth: 80,
  },

  timeText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },

  durationText: {
    fontSize: 12,
    color: COLORS.muted,
    backgroundColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: "600",
  },

  appointmentContent: {
    flex: 1,
  },

  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "800",
  },

  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },

  appointmentType: {
    fontSize: 13,
    color: COLORS.muted,
  },

  priorityTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },

  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  priorityText: {
    fontSize: 12,
    fontWeight: "700",
  },

  appointmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
  },

  roomText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },

  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  /* ===== PATIENTS LIST ===== */
  patientsList: {
    gap: 16,
  },

  patientItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },

  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    fontSize: 15,
    fontWeight: "800",
  },

  patientInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },

  patientMeta: {
    fontSize: 12,
    color: COLORS.muted,
  },

  patientDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  patientCondition: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "600",
    backgroundColor: COLORS.soft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  patientStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  lastVisit: {
    fontSize: 12,
    color: COLORS.muted,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },

  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  /* ===== CHART ===== */
  chartContainer: {
    paddingTop: 10,
  },

  chartBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    marginBottom: 20,
  },

  chartBarContainer: {
    alignItems: "center",
    flex: 1,
  },

  chartBarWrapper: {
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  chartBar: {
    width: 12,
    borderRadius: 6,
    marginBottom: 8,
  },

  chartLabel: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "600",
  },

  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },

  /* ===== MEDICATION REMINDERS ===== */
  reminderBadge: {
    backgroundColor: COLORS.warning,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  reminderCount: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  addReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.soft,
    borderRadius: 10,
  },

  addReminderText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },

  medicationsGrid: {
    flexDirection: "row",
    gap: 16,
  },

  medicationCard: {
    flex: 1,
    backgroundColor: COLORS.softLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  medicationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  medicationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  medicationInfo: {
    flex: 1,
  },

  medicationPatient: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },

  medicationName: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },

  medicationDosage: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "600",
  },

  medicationTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
  },

  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
  },
}); 