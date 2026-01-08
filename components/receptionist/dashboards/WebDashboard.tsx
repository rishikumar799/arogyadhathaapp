import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width } = Dimensions.get('window');

/* ================= RECEPTIONIST THEME (Professional Blue) ================= */

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
  { label: "Appointment", icon: "calendar", color: "#FFFFFF", bg: COLORS.secondary },
  { label: "Check-in", icon: "checkmark-circle", color: "#FFFFFF", bg: COLORS.success },
  { label: "Billing", icon: "cash", color: "#FFFFFF", bg: COLORS.info },
  { label: "Records", icon: "folder", color: "#FFFFFF", bg: COLORS.purple },
  { label: "Queue", icon: "list", color: "#FFFFFF", bg: COLORS.warning },
  { label: "Messages", icon: "chatbubble", color: "#FFFFFF", bg: COLORS.pink },
  { label: "Reports", icon: "stats-chart", color: "#FFFFFF", bg: COLORS.accent },
];

const KPI_DATA = [
  { 
    label: "Today's Appointments", 
    value: "68", 
    icon: "calendar", 
    change: "+6",
    subLabel: "8 pending check-in",
    trend: "up",
    gradient: ["#3B82F6", "#60A5FA"]
  },
  { 
    label: "Waiting Room", 
    value: "12", 
    icon: "people", 
    change: "+3",
    subLabel: "Patients waiting",
    trend: "up",
    gradient: ["#8B5CF6", "#A78BFA"]
  },
  { 
    label: "Pending Payments", 
    value: "8", 
    icon: "cash", 
    change: "-2",
    subLabel: "Need processing",
    trend: "down",
    gradient: ["#06B6D4", "#22D3EE"]
  },
  { 
    label: "Avg Wait Time", 
    value: "15 min", 
    icon: "time", 
    change: "-5 min",
    subLabel: "Improved efficiency",
    trend: "down",
    gradient: ["#10B981", "#34D399"]
  },
];

const OPERATION_METRICS = [
  { 
    title: "Checked-in", 
    value: "42", 
    icon: "checkmark-circle",
    trend: "up",
    color: COLORS.success,
    gradient: ["#ECFDF5", "#D1FAE5"]
  },
  { 
    title: "No-shows", 
    value: "3", 
    icon: "close-circle",
    trend: "stable",
    color: COLORS.danger,
    gradient: ["#FEF2F2", "#FEE2E2"]
  },
  { 
    title: "Rescheduled", 
    value: "5", 
    icon: "refresh-circle",
    trend: "up",
    color: COLORS.warning,
    gradient: ["#FFFBEB", "#FEF3C7"]
  },
  { 
    title: "Walk-ins", 
    value: "8", 
    icon: "walk",
    trend: "up",
    color: COLORS.info,
    gradient: ["#F0F9FF", "#E0F2FE"]
  },
  { 
    title: "Discharged", 
    value: "28", 
    icon: "exit",
    trend: "up",
    color: COLORS.success,
    gradient: ["#ECFDF5", "#D1FAE5"]
  },
  { 
    title: "Follow-ups", 
    value: "15", 
    icon: "return-up-forward",
    trend: "down",
    color: COLORS.secondary,
    gradient: ["#F5F3FF", "#EDE9FE"]
  },
];

const TODAY_APPOINTMENTS = [
  { 
    id: "1",
    name: "John Carter", 
    time: "09:30 AM", 
    doctor: "Dr. Smith - Cardiology",
    status: "checked-in",
    priority: "new",
    room: "Waiting Area 3",
    duration: "30 min",
    payment: "Paid",
    avatarColor: COLORS.primary
  },
  { 
    id: "2",
    name: "Emily Stone", 
    time: "11:00 AM", 
    doctor: "Dr. Johnson - Dental",
    status: "waiting",
    priority: "follow-up",
    room: "Dental Wing",
    duration: "2 hrs",
    payment: "Pending",
    avatarColor: COLORS.secondary
  },
  { 
    id: "3",
    name: "Michael Ross", 
    time: "02:15 PM", 
    doctor: "Dr. Wilson - Cardiology",
    status: "scheduled",
    priority: "urgent",
    room: "Cardiac Center",
    duration: "45 min",
    payment: "Insurance",
    avatarColor: COLORS.accent
  },
  { 
    id: "4",
    name: "Sarah Johnson", 
    time: "03:45 PM", 
    doctor: "Dr. Brown - Orthopedic",
    status: "arrived",
    priority: "normal",
    room: "Ortho Dept",
    duration: "20 min",
    payment: "Paid",
    avatarColor: COLORS.info
  },
];

const WAITING_ROOM = [
  { 
    name: "Robert Chen", 
    doctor: "Dr. Smith", 
    waitTime: "25 min",
    status: "Examining",
    color: COLORS.primary,
    initials: "RC",
    age: "45",
    appointmentTime: "09:00 AM"
  },
  { 
    name: "Maria Garcia", 
    doctor: "Dr. Johnson", 
    waitTime: "15 min",
    status: "Waiting",
    color: COLORS.secondary,
    initials: "MG",
    age: "52",
    appointmentTime: "10:30 AM"
  },
  { 
    name: "James Wilson", 
    doctor: "Dr. Wilson", 
    waitTime: "40 min",
    status: "Delayed",
    color: COLORS.warning,
    initials: "JW",
    age: "38",
    appointmentTime: "09:45 AM"
  },
  { 
    name: "Lisa Taylor", 
    doctor: "Dr. Brown", 
    waitTime: "5 min",
    status: "Ready",
    color: COLORS.success,
    initials: "LT",
    age: "29",
    appointmentTime: "11:15 AM"
  },
];

const BILLING_PENDING = [
  {
    id: "1",
    patient: "David Brown",
    amount: "$250",
    time: "Today 10:30 AM",
    status: "Pending",
    color: COLORS.warning,
    service: "Consultation + Tests"
  },
  {
    id: "2",
    patient: "Sarah Miller",
    amount: "$120",
    time: "Today 09:15 AM",
    status: "Partial",
    color: COLORS.info,
    service: "Follow-up Visit"
  },
  {
    id: "3",
    patient: "Thomas Lee",
    amount: "$450",
    time: "Yesterday",
    status: "Overdue",
    color: COLORS.danger,
    service: "Dental Procedure"
  },
];

const DOCTOR_AVAILABILITY = [
  { name: "Dr. Smith", specialty: "Cardiology", status: "Available", patients: 3, color: COLORS.success },
  { name: "Dr. Johnson", specialty: "Dental", status: "In Surgery", patients: 1, color: COLORS.warning },
  { name: "Dr. Wilson", specialty: "Cardiology", status: "Available", patients: 2, color: COLORS.success },
  { name: "Dr. Brown", specialty: "Orthopedic", status: "Break", patients: 0, color: COLORS.info },
];

const STATS_CHART = [
  { hour: "9 AM", value: 18 },
  { hour: "10 AM", value: 25 },
  { hour: "11 AM", value: 32 },
  { hour: "12 PM", value: 28 },
  { hour: "1 PM", value: 15 },
  { hour: "2 PM", value: 22 },
  { hour: "3 PM", value: 19 },
];

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

/* ================= MAIN COMPONENT ================= */

export default function ReceptionistDashboard() {
  const [receptionistName, setReceptionistName] = useState("");
  const [shiftInfo, setShiftInfo] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [activeTab, setActiveTab] = useState("appointments");
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setReceptionistName(data?.name || "");
        setShiftInfo(data?.shift || "Morning Shift (8 AM - 4 PM)");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const now = new Date();
    setDateTime(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    // Simulate upcoming appointments count
    setUpcomingAppointments(12);
  }, []);

  const handleCheckIn = (patientId) => {
    Alert.alert(
      "Check-in Patient",
      "Mark patient as checked in?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Check-in", onPress: () => {
          // Add your check-in logic here
          Alert.alert("Success", "Patient checked in successfully!");
        }}
      ]
    );
  };

  const handlePayment = (patientId) => {
    Alert.alert(
      "Process Payment",
      "Open payment processing screen?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Proceed", onPress: () => {
          // Add payment processing logic
          Alert.alert("Payment", "Redirecting to payment screen...");
        }}
      ]
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'checked-in': return COLORS.success;
      case 'waiting': return COLORS.warning;
      case 'arrived': return COLORS.info;
      case 'scheduled': return COLORS.muted;
      default: return COLORS.muted;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return COLORS.danger;
      case 'new': return COLORS.primary;
      case 'follow-up': return COLORS.secondary;
      default: return COLORS.muted;
    }
  };

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
              <ThemedText style={styles.receptionistName}>
                {receptionistName ? receptionistName : "Receptionist"}
              </ThemedText>
              {/* {shiftInfo ? (
                <ThemedText style={styles.shiftInfo}>
                  <Ionicons name="time" size={14} color="rgba(255,255,255,0.8)" /> {shiftInfo}
                </ThemedText>
              ) : null} */}
            </View>

            <View style={styles.headerStats}>
              <View style={styles.statBadge}>
                <ThemedText style={styles.statValue}>{upcomingAppointments}</ThemedText>
                <ThemedText style={styles.statLabel}>Upcoming</ThemedText>
              </View>
              <View style={styles.statBadge}>
                <ThemedText style={styles.statValue}>8</ThemedText>
                <ThemedText style={styles.statLabel}>Checked-in</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <Ionicons name="calendar" size={16} color="rgba(255,255,255,0.8)" />
            <ThemedText style={styles.date}>
              {dateTime}
            </ThemedText>
          </View>
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

      {/* ===== OPERATIONAL METRICS ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Today's Operations</ThemedText>
          <TouchableOpacity style={styles.filterButton}>
            <ThemedText style={styles.filterText}>Live Update</ThemedText>
            <Ionicons name="sync" size={14} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.metricsGrid}>
          {OPERATION_METRICS.map((metric, index) => (
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

      {/* ===== DASHBOARD TABS ===== */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {["appointments", "waiting", "billing", "doctors"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== APPOINTMENTS SECTION ===== */}
      {activeTab === "appointments" && (
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <ThemedText style={styles.cardTitle}>Today's Appointments</ThemedText>
              <View style={styles.scheduleBadge}>
                <ThemedText style={styles.scheduleCount}>{TODAY_APPOINTMENTS.length}</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <ThemedText style={styles.filterText}>Filter</ThemedText>
              <Ionicons name="filter" size={14} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.appointmentsList}>
            {TODAY_APPOINTMENTS.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentItem}>
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
                        <ThemedText style={styles.doctorText}>{appointment.doctor}</ThemedText>
                      </View>
                    </View>
                    
                    <View style={[
                      styles.priorityTag,
                      { backgroundColor: getPriorityColor(appointment.priority) + '20' }
                    ]}>
                      <View style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(appointment.priority) }
                      ]} />
                      <ThemedText style={[
                        styles.priorityText,
                        { color: getPriorityColor(appointment.priority) }
                      ]}>
                        {appointment.priority}
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.appointmentFooter}>
                    <View style={styles.roomInfo}>
                      <Ionicons name="location" size={12} color={COLORS.muted} />
                      <ThemedText style={styles.roomText}>{appointment.room}</ThemedText>
                    </View>
                    
                    <View style={styles.paymentStatus}>
                      <View style={[
                        styles.paymentBadge,
                        { backgroundColor: appointment.payment === 'Paid' ? COLORS.success + '20' : COLORS.warning + '20' }
                      ]}>
                        <Ionicons 
                          name={appointment.payment === 'Paid' ? "checkmark-circle" : "time"} 
                          size={12} 
                          color={appointment.payment === 'Paid' ? COLORS.success : COLORS.warning} 
                        />
                        <ThemedText style={[
                          styles.paymentText,
                          { color: appointment.payment === 'Paid' ? COLORS.success : COLORS.warning }
                        ]}>
                          {appointment.payment}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.checkinButton]}
                      onPress={() => handleCheckIn(appointment.id)}
                    >
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                      <ThemedText style={[styles.actionButtonText, { color: COLORS.success }]}>
                        Check-in
                      </ThemedText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.paymentButton]}
                      onPress={() => handlePayment(appointment.id)}
                    >
                      <Ionicons name="cash" size={16} color={COLORS.primary} />
                      <ThemedText style={[styles.actionButtonText, { color: COLORS.primary }]}>
                        Payment
                      </ThemedText>
                    </TouchableOpacity>
                    
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(appointment.status) + '20' }
                    ]}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(appointment.status) }
                      ]} />
                      <ThemedText style={[
                        styles.statusText,
                        { color: getStatusColor(appointment.status) }
                      ]}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ===== WAITING ROOM SECTION ===== */}
      {activeTab === "waiting" && (
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <ThemedText style={styles.cardTitle}>Waiting Room</ThemedText>
              <View style={styles.waitingBadge}>
                <ThemedText style={styles.waitingCount}>{WAITING_ROOM.length}</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.callNextButton}>
              <Ionicons name="megaphone" size={16} color="#FFFFFF" />
              <ThemedText style={styles.callNextText}>Call Next</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.waitingList}>
            {WAITING_ROOM.map((patient, index) => (
              <TouchableOpacity key={index} style={styles.waitingItem}>
                <View style={styles.waitingHeader}>
                  <View style={[styles.patientAvatar, { backgroundColor: patient.color + '20' }]}>
                    <ThemedText style={[styles.avatarText, { color: patient.color }]}>
                      {patient.initials}
                    </ThemedText>
                  </View>
                  <View style={styles.patientInfo}>
                    <ThemedText style={styles.patientName}>{patient.name}</ThemedText>
                    <ThemedText style={styles.patientMeta}>
                      {patient.age} yrs • {patient.doctor}
                    </ThemedText>
                  </View>
                  <View style={styles.waitTime}>
                    <Ionicons name="time" size={14} color={COLORS.muted} />
                    <ThemedText style={styles.waitTimeText}>{patient.waitTime}</ThemedText>
                  </View>
                </View>
                
                <View style={styles.waitingDetails}>
                  <View style={styles.appointmentTimeInfo}>
                    <Ionicons name="calendar" size={12} color={COLORS.muted} />
                    <ThemedText style={styles.appointmentTimeText}>
                      Appt: {patient.appointmentTime}
                    </ThemedText>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: patient.status === 'Ready' ? COLORS.success + '20' : COLORS.warning + '20' }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: patient.status === 'Ready' ? COLORS.success : COLORS.warning }
                    ]} />
                    <ThemedText style={[
                      styles.statusText,
                      { color: patient.status === 'Ready' ? COLORS.success : COLORS.warning }
                    ]}>
                      {patient.status}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ===== DOCTOR AVAILABILITY ===== */}
      {activeTab === "doctors" && (
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Doctor Availability</ThemedText>
            <TouchableOpacity>
              <Ionicons name="refresh" size={18} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.doctorsGrid}>
            {DOCTOR_AVAILABILITY.map((doctor, index) => (
              <View key={index} style={styles.doctorCard}>
                <View style={styles.doctorHeader}>
                  <View style={styles.doctorAvatar}>
                    <ThemedText style={styles.doctorInitials}>
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </ThemedText>
                  </View>
                  <View style={styles.doctorInfo}>
                    <ThemedText style={styles.doctorName}>{doctor.name}</ThemedText>
                    <ThemedText style={styles.doctorSpecialty}>{doctor.specialty}</ThemedText>
                  </View>
                </View>
                
                <View style={styles.doctorStatus}>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: doctor.status === 'Available' ? COLORS.success + '20' : COLORS.warning + '20' }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: doctor.status === 'Available' ? COLORS.success : COLORS.warning }
                    ]} />
                    <ThemedText style={[
                      styles.statusText,
                      { color: doctor.status === 'Available' ? COLORS.success : COLORS.warning }
                    ]}>
                      {doctor.status}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.patientCount}>
                    <Ionicons name="people" size={12} color={COLORS.muted} /> {doctor.patients} waiting
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ===== BILLING & PAYMENTS ===== */}
      {activeTab === "billing" && (
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <ThemedText style={styles.cardTitle}>Pending Payments</ThemedText>
              <View style={styles.pendingBadge}>
                <ThemedText style={styles.pendingCount}>{BILLING_PENDING.length}</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.processAllButton}>
              <Ionicons name="play-circle" size={16} color="#FFFFFF" />
              <ThemedText style={styles.processAllText}>Process All</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.billingList}>
            {BILLING_PENDING.map((bill) => (
              <TouchableOpacity key={bill.id} style={styles.billingItem}>
                <View style={styles.billingHeader}>
                  <View style={styles.billingInfo}>
                    <ThemedText style={styles.billingPatient}>{bill.patient}</ThemedText>
                    <ThemedText style={styles.billingService}>{bill.service}</ThemedText>
                    <ThemedText style={styles.billingTime}>{bill.time}</ThemedText>
                  </View>
                  <View style={styles.billingAmountContainer}>
                    <ThemedText style={styles.billingAmount}>{bill.amount}</ThemedText>
                  </View>
                </View>
                
                <View style={styles.billingActions}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: bill.color + '20' }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: bill.color }
                    ]} />
                    <ThemedText style={[
                      styles.statusText,
                      { color: bill.color }
                    ]}>
                      {bill.status}
                    </ThemedText>
                  </View>
                  
                  <TouchableOpacity style={styles.processButton}>
                    <Ionicons name="card" size={14} color={COLORS.primary} />
                    <ThemedText style={styles.processText}>Process</ThemedText>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ===== STATISTICS CHART ===== */}
      <View style={styles.dashboardCard}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Hourly Patient Flow</ThemedText>
          <TouchableOpacity>
            <Ionicons name="stats-chart" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {STATS_CHART.map((hour, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View style={styles.chartBarWrapper}>
                  <View 
                    style={[
                      styles.chartBar, 
                      { 
                        height: hour.value * 1.5,
                        backgroundColor: hour.value > 25 ? COLORS.primary : COLORS.primaryLight 
                      }
                    ]} 
                  />
                </View>
                <ThemedText style={styles.chartLabel}>{hour.hour}</ThemedText>
              </View>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <ThemedText style={styles.legendText}>Patient Check-ins</ThemedText>
            </View>
          </View>
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

  gradientCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

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

  receptionistName: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "800",
    marginBottom: 4,
  },

  shiftInfo: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
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

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  date: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },

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

  tabsContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  tabsScroll: {
    flexDirection: "row",
  },

  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: COLORS.soft,
  },

  activeTab: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  dashboardCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
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
  },

  scheduleCount: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  waitingBadge: {
    backgroundColor: COLORS.warning,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  waitingCount: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  pendingBadge: {
    backgroundColor: COLORS.danger,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  pendingCount: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  appointmentsList: {
    gap: 16,
  },

  appointmentItem: {
    backgroundColor: COLORS.softLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  appointmentTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  timeText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
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

  appointmentContent: {},
  
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

  doctorText: {
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
    marginBottom: 16,
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

  paymentStatus: {},
  
  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },

  paymentText: {
    fontSize: 12,
    fontWeight: "700",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    backgroundColor: COLORS.soft,
  },

  checkinButton: {
    backgroundColor: COLORS.success + '20',
  },

  paymentButton: {
    backgroundColor: COLORS.primary + '20',
  },

  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
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

  waitingList: {
    gap: 16,
  },

  waitingItem: {
    backgroundColor: COLORS.softLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  waitingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  waitTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  waitTimeText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },

  waitingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  appointmentTimeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  appointmentTimeText: {
    fontSize: 12,
    color: COLORS.muted,
  },

  doctorsGrid: {
    gap: 16,
  },

  doctorCard: {
    backgroundColor: COLORS.softLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20',
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  doctorInitials: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },

  doctorInfo: {
    flex: 1,
  },

  doctorName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },

  doctorSpecialty: {
    fontSize: 13,
    color: COLORS.muted,
  },

  doctorStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  patientCount: {
    fontSize: 12,
    color: COLORS.muted,
  },

  billingList: {
    gap: 16,
  },

  billingItem: {
    backgroundColor: COLORS.softLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  billingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  billingInfo: {
    flex: 1,
  },

  billingPatient: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },

  billingService: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },

  billingTime: {
    fontSize: 12,
    color: COLORS.muted,
  },

  billingAmountContainer: {},
  
  billingAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  billingActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  processButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.soft,
    borderRadius: 8,
    gap: 6,
  },

  processText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },

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

  callNextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },

  callNextText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  processAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },

  processAllText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});