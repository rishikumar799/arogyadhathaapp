import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* 🌿 AROGYADATHA COLORS */
const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#10B981",
  primaryLight: "#34D399",
  primaryDark: "#065F46",
  soft: "#ECFDF5",
  warning: "#F59E0B",
  info: "#3B82F6",
  success: "#10B981",
  danger: "#EF4444",
  muted: "#64748B",
  text: "#0F172A",
  border: "#E2E8F0",
};

/* 🧪 SAMPLE COLLECTIONS DATA */
const COLLECTIONS = [
  {
    id: "COL-001",
    patient: "John Carter",
    test: "Complete Blood Count",
    status: "pending",
    time: "09:30 AM",
    phlebotomist: "Dr. Sharma",
    sampleType: "Blood",
    collectionTime: "08:45 AM",
    tubeColor: "Purple",
  },
  {
    id: "COL-002",
    patient: "Emily Johnson",
    test: "Lipid Profile",
    status: "collected",
    time: "10:15 AM",
    phlebotomist: "Dr. Gupta",
    sampleType: "Blood",
    collectionTime: "10:00 AM",
    tubeColor: "Red",
  },
  {
    id: "COL-003",
    patient: "Robert Chen",
    test: "Urine Culture",
    status: "processing",
    time: "11:45 AM",
    phlebotomist: "Dr. Patel",
    sampleType: "Urine",
    collectionTime: "11:30 AM",
    tubeColor: "Sterile",
  },
  {
    id: "COL-004",
    patient: "Sarah Williams",
    test: "Thyroid Profile",
    status: "pending",
    time: "02:30 PM",
    phlebotomist: "Dr. Singh",
    sampleType: "Blood",
    collectionTime: "",
    tubeColor: "Green",
  },
  {
    id: "COL-005",
    patient: "Michael Brown",
    test: "Glucose Test",
    status: "rejected",
    time: "03:45 PM",
    phlebotomist: "Dr. Kumar",
    sampleType: "Blood",
    collectionTime: "03:30 PM",
    tubeColor: "Gray",
    rejectReason: "Sample hemolyzed",
  },
];

const STATUS_COLORS = {
  pending: COLORS.warning,
  collected: COLORS.info,
  processing: COLORS.primary,
  rejected: COLORS.danger,
};

const STATUS_ICONS = {
  pending: "time",
  collected: "checkmark-circle",
  processing: "sync",
  rejected: "close-circle",
};

export default function Collections() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredCollections = COLLECTIONS.filter(collection => {
    const matchesFilter = filter === "all" || collection.status === filter;
    const matchesSearch = 
      collection.patient.toLowerCase().includes(search.toLowerCase()) ||
      collection.id.toLowerCase().includes(search.toLowerCase()) ||
      collection.test.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (id: string, newStatus: string) => {
    console.log(`Update ${id} to ${newStatus}`);
    // Update logic here
  };

  const renderCollection = ({ item }: any) => {
    const statusColor = STATUS_COLORS[item.status];
    
    return (
      <TouchableOpacity 
        style={styles.collectionCard}
        onPress={() => {
          setSelectedCollection(item);
          setShowModal(true);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.idRow}>
            <ThemedText style={styles.collectionId}>{item.id}</ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
              <Ionicons name={STATUS_ICONS[item.status]} size={12} color={statusColor} />
              <ThemedText style={[styles.statusText, { color: statusColor }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </ThemedText>
            </View>
          </View>
          
          <ThemedText style={styles.timeText}>{item.time}</ThemedText>
        </View>

        <ThemedText style={styles.patientName}>{item.patient}</ThemedText>
        <ThemedText style={styles.testName}>{item.test}</ThemedText>

        <View style={styles.sampleInfo}>
          <View style={styles.sampleItem}>
            <Ionicons name="water" size={14} color={COLORS.muted} />
            <ThemedText style={styles.sampleText}>{item.sampleType}</ThemedText>
          </View>
          
          <View style={styles.sampleItem}>
            <Ionicons name="color-palette" size={14} color={COLORS.muted} />
            <ThemedText style={styles.sampleText}>{item.tubeColor} tube</ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.phlebotomist}>
            <Ionicons name="person" size={14} color={COLORS.muted} />
            <ThemedText style={styles.phlebotomistText}>{item.phlebotomist}</ThemedText>
          </View>
          
          {item.status === "pending" && (
            <TouchableOpacity 
              style={styles.collectButton}
              onPress={() => updateStatus(item.id, "collected")}
            >
              <ThemedText style={styles.collectText}>Collect</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.page}>
      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.muted} />
        <TextInput
          placeholder="Search by patient, test, or ID..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* STATS & FILTERS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{COLLECTIONS.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total</ThemedText>
        </View>
        
        <View style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: COLORS.warning }]}>
            {COLLECTIONS.filter(c => c.status === "pending").length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Pending</ThemedText>
        </View>
        
        <View style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: COLORS.success }]}>
            {COLLECTIONS.filter(c => c.status === "collected").length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Collected</ThemedText>
        </View>
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.filterRow}>
        {["all", "pending", "collected", "processing", "rejected"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterChip,
              filter === f && styles.filterActive,
              filter === f && { backgroundColor: STATUS_COLORS[f] || COLORS.primary }
            ]}
          >
            <ThemedText style={[
              styles.filterText,
              filter === f && styles.filterTextActive,
            ]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* COLLECTIONS LIST */}
      <FlatList
        data={filteredCollections}
        renderItem={renderCollection}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {/* COLLECTION DETAILS MODAL */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Collection Details</ThemedText>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {selectedCollection && (
              <View style={styles.modalBody}>
                <View style={styles.modalStatus}>
                  <View style={[styles.modalStatusBadge, { 
                    backgroundColor: `${STATUS_COLORS[selectedCollection.status]}15` 
                  }]}>
                    <Ionicons 
                      name={STATUS_ICONS[selectedCollection.status]} 
                      size={16} 
                      color={STATUS_COLORS[selectedCollection.status]} 
                    />
                    <ThemedText style={[styles.modalStatusText, { 
                      color: STATUS_COLORS[selectedCollection.status] 
                    }]}>
                      {selectedCollection.status.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Collection ID</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedCollection.id}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Patient</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedCollection.patient}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Test</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedCollection.test}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Sample Type</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedCollection.sampleType}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Tube Color</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedCollection.tubeColor}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Scheduled Time</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedCollection.time}</ThemedText>
                </View>
                
                {selectedCollection.collectionTime && (
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Collection Time</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedCollection.collectionTime}</ThemedText>
                  </View>
                )}
                
                {selectedCollection.rejectReason && (
                  <View style={styles.rejectBox}>
                    <Ionicons name="warning" size={16} color={COLORS.danger} />
                    <ThemedText style={styles.rejectText}>
                      Rejection: {selectedCollection.rejectReason}
                    </ThemedText>
                  </View>
                )}

                <View style={styles.modalActions}>
                  {selectedCollection.status === "pending" && (
                    <>
                      <TouchableOpacity 
                        style={styles.collectActionButton}
                        onPress={() => {
                          updateStatus(selectedCollection.id, "collected");
                          setShowModal(false);
                        }}
                      >
                        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                        <ThemedText style={styles.collectActionText}>Mark Collected</ThemedText>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.rejectActionButton}
                        onPress={() => {
                          updateStatus(selectedCollection.id, "rejected");
                          setShowModal(false);
                        }}
                      >
                        <Ionicons name="close" size={18} color="#FFFFFF" />
                        <ThemedText style={styles.rejectActionText}>Reject</ThemedText>
                      </TouchableOpacity>
                    </>
                  )}
                  
                  {selectedCollection.status === "collected" && (
                    <TouchableOpacity 
                      style={styles.processActionButton}
                      onPress={() => {
                        updateStatus(selectedCollection.id, "processing");
                        setShowModal(false);
                      }}
                    >
                      <Ionicons name="play" size={18} color="#FFFFFF" />
                      <ThemedText style={styles.processActionText}>Start Processing</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: 16,
  },
  
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 15,
    flex: 1,
  },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: COLORS.soft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterActive: {
    // Color applied inline
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  collectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  collectionId: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.muted,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  timeText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },

  patientName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  testName: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 12,
  },

  sampleInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  sampleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sampleText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  phlebotomist: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phlebotomistText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  collectButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  collectText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 500,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  modalBody: {
    flex: 1,
  },
  modalStatus: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: "700",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },

  rejectBox: {
    flexDirection: "row",
    backgroundColor: `${COLORS.danger}15`,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  rejectText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: "600",
  },

  modalActions: {
    marginTop: 20,
    gap: 12,
  },
  collectActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 12,
  },
  collectActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  rejectActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.danger,
    paddingVertical: 14,
    borderRadius: 12,
  },
  rejectActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  processActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  processActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});