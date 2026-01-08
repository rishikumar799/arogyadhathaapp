import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375;

/* 🌿 ENHANCED AROGYADATHA COLOR PALETTE */
const COLORS = {
  bg: "#F8FAFC",
  bgLight: "#FFFFFF",
  card: "#FFFFFF",
  primary: "#10B981",
  primaryLight: "#34D399",
  primaryDark: "#065F46",
  soft: "#ECFDF5",
  softLight: "#F0FDFA",
  warning: "#F59E0B",
  warningLight: "#FBBF24",
  info: "#3B82F6",
  infoLight: "#60A5FA",
  success: "#10B981",
  successLight: "#34D399",
  danger: "#EF4444",
  dangerLight: "#F87171",
  muted: "#64748B",
  mutedLight: "#94A3B8",
  text: "#0F172A",
  textLight: "#334155",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  overlay: "rgba(6, 95, 70, 0.9)",
};

/* 🔖 ENHANCED STATUS CONFIG */
const STATUS_MAP: any = {
  pending: { 
    label: "Pending", 
    color: COLORS.warning, 
    bg: "#FEF3C7", 
    icon: "time-outline",
    description: "Awaiting sample collection"
  },
  collected: { 
    label: "Sample Collected", 
    color: COLORS.info, 
    bg: "#DBEAFE", 
    icon: "water-outline",
    description: "Sample received in lab"
  },
  processing: { 
    label: "Processing", 
    color: COLORS.info, 
    bg: "#DBEAFE", 
    icon: "sync-outline",
    description: "Test in progress"
  },
  completed: { 
    label: "Completed", 
    color: COLORS.success, 
    bg: "#D1FAE5", 
    icon: "checkmark-circle-outline",
    description: "Results ready"
  },
  rejected: { 
    label: "Rejected", 
    color: COLORS.danger, 
    bg: "#FEE2E2", 
    icon: "close-circle-outline",
    description: "Sample rejected"
  },
};

/* 🧪 ENHANCED ORDERS DATA */
const ORDERS = [
  { 
    id: "ORD-001", 
    patient: "John Carter", 
    patientId: "PAT-2024-001",
    age: 45,
    gender: "Male",
    test: "Complete Blood Count + ESR", 
    status: "pending", 
    time: "10:30 AM",
    date: "2024-01-15",
    priority: "normal",
    lab: "Hematology",
    tat: "2 hours",
    doctor: "Dr. Sharma",
    amount: 850,
    sampleType: "Blood",
    notes: "Fasting required"
  },
  { 
    id: "ORD-002", 
    patient: "Emily Johnson", 
    patientId: "PAT-2024-002",
    age: 32,
    gender: "Female",
    test: "Lipid Profile + Liver Function", 
    status: "collected", 
    time: "11:45 AM",
    date: "2024-01-15",
    priority: "urgent",
    lab: "Biochemistry",
    tat: "4 hours",
    doctor: "Dr. Gupta",
    amount: 2200,
    sampleType: "Blood",
    notes: "Last meal 12 hours ago"
  },
  { 
    id: "ORD-003", 
    patient: "Robert Chen", 
    patientId: "PAT-2024-003",
    age: 58,
    gender: "Male",
    test: "Culture & Sensitivity", 
    status: "processing", 
    time: "09:15 AM",
    date: "2024-01-15",
    priority: "normal",
    lab: "Microbiology",
    tat: "48 hours",
    doctor: "Dr. Patel",
    amount: 1500,
    sampleType: "Urine",
    notes: "Mid-stream sample"
  },
  { 
    id: "ORD-004", 
    patient: "Sarah Williams", 
    patientId: "PAT-2024-004",
    age: 29,
    gender: "Female",
    test: "Thyroid Profile", 
    status: "completed", 
    time: "Yesterday",
    date: "2024-01-14",
    priority: "normal",
    lab: "Endocrinology",
    tat: "6 hours",
    doctor: "Dr. Singh",
    amount: 1200,
    sampleType: "Blood",
    notes: ""
  },
  { 
    id: "ORD-005", 
    patient: "Michael Brown", 
    patientId: "PAT-2024-005",
    age: 65,
    gender: "Male",
    test: "Rapid HIV Test", 
    status: "rejected", 
    time: "Yesterday",
    date: "2024-01-14",
    priority: "urgent",
    lab: "Serology",
    tat: "1 hour",
    doctor: "Dr. Kumar",
    amount: 600,
    sampleType: "Blood",
    notes: "Sample hemolyzed"
  },
  { 
    id: "ORD-006", 
    patient: "Lisa Garcia", 
    patientId: "PAT-2024-006",
    age: 41,
    gender: "Female",
    test: "Urine Routine + Microscopy", 
    status: "processing", 
    time: "08:30 AM",
    date: "2024-01-15",
    priority: "normal",
    lab: "Pathology",
    tat: "3 hours",
    doctor: "Dr. Rao",
    amount: 450,
    sampleType: "Urine",
    notes: "First morning sample"
  },
];

export default function Orders() {
  const [filter, setFilter] = useState<"all" | "pending" | "collected" | "processing" | "completed" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const filteredOrders = useMemo(() => {
    return ORDERS.filter((order) => {
      const matchesFilter = filter === "all" || order.status === filter;
      const matchesSearch = searchQuery === "" || 
        order.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.test.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const statusStats = useMemo(() => {
    const stats: any = {
      all: ORDERS.length,
      pending: 0,
      collected: 0,
      processing: 0,
      completed: 0,
      rejected: 0
    };
    
    ORDERS.forEach(order => {
      if (stats[order.status] !== undefined) {
        stats[order.status]++;
      }
    });
    
    return stats;
  }, []);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return COLORS.danger;
      case 'high': return COLORS.warning;
      default: return COLORS.success;
    }
  };

  const handleOrderAction = (action: string, order: any) => {
    console.log(`${action} order ${order.id}`);
    // Implement action logic here
    setShowActionSheet(false);
  };

  const renderOrder = ({ item }: any) => {
    const status = STATUS_MAP[item.status];
    const priorityColor = getPriorityColor(item.priority);

    return (
      <TouchableOpacity 
        style={styles.orderCard}
        activeOpacity={0.9}
        onPress={() => {
          setSelectedOrder(item);
          setShowDetailsModal(true);
        }}
        onLongPress={() => {
          setSelectedOrder(item);
          setShowActionSheet(true);
        }}
      >
        {/* HEADER WITH STATUS & ACTIONS */}
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <ThemedText style={styles.orderId}>{item.id}</ThemedText>
            <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}15` }]}>
              <Ionicons 
                name={item.priority === 'urgent' ? "alert-circle" : "flag"} 
                size={10} 
                color={priorityColor} 
              />
              <ThemedText style={[styles.priorityText, { color: priorityColor }]}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon} size={14} color={status.color} />
            <ThemedText style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </ThemedText>
          </View>
        </View>

        {/* PATIENT INFO */}
        <View style={styles.patientRow}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {item.patient.split(' ').map(n => n[0]).join('')}
            </ThemedText>
          </View>
          <View style={styles.patientInfo}>
            <ThemedText style={styles.patientName}>{item.patient}</ThemedText>
            <View style={styles.patientMeta}>
              <ThemedText style={styles.patientDetail}>{item.age}y • {item.gender}</ThemedText>
              <ThemedText style={styles.patientId}>{item.patientId}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.orderAmount}>₹{item.amount}</ThemedText>
        </View>

        {/* TEST DETAILS */}
        <View style={styles.testSection}>
          <ThemedText style={styles.testName} numberOfLines={2}>{item.test}</ThemedText>
          <View style={styles.testMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="business" size={12} color={COLORS.muted} />
              <ThemedText style={styles.metaText}>{item.lab}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="medical" size={12} color={COLORS.muted} />
              <ThemedText style={styles.metaText}>{item.doctor}</ThemedText>
            </View>
          </View>
        </View>

        {/* FOOTER WITH ACTIONS */}
        <View style={styles.orderFooter}>
          <View style={styles.footerLeft}>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={12} color={COLORS.muted} />
              <ThemedText style={styles.timeText}>{item.time}</ThemedText>
            </View>
            <View style={styles.tatBadge}>
              <Ionicons name="hourglass-outline" size={12} color={COLORS.muted} />
              <ThemedText style={styles.tatText}>{item.tat}</ThemedText>
            </View>
          </View>
          <View style={styles.actionIcons}>
            {item.notes && (
              <TouchableOpacity style={styles.noteIcon}>
                <Ionicons name="document-text" size={14} color={COLORS.info} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.menuIcon}>
              <Ionicons name="ellipsis-vertical" size={16} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (statusKey: string, label: string) => {
    const isActive = filter === statusKey;
    const status = STATUS_MAP[statusKey] || { color: COLORS.primary, bg: COLORS.soft };
    
    return (
      <TouchableOpacity
        key={statusKey}
        onPress={() => setFilter(statusKey as any)}
        style={[
          styles.filterChip,
          isActive && styles.filterActive,
          { backgroundColor: isActive ? status.color : COLORS.soft }
        ]}
      >
        <ThemedText
          style={[
            styles.filterText,
            isActive && styles.filterTextActive,
          ]}
        >
          {label}
        </ThemedText>
        <View style={[
          styles.filterCount,
          { backgroundColor: isActive ? "#FFFFFF" : status.color + "20" }
        ]}>
          <ThemedText style={[
            styles.filterCountText,
            { color: isActive ? status.color : COLORS.muted }
          ]}>
            {statusStats[statusKey]}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
        {/* 📊 HEADER WITH STATS */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <ThemedText style={styles.headerTitle}>Orders</ThemedText>
              <ThemedText style={styles.headerSubtitle}>Manage test requests & samples</ThemedText>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{ORDERS.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Total</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{statusStats.pending}</ThemedText>
              <ThemedText style={styles.statLabel}>Pending</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{statusStats.processing}</ThemedText>
              <ThemedText style={styles.statLabel}>Processing</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{statusStats.completed}</ThemedText>
              <ThemedText style={styles.statLabel}>Completed</ThemedText>
            </View>
          </View>
        </View>

        {/* 🔍 SEARCH BAR */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={COLORS.muted} />
            <TextInput
              placeholder="Search by patient, order ID, or test..."
              placeholderTextColor={COLORS.mutedLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color={COLORS.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 📊 STATUS FILTER WITH COUNTS */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {renderFilterChip("all", "All Orders")}
          {renderFilterChip("pending", "Pending")}
          {renderFilterChip("collected", "Collected")}
          {renderFilterChip("processing", "Processing")}
          {renderFilterChip("completed", "Completed")}
          {renderFilterChip("rejected", "Rejected")}
        </ScrollView>

        {/* 📋 RESULTS INFO */}
        <View style={styles.resultsInfo}>
          <ThemedText style={styles.resultsText}>
            {filteredOrders.length} orders found
          </ThemedText>
          <TouchableOpacity style={styles.sortButton}>
            <Ionicons name="funnel" size={14} color={COLORS.muted} />
            <ThemedText style={styles.sortText}>Sort by: Recent</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 📋 ORDERS LIST */}
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={48} color={COLORS.border} />
              </View>
              <ThemedText style={styles.emptyTitle}>No orders found</ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                {searchQuery ? "Try a different search" : "No orders match the selected filter"}
              </ThemedText>
            </View>
          }
        />
      </ScrollView>

      {/* 📄 ORDER DETAILS MODAL */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Order Details</ThemedText>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowDetailsModal(false)}
              >
                <Ionicons name="close" size={22} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {selectedOrder && (
                <>
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailSectionTitle}>Patient Information</ThemedText>
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Name:</ThemedText>
                      <ThemedText style={styles.detailValue}>{selectedOrder.patient}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Patient ID:</ThemedText>
                      <ThemedText style={styles.detailValue}>{selectedOrder.patientId}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Age & Gender:</ThemedText>
                      <ThemedText style={styles.detailValue}>{selectedOrder.age}y, {selectedOrder.gender}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Referring Doctor:</ThemedText>
                      <ThemedText style={styles.detailValue}>{selectedOrder.doctor}</ThemedText>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailSectionTitle}>Test Information</ThemedText>
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Test:</ThemedText>
                      <ThemedText style={styles.detailValue}>{selectedOrder.test}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Laboratory:</ThemedText>
                      <ThemedText style={styles.detailValue}>{selectedOrder.lab}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Sample Type:</ThemedText>
                      <ThemedText style={styles.detailValue}>{selectedOrder.sampleType}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>TAT:</ThemedText>
                      <ThemedText style={styles.detailValue}>{selectedOrder.tat}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Priority:</ThemedText>
                      <ThemedText style={[styles.detailValue, { 
                        color: getPriorityColor(selectedOrder.priority),
                        fontWeight: '700'
                      }]}>
                        {selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}
                      </ThemedText>
                    </View>
                  </View>

                  {selectedOrder.notes && (
                    <View style={styles.detailSection}>
                      <ThemedText style={styles.detailSectionTitle}>Special Notes</ThemedText>
                      <View style={styles.notesBox}>
                        <ThemedText style={styles.notesText}>{selectedOrder.notes}</ThemedText>
                      </View>
                    </View>
                  )}

                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailSectionTitle}>Order Summary</ThemedText>
                    <View style={styles.summaryBox}>
                      <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Order ID:</ThemedText>
                        <ThemedText style={styles.summaryValue}>{selectedOrder.id}</ThemedText>
                      </View>
                      <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Date & Time:</ThemedText>
                        <ThemedText style={styles.summaryValue}>{selectedOrder.date} • {selectedOrder.time}</ThemedText>
                      </View>
                      <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Status:</ThemedText>
                        <View style={[styles.statusBadge, { 
                          backgroundColor: STATUS_MAP[selectedOrder.status].bg,
                          alignSelf: 'flex-start'
                        }]}>
                          <Ionicons 
                            name={STATUS_MAP[selectedOrder.status].icon} 
                            size={14} 
                            color={STATUS_MAP[selectedOrder.status].color} 
                          />
                          <ThemedText style={[styles.statusText, { 
                            color: STATUS_MAP[selectedOrder.status].color 
                          }]}>
                            {STATUS_MAP[selectedOrder.status].label}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Amount:</ThemedText>
                        <ThemedText style={styles.summaryAmount}>₹{selectedOrder.amount}</ThemedText>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowDetailsModal(false)}
              >
                <ThemedText style={styles.secondaryButtonText}>Close</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton}>
                <Ionicons name="print" size={18} color="#FFFFFF" />
                <ThemedText style={styles.primaryButtonText}>Print Report</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* 🎨 ENHANCED STYLES */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  /* HEADER */
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  /* STATS ROW */
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "600",
  },

  /* SEARCH */
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
    color: COLORS.text,
    fontWeight: "500",
  },

  /* FILTER BAR */
  filterBar: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 100,
    gap: 6,
  },
  filterActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  filterCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: "800",
  },

  /* RESULTS INFO */
  resultsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  resultsText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.soft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  sortText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },

  /* LIST */
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  /* ORDER CARD */
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.muted,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  /* PATIENT INFO */
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 2,
  },
  patientMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  patientDetail: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  patientId: {
    fontSize: 12,
    color: COLORS.mutedLight,
    fontWeight: "600",
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },

  /* TEST SECTION */
  testSection: {
    marginBottom: 16,
  },
  testName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  testMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },

  /* ORDER FOOTER */
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  footerLeft: {
    flexDirection: "row",
    gap: 12,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },
  tatBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tatText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },
  actionIcons: {
    flexDirection: "row",
    gap: 12,
  },
  noteIcon: {
    padding: 6,
  },
  menuIcon: {
    padding: 6,
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 250,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    padding: 24,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  notesBox: {
    backgroundColor: COLORS.soft,
    padding: 16,
    borderRadius: 12,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  summaryBox: {
    backgroundColor: COLORS.bg,
    padding: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.borderLight,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.muted,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});