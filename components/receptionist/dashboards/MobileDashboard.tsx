import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isTablet = width > 768;

/* ================= RECEPTIONIST THEME (Professional Green) ================= */

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
  const [upcomingAppointments, setUpcomingAppointments] = useState(12);
  const [checkedIn, setCheckedIn] = useState(8);
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock data - replace with actual Firebase data
  const [todaysAppointments, setTodaysAppointments] = useState([
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
  ]);
  
  const [waitingRoom, setWaitingRoom] = useState([
    { 
      id: "1",
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
      id: "2",
      name: "Maria Garcia", 
      doctor: "Dr. Johnson", 
      waitTime: "15 min",
      status: "Waiting",
      color: COLORS.secondary,
      initials: "MG",
      age: "52",
      appointmentTime: "10:30 AM"
    },
  ]);
  
  const [billingPending, setBillingPending] = useState([
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
  ]);
  
  const [doctorAvailability, setDoctorAvailability] = useState([
    { name: "Dr. Smith", specialty: "Cardiology", status: "Available", patients: 3, color: COLORS.success },
    { name: "Dr. Johnson", specialty: "Dental", status: "In Surgery", patients: 1, color: COLORS.warning },
  ]);

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
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setUpcomingAppointments(Math.floor(Math.random() * 5) + 10);
      setCheckedIn(Math.floor(Math.random() * 3) + 8);
      setRefreshing(false);
    }, 1500);
  };

  const handleCheckIn = (patientId, patientName) => {
    Alert.alert(
      "Check-in Patient",
      `Mark ${patientName} as checked in?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Check-in", onPress: () => {
          // Update local state
          setTodaysAppointments(prev => 
            prev.map(appt => 
              appt.id === patientId 
                ? { ...appt, status: 'checked-in' }
                : appt
            )
          );
          setCheckedIn(prev => prev + 1);
          Alert.alert("Success", `${patientName} checked in successfully!`);
        }}
      ]
    );
  };

  const handlePayment = (patientId, patientName) => {
    Alert.alert(
      "Process Payment",
      `Process payment for ${patientName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Proceed", onPress: () => {
          // Update local state
          setTodaysAppointments(prev => 
            prev.map(appt => 
              appt.id === patientId 
                ? { ...appt, payment: 'Paid' }
                : appt
            )
          );
          Alert.alert("Payment", `Processing payment for ${patientName}...`);
        }}
      ]
    );
  };

  const handleCallNext = () => {
    if (waitingRoom.length > 0) {
      const nextPatient = waitingRoom[0];
      Alert.alert(
        "Call Next Patient",
        `Call ${nextPatient.name} to see ${nextPatient.doctor}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Call Now", onPress: () => {
            // Remove from waiting room
            setWaitingRoom(prev => prev.slice(1));
            Alert.alert("Called", `${nextPatient.name} has been called.`);
          }}
        ]
      );
    } else {
      Alert.alert("Empty", "No patients in waiting room.");
    }
  };

  const handleProcessPayment = (billId) => {
    Alert.alert(
      "Confirm Payment",
      "Mark this payment as processed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Process", onPress: () => {
          setBillingPending(prev => prev.filter(bill => bill.id !== billId));
          Alert.alert("Success", "Payment processed!");
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
      case 'Examining': return COLORS.primary;
      case 'Ready': return COLORS.success;
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.gradientHeader}>
        <View style={styles.headerTop}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {receptionistName ? receptionistName.charAt(0) : "R"}
              </ThemedText>
            </View>
            <View style={styles.greetingSection}>
              <ThemedText style={styles.greeting}>
                {new Date().getHours() < 12
                  ? "Good Morning"
                  : new Date().getHours() < 18
                  ? "Good Afternoon"
                  : "Good Evening"}
              </ThemedText>
              <ThemedText style={styles.receptionistName}>
                {receptionistName || "Receptionist"}
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={22} color="#FFFFFF" />
            <View style={styles.notificationBadge}>
              <ThemedText style={styles.notificationCount}>3</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerBottom}>
          {/* <View style={styles.shiftInfoContainer}>
            <Ionicons name="time" size={14} color="rgba(255,255,255,0.9)" />
            <ThemedText style={styles.shiftInfo}>
              {shiftInfo}
            </ThemedText>
          </View> */}
          <View style={styles.dateContainer}>
            <Ionicons name="calendar" size={14} color="rgba(255,255,255,0.9)" />
            <ThemedText style={styles.date}>{dateTime}</ThemedText>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{upcomingAppointments}</ThemedText>
            <ThemedText style={styles.statLabel}>Upcoming</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{checkedIn}</ThemedText>
            <ThemedText style={styles.statLabel}>Checked-in</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{waitingRoom.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Waiting</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={18} color={COLORS.muted} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.quickActionsScroll}
      >
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.primary }]}>
            <Ionicons name="person-add" size={22} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.actionLabel}>New Patient</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.secondary }]}>
            <Ionicons name="calendar" size={22} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.actionLabel}>Appointment</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.success }]}>
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.actionLabel}>Check-in</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.info }]}>
            <Ionicons name="cash" size={22} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.actionLabel}>Billing</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.warning }]}>
            <Ionicons name="list" size={22} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.actionLabel}>Queue</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderKPI = () => (
    <View style={styles.kpiSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kpiContainer}
      >
        <GradientCard colors={[COLORS.primary, COLORS.primaryLight]} style={styles.kpiCard}>
          <View style={styles.kpiContent}>
            <View style={styles.kpiIconContainer}>
              <Ionicons name="calendar" size={20} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.kpiValue}>{todaysAppointments.length}</ThemedText>
            <ThemedText style={styles.kpiLabel}>Today's Appointments</ThemedText>
            <View style={styles.kpiTrend}>
              <Ionicons name="trending-up" size={12} color="#FFFFFF" />
              <ThemedText style={styles.kpiTrendText}>+6 from yesterday</ThemedText>
            </View>
          </View>
        </GradientCard>
        
        <GradientCard colors={["#8B5CF6", "#A78BFA"]} style={styles.kpiCard}>
          <View style={styles.kpiContent}>
            <View style={styles.kpiIconContainer}>
              <Ionicons name="people" size={20} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.kpiValue}>{waitingRoom.length}</ThemedText>
            <ThemedText style={styles.kpiLabel}>Waiting Room</ThemedText>
            <View style={styles.kpiTrend}>
              <Ionicons name="trending-up" size={12} color="#FFFFFF" />
              <ThemedText style={styles.kpiTrendText}>+3 patients</ThemedText>
            </View>
          </View>
        </GradientCard>
        
        <GradientCard colors={[COLORS.warning, "#FBBF24"]} style={styles.kpiCard}>
          <View style={styles.kpiContent}>
            <View style={styles.kpiIconContainer}>
              <Ionicons name="cash" size={20} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.kpiValue}>{billingPending.length}</ThemedText>
            <ThemedText style={styles.kpiLabel}>Pending Payments</ThemedText>
            <View style={styles.kpiTrend}>
              <Ionicons name="trending-down" size={12} color="#FFFFFF" />
              <ThemedText style={styles.kpiTrendText}>-2 cleared</ThemedText>
            </View>
          </View>
        </GradientCard>
      </ScrollView>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === "appointments" && styles.activeTab]}
          onPress={() => setActiveTab("appointments")}
        >
          <Ionicons 
            name="calendar" 
            size={18} 
            color={activeTab === "appointments" ? "#FFFFFF" : COLORS.muted} 
          />
          <ThemedText style={[styles.tabText, activeTab === "appointments" && styles.activeTabText]}>
            Appointments
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "waiting" && styles.activeTab]}
          onPress={() => setActiveTab("waiting")}
        >
          <Ionicons 
            name="people" 
            size={18} 
            color={activeTab === "waiting" ? "#FFFFFF" : COLORS.muted} 
          />
          <ThemedText style={[styles.tabText, activeTab === "waiting" && styles.activeTabText]}>
            Waiting ({waitingRoom.length})
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "billing" && styles.activeTab]}
          onPress={() => setActiveTab("billing")}
        >
          <Ionicons 
            name="cash" 
            size={18} 
            color={activeTab === "billing" ? "#FFFFFF" : COLORS.muted} 
          />
          <ThemedText style={[styles.tabText, activeTab === "billing" && styles.activeTabText]}>
            Billing ({billingPending.length})
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "doctors" && styles.activeTab]}
          onPress={() => setActiveTab("doctors")}
        >
          <Ionicons 
            name="medkit" 
            size={18} 
            color={activeTab === "doctors" ? "#FFFFFF" : COLORS.muted} 
          />
          <ThemedText style={[styles.tabText, activeTab === "doctors" && styles.activeTabText]}>
            Doctors
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderAppointments = () => (
    <View style={styles.contentSection}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Today's Appointments</ThemedText>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={16} color={COLORS.muted} />
          <ThemedText style={styles.filterText}>Filter</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.appointmentsList}>
        {todaysAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.patientInfo}>
                <View style={[styles.avatarSmall, { backgroundColor: appointment.avatarColor + '20' }]}>
                  <ThemedText style={[styles.avatarTextSmall, { color: appointment.avatarColor }]}>
                    {appointment.name.split(' ').map(n => n[0]).join('')}
                  </ThemedText>
                </View>
                <View style={styles.patientDetails}>
                  <ThemedText style={styles.patientName}>{appointment.name}</ThemedText>
                  <ThemedText style={styles.doctorName}>{appointment.doctor}</ThemedText>
                </View>
              </View>
              <View style={styles.appointmentTime}>
                <ThemedText style={styles.timeText}>{appointment.time}</ThemedText>
                <ThemedText style={styles.durationText}>{appointment.duration}</ThemedText>
              </View>
            </View>
            
            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="location" size={12} color={COLORS.muted} />
                  <ThemedText style={styles.detailText}>{appointment.room}</ThemedText>
                </View>
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
                    {appointment.status}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(appointment.priority) + '20' }
                ]}>
                  <ThemedText style={[
                    styles.priorityText,
                    { color: getPriorityColor(appointment.priority) }
                  ]}>
                    {appointment.priority}
                  </ThemedText>
                </View>
                <View style={[
                  styles.paymentBadge,
                  { 
                    backgroundColor: appointment.payment === 'Paid' 
                      ? COLORS.success + '20' 
                      : COLORS.warning + '20' 
                  }
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
                style={[
                  styles.actionButton, 
                  styles.checkinButton,
                  appointment.status === 'checked-in' && styles.disabledButton
                ]}
                onPress={() => handleCheckIn(appointment.id, appointment.name)}
                disabled={appointment.status === 'checked-in'}
              >
                <Ionicons 
                  name="checkmark-circle" 
                  size={16} 
                  color={appointment.status === 'checked-in' ? COLORS.muted : COLORS.success} 
                />
                <ThemedText style={[
                  styles.actionButtonText,
                  { color: appointment.status === 'checked-in' ? COLORS.muted : COLORS.success }
                ]}>
                  {appointment.status === 'checked-in' ? 'Checked In' : 'Check-in'}
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.paymentButton,
                  appointment.payment === 'Paid' && styles.disabledButton
                ]}
                onPress={() => handlePayment(appointment.id, appointment.name)}
                disabled={appointment.payment === 'Paid'}
              >
                <Ionicons 
                  name="cash" 
                  size={16} 
                  color={appointment.payment === 'Paid' ? COLORS.muted : COLORS.primary} 
                />
                <ThemedText style={[
                  styles.actionButtonText,
                  { color: appointment.payment === 'Paid' ? COLORS.muted : COLORS.primary }
                ]}>
                  {appointment.payment === 'Paid' ? 'Paid' : 'Payment'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderWaitingRoom = () => (
    <View style={styles.contentSection}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Waiting Room</ThemedText>
        <TouchableOpacity 
          style={styles.callNextButton}
          onPress={handleCallNext}
        >
          <Ionicons name="megaphone" size={16} color="#FFFFFF" />
          <ThemedText style={styles.callNextText}>Call Next</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.waitingList}>
        {waitingRoom.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={COLORS.border} />
            <ThemedText style={styles.emptyStateText}>No patients in waiting room</ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>All patients have been attended to</ThemedText>
          </View>
        ) : (
          waitingRoom.map((patient) => (
            <View key={patient.id} style={styles.waitingCard}>
              <View style={styles.waitingHeader}>
                <View style={styles.patientInfo}>
                  <View style={[styles.avatarSmall, { backgroundColor: patient.color + '20' }]}>
                    <ThemedText style={[styles.avatarTextSmall, { color: patient.color }]}>
                      {patient.initials}
                    </ThemedText>
                  </View>
                  <View style={styles.patientDetails}>
                    <ThemedText style={styles.patientName}>{patient.name}</ThemedText>
                    <View style={styles.patientMeta}>
                      <ThemedText style={styles.patientAge}>{patient.age} yrs</ThemedText>
                      <View style={styles.dot} />
                      <ThemedText style={styles.patientDoctor}>{patient.doctor}</ThemedText>
                    </View>
                  </View>
                </View>
                <View style={styles.waitTime}>
                  <Ionicons name="time" size={14} color={COLORS.muted} />
                  <ThemedText style={styles.waitTimeText}>{patient.waitTime}</ThemedText>
                </View>
              </View>
              
              <View style={styles.waitingDetails}>
                <View style={styles.appointmentTimeRow}>
                  <Ionicons name="calendar" size={12} color={COLORS.muted} />
                  <ThemedText style={styles.appointmentTimeText}>
                    Appointment: {patient.appointmentTime}
                  </ThemedText>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(patient.status) + '20' }
                ]}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(patient.status) }
                  ]} />
                  <ThemedText style={[
                    styles.statusText,
                    { color: getStatusColor(patient.status) }
                  ]}>
                    {patient.status}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderBilling = () => (
    <View style={styles.contentSection}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Pending Payments</ThemedText>
        <TouchableOpacity style={styles.processAllButton}>
          <Ionicons name="play-circle" size={16} color="#FFFFFF" />
          <ThemedText style={styles.processAllText}>Process All</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.billingList}>
        {billingPending.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
            <ThemedText style={styles.emptyStateText}>All payments processed</ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>No pending payments</ThemedText>
          </View>
        ) : (
          billingPending.map((bill) => (
            <View key={bill.id} style={styles.billingCard}>
              <View style={styles.billingHeader}>
                <View style={styles.billingInfo}>
                  <ThemedText style={styles.billingPatient}>{bill.patient}</ThemedText>
                  <ThemedText style={styles.billingService}>{bill.service}</ThemedText>
                  <ThemedText style={styles.billingTime}>{bill.time}</ThemedText>
                </View>
                <View style={styles.billingAmount}>
                  <ThemedText style={styles.amountText}>{bill.amount}</ThemedText>
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
                
                <TouchableOpacity 
                  style={styles.processButton}
                  onPress={() => handleProcessPayment(bill.id)}
                >
                  <Ionicons name="card" size={14} color={COLORS.primary} />
                  <ThemedText style={styles.processText}>Process</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderDoctors = () => (
    <View style={styles.contentSection}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Doctor Availability</ThemedText>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="refresh" size={16} color={COLORS.muted} />
          <ThemedText style={styles.filterText}>Refresh</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.doctorsGrid}>
        {doctorAvailability.map((doctor, index) => (
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
                styles.availabilityBadge,
                { backgroundColor: doctor.status === 'Available' ? COLORS.success + '20' : COLORS.warning + '20' }
              ]}>
                <View style={[
                  styles.availabilityDot,
                  { backgroundColor: doctor.status === 'Available' ? COLORS.success : COLORS.warning }
                ]} />
                <ThemedText style={[
                  styles.availabilityText,
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
  );

  const renderActiveTabContent = () => {
    switch(activeTab) {
      case "appointments":
        return renderAppointments();
      case "waiting":
        return renderWaitingRoom();
      case "billing":
        return renderBilling();
      case "doctors":
        return renderDoctors();
      default:
        return renderAppointments();
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {renderQuickActions()}
        {renderKPI()}
        {renderTabs()}
        {renderActiveTabContent()}
        
        {/* Statistics Chart */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Hourly Patient Flow</ThemedText>
            <TouchableOpacity>
              <Ionicons name="stats-chart" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
              {[18, 25, 32, 28, 15, 22, 19].map((value, index) => (
                <View key={index} style={styles.chartBarContainer}>
                  <View style={styles.chartBarWrapper}>
                    <View 
                      style={[
                        styles.chartBar, 
                        { 
                          height: value * 2,
                          backgroundColor: value > 25 ? COLORS.primary : COLORS.primaryLight 
                        }
                      ]} 
                    />
                  </View>
                  <ThemedText style={styles.chartLabel}>
                    {["9A", "10A", "11A", "12P", "1P", "2P", "3P"][index]}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

/* ================= MOBILE-OPTIMIZED STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  
  scrollView: {
    flex: 1,
  },
  
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 100 : 80,
  },
  
  /* ===== HEADER ===== */
  header: {
    marginBottom: isSmallScreen ? 16 : 20,
  },
  
  gradientHeader: {
    backgroundColor: COLORS.bannerMid,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  
  greetingSection: {
    flex: 1,
  },
  
  greeting: {
    fontSize: isSmallScreen ? 13 : 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 2,
  },
  
  receptionistName: {
    fontSize: isSmallScreen ? 20 : 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.bannerMid,
  },
  
  notificationCount: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  
  headerBottom: {
    marginBottom: 16,
  },
  
  shiftInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  shiftInfo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginLeft: 6,
  },
  
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginLeft: 6,
  },
  
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 12,
  },
  
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: isSmallScreen ? 22 : 24,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 2,
  },
  
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  
  /* ===== QUICK ACTIONS ===== */
  quickActionsSection: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginBottom: 20,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  
  quickActionsScroll: {
    flexDirection: 'row',
  },
  
  actionCard: {
    alignItems: 'center',
    marginRight: isSmallScreen ? 16 : 20,
    width: 72,
  },
  
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  actionLabel: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  /* ===== KPI CARDS ===== */
  kpiSection: {
    marginBottom: 20,
  },
  
  kpiContainer: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
  },
  
  kpiCard: {
    width: isSmallScreen ? 180 : 200,
    marginRight: 12,
    borderRadius: 16,
    padding: 16,
  },
  
  kpiContent: {
    alignItems: 'flex-start',
  },
  
  kpiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  
  kpiValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  
  kpiLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 8,
  },
  
  kpiTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  kpiTrendText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  
  /* ===== TABS ===== */
  tabsContainer: {
    marginBottom: 20,
  },
  
  tabsContent: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
  },
  
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: COLORS.soft,
  },
  
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
    marginLeft: 6,
  },
  
  activeTabText: {
    color: '#FFFFFF',
  },
  
  /* ===== CONTENT SECTIONS ===== */
  contentSection: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginBottom: 24,
  },
  
  /* ===== APPOINTMENTS ===== */
  appointmentsList: {
    gap: 12,
  },
  
  appointmentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  avatarTextSmall: {
    fontSize: 14,
    fontWeight: '800',
  },
  
  patientDetails: {
    flex: 1,
  },
  
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  
  doctorName: {
    fontSize: 12,
    color: COLORS.muted,
  },
  
  appointmentTime: {
    alignItems: 'flex-end',
  },
  
  timeText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  
  durationText: {
    fontSize: 11,
    color: COLORS.muted,
    backgroundColor: COLORS.soft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  
  appointmentDetails: {
    marginBottom: 12,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  detailText: {
    fontSize: 12,
    color: COLORS.muted,
    marginLeft: 4,
  },
  
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  
  paymentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  
  checkinButton: {
    backgroundColor: COLORS.success + '20',
  },
  
  paymentButton: {
    backgroundColor: COLORS.primary + '20',
  },
  
  disabledButton: {
    opacity: 0.6,
  },
  
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.soft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  
  filterText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  
  /* ===== WAITING ROOM ===== */
  waitingList: {
    gap: 12,
  },
  
  waitingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  waitingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  patientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  patientAge: {
    fontSize: 11,
    color: COLORS.muted,
  },
  
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.muted,
    marginHorizontal: 4,
  },
  
  patientDoctor: {
    fontSize: 11,
    color: COLORS.muted,
  },
  
  waitTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  waitTimeText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '600',
  },
  
  waitingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  appointmentTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  appointmentTimeText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  
  callNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  
  callNextText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  /* ===== BILLING ===== */
  billingList: {
    gap: 12,
  },
  
  billingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  billingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  billingInfo: {
    flex: 1,
  },
  
  billingPatient: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  
  billingService: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  
  billingTime: {
    fontSize: 11,
    color: COLORS.muted,
  },
  
  billingAmount: {},
  
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  
  billingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.soft,
    borderRadius: 8,
    gap: 4,
  },
  
  processText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  processAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  
  processAllText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  /* ===== DOCTORS ===== */
  doctorsGrid: {
    gap: 12,
  },
  
  doctorCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  doctorInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  
  doctorInfo: {
    flex: 1,
  },
  
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  
  doctorSpecialty: {
    fontSize: 12,
    color: COLORS.muted,
  },
  
  doctorStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  availabilityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  
  patientCount: {
    fontSize: 11,
    color: COLORS.muted,
  },
  
  /* ===== CHART ===== */
  chartSection: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginBottom: 24,
  },
  
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  chartBarWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  chartBar: {
    width: isSmallScreen ? 10 : 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  
  chartLabel: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '600',
  },
  
  /* ===== EMPTY STATE ===== */
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: 12,
    marginBottom: 4,
  },
  
  emptyStateSubtext: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
  },
  
  /* ===== GRADIENT CARD ===== */
  gradientCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});