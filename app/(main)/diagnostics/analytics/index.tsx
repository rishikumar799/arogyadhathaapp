import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";

/* 🌿 AROGYADATHA DIAGNOSTICS COLORS */
const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#10B981",
  primaryDark: "#065F46",
  soft: "#ECFDF5",
  info: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  muted: "#64748B",
  text: "#0F172A",
  border: "#E2E8F0",
};

export default function Analytics() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [timeRange, setTimeRange] = useState("week");
  const [showFilter, setShowFilter] = useState(false);

  /* ================= KEY METRICS ================= */
  const metrics = [
    {
      label: "Tests Processed",
      value: "128",
      change: "+12%",
      icon: "flask",
      color: COLORS.info,
    },
    {
      label: "Revenue",
      value: "₹45,600",
      change: "+8%",
      icon: "cash",
      color: COLORS.success,
    },
    {
      label: "Avg TAT",
      value: "2.4 hrs",
      change: "-0.3h",
      icon: "time",
      color: COLORS.warning,
    },
    {
      label: "Accuracy",
      value: "99.2%",
      change: "+0.4%",
      icon: "checkmark-circle",
      color: COLORS.primary,
    },
  ];

  /* ================= DEPARTMENTS ================= */
  const departments = [
    { name: "Hematology", tests: 42 },
    { name: "Biochemistry", tests: 38 },
    { name: "Microbiology", tests: 28 },
    { name: "Pathology", tests: 20 },
  ];

  /* ================= WEEKLY TREND ================= */
  const weekly = [
    { day: "Mon", tests: 65 },
    { day: "Tue", tests: 48 },
    { day: "Wed", tests: 72 },
    { day: "Thu", tests: 56 },
    { day: "Fri", tests: 85 },
    { day: "Sat", tests: 42 },
    { day: "Sun", tests: 28 },
  ];

  const maxTests = Math.max(...weekly.map((d) => d.tests));

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Analytics</ThemedText>
          <ThemedText style={styles.subtitle}>
            Diagnostics performance overview
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons name="filter" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* TIME RANGE */}
      <View style={styles.rangeRow}>
        {["day", "week", "month"].map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setTimeRange(r)}
            style={[
              styles.rangeBtn,
              timeRange === r && styles.rangeActive,
            ]}
          >
            <ThemedText
              style={[
                styles.rangeText,
                timeRange === r && styles.rangeTextActive,
              ]}
            >
              {r.toUpperCase()}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* METRICS */}
      <View style={styles.metricsGrid}>
        {metrics.map((m, i) => (
          <View key={i} style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: `${m.color}20` }]}>
              <Ionicons name={m.icon as any} size={20} color={m.color} />
            </View>
            <ThemedText style={styles.metricValue}>{m.value}</ThemedText>
            <ThemedText style={styles.metricLabel}>{m.label}</ThemedText>
            <ThemedText style={styles.metricChange}>{m.change}</ThemedText>
          </View>
        ))}
      </View>

      {/* WEEKLY TREND */}
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Weekly Test Volume</ThemedText>

        <View style={styles.chart}>
          {weekly.map((d, i) => (
            <View key={i} style={styles.chartCol}>
              <View
                style={[
                  styles.bar,
                  { height: (d.tests / maxTests) * 140 },
                ]}
              />
              <ThemedText style={styles.chartDay}>{d.day}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* DEPARTMENTS */}
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>
          Department Contribution
        </ThemedText>

        {departments.map((d, i) => (
          <View key={i} style={styles.deptRow}>
            <ThemedText style={styles.deptName}>{d.name}</ThemedText>
            <ThemedText style={styles.deptValue}>{d.tests} tests</ThemedText>
          </View>
        ))}
      </View>

      {/* FILTER MODAL */}
      <Modal visible={showFilter} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ThemedText style={styles.modalTitle}>Filters</ThemedText>

            {["Today", "This Week", "This Month"].map((f) => (
              <TouchableOpacity key={f} style={styles.filterOption}>
                <ThemedText>{f}</ThemedText>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowFilter(false)}
            >
              <ThemedText style={{ color: "#fff" }}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  subtitle: {
    color: COLORS.muted,
    marginTop: 4,
  },
  filterBtn: {
    backgroundColor: COLORS.soft,
    padding: 10,
    borderRadius: 10,
  },

  rangeRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  rangeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.soft,
  },
  rangeActive: {
    backgroundColor: COLORS.primary,
  },
  rangeText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  rangeTextActive: {
    color: "#fff",
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metricCard: {
    width: "47%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.muted,
  },
  metricChange: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.success,
    fontWeight: "700",
  },

  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 160,
  },
  chartCol: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  chartDay: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 6,
  },

  deptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  deptName: {
    fontWeight: "600",
  },
  deptValue: {
    fontWeight: "700",
    color: COLORS.primary,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  filterOption: {
    paddingVertical: 12,
  },
  closeBtn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
});
