import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get('window');
const COLORS = {
  primary: "#10B981",
  secondary: "#3B82F6",
  accent: "#8B5CF6",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#10B981",
  text: "#0F172A",
  textLight: "#334155",
  muted: "#64748B",
  border: "#E2E8F0",
  soft: "#ECFDF5",
  bg: "#FFFFFF",
};

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("week");
  const [activeReport, setActiveReport] = useState("sales");

  const REPORT_TYPES = [
    { id: "sales", title: "Sales Report", icon: "cash", color: COLORS.primary },
    { id: "inventory", title: "Inventory Report", icon: "cube", color: COLORS.secondary },
    { id: "prescriptions", title: "Prescriptions", icon: "document-text", color: COLORS.accent },
    { id: "patients", title: "Patient Analytics", icon: "people", color: COLORS.success },
  ];

  const SALES_DATA = {
    week: [45, 52, 48, 60, 55, 70, 65],
    month: [120, 135, 110, 145, 130, 125, 140, 155, 150, 160, 170, 165, 180],
    year: [1200, 1350, 1400, 1300, 1450, 1600, 1550, 1700, 1800, 1750, 1900, 2000],
  };

  const INVENTORY_REPORT = {
    lowStock: 8,
    expiringSoon: 15,
    totalItems: 156,
    totalValue: "$24,580",
  };

  const PRESCRIPTION_STATS = {
    pending: 24,
    processed: 156,
    dispensed: 132,
    averageTime: "15 min",
  };

  const handleGenerateReport = () => {
    Alert.alert("Generate Report", "Generate detailed PDF report?", [
      { text: "Cancel", style: "cancel" },
      { text: "Generate", onPress: () => Alert.alert("Success", "Report generated and saved!") }
    ]);
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Export data to Excel?", [
      { text: "Cancel", style: "cancel" },
      { text: "Export", onPress: () => Alert.alert("Exported", "Data exported successfully!") }
    ]);
  };

  const renderChart = () => {
    const data = SALES_DATA[timeRange];
    const maxValue = Math.max(...data);
    const chartWidth = width - 48;
    const barWidth = (chartWidth - (data.length - 1) * 8) / data.length;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartBars}>
          {data.map((value, index) => (
            <View key={index} style={styles.chartBarContainer}>
              <View style={styles.chartBarWrapper}>
                <View 
                  style={[
                    styles.chartBar, 
                    { 
                      height: (value / maxValue) * 120,
                      backgroundColor: value > maxValue * 0.7 ? COLORS.primary : COLORS.primaryLight 
                    }
                  ]} 
                />
              </View>
              <ThemedText style={styles.chartLabel}>
                {timeRange === 'week' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index] :
                 timeRange === 'month' ? index + 1 :
                 ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSalesReport = () => (
    <View style={styles.reportSection}>
      <View style={styles.timeRangeContainer}>
        {["week", "month", "year"].map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.timeRangeButton, timeRange === range && styles.activeTimeRange]}
            onPress={() => setTimeRange(range)}
          >
            <ThemedText style={[styles.timeRangeText, timeRange === range && styles.activeTimeRangeText]}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {renderChart()}

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>
            ${timeRange === 'week' ? '2,480' : timeRange === 'month' ? '12,450' : '156,800'}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Revenue</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>
            {timeRange === 'week' ? '156' : timeRange === 'month' ? '680' : '8,240'}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Transactions</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={[styles.statValue, { color: COLORS.success }]}>
            {timeRange === 'week' ? '+12%' : timeRange === 'month' ? '+8%' : '+15%'}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Growth</ThemedText>
        </View>
      </View>
    </View>
  );

  const renderInventoryReport = () => (
    <View style={styles.reportSection}>
      <View style={styles.inventoryStats}>
        <View style={styles.inventoryStatCard}>
          <ThemedText style={[styles.inventoryStatValue, { color: COLORS.danger }]}>
            {INVENTORY_REPORT.lowStock}
          </ThemedText>
          <ThemedText style={styles.inventoryStatLabel}>Low Stock Items</ThemedText>
        </View>
        <View style={styles.inventoryStatCard}>
          <ThemedText style={[styles.inventoryStatValue, { color: COLORS.warning }]}>
            {INVENTORY_REPORT.expiringSoon}
          </ThemedText>
          <ThemedText style={styles.inventoryStatLabel}>Expiring Soon</ThemedText>
        </View>
        <View style={styles.inventoryStatCard}>
          <ThemedText style={styles.inventoryStatValue}>
            {INVENTORY_REPORT.totalItems}
          </ThemedText>
          <ThemedText style={styles.inventoryStatLabel}>Total Items</ThemedText>
        </View>
        <View style={styles.inventoryStatCard}>
          <ThemedText style={styles.inventoryStatValue}>
            {INVENTORY_REPORT.totalValue}
          </ThemedText>
          <ThemedText style={styles.inventoryStatLabel}>Total Value</ThemedText>
        </View>
      </View>
    </View>
  );

  const renderPrescriptionReport = () => (
    <View style={styles.reportSection}>
      <View style={styles.prescriptionStats}>
        <View style={styles.prescriptionStatCard}>
          <ThemedText style={[styles.prescriptionStatValue, { color: COLORS.warning }]}>
            {PRESCRIPTION_STATS.pending}
          </ThemedText>
          <ThemedText style={styles.prescriptionStatLabel}>Pending Rx</ThemedText>
        </View>
        <View style={styles.prescriptionStatCard}>
          <ThemedText style={[styles.prescriptionStatValue, { color: COLORS.primary }]}>
            {PRESCRIPTION_STATS.processed}
          </ThemedText>
          <ThemedText style={styles.prescriptionStatLabel}>Processed Today</ThemedText>
        </View>
        <View style={styles.prescriptionStatCard}>
          <ThemedText style={[styles.prescriptionStatValue, { color: COLORS.success }]}>
            {PRESCRIPTION_STATS.dispensed}
          </ThemedText>
          <ThemedText style={styles.prescriptionStatLabel}>Dispensed</ThemedText>
        </View>
        <View style={styles.prescriptionStatCard}>
          <ThemedText style={styles.prescriptionStatValue}>
            {PRESCRIPTION_STATS.averageTime}
          </ThemedText>
          <ThemedText style={styles.prescriptionStatLabel}>Avg Process Time</ThemedText>
        </View>
      </View>
    </View>
  );

  const renderActiveReport = () => {
    switch(activeReport) {
      case "sales":
        return renderSalesReport();
      case "inventory":
        return renderInventoryReport();
      case "prescriptions":
        return renderPrescriptionReport();
      default:
        return renderSalesReport();
    }
  };

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Reports & Analytics</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Insights and performance metrics</ThemedText>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
              <Ionicons name="download" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.printButton} onPress={handleGenerateReport}>
              <Ionicons name="print" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* REPORT TYPES */}
      <View style={styles.reportTypesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reportTypesScroll}>
          {REPORT_TYPES.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={[styles.reportTypeCard, activeReport === report.id && styles.activeReportCard]}
              onPress={() => setActiveReport(report.id)}
            >
              <View style={[styles.reportIcon, { backgroundColor: report.color + '20' }]}>
                <Ionicons name={report.icon as any} size={24} color={report.color} />
              </View>
              <ThemedText style={[styles.reportTypeText, activeReport === report.id && styles.activeReportText]}>
                {report.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ACTIVE REPORT */}
      {renderActiveReport()}

      {/* ACTIONS */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleGenerateReport}>
          <Ionicons name="document-text" size={20} color="#FFFFFF" />
          <ThemedText style={styles.actionButtonText}>Generate Full Report</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]} onPress={handleExportData}>
          <Ionicons name="share" size={20} color={COLORS.primary} />
          <ThemedText style={[styles.actionButtonText, { color: COLORS.primary }]}>Export Data</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 32, color: "#FFFFFF", fontWeight: "800", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.9)" },
  headerActions: { flexDirection: "row", gap: 12 },
  exportButton: { width: 44, height: 44, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  printButton: { width: 44, height: 44, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reportTypesSection: { paddingHorizontal: 24, marginVertical: 20 },
  reportTypesScroll: { flexDirection: "row" },
  reportTypeCard: { alignItems: "center", marginRight: 20, width: 100 },
  activeReportCard: { opacity: 1 },
  reportIcon: { width: 60, height: 60, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  reportTypeText: { fontSize: 12, color: COLORS.muted, fontWeight: "600", textAlign: "center" },
  activeReportText: { color: COLORS.primary, fontWeight: "700" },
  reportSection: { paddingHorizontal: 24, marginBottom: 30 },
  timeRangeContainer: { flexDirection: "row", justifyContent: "center", gap: 12, marginBottom: 20 },
  timeRangeButton: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: COLORS.soft, borderRadius: 12 },
  activeTimeRange: { backgroundColor: COLORS.primary },
  timeRangeText: { fontSize: 14, fontWeight: "600", color: COLORS.muted },
  activeTimeRangeText: { color: "#FFFFFF" },
  chartContainer: { backgroundColor: COLORS.bg, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
  chartBars: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 150 },
  chartBarContainer: { alignItems: "center", flex: 1 },
  chartBarWrapper: { height: 120, justifyContent: "flex-end", alignItems: "center" },
  chartBar: { width: 12, borderRadius: 6, marginBottom: 8 },
  chartLabel: { fontSize: 11, color: COLORS.muted, fontWeight: "600" },
  statsGrid: { flexDirection: "row", gap: 12 },
  statItem: { flex: 1, backgroundColor: COLORS.soft, padding: 16, borderRadius: 16, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "800", color: COLORS.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: COLORS.muted, fontWeight: "600", textAlign: "center" },
  inventoryStats: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  inventoryStatCard: { width: (width - 72) / 2, backgroundColor: COLORS.soft, padding: 16, borderRadius: 16, alignItems: "center" },
  inventoryStatValue: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  inventoryStatLabel: { fontSize: 12, color: COLORS.muted, fontWeight: "600", textAlign: "center" },
  prescriptionStats: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  prescriptionStatCard: { width: (width - 72) / 2, backgroundColor: COLORS.soft, padding: 16, borderRadius: 16, alignItems: "center" },
  prescriptionStatValue: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  prescriptionStatLabel: { fontSize: 12, color: COLORS.muted, fontWeight: "600", textAlign: "center" },
  actionsSection: { paddingHorizontal: 24, marginBottom: 40, gap: 12 },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, gap: 8 },
  secondaryAction: { backgroundColor: COLORS.soft },
  actionButtonText: { fontSize: 16, color: "#FFFFFF", fontWeight: "600" },
});