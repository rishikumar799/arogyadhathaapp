import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#065F46",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const tests = [
  { name: "Blood Test", pending: 12, completed: 45, color: COLORS.danger },
  { name: "X-Ray", pending: 8, completed: 32, color: COLORS.warning },
  { name: "MRI Scan", pending: 5, completed: 18, color: COLORS.info },
  { name: "Ultrasound", pending: 3, completed: 24, color: COLORS.success },
];

const recentReports = [
  { patient: "John Carter", test: "Complete Blood Count", date: "2024-01-15", status: "Completed" },
  { patient: "Emma Wilson", test: "X-Ray Chest", date: "2024-01-14", status: "Pending" },
  { patient: "Michael Brown", test: "MRI Brain", date: "2024-01-13", status: "Completed" },
];

export default function DiagnosticsPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Diagnostics</ThemedText>
          <ThemedText style={styles.subtitle}>Laboratory & Imaging Services</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>New Test</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>68</ThemedText>
          <ThemedText style={styles.statLabel}>Tests Today</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>28</ThemedText>
          <ThemedText style={styles.statLabel}>Pending Results</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>40</ThemedText>
          <ThemedText style={styles.statLabel}>Completed</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Test Categories</ThemedText>
        <View style={styles.testsGrid}>
          {tests.map((test, idx) => (
            <View key={idx} style={styles.testCard}>
              <View style={[styles.testIcon, { backgroundColor: test.color + "20" }]}>
                <Ionicons name="flask" size={24} color={test.color} />
              </View>
              <ThemedText style={styles.testName}>{test.name}</ThemedText>
              <View style={styles.testStats}>
                <View style={styles.testStat}>
                  <ThemedText style={styles.testStatValue}>{test.pending}</ThemedText>
                  <ThemedText style={styles.testStatLabel}>Pending</ThemedText>
                </View>
                <View style={styles.testStat}>
                  <ThemedText style={styles.testStatValue}>{test.completed}</ThemedText>
                  <ThemedText style={styles.testStatLabel}>Done</ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Reports</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.reportsCard}>
          {recentReports.map((report, idx) => (
            <View key={idx} style={styles.reportRow}>
              <View>
                <ThemedText style={styles.reportPatient}>{report.patient}</ThemedText>
                <ThemedText style={styles.reportTest}>{report.test}</ThemedText>
              </View>
              <View style={styles.reportRight}>
                <ThemedText style={styles.reportDate}>{report.date}</ThemedText>
                <View style={[styles.statusBadge, { 
                  backgroundColor: report.status === 'Completed' ? COLORS.success + '20' : COLORS.warning + '20' 
                }]}>
                  <ThemedText style={[styles.statusText, { 
                    color: report.status === 'Completed' ? COLORS.success : COLORS.warning 
                  }]}>
                    {report.status}
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

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  newButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  newButtonText: { color: "#fff", fontWeight: "600" },
  stats: { paddingHorizontal: 24, flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statNumber: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  testsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  testCard: { width: "48%", backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  testIcon: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  testName: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  testStats: { flexDirection: "row", gap: 12 },
  testStat: { flex: 1 },
  testStatValue: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  testStatLabel: { fontSize: 11, color: COLORS.muted },
  reportsCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  reportRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  reportPatient: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  reportTest: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  reportRight: { alignItems: "flex-end" },
  reportDate: { fontSize: 12, color: COLORS.muted, marginBottom: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: "600" },
});