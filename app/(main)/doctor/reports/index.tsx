import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const COLORS = {
  bg: "#FFFFFF", primary: "#10B981", text: "#0F172A", textLight: "#334155",
  muted: "#64748B", border: "#E2E8F0", soft: "#ECFDF5",
};

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Reports</ThemedText>
        <ThemedText style={styles.subtitle}>Analytics and insights</ThemedText>
      </View>

      <View style={styles.periodSelector}>
        {["day", "week", "month", "year"].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.activePeriod
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <ThemedText style={[
              styles.periodText,
              selectedPeriod === period && styles.activePeriodText
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
  style={styles.content}
  contentContainerStyle={{ paddingBottom: 120 }}
  showsVerticalScrollIndicator={false}
>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="people" size={24} color={COLORS.primary} />
            </View>
            <ThemedText style={styles.statValue}>1,240</ThemedText>
            <ThemedText style={styles.statLabel}>Consultations</ThemedText>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="document-text" size={24} color="#22C55E" />
            </View>
            <ThemedText style={styles.statValue}>860</ThemedText>
            <ThemedText style={styles.statLabel}>Prescriptions</ThemedText>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="flask" size={24} color="#0EA5E9" />
            </View>
            <ThemedText style={styles.statValue}>320</ThemedText>
            <ThemedText style={styles.statLabel}>Lab Tests</ThemedText>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="cash" size={24} color="#F59E0B" />
            </View>
            <ThemedText style={styles.statValue}>$24,580</ThemedText>
            <ThemedText style={styles.statLabel}>Revenue</ThemedText>
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Weekly Performance</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAll}>Details →</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
              {[
                { day: "Mon", value: 45 },
                { day: "Tue", value: 52 },
                { day: "Wed", value: 48 },
                { day: "Thu", value: 60 },
                { day: "Fri", value: 55 },
                { day: "Sat", value: 40 },
                { day: "Sun", value: 35 },
              ].map((item, index) => (
                <View key={index} style={styles.chartBarContainer}>
                  <View style={styles.chartBarWrapper}>
                    <View 
                      style={[
                        styles.chartBar, 
                        { 
                          height: item.value * 1.5,
                          backgroundColor: item.value > 50 ? COLORS.primary : COLORS.primary + "80" 
                        }
                      ]} 
                    />
                  </View>
                  <ThemedText style={styles.chartLabel}>{item.day}</ThemedText>
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

        <View style={styles.reportsSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Reports</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAll}>View All →</ThemedText>
            </TouchableOpacity>
          </View>

          {[
            { title: "Monthly Revenue Report", date: "Mar 2024", type: "Financial", status: "Generated" },
            { title: "Patient Satisfaction Survey", date: "Feb 2024", type: "Survey", status: "Completed" },
            { title: "Clinical Performance Analysis", date: "Feb 2024", type: "Clinical", status: "In Review" },
            { title: "Medication Compliance Report", date: "Jan 2024", type: "Compliance", status: "Generated" },
          ].map((report, index) => (
            <TouchableOpacity key={index} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={[styles.reportIcon, 
                  { backgroundColor: 
                    report.type === "Financial" ? "#FEF3C7" : 
                    report.type === "Survey" ? "#DBEAFE" : "#D1FAE5"
                  }
                ]}>
                  <Ionicons 
                    name={
                      report.type === "Financial" ? "cash" : 
                      report.type === "Survey" ? "chatbubble" : "stats-chart"
                    } 
                    size={20} 
                    color={
                      report.type === "Financial" ? "#D97706" : 
                      report.type === "Survey" ? "#1D4ED8" : "#059669"
                    } 
                  />
                </View>
                <View style={styles.reportInfo}>
                  <ThemedText style={styles.reportTitle}>{report.title}</ThemedText>
                  <ThemedText style={styles.reportMeta}>{report.date} • {report.type}</ThemedText>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: report.status === "Generated" ? "#D1FAE5" : "#FEF3C7" }
                ]}>
                  <ThemedText style={[
                    styles.statusText,
                    { color: report.status === "Generated" ? "#059669" : "#D97706" }
                  ]}>
                    {report.status}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.reportActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye" size={16} color={COLORS.primary} />
                  <ThemedText style={styles.actionText}>View</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="download" size={16} color={COLORS.primary} />
                  <ThemedText style={styles.actionText}>Download</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share" size={16} color={COLORS.primary} />
                  <ThemedText style={styles.actionText}>Share</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.generateButton}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <ThemedText style={styles.generateButtonText}>Generate Report</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.muted },
  periodSelector: {
    flexDirection: "row", paddingHorizontal: 24,
    paddingVertical: 16, gap: 8
  },
  periodButton: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: COLORS.soft
  },
  activePeriod: { backgroundColor: COLORS.primary },
  periodText: { fontSize: 14, color: COLORS.text, fontWeight: "600" },
  activePeriodText: { color: "#FFFFFF" },
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  statsGrid: { 
    flexDirection: "row", flexWrap: "wrap", 
    gap: 12, marginBottom: 24 
  },
  statCard: {
    width: "47%", backgroundColor: COLORS.soft,
    borderRadius: 16, padding: 16, alignItems: "center"
  },
  statIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#FFFFFF", alignItems: "center",
    justifyContent: "center", marginBottom: 8
  },
  statValue: { fontSize: 24, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: COLORS.muted, textAlign: "center" },
  chartSection: { marginBottom: 24 },
  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 16 
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  viewAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  chartContainer: { backgroundColor: COLORS.soft, borderRadius: 16, padding: 20 },
  chartBars: { 
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-end", height: 150, marginBottom: 20 
  },
  chartBarContainer: { alignItems: "center", flex: 1 },
  chartBarWrapper: { height: 120, justifyContent: "flex-end", alignItems: "center" },
  chartBar: { width: 12, borderRadius: 6, marginBottom: 8 },
  chartLabel: { fontSize: 11, color: COLORS.muted, fontWeight: "600" },
  chartLegend: { flexDirection: "row", justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: COLORS.muted, fontWeight: "600" },
  reportsSection: { marginBottom: 24 },
  reportCard: {
    backgroundColor: COLORS.soft, borderRadius: 16,
    padding: 16, marginBottom: 12
  },
  reportHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  reportIcon: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    marginRight: 12
  },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  reportMeta: { fontSize: 14, color: COLORS.muted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: "700" },
  reportActions: { flexDirection: "row", gap: 12 },
  actionButton: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 10, borderRadius: 8, backgroundColor: "#FFFFFF", gap: 8
  },
  actionText: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  generateButton: {
    position: "absolute", top: 24, right: 24,
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primary, paddingHorizontal: 20,
    paddingVertical: 16, borderRadius: 16, gap: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
  },
  generateButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
});