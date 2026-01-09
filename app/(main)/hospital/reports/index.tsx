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

const reportTypes = [
  { name: "Financial Report", icon: "bar-chart", count: "Monthly", color: COLORS.success },
  { name: "Patient Statistics", icon: "people", count: "Daily", color: COLORS.primary },
  { name: "Inventory Report", icon: "cube", count: "Weekly", color: COLORS.warning },
  { name: "Staff Performance", icon: "medkit", count: "Quarterly", color: COLORS.info },
];

const recentReports = [
  { name: "January Revenue Report", date: "2024-01-31", type: "Financial", size: "2.4 MB" },
  { name: "Patient Admission Summary", date: "2024-01-30", type: "Statistics", size: "1.8 MB" },
  { name: "Medication Usage Report", date: "2024-01-29", type: "Inventory", size: "3.2 MB" },
];

export default function ReportsPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Reports</ThemedText>
          <ThemedText style={styles.subtitle}>Analytics & Insights</ThemedText>
        </View>
        <TouchableOpacity style={styles.generateButton}>
          <Ionicons name="download" size={20} color="#fff" />
          <ThemedText style={styles.generateButtonText}>Generate Report</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>48</ThemedText>
          <ThemedText style={styles.statLabel}>Reports This Month</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>12</ThemedText>
          <ThemedText style={styles.statLabel}>Scheduled</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>4</ThemedText>
          <ThemedText style={styles.statLabel}>Categories</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Report Types</ThemedText>
        <View style={styles.reportsGrid}>
          {reportTypes.map((report, idx) => (
            <TouchableOpacity key={idx} style={styles.reportCard}>
              <View style={[styles.reportIcon, { backgroundColor: report.color + "20" }]}>
                <Ionicons name={report.icon as any} size={24} color={report.color} />
              </View>
              <ThemedText style={styles.reportName}>{report.name}</ThemedText>
              <ThemedText style={styles.reportCount}>{report.count}</ThemedText>
            </TouchableOpacity>
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
        <View style={styles.recentCard}>
          {recentReports.map((report, idx) => (
            <View key={idx} style={styles.reportRow}>
              <View style={styles.reportInfo}>
                <ThemedText style={styles.reportTitle}>{report.name}</ThemedText>
                <View style={styles.reportMeta}>
                  <ThemedText style={styles.reportDate}>{report.date}</ThemedText>
                  <View style={styles.reportTypeBadge}>
                    <ThemedText style={styles.reportTypeText}>{report.type}</ThemedText>
                  </View>
                  <ThemedText style={styles.reportSize}>{report.size}</ThemedText>
                </View>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Ionicons name="download-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
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
  generateButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  generateButtonText: { color: "#fff", fontWeight: "600" },
  stats: { paddingHorizontal: 24, flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statNumber: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  reportsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  reportCard: { width: "48%", backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  reportIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  reportName: { fontSize: 14, fontWeight: "600", textAlign: "center", marginBottom: 4 },
  reportCount: { fontSize: 12, color: COLORS.muted },
  recentCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  reportRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 8 },
  reportMeta: { flexDirection: "row", alignItems: "center", gap: 12 },
  reportDate: { fontSize: 12, color: COLORS.muted },
  reportTypeBadge: { backgroundColor: COLORS.border, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  reportTypeText: { fontSize: 10, fontWeight: "600", color: COLORS.muted },
  reportSize: { fontSize: 12, color: COLORS.muted },
  downloadButton: { padding: 8 },
});