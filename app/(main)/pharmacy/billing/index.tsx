import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const COLORS = {
  primary: "#065f46",
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

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const BILLING_DATA = {
    pending: [
      { id: "1", patient: "John Carter", amount: "$125.50", date: "Today", items: 3, status: "Pending", type: "Prescription" },
      { id: "2", patient: "Emily Stone", amount: "$89.75", date: "Today", items: 2, status: "Pending", type: "Consultation" },
      { id: "3", patient: "Michael Ross", amount: "$245.00", date: "Yesterday", items: 5, status: "Pending", type: "Prescription" },
    ],
    paid: [
      { id: "4", patient: "Sarah Johnson", amount: "$65.25", date: "Today", items: 1, status: "Paid", type: "Prescription" },
      { id: "5", patient: "David Brown", amount: "$189.50", date: "Yesterday", items: 4, status: "Paid", type: "Prescription" },
    ],
    overdue: [
      { id: "6", patient: "Lisa Taylor", amount: "$325.75", date: "5 days ago", items: 6, status: "Overdue", type: "Consultation" },
      { id: "7", patient: "Robert Chen", amount: "$98.25", date: "1 week ago", items: 2, status: "Overdue", type: "Prescription" },
    ]
  };

  const TODAY_SALES = [
    { time: "09:30 AM", patient: "John Carter", amount: "$125.50", method: "Credit Card" },
    { time: "11:15 AM", patient: "Emily Stone", amount: "$89.75", method: "Cash" },
    { time: "02:45 PM", patient: "Sarah Johnson", amount: "$65.25", method: "Insurance" },
    { time: "04:20 PM", patient: "Mike Wilson", amount: "$210.00", method: "Credit Card" },
  ];

  const handleProcessPayment = (invoice) => {
    Alert.alert("Process Payment", `Process payment of ${invoice.amount} from ${invoice.patient}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Process", onPress: () => Alert.alert("Success", `Payment of ${invoice.amount} processed!`) }
    ]);
  };

  const handleSendReminder = (invoice) => {
    Alert.alert("Send Reminder", `Send payment reminder to ${invoice.patient}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Send", onPress: () => Alert.alert("Sent", `Reminder sent to ${invoice.patient}`) }
    ]);
  };

  const renderInvoiceCard = (item) => (
    <View key={item.id} style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <View>
          <ThemedText style={styles.patientName}>{item.patient}</ThemedText>
          <View style={styles.invoiceDetails}>
            <ThemedText style={styles.dateText}>{item.date}</ThemedText>
            <View style={styles.dot} />
            <ThemedText style={styles.itemsText}>{item.items} items</ThemedText>
            <View style={styles.dot} />
            <ThemedText style={styles.typeText}>{item.type}</ThemedText>
          </View>
        </View>
        <View style={[styles.amountBadge, { backgroundColor: 
          item.status === 'Paid' ? '#D1FAE5' : 
          item.status === 'Overdue' ? '#FEE2E2' : '#FEF3C7' 
        }]}>
          <ThemedText style={[styles.amountText, { color: 
            item.status === 'Paid' ? COLORS.success : 
            item.status === 'Overdue' ? COLORS.danger : COLORS.warning 
          }]}>
            {item.amount}
          </ThemedText>
        </View>
      </View>

      <View style={styles.invoiceFooter}>
        <View style={[styles.statusBadge, { backgroundColor: 
          item.status === 'Paid' ? '#D1FAE5' : 
          item.status === 'Overdue' ? '#FEE2E2' : '#FEF3C7' 
        }]}>
          <View style={[styles.statusDot, { backgroundColor: 
            item.status === 'Paid' ? COLORS.success : 
            item.status === 'Overdue' ? COLORS.danger : COLORS.warning 
          }]} />
          <ThemedText style={[styles.statusText, { color: 
            item.status === 'Paid' ? COLORS.success : 
            item.status === 'Overdue' ? COLORS.danger : COLORS.warning 
          }]}>
            {item.status}
          </ThemedText>
        </View>

        <View style={styles.actionButtons}>
          {item.status === 'Pending' && (
            <TouchableOpacity style={styles.payButton} onPress={() => handleProcessPayment(item)}>
              <Ionicons name="cash" size={16} color={COLORS.primary} />
              <ThemedText style={styles.payButtonText}>Process</ThemedText>
            </TouchableOpacity>
          )}
          
          {item.status === 'Overdue' && (
            <TouchableOpacity style={styles.reminderButton} onPress={() => handleSendReminder(item)}>
              <Ionicons name="notifications" size={16} color={COLORS.warning} />
              <ThemedText style={[styles.reminderButtonText, { color: COLORS.warning }]}>Remind</ThemedText>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.viewButton}>
            <Ionicons name="eye" size={16} color={COLORS.secondary} />
            <ThemedText style={[styles.viewButtonText, { color: COLORS.secondary }]}>View</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSaleItem = ({ item }) => (
    <View style={styles.saleItem}>
      <View style={styles.saleTime}>
        <ThemedText style={styles.timeText}>{item.time}</ThemedText>
      </View>
      <View style={styles.saleInfo}>
        <ThemedText style={styles.salePatient}>{item.patient}</ThemedText>
        <ThemedText style={styles.saleMethod}>{item.method}</ThemedText>
      </View>
      <ThemedText style={styles.saleAmount}>{item.amount}</ThemedText>
    </View>
  );

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* HEADER */}
      <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Billing</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Manage invoices and payments</ThemedText>
          </View>
          <TouchableOpacity style={styles.newInvoiceButton} onPress={() => setShowNewInvoice(true)}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <ThemedText style={styles.newInvoiceButtonText}>New Invoice</ThemedText>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>$2,480</ThemedText>
          <ThemedText style={styles.statLabel}>Today's Revenue</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: COLORS.warning }]}>$325</ThemedText>
          <ThemedText style={styles.statLabel}>Pending</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: COLORS.danger }]}>$424</ThemedText>
          <ThemedText style={styles.statLabel}>Overdue</ThemedText>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search invoices..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.muted}
          />
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        {["pending", "paid", "overdue"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <ThemedText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({BILLING_DATA[tab].length})
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* INVOICES */}
      <View style={styles.contentSection}>
        <FlatList
          data={BILLING_DATA[activeTab]}
          renderItem={({ item }) => renderInvoiceCard(item)}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* TODAY'S SALES */}
      <View style={styles.salesSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Today's Sales</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.viewAll}>View All →</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.salesList}>
          <FlatList
            data={TODAY_SALES}
            renderItem={renderSaleItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
      </View>

      {/* NEW INVOICE MODAL */}
      <Modal visible={showNewInvoice} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>New Invoice</ThemedText>
              <TouchableOpacity onPress={() => setShowNewInvoice(false)}>
                <Ionicons name="close" size={24} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.submitButton}>
              <ThemedText style={styles.submitButtonText}>Create Invoice</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 32, color: "#FFFFFF", fontWeight: "800", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.9)" },
  newInvoiceButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  newInvoiceButtonText: { fontSize: 14, color: "#FFFFFF", fontWeight: "600" },
  statsContainer: { flexDirection: "row", paddingHorizontal: 24, marginVertical: 20, gap: 12 },
  statCard: { flex: 1, backgroundColor: COLORS.soft, padding: 16, borderRadius: 16, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "800", color: COLORS.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: COLORS.muted, fontWeight: "600" },
  searchSection: { paddingHorizontal: 24, marginBottom: 20 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.soft, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.text },
  tabsContainer: { flexDirection: "row", paddingHorizontal: 24, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: "600", color: COLORS.muted },
  activeTabText: { color: COLORS.primary },
  contentSection: { paddingHorizontal: 24, marginBottom: 24 },
  invoiceCard: { backgroundColor: COLORS.bg, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  invoiceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  patientName: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  invoiceDetails: { flexDirection: "row", alignItems: "center" },
  dateText: { fontSize: 12, color: COLORS.muted },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.muted, marginHorizontal: 6 },
  itemsText: { fontSize: 12, color: COLORS.muted },
  typeText: { fontSize: 12, color: COLORS.muted },
  amountBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  amountText: { fontSize: 18, fontWeight: "800" },
  invoiceFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: "700" },
  actionButtons: { flexDirection: "row", gap: 8 },
  payButton: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.soft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  payButtonText: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  reminderButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFBEB", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  reminderButtonText: { fontSize: 12, fontWeight: "600" },
  viewButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E0F2FE", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  viewButtonText: { fontSize: 12, fontWeight: "600" },
  salesSection: { paddingHorizontal: 24, marginBottom: 40 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  viewAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  salesList: { backgroundColor: COLORS.bg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  saleItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  saleTime: { width: 70 },
  timeText: { fontSize: 13, color: COLORS.muted, fontWeight: "600" },
  saleInfo: { flex: 1 },
  salePatient: { fontSize: 15, fontWeight: "600", color: COLORS.text, marginBottom: 2 },
  saleMethod: { fontSize: 12, color: COLORS.muted },
  saleAmount: { fontSize: 16, fontWeight: "700", color: COLORS.primary },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: COLORS.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: "700", color: COLORS.text },
  submitButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  submitButtonText: { fontSize: 16, color: "#FFFFFF", fontWeight: "600" },
});