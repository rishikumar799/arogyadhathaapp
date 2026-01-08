import { ThemedText } from "@/components/themed-text";
import { loadSession } from "@/lib/authPersist";
import { db } from "@/lib/firebaseConfig";
import { loadWebSession } from "@/lib/webPersist";
import { doc, onSnapshot } from "firebase/firestore";

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, View, } from "react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375;

/* 🎨 DIAGNOSTICS BLUE-GREEN THEME */
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
  chartPurple: "#8B5CF6",
};

/* ⚡ DIAGNOSTICS QUICK ACTIONS */
const QUICK_ACTIONS = [
  { label: "New Test", icon: "add-circle", bg: COLORS.primary },
  { label: "Test Results", icon: "document-text", bg: COLORS.secondary },
  { label: "Sample Entry", icon: "water", bg: COLORS.accent },
  { label: "Lab Reports", icon: "reader", bg: COLORS.info },
  { label: "Equipment", icon: "hardware-chip", bg: COLORS.success },
  { label: "Inventory", icon: "cube", bg: COLORS.warning },
  { label: "Quality Check", icon: "shield-checkmark", bg: COLORS.chartPurple },
  { label: "Billing", icon: "cash", bg: "#EC4899" },
];

/* 📊 DIAGNOSTICS KPI DATA */
const KPI_DATA = [
  { label: "Tests Today", value: "148", icon: "flask", change: "+18%", subLabel: "32 pending", trend: "up", gradient: ["#0EA5E9", "#38BDF8"] },
  { label: "Critical Results", value: "7", icon: "alert-circle", change: "+2", subLabel: "Require attention", trend: "up", gradient: ["#EF4444", "#F87171"] },
  { label: "Avg TAT", value: "2.4 hrs", icon: "time", change: "-0.3 hrs", subLabel: "Turnaround time", trend: "down", gradient: ["#10B981", "#34D399"] },
  { label: "Equipment Uptime", value: "98.7%", icon: "hardware-chip", change: "+0.4%", subLabel: "All systems operational", trend: "up", gradient: ["#8B5CF6", "#A78BFA"] },
];

/* 🧪 TEST CATEGORIES */
const TEST_CATEGORIES = [
  { title: "Hematology", value: "64", icon: "water", trend: "up", color: COLORS.primary, pending: 12 },
  { title: "Biochemistry", value: "42", icon: "flask", trend: "up", color: COLORS.secondary, pending: 8 },
  { title: "Microbiology", value: "23", icon: "bug", trend: "stable", color: COLORS.success, pending: 5 },
  { title: "Pathology", value: "18", icon: "medkit", trend: "up", color: COLORS.accent, pending: 3 },
  { title: "Immunology", value: "15", icon: "shield", trend: "down", color: COLORS.info, pending: 2 }, 
  { title: "Molecular", value: "9", icon: "code-slash", trend: "up", color: COLORS.warning, pending: 1 },
];

/* 📋 TODAY'S TEST QUEUE */
const TODAY_TESTS = [
  { id: "1", patient: "John Carter", test: "CBC + ESR", time: "09:30 AM", status: "sample_collected", priority: "normal", lab: "Hematology", tat: "1 hr", color: COLORS.primary }, 
  { id: "2", patient: "Emily Stone", test: "Lipid Profile", time: "10:15 AM", status: "processing", priority: "urgent", lab: "Biochemistry", tat: "2 hrs", color: COLORS.secondary }, 
  { id: "3", patient: "Michael Ross", test: "Culture & Sensitivity", time: "11:45 AM", status: "pending", priority: "normal", lab: "Microbiology", tat: "48 hrs", color: COLORS.success }, 
  { id: "4", patient: "Sarah Johnson", test: "Tumor Markers", time: "02:30 PM", status: "sample_collected", priority: "high", lab: "Immunology", tat: "4 hrs", color: COLORS.info },
];

/* ⚠️ CRITICAL RESULTS */
const CRITICAL_RESULTS = [
  { patient: "Robert Chen", test: "Troponin I", value: "4.2 ng/mL", normalRange: "<0.04 ng/mL", time: "1 hour ago", color: COLORS.danger, initials: "RC" },
   { patient: "Maria Garcia", test: "WBC Count", value: "22.4 x10³/μL", normalRange: "4.0-11.0", time: "2 hours ago", color: COLORS.warning, initials: "MG" }, 
   { patient: "James Wilson", test: "Creatinine", value: "3.8 mg/dL", normalRange: "0.6-1.2", time: "3 hours ago", color: COLORS.danger, initials: "JW" }, 
  ]; /* 🛠️ EQUIPMENT STATUS */ 
  const EQUIPMENT_STATUS = [ 
    { name: "Auto Analyzer", status: "operational", uptime: "99.2%", lastMaintenance: "2 days ago", color: COLORS.success }, 
    { name: "Hematology Analyzer", status: "maintenance", uptime: "98.7%", lastMaintenance: "In progress", color: COLORS.warning }, 
    { name: "PCR Machine", status: "operational", uptime: "99.5%", lastMaintenance: "1 week ago", color: COLORS.success },
];

/* 📈 DAILY STATS CHART */
const STATS_CHART = [
  { hour: "8 AM", value: 42 }, { hour: "10 AM", value: 68 }, { hour: "12 PM", value: 85 }, { hour: "2 PM", value: 74 }, { hour: "4 PM", value: 52 }, { hour: "6 PM", value: 38 },
];

export default function DiagnosticsDashboard() {
  const [labName, setLabName] = useState("");
  const [labType, setLabType] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let unsub: (() => void) | undefined;

  (async () => {
    const session =
      Platform.OS === "web"
        ? loadWebSession()
        : await loadSession();

    console.log("SESSION:", session);

    // ⚡ FAST FALLBACK (optional)
    if (session?.name) setLabName(session.name);
    if (session?.labName) setLabType(session.labName);

    // 🔥 REAL SOURCE OF TRUTH — FIRESTORE
    if (session?.uid) {
      const ref = doc(db, "diagnostics", session.uid);

      unsub = onSnapshot(ref, (snap) => {
        console.log("SNAPSHOT:", snap.data());

        if (snap.exists()) {
          const data = snap.data();
          if (data?.name) setLabName(data.name);
          if (data?.labName) setLabType(data.labName);
        }
      });
    }

    setLoading(false);
  })();

  return () => {
    if (unsub) unsub();
  };
}, []);



  /* 🔹 RENDER COMPONENTS */
  const renderKpi = ({ item }) => (
    <View style={[styles.kpiCard, { backgroundColor: item.gradient[0] }]}>
      <View style={styles.kpiHeader}>
        <View style={styles.kpiIcon}>
          <Ionicons name={item.icon} size={22} color="#FFFFFF" />
        </View>
        <View style={[styles.trendBadge, { backgroundColor: item.trend === "up" ? "rgba(255,255,255,0.2)" : "rgba(239,68,68,0.2)" }]}>
          <Ionicons name={item.trend === "up" ? "trending-up" : "trending-down"} size={10} color="#FFFFFF" />
          <ThemedText style={styles.trendText}>{item.change}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.kpiValue}>{item.value}</ThemedText>
      <ThemedText style={styles.kpiLabel}>{item.label}</ThemedText>
      <ThemedText style={styles.kpiSubLabel}>{item.subLabel}</ThemedText>
    </View>
  );

  const renderTestCategory = ({ item }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={18} color={item.color} />
        </View>
        <ThemedText style={styles.categoryValue}>{item.value}</ThemedText>
      </View>
      <ThemedText style={styles.categoryTitle}>{item.title}</ThemedText>
      <View style={styles.categoryFooter}>
        <View style={styles.pendingBadge}>
          <ThemedText style={styles.pendingText}>{item.pending} pending</ThemedText>
        </View>
        <Ionicons 
          name={item.trend === 'up' ? "arrow-up" : item.trend === 'down' ? "arrow-down" : "remove"} 
          size={12} 
          color={item.trend === 'up' ? COLORS.success : item.trend === 'down' ? COLORS.danger : COLORS.muted} 
        />
      </View>
    </View>
  );

  const renderTest = ({ item }) => (
    <TouchableOpacity style={styles.testCard}>
      <View style={styles.testHeader}>
        <View style={[styles.patientAvatar, { backgroundColor: item.color + '20' }]}>
          <ThemedText style={[styles.avatarText, { color: item.color }]}>
            {item.patient.split(' ').map(n => n[0]).join('')}
          </ThemedText>
        </View>
        <View style={styles.testInfo}>
          <ThemedText style={styles.patientName}>{item.patient}</ThemedText>
          <ThemedText style={styles.testName}>{item.test}</ThemedText>
        </View>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: item.priority === 'urgent' ? '#FEE2E2' : item.priority === 'high' ? '#FEF3C7' : COLORS.soft }
        ]}>
          <ThemedText style={[
            styles.priorityText,
            { color: item.priority === 'urgent' ? '#DC2626' : item.priority === 'high' ? '#D97706' : COLORS.primary }
          ]}>
            {item.priority}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.testDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={12} color={COLORS.muted} />
          <ThemedText style={styles.detailText}>{item.time}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="business" size={12} color={COLORS.muted} />
          <ThemedText style={styles.detailText}>{item.lab}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="hourglass" size={12} color={COLORS.muted} />
          <ThemedText style={styles.detailText}>{item.tat}</ThemedText>
        </View>
      </View>
      
      <View style={[
        styles.statusBar,
        { backgroundColor: 
          item.status === 'processing' ? '#FEF3C7' : 
          item.status === 'sample_collected' ? '#ECFDF5' : 
          '#F1F5F9'
        }
      ]}>
        <View style={[
          styles.statusDot,
          { backgroundColor: 
            item.status === 'processing' ? COLORS.warning : 
            item.status === 'sample_collected' ? COLORS.primary : 
            COLORS.muted
          }
        ]} />
        <ThemedText style={styles.statusText}>
          {item.status === 'processing' ? 'Processing' : 
           item.status === 'sample_collected' ? 'Sample Collected' : 'Pending'}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const renderCriticalResult = ({ item }) => (
    <View style={styles.criticalCard}>
      <View style={styles.criticalHeader}>
        <View style={[styles.patientAvatar, { backgroundColor: item.color + '20' }]}>
          <ThemedText style={[styles.avatarText, { color: item.color }]}>{item.initials}</ThemedText>
        </View>
        <View style={styles.criticalInfo}>
          <ThemedText style={styles.patientName}>{item.patient}</ThemedText>
          <ThemedText style={styles.criticalTest}>{item.test}</ThemedText>
        </View>
        <ThemedText style={styles.criticalTime}>{item.time}</ThemedText>
      </View>
      
      <View style={styles.resultDetails}>
        <View style={styles.valueContainer}>
          <ThemedText style={styles.resultValue}>{item.value}</ThemedText>
          <ThemedText style={styles.resultLabel}>Current Value</ThemedText>
        </View>
        <View style={styles.valueContainer}>
          <ThemedText style={styles.normalValue}>{item.normalRange}</ThemedText>
          <ThemedText style={styles.resultLabel}>Normal Range</ThemedText>
        </View>
      </View>
      
      <TouchableOpacity style={styles.actionButton}>
        <ThemedText style={styles.actionText}>Notify Doctor</ThemedText>
        <Ionicons name="notifications" size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderEquipment = ({ item }) => (
    <View style={styles.equipmentCard}>
      <View style={styles.equipmentHeader}>
        <View style={[styles.equipmentIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name="hardware-chip" size={20} color={item.color} />
        </View>
        <View style={styles.equipmentInfo}>
          <ThemedText style={styles.equipmentName}>{item.name}</ThemedText>
          <ThemedText style={styles.equipmentStatus}>{item.status}</ThemedText>
        </View>
        <ThemedText style={styles.uptimeText}>{item.uptime}</ThemedText>
      </View>
      <View style={styles.maintenanceInfo}>
        <Ionicons name="calendar" size={12} color={COLORS.muted} />
        <ThemedText style={styles.maintenanceText}>Last: {item.lastMaintenance}</ThemedText>
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
              backgroundColor: item.value > 60 ? COLORS.primary : COLORS.primaryLight 
            }
          ]} 
        />
      </View>
      <ThemedText style={styles.chartLabel}>{item.hour}</ThemedText>
    </View>
  );

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* 🧠 DIAGNOSTICS HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.greeting}>
              {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"}
            </ThemedText>
            <ThemedText style={styles.labName}>
              {loading ? "Loading…" : labName || "Arogyadatha Diagnostics"}
            </ThemedText>
            {!loading && labType && <ThemedText style={styles.labType}>{labType}</ThemedText>}
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statBadge}>
              <ThemedText style={styles.statValue}>148</ThemedText>
              <ThemedText style={styles.statLabel}>Today</ThemedText>
            </View>
            <View style={styles.statBadge}>
              <ThemedText style={styles.statValue}>842</ThemedText>
              <ThemedText style={styles.statLabel}>Week</ThemedText>
            </View>
          </View>
        </View>
        <ThemedText style={styles.date}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </ThemedText>
      </View>

      {/* ⚡ QUICK ACTIONS */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.viewAll}>All →</ThemedText>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
          {QUICK_ACTIONS.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon} size={24} color="#FFFFFF" />
              </View>
              <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 📊 LAB OVERVIEW KPI */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Lab Overview</ThemedText>
        <FlatList
          data={KPI_DATA}
          renderItem={renderKpi}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kpiList}
        />
      </View>

      {/* 🧪 TEST CATEGORIES */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Test Categories</ThemedText>
          <TouchableOpacity style={styles.filterButton}>
            <ThemedText style={styles.filterText}>Today</ThemedText>
            <Ionicons name="chevron-down" size={12} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
        <View style={styles.categoriesGrid}>
          {TEST_CATEGORIES.map((category, index) => renderTestCategory({ item: category }))}
        </View>
      </View>

      {/* 📋 TODAY'S TEST QUEUE */}
      <View style={styles.section}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <ThemedText style={styles.cardTitle}>Today's Test Queue</ThemedText>
            <View style={styles.queueBadge}>
              <ThemedText style={styles.queueCount}>{TODAY_TESTS.length}</ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.viewAllButton}> <ThemedText style={styles.viewAllText}>All</ThemedText> <Ionicons name="arrow-forward" size={12} color={COLORS.primary} /> </TouchableOpacity>
        </View>
        <FlatList data={TODAY_TESTS} renderItem={renderTest} keyExtractor={(item) => item.id} scrollEnabled={false} contentContainerStyle={styles.testsList} />
      </View>

      {/* ⚠️ CRITICAL RESULTS */}
      <View style={styles.section}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Critical Results</ThemedText>
          <View style={styles.criticalBadge}> <ThemedText style={styles.criticalCount}>{CRITICAL_RESULTS.length}</ThemedText> </View>
        </View>
        <FlatList data={CRITICAL_RESULTS} renderItem={renderCriticalResult} keyExtractor={(item, index) => index.toString()} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.criticalList} />
      </View>

      {/* 📈 DAILY STATISTICS */}
      <View style={styles.section}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Daily Statistics</ThemedText>
          <TouchableOpacity>
            <Ionicons name="stats-chart" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}> {STATS_CHART.map((hour, index) => renderChartBar({ item: hour, index }))} </View>
          <View style={styles.chartLegend}> <View style={styles.legendItem}> <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} /> <ThemedText style={styles.legendText}>Tests Processed</ThemedText> </View> </View>
        </View>
      </View>

      {/* 🛠️ EQUIPMENT STATUS */}
      <View style={styles.section}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Equipment Status</ThemedText>
          <TouchableOpacity>
            <Ionicons name="refresh" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <FlatList data={EQUIPMENT_STATUS} renderItem={renderEquipment} keyExtractor={(item, index) => index.toString()} scrollEnabled={false} contentContainerStyle={styles.equipmentList} />
      </View>
    </ScrollView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 120 },

  // 🧠 HEADER
  header: { backgroundColor: COLORS.bannerMid, paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, },
  headerLeft: { flex: 1, marginRight: 12 },
  greeting: { color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: "500", marginBottom: 4 },
  labName: { color: "#FFFFFF", fontSize: 28, fontWeight: "800", marginBottom: 4 },
  labType: { color: "rgba(255,255,255,0.8)", fontSize: 16, fontWeight: "600" },
  headerStats: { flexDirection: "row", gap: 8 },
  statBadge: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, minWidth: 70, },
  statValue: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 2 },
  statLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600" },
  date: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: "500" },

  // 📁 SECTIONS
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text, letterSpacing: -0.5 },
  viewAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  filterButton: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.soft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 4, },
  filterText: { fontSize: 13, color: COLORS.text, fontWeight: "500" },

  // ⚡ QUICK ACTIONS
  actionsScroll: { paddingRight: 20 },
  actionCard: { alignItems: "center", marginRight: 20, width: 80 },
  actionIcon: { width: 60, height: 60, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4, },
  actionLabel: { fontSize: 12, color: COLORS.text, fontWeight: "600", textAlign: "center" },

  // 📊 KPI CARDS
  kpiList: { paddingRight: 20 },
  kpiCard: { borderRadius: 16, padding: 20, width: width * 0.75, marginRight: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, },
  kpiHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  kpiIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", },
  trendBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, gap: 4 },
  trendText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
  kpiValue: { fontSize: 32, fontWeight: "800", color: "#FFFFFF", marginBottom: 4 },
  kpiLabel: { fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: "600", marginBottom: 4 },
  kpiSubLabel: { fontSize: 12, color: "rgba(255,255,255,0.7)" },

  // 🧪 TEST CATEGORIES
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  categoryCard: { width: isSmallScreen ? "48%" : "31%", backgroundColor: COLORS.card, borderRadius: 14, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", },
  categoryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  categoryIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  categoryValue: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  categoryTitle: { fontSize: 13, color: COLORS.text, fontWeight: "700", marginBottom: 8 },
  categoryFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pendingBadge: { backgroundColor: COLORS.soft, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  pendingText: { fontSize: 10, color: COLORS.primary, fontWeight: "600" },

  // 📋 CARD HEADERS
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text, letterSpacing: -0.3 },
  queueBadge: { backgroundColor: COLORS.primary, width: 28, height: 28, borderRadius: 12, alignItems: "center", justifyContent: "center", shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, },
  queueCount: { fontSize: 13, color: "#FFFFFF", fontWeight: "800" },
  viewAllButton: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.soft, borderRadius: 8, },
  viewAllText: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },

  // 📋 TODAY'S TESTS
  testsList: { gap: 12 },
  testCard: { backgroundColor: COLORS.soft, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border, },
  testHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  patientAvatar: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12, },
  avatarText: { fontSize: 16, fontWeight: "800" },
  testInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  testName: { fontSize: 13, color: COLORS.muted },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priorityText: { fontSize: 12, fontWeight: "700" },
  testDetails: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  detailText: { fontSize: 12, color: COLORS.muted, fontWeight: "600" },
  statusBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6, },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: "700", color: COLORS.text },

  // ⚠️ CRITICAL RESULTS
  criticalBadge: { backgroundColor: COLORS.danger, width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", },
  criticalCount: { fontSize: 13, color: "#FFFFFF", fontWeight: "800" },
  criticalList: { gap: 12, paddingRight: 20 },
  criticalCard: { backgroundColor: "#FEF2F2", borderRadius: 16, padding: 16, width: width * 0.85, marginRight: 12, borderWidth: 1, borderColor: "#FECACA", },
  criticalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  criticalInfo: { flex: 1, marginLeft: 12 },
  criticalTest: { fontSize: 13, color: COLORS.textLight, fontWeight: "600" },
  criticalTime: { fontSize: 12, color: COLORS.muted, fontWeight: "600" },
  resultDetails: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  valueContainer: { alignItems: "center" },
  resultValue: { fontSize: 24, fontWeight: "800", color: COLORS.danger, marginBottom: 4 },
  normalValue: { fontSize: 18, fontWeight: "700", color: COLORS.success, marginBottom: 4 },
  resultLabel: { fontSize: 11, color: COLORS.muted, fontWeight: "600" },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.danger, paddingVertical: 10, borderRadius: 10, gap: 8, },
  actionText: { fontSize: 14, color: "#FFFFFF", fontWeight: "700" },

  // 📈 CHART
  chartContainer: { paddingTop: 10 },
  chartBars: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: isSmallScreen ? 120 : 140, marginBottom: 16, },
  chartBarContainer: { alignItems: "center", flex: 1 },
  chartBarWrapper: { height: isSmallScreen ? 90 : 110, justifyContent: "flex-end", alignItems: "center" },
  chartBar: { width: isSmallScreen ? 8 : 10, borderRadius: 4, marginBottom: 6 },
  chartLabel: { fontSize: isSmallScreen ? 10 : 11, color: COLORS.muted, fontWeight: "600" },
  chartLegend: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: isSmallScreen ? 8 : 10, height: isSmallScreen ? 8 : 10, borderRadius: 5 },
  legendText: { fontSize: isSmallScreen ? 11 : 12, color: COLORS.muted, fontWeight: "600" },

  // 🛠️ EQUIPMENT
  equipmentList: { gap: 12 },  equipmentCard: {    backgroundColor: COLORS.card,    borderRadius: 16,    padding: 16,    borderWidth: 1,    borderColor: COLORS.border,  },
  equipmentHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  equipmentIcon: {    width: 44,    height: 44,    borderRadius: 12,    alignItems: "center",    justifyContent: "center",    marginRight: 12,  },
  equipmentInfo: { flex: 1 },
  equipmentName: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  equipmentStatus: { fontSize: 13, color: COLORS.muted },
  uptimeText: { fontSize: 16, fontWeight: "800", color: COLORS.success },
  maintenanceInfo: { flexDirection: "row", alignItems: "center", gap: 4 },
  maintenanceText: { fontSize: 12, color: COLORS.muted, fontWeight: "600" },
});