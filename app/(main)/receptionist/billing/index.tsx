import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= COLORS (GREEN THEME) ================= */

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#10B981",
  primaryLight: "#34D399",
  primaryDark: "#065F46",
  soft: "#ECFDF5",
  warning: "#F59E0B",
  success: "#10B981",
  danger: "#EF4444",
  muted: "#64748B",
  text: "#0F172A",
  border: "#E2E8F0",
};

/* ================= MOCK DATA ================= */

const BILLS = [
  {
    id: "INV-001",
    patient: "John Carter",
    date: "Today",
    amount: 2500,
    status: "paid",
    items: ["Consultation", "Blood Test"],
    paymentMethod: "Cash",
  },
  {
    id: "INV-002",
    patient: "Emily Johnson",
    date: "Today",
    amount: 1800,
    status: "pending",
    items: ["X-Ray", "Medication"],
    paymentMethod: "Card",
  },
  {
    id: "INV-003",
    patient: "Robert Chen",
    date: "Yesterday",
    amount: 4200,
    status: "paid",
    items: ["MRI Scan", "Consultation"],
    paymentMethod: "Insurance",
  },
  {
    id: "INV-004",
    patient: "Sarah Williams",
    date: "Yesterday",
    amount: 1200,
    status: "overdue",
    items: ["Blood Test"],
    paymentMethod: "Cash",
  },
];

/* ================= COMPONENT ================= */

export default function Billing() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredBills = useMemo(() => {
    return BILLS.filter((bill) => {
      const matchesSearch =
        bill.patient.toLowerCase().includes(search.toLowerCase()) ||
        bill.id.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || bill.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const stats = useMemo(() => {
    return {
      revenue: BILLS.filter(b => b.status === "paid").reduce((s, b) => s + b.amount, 0),
      pending: BILLS.filter(b => b.status === "pending").reduce((s, b) => s + b.amount, 0),
      overdue: BILLS.filter(b => b.status === "overdue").reduce((s, b) => s + b.amount, 0),
    };
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "paid") return COLORS.success;
    if (status === "pending") return COLORS.warning;
    if (status === "overdue") return COLORS.danger;
    return COLORS.muted;
  };

  return (
    <View style={styles.page}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Billing</ThemedText>
        <ThemedText style={styles.subtitle}>Invoices & Payments</ThemedText>
      </View>

      {/* ===== CONTENT ===== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ===== STATS ===== */}
        <View style={styles.statsRow}>
          <StatCard
            label="Revenue"
            value={`₹${stats.revenue}`}
            icon="cash"
            color={COLORS.success}
          />
          <StatCard
            label="Pending"
            value={`₹${stats.pending}`}
            icon="time"
            color={COLORS.warning}
          />
          <StatCard
            label="Overdue"
            value={`₹${stats.overdue}`}
            icon="alert-circle"
            color={COLORS.danger}
          />
        </View>

        {/* ===== SEARCH ===== */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search invoice or patient"
            style={styles.searchInput}
          />
        </View>

        {/* ===== FILTERS ===== */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
          {["all", "paid", "pending", "overdue"].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterChip,
                filter === f && styles.filterActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f.toUpperCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ===== BILL LIST ===== */}
        <View style={{ marginTop: 16 }}>
          {filteredBills.map((bill) => {
            const color = getStatusColor(bill.status);
            return (
              <View key={bill.id} style={styles.billCard}>
                <View style={styles.billHeader}>
                  <View>
                    <ThemedText style={styles.billId}>{bill.id}</ThemedText>
                    <ThemedText style={styles.patient}>{bill.patient}</ThemedText>
                  </View>
                  <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
                    <ThemedText style={[styles.badgeText, { color }]}>
                      {bill.status.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.items}>
                  {bill.items.join(", ")}
                </ThemedText>

                <View style={styles.billFooter}>
                  <ThemedText style={styles.amount}>₹{bill.amount}</ThemedText>
                  {bill.status === "pending" && (
                    <TouchableOpacity style={styles.payBtn}>
                      <ThemedText style={styles.payText}>Mark Paid</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {filteredBills.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="document-text" size={42} color={COLORS.border} />
              <ThemedText style={styles.emptyText}>No invoices found</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= SMALL COMPONENT ================= */

function StatCard({ label, value, icon, color }: any) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingTop: 44,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primaryDark,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#FFF" },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.85)" },

  content: { padding: 20, paddingBottom: 140 },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.muted },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: { marginLeft: 10, flex: 1 },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.soft,
    marginRight: 8,
  },
  filterActive: { backgroundColor: COLORS.primaryDark },
  filterText: { fontSize: 12, fontWeight: "700", color: COLORS.primary },
  filterTextActive: { color: "#FFF" },

  billCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  billHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billId: { fontSize: 13, color: COLORS.muted, fontWeight: "700" },
  patient: { fontSize: 17, fontWeight: "800" },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },

  items: {
    fontSize: 13,
    color: COLORS.text,
    fontStyle: "italic",
    marginBottom: 10,
  },

  billFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: { fontSize: 20, fontWeight: "800", color: COLORS.primary },
  payBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payText: { color: "#FFF", fontSize: 12, fontWeight: "700" },

  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { marginTop: 12, color: COLORS.muted },
});
