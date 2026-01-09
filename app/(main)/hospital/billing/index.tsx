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

const recentBills = [
  { id: "INV-001", patient: "John Carter", amount: "₹4,250", date: "2024-01-15", status: "Paid" },
  { id: "INV-002", patient: "Emma Wilson", amount: "₹8,750", date: "2024-01-14", status: "Pending" },
  { id: "INV-003", patient: "Michael Brown", amount: "₹12,500", date: "2024-01-13", status: "Paid" },
  { id: "INV-004", patient: "Sophia Garcia", amount: "₹6,300", date: "2024-01-12", status: "Partial" },
];

const pendingPayments = [
  { patient: "David Chen", amount: "₹5,800", days: 15 },
  { patient: "Olivia Taylor", amount: "₹3,200", days: 7 },
  { patient: "William Johnson", amount: "₹9,500", days: 30 },
];

export default function BillingPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Billing</ThemedText>
          <ThemedText style={styles.subtitle}>Financial Transactions</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>New Invoice</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>₹1,42,800</ThemedText>
          <ThemedText style={styles.statLabel}>Revenue Today</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>₹24,500</ThemedText>
          <ThemedText style={styles.statLabel}>Pending</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>68</ThemedText>
          <ThemedText style={styles.statLabel}>Invoices</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Bills</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.billsCard}>
          {recentBills.map((bill, idx) => (
            <View key={idx} style={styles.billRow}>
              <View style={styles.billInfo}>
                <ThemedText style={styles.billId}>{bill.id}</ThemedText>
                <ThemedText style={styles.billPatient}>{bill.patient}</ThemedText>
                <ThemedText style={styles.billDate}>{bill.date}</ThemedText>
              </View>
              <View style={styles.billRight}>
                <ThemedText style={styles.billAmount}>{bill.amount}</ThemedText>
                <View style={[styles.statusBadge, { 
                  backgroundColor: bill.status === 'Paid' ? COLORS.success + '20' : 
                                  bill.status === 'Partial' ? COLORS.warning + '20' : COLORS.danger + '20' 
                }]}>
                  <ThemedText style={[styles.statusText, { 
                    color: bill.status === 'Paid' ? COLORS.success : 
                           bill.status === 'Partial' ? COLORS.warning : COLORS.danger 
                  }]}>
                    {bill.status}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Pending Payments</ThemedText>
        <View style={styles.pendingCard}>
          {pendingPayments.map((payment, idx) => (
            <View key={idx} style={styles.paymentRow}>
              <View>
                <ThemedText style={styles.paymentPatient}>{payment.patient}</ThemedText>
                <ThemedText style={styles.paymentDays}>{payment.days} days overdue</ThemedText>
              </View>
              <View style={styles.paymentRight}>
                <ThemedText style={styles.paymentAmount}>{payment.amount}</ThemedText>
                <TouchableOpacity style={styles.remindButton}>
                  <Ionicons name="notifications" size={16} color={COLORS.primary} />
                  <ThemedText style={styles.remindText}>Remind</ThemedText>
                </TouchableOpacity>
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
  billsCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  billRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  billInfo: { flex: 1 },
  billId: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  billPatient: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  billDate: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  billRight: { alignItems: "flex-end" },
  billAmount: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: "600" },
  pendingCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  paymentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  paymentPatient: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  paymentDays: { fontSize: 12, color: COLORS.danger, marginTop: 2 },
  paymentRight: { alignItems: "flex-end" },
  paymentAmount: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  remindButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  remindText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
});