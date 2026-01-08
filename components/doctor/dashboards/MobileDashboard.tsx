import { ThemedText } from "@/components/themed-text";
import { loadSession } from "@/lib/authPersist";
import { loadWebSession } from "@/lib/webPersist";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";





const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isMediumScreen = width < 414;

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
  bannerDark: "#064E3B",       // Dark Emerald
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

/* ================= GRADIENT COMPONENT ================= */

const GradientCard = ({ children, colors, style }) => {
  return (
    <View style={[styles.gradientCard, style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
};

/* ================= COMPONENT ================= */

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loadingDoctor, setLoadingDoctor] = useState(true);

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
  (async () => {
    const session =
      Platform.OS === "web"
        ? loadWebSession()
        : await loadSession();

    console.log("SESSION DATA:", session);

    if (session?.name) {
      setDoctorName(session.name);
    }

    if (session?.role === "doctor" && session?.specialization) {
      setSpecialization(session.specialization);
    }

    setLoadingDoctor(false);
  })();
}, []);






const renderKpiCard = ({ item }) => (
    <GradientCard colors={item.gradient} style={styles.kpiCard}>
      <View style={styles.kpiHeader}>
        <View style={styles.kpiIconContainer}>
          <Ionicons name={item.icon} size={isSmallScreen ? 18 : 22} color="#FFFFFF" />
        </View>
        <View style={[
          styles.trendBadge,
          { backgroundColor: item.trend === 'up' ? 'rgba(255,255,255,0.2)' : 'rgba(239,68,68,0.2)' }
        ]}>
          <Ionicons 
            name={item.trend === 'up' ? "trending-up" : "trending-down"} 
            size={10} 
            color="#FFFFFF" 
          />
          <ThemedText style={styles.trendText}>
            {item.change}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.kpiContent}>
        <ThemedText style={styles.kpiValue}>{item.value}</ThemedText>
        <ThemedText style={styles.kpiLabel}>{item.label}</ThemedText>
        <ThemedText style={styles.kpiSubLabel}>{item.subLabel}</ThemedText>
      </View>
    </GradientCard>
  );

  const renderMetricCard = ({ item }) => (
    <View key={item.title} style={[styles.metricCard, { backgroundColor: item.gradient[0] }]}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={isSmallScreen ? 14 : 18} color={item.color} />
        </View>
        <View style={styles.trendIndicator}>
          <Ionicons 
            name={item.trend === 'up' ? "arrow-up" : item.trend === 'down' ? "arrow-down" : "remove"} 
            size={10} 
            color={item.trend === 'up' ? COLORS.success : item.trend === 'down' ? COLORS.danger : COLORS.muted} 
          />
        </View>
      </View>
      
      <ThemedText style={styles.metricValue}>{item.value}</ThemedText>
      <ThemedText style={styles.metricLabel}>{item.title}</ThemedText>
    </View>
  );

  const renderAppointment = ({ item }) => (
    <TouchableOpacity key={item.id} style={styles.appointmentItem}>
      <View style={styles.appointmentTime}>
        <ThemedText style={styles.timeText}>{item.time}</ThemedText>
        <ThemedText style={styles.durationText}>{item.duration}</ThemedText>
      </View>
      
      <View style={styles.appointmentContent}>
        <View style={styles.appointmentHeader}>
          <View style={styles.patientInfo}>
            <View style={[styles.patientAvatar, { backgroundColor: item.avatarColor + '20' }]}>
              <ThemedText style={[styles.avatarText, { color: item.avatarColor }]}>
                {item.name.split(' ').map(n => n[0]).join('')}
              </ThemedText>
            </View>
            <View style={styles.patientTextContainer}>
              <ThemedText style={styles.patientName}>{item.name}</ThemedText>
              <ThemedText style={styles.appointmentType}>{item.type}</ThemedText>
            </View>
          </View>
          
          <View style={[
            styles.priorityTag,
            { 
              backgroundColor: item.priority === 'high' ? '#FEE2E2' : 
                             item.priority === 'medium' ? '#FEF3C7' : 
                             '#ECFDF5'
            }
          ]}>
            <View style={[
              styles.priorityDot,
              { 
                backgroundColor: item.priority === 'high' ? '#DC2626' : 
                              item.priority === 'medium' ? '#D97706' : 
                              COLORS.primary
              }
            ]} />
            <ThemedText style={[
              styles.priorityText,
              { 
                color: item.priority === 'high' ? '#DC2626' : 
                       item.priority === 'medium' ? '#D97706' : 
                       COLORS.primary
              }
            ]}>
              {item.priority}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.appointmentFooter}>
          <View style={styles.roomInfo}>
            <Ionicons name="location" size={10} color={COLORS.muted} />
            <ThemedText style={styles.roomText}>Room {item.room}</ThemedText>
          </View>
          
          <View style={[
            styles.statusIndicator,
            { backgroundColor: item.status === 'active' ? '#D1FAE5' : '#ECFDF5' }
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: item.status === 'active' ? COLORS.success : COLORS.primary }
            ]} />
            <ThemedText style={[
              styles.statusText,
              { color: item.status === 'active' ? COLORS.success : COLORS.primary }
            ]}>
              {item.status === 'active' ? 'In Progress' : 'Upcoming'}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPatient = ({ item }) => (
    <TouchableOpacity style={styles.patientItem}>
      <View style={styles.patientHeader}>
        <View style={[styles.patientAvatar, { backgroundColor: item.color + '20' }]}>
          <ThemedText style={[styles.avatarText, { color: item.color }]}>
            {item.initials}
          </ThemedText>
        </View>
        <View style={styles.patientInfo}>
          <ThemedText style={styles.patientName}>{item.name}</ThemedText>
          <ThemedText style={styles.patientMeta}>
            {item.age} yrs • {item.gender}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.patientDetails}>
        <ThemedText style={styles.patientCondition}>{item.condition}</ThemedText>
        <View style={styles.patientStatus}>
          <ThemedText style={styles.lastVisit}>{item.lastVisit}</ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: item.color + '20' }]}>
            <View style={[styles.statusDotSmall, { backgroundColor: item.color }]} />
            <ThemedText style={[styles.statusText, { color: item.color }]}>
              {item.status}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMedication = ({ item }) => (
    <View key={item.id} style={styles.medicationCard}>
      <View style={styles.medicationHeader}>
        <View style={styles.medicationIcon}>
          <Ionicons name="medical" size={isSmallScreen ? 16 : 20} color="#FFFFFF" />
        </View>
        <View style={styles.medicationInfo}>
          <ThemedText style={styles.medicationPatient}>{item.patient}</ThemedText>
          <ThemedText style={styles.medicationName}>{item.medication}</ThemedText>
          <ThemedText style={styles.medicationDosage}>{item.dosage}</ThemedText>
        </View>
      </View>
      
      <View style={styles.medicationTime}>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={12} color={COLORS.muted} />
          <ThemedText style={styles.timeText}>{item.time}</ThemedText>
        </View>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: item.color + '20', borderColor: item.color + '40' }
        ]}>
          <View style={[styles.statusDotSmall, { backgroundColor: item.color }]} />
          <ThemedText style={[styles.statusText, { color: item.color }]}>
            {item.status}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderChartBar = ({ item, index }) => (
    <View key={index} style={styles.chartBarContainer}>
      <View style={styles.chartBarWrapper}>
        <View 
          style={[
            styles.chartBar, 
            { 
              height: item.value * (isSmallScreen ? 1.2 : 1.5),
              backgroundColor: item.value > 50 ? COLORS.primary : COLORS.primaryLight 
            }
          ]} 
        />
      </View>
      <ThemedText style={styles.chartLabel}>{item.day}</ThemedText>
    </View>
  );

  return (
   <ScrollView
  style={styles.page}  showsVerticalScrollIndicator={false}  contentContainerStyle={styles.scrollContent}>
      {/* ===== HEADER WITH GRADIENT ===== */}
      <View style={styles.header}>
  <View style={styles.gradientHeader}>
    <View style={styles.headerContent}>
      {/* ===== LEFT SIDE ===== */}
      <View style={styles.headerLeft}>
        <ThemedText style={styles.greeting}>
          {new Date().getHours() < 12
            ? "Good Morning"
            : new Date().getHours() < 18
            ? "Good Afternoon"
            : "Good Evening"}
        </ThemedText>

       <ThemedText style={styles.doctorName}>
  {loadingDoctor ? "Loading…" : `Dr. ${doctorName}`}
</ThemedText>

{!loadingDoctor && specialization ? (
  <ThemedText style={styles.specialty}>
    {specialization}
  </ThemedText>
) : null}

      </View>

      {/* ===== RIGHT SIDE STATS ===== */}
      <View style={styles.headerStats}>
        <View style={styles.statBadge}>
          <ThemedText style={styles.statValue}>8</ThemedText>
          <ThemedText style={styles.statLabel}>Today</ThemedText>
        </View>
        <View style={styles.statBadge}>
          <ThemedText style={styles.statValue}>42</ThemedText>
          <ThemedText style={styles.statLabel}>Week</ThemedText>
        </View>
      </View>
    </View>

    {/* ===== DATE ===== */}
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
            <ThemedText style={styles.viewAll}>All →</ThemedText>
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
                <Ionicons name={action.icon} size={isSmallScreen ? 20 : 24} color={action.color} />
              </View>
              <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== KPI DASHBOARD ===== */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Overview</ThemedText>
        <FlatList
          data={KPI_DATA}
          renderItem={renderKpiCard}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kpiList}
        />
      </View>

      {/* ===== CLINICAL METRICS ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Performance</ThemedText>
          <TouchableOpacity style={styles.filterButton}>
            <ThemedText style={styles.filterText}>This Month</ThemedText>
            <Ionicons name="chevron-down" size={12} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.metricsGrid}>
          {CLINICAL_METRICS.map((metric, index) => renderMetricCard({ item: metric }))}
        </View>
      </View>

      {/* ===== TODAY'S SCHEDULE ===== */}
      <View style={styles.section}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <ThemedText style={styles.cardTitle}>Today's Schedule</ThemedText>
            <View style={styles.scheduleBadge}>
              <ThemedText style={styles.scheduleCount}>8</ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <ThemedText style={styles.viewAllText}>All</ThemedText>
            <Ionicons name="arrow-forward" size={12} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={TODAY_SCHEDULE}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.scheduleList}
        />
      </View>

      {/* ===== RECENT PATIENTS ===== */}
      <View style={styles.section}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Recent Patients</ThemedText>
          <TouchableOpacity>
            <Ionicons name="refresh" size={isSmallScreen ? 16 : 18} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={RECENT_PATIENTS}
          renderItem={renderPatient}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.patientsList}
        />
      </View>

      {/* ===== STATISTICS CHART ===== */}
      <View style={styles.section}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Weekly Statistics</ThemedText>
          <TouchableOpacity>
            <Ionicons name="stats-chart" size={isSmallScreen ? 16 : 18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {STATS_CHART.map((day, index) => renderChartBar({ item: day, index }))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <ThemedText style={styles.legendText}>Patient Visits</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* ===== MEDICATION REMINDERS ===== */}
      <View style={styles.section}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <ThemedText style={styles.cardTitle}>Medication Reminders</ThemedText>
            <View style={styles.reminderBadge}>
              <ThemedText style={styles.reminderCount}>3</ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.addReminderButton}>
            <Ionicons name="add" size={isSmallScreen ? 14 : 16} color={COLORS.primary} />
            <ThemedText style={styles.addReminderText}>Add</ThemedText>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={MEDICATION_REMINDERS}
          renderItem={renderMedication}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.medicationsGrid}
        />
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
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginRight: 12,
    width: width * 0.75,
  },

  /* ===== HEADER WITH GRADIENT ===== */
  header: {
    marginBottom: 16,
  },

  gradientHeader: {
    backgroundColor: COLORS.bannerMid,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingTop: isSmallScreen ? 50 : 60,
    paddingBottom: isSmallScreen ? 20 : 24,
    shadowColor: COLORS.bannerDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  headerLeft: {
    flex: 1,
    marginRight: 12,
  },

  greeting: {
    fontSize: isSmallScreen ? 14 : 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    marginBottom: isSmallScreen ? 2 : 4,
  },

  doctorName: {
    fontSize: isSmallScreen ? 22 : 28,
    color: "#FFFFFF",
    fontWeight: "800",
    marginBottom: isSmallScreen ? 2 : 4,
  },

  specialty: {
    fontSize: isSmallScreen ? 14 : 18,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },

  headerStats: {
    flexDirection: "row",
    gap: 8,
  },

  statBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 6 : 8,
    borderRadius: 10,
    minWidth: isSmallScreen ? 60 : 70,
  },

  statValue: {
    fontSize: isSmallScreen ? 18 : 20,
    color: "#FFFFFF",
    fontWeight: "800",
    marginBottom: 2,
  },

  statLabel: {
    fontSize: isSmallScreen ? 10 : 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },

  date: {
    fontSize: isSmallScreen ? 12 : 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },

  /* ===== SECTIONS ===== */
  section: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  viewAll: {
    fontSize: isSmallScreen ? 12 : 14,
    color: COLORS.primary,
    fontWeight: "600",
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.soft,
    paddingHorizontal: isSmallScreen ? 10 : 12,
    paddingVertical: isSmallScreen ? 6 : 8,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  filterText: {
    fontSize: isSmallScreen ? 12 : 13,
    color: COLORS.text,
    fontWeight: "500",
  },

  /* ===== QUICK ACTIONS ===== */
  quickActionsSection: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginBottom: 20,
  },

  quickActionsScroll: {
    marginTop: 16,
  },

  quickActionsContainer: {
    paddingRight: isSmallScreen ? 16 : 20,
  },

  actionCard: {
    alignItems: "center",
    marginRight: isSmallScreen ? 16 : 20,
    width: isSmallScreen ? 70 : 80,
  },

  actionIconContainer: {
    width: isSmallScreen ? 50 : 60,
    height: isSmallScreen ? 50 : 60,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  actionLabel: {
    fontSize: isSmallScreen ? 11 : 12,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "center",
  },

  /* ===== KPI SECTION ===== */
  kpiList: {
    paddingRight: isSmallScreen ? 16 : 20,
  },

  kpiCard: {
    width: width * 0.75,
  },

  kpiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmallScreen ? 12 : 16,
  },

  kpiIconContainer: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },

  trendText: {
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  kpiContent: {},
  
  kpiValue: {
    fontSize: isSmallScreen ? 26 : 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  kpiLabel: {
    fontSize: isSmallScreen ? 12 : 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    marginBottom: 4,
  },

  kpiSubLabel: {
    fontSize: isSmallScreen ? 10 : 12,
    color: "rgba(255,255,255,0.7)",
  },

  /* ===== METRICS GRID ===== */
  /* ===== METRICS GRID ===== */
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",  // This distributes space evenly
    gap: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 4 : 0,  // Add small side padding
  },

  metricCard: {
    width: isSmallScreen ? "48%" : "31%",  // Slightly reduced width for better spacing
    minWidth: isSmallScreen ? 100 : 110,   // Minimum width for consistency
    borderRadius: 14,
    padding: isSmallScreen ? 14 : 16,      // Increased padding slightly
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: isSmallScreen ? 12 : 16,
  },

  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
    paddingHorizontal: 4,  // Add small padding inside
  },

  metricIcon: {
    width: isSmallScreen ? 36 : 40,
    height: isSmallScreen ? 36 : 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  trendIndicator: {
    width: isSmallScreen ? 24 : 28,
    height: isSmallScreen ? 24 : 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },

  metricValue: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
    textAlign: "center",
  },

  metricLabel: {
    fontSize: isSmallScreen ? 12 : 13,
    color: COLORS.muted,
    textAlign: "center",
    fontWeight: "600",
    paddingHorizontal: 4,
  },

  /* ===== CARD STYLES ===== */
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },

  scheduleBadge: {
    backgroundColor: COLORS.primary,
    width: isSmallScreen ? 24 : 28,
    height: isSmallScreen ? 24 : 28,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  scheduleCount: {
    fontSize: isSmallScreen ? 11 : 13,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: isSmallScreen ? 10 : 12,
    paddingVertical: isSmallScreen ? 5 : 6,
    backgroundColor: COLORS.soft,
    borderRadius: 8,
  },

  viewAllText: {
    fontSize: isSmallScreen ? 12 : 13,
    color: COLORS.primary,
    fontWeight: "600",
  },

  /* ===== SCHEDULE ===== */
  scheduleList: {
    gap: 12,
  },

  appointmentItem: {
    flexDirection: "row",
    backgroundColor: COLORS.softLight,
    borderRadius: 16,
    padding: isSmallScreen ? 14 : 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  appointmentTime: {
    alignItems: "center",
    marginRight: isSmallScreen ? 12 : 16,
    minWidth: isSmallScreen ? 70 : 80,
  },

  timeText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },

  durationText: {
    fontSize: isSmallScreen ? 10 : 12,
    color: COLORS.muted,
    backgroundColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "600",
  },

  appointmentContent: {
    flex: 1,
  },

  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  patientAvatar: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "800",
  },

  patientTextContainer: {
    flex: 1,
  },

  patientName: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },

  appointmentType: {
    fontSize: isSmallScreen ? 11 : 13,
    color: COLORS.muted,
  },

  priorityTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },

  priorityDot: {
    width: isSmallScreen ? 5 : 6,
    height: isSmallScreen ? 5 : 6,
    borderRadius: 3,
  },

  priorityText: {
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: "700",
  },

  appointmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 6,
  },

  roomText: {
    fontSize: isSmallScreen ? 11 : 12,
    color: COLORS.muted,
    fontWeight: "600",
  },

  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isSmallScreen ? 8 : 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  statusDot: {
    width: isSmallScreen ? 6 : 8,
    height: isSmallScreen ? 6 : 8,
    borderRadius: 3,
  },

  statusText: {
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: "700",
  },

  /* ===== PATIENTS LIST ===== */
  patientsList: {
    gap: 12,
  },

  patientItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },

  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  patientInfo: {
    flex: 1,
  },

  patientMeta: {
    fontSize: isSmallScreen ? 11 : 12,
    color: COLORS.muted,
  },

  patientDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  patientCondition: {
    fontSize: isSmallScreen ? 12 : 13,
    color: COLORS.textLight,
    fontWeight: "600",
    backgroundColor: COLORS.soft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  patientStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  lastVisit: {
    fontSize: isSmallScreen ? 10 : 12,
    color: COLORS.muted,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },

  statusDotSmall: {
    width: isSmallScreen ? 5 : 6,
    height: isSmallScreen ? 5 : 6,
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
    height: isSmallScreen ? 120 : 140,
    marginBottom: 16,
  },

  chartBarContainer: {
    alignItems: "center",
    flex: 1,
  },

  chartBarWrapper: {
    height: isSmallScreen ? 90 : 110,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  chartBar: {
    width: isSmallScreen ? 8 : 10,
    borderRadius: 4,
    marginBottom: 6,
  },

  chartLabel: {
    fontSize: isSmallScreen ? 10 : 11,
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
    gap: 6,
  },

  legendDot: {
    width: isSmallScreen ? 8 : 10,
    height: isSmallScreen ? 8 : 10,
    borderRadius: 5,
  },

  legendText: {
    fontSize: isSmallScreen ? 11 : 12,
    color: COLORS.muted,
    fontWeight: "600",
  },

  /* ===== MEDICATION REMINDERS ===== */
  reminderBadge: {
    backgroundColor: COLORS.warning,
    width: isSmallScreen ? 22 : 26,
    height: isSmallScreen ? 22 : 26,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  reminderCount: {
    fontSize: isSmallScreen ? 10 : 12,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  addReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: isSmallScreen ? 10 : 12,
    paddingVertical: isSmallScreen ? 6 : 8,
    backgroundColor: COLORS.soft,
    borderRadius: 8,
  },

  addReminderText: {
    fontSize: isSmallScreen ? 12 : 13,
    color: COLORS.primary,
    fontWeight: "600",
  },

  medicationsGrid: {
    gap: 12,
    paddingRight: isSmallScreen ? 16 : 20,
  },

  medicationCard: {
    backgroundColor: COLORS.softLight,
    borderRadius: 16,
    padding: isSmallScreen ? 14 : 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: width * 0.85,
    marginRight: 12,
  },

  medicationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  medicationIcon: {
    width: isSmallScreen ? 40 : 44,
    height: isSmallScreen ? 40 : 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
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
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },

  medicationName: {
    fontSize: isSmallScreen ? 12 : 13,
    color: COLORS.textLight,
    marginBottom: 2,
  },

  medicationDosage: {
    fontSize: isSmallScreen ? 10 : 11,
    color: COLORS.muted,
    fontWeight: "600",
  },

  medicationTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 6,
  },

  scrollContent: {
  paddingBottom: 120, // space for bottom navbar + safe area
},

});