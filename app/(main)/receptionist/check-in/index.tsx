import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ===================== THEME (HOSPITAL GREEN) ===================== */

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#10B981",        // Brand Green
  primaryDark: "#065F46",
  primaryLight: "#22C55E",
  soft: "#ECFDF5",
  warning: "#F59E0B",
  info: "#0EA5E9",
  success: "#16A34A",
  danger: "#DC2626",
  muted: "#64748B",
  text: "#0F172A",
  border: "#E2E8F0",
};

/* ===================== MOCK QUEUE DATA ===================== */

const QUEUE_DATA = [
  { id: "Q-001", patient: "John Carter", doctor: "Dr. Sharma", time: "10:15 AM", wait: 15, status: "waiting", priority: "normal" },
  { id: "Q-002", patient: "Emily Johnson", doctor: "Dr. Gupta", time: "10:30 AM", wait: 25, status: "waiting", priority: "urgent" },
  { id: "Q-003", patient: "Robert Chen", doctor: "Dr. Patel", time: "10:45 AM", wait: 8, status: "waiting", priority: "normal" },
  { id: "Q-004", patient: "Sarah Williams", doctor: "Dr. Singh", time: "11:00 AM", wait: 0, status: "in-progress", priority: "normal" },
  { id: "Q-005", patient: "Michael Brown", doctor: "Dr. Kumar", time: "09:45 AM", wait: 45, status: "completed", priority: "normal" },
];

/* ===================== MAIN ===================== */

export default function CheckInQueue() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "waiting" | "in-progress" | "completed">("all");
  const [showCheckIn, setShowCheckIn] = useState(false);

  const [newPatient, setNewPatient] = useState({
    name: "",
    phone: "",
    doctor: "",
  });

  /* ===================== DERIVED DATA ===================== */

  const filteredQueue = useMemo(() => {
    return QUEUE_DATA.filter(q => {
      const matchSearch =
        q.patient.toLowerCase().includes(search.toLowerCase()) ||
        q.doctor.toLowerCase().includes(search.toLowerCase());

      const matchFilter = filter === "all" || q.status === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const waitingCount = QUEUE_DATA.filter(q => q.status === "waiting").length;
  const avgWait =
    Math.round(
      QUEUE_DATA.filter(q => q.status === "waiting").reduce((a, b) => a + b.wait, 0) /
      (waitingCount || 1)
    );

  /* ===================== HELPERS ===================== */

  const statusColor = (status: string) => {
    switch (status) {
      case "waiting": return COLORS.warning;
      case "in-progress": return COLORS.info;
      case "completed": return COLORS.success;
      default: return COLORS.muted;
    }
  };

  /* ===================== UI ===================== */

  return (
    <View style={styles.page}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Check-In & Queue</ThemedText>
        <ThemedText style={styles.subtitle}>
          Live patient queue management
        </ThemedText>

        <View style={styles.headerStats}>
          <Stat value={waitingCount} label="Waiting" />
          <Stat value={avgWait} label="Avg Wait (min)" />
        </View>
      </View>

      {/* ================= CONTROLS ================= */}
      <View style={styles.controls}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search patient or doctor"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.checkInBtn} onPress={() => setShowCheckIn(true)}>
          <Ionicons name="log-in" size={18} color="#fff" />
          <ThemedText style={styles.checkInText}>Check-In</ThemedText>
        </TouchableOpacity>
      </View>

      {/* ================= FILTERS ================= */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {["all", "waiting", "in-progress", "completed"].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f as any)}
            style={[styles.filterChip, filter === f && styles.filterActive]}
          >
            <ThemedText style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.replace("-", " ").toUpperCase()}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ================= QUEUE LIST ================= */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {filteredQueue.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <ThemedText style={styles.patient}>{item.patient}</ThemedText>
                <ThemedText style={styles.doctor}>with {item.doctor}</ThemedText>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + "20" }]}>
                <ThemedText style={{ color: statusColor(item.status), fontWeight: "700", fontSize: 11 }}>
                  {item.status.toUpperCase()}
                </ThemedText>
              </View>
            </View>

            <View style={styles.meta}>
              <Meta icon="time" label={`Check-in ${item.time}`} />
              <Meta icon="hourglass" label={`Wait ${item.wait} min`} />
            </View>

            {item.status === "waiting" && (
              <View style={styles.actions}>
                <Action icon="play" label="Start" filled />
                <Action icon="call" label="Call" />
              </View>
            )}

            {item.status === "in-progress" && (
              <Action icon="checkmark" label="Complete" filled />
            )}
          </View>
        ))}

        {filteredQueue.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="list" size={48} color={COLORS.border} />
            <ThemedText style={styles.emptyText}>No patients found</ThemedText>
          </View>
        )}
      </ScrollView>

      {/* ================= CHECK-IN MODAL ================= */}
      <Modal visible={showCheckIn} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ThemedText style={styles.modalTitle}>Patient Check-In</ThemedText>

            <Input label="Patient Name *" value={newPatient.name} onChange={v => setNewPatient(p => ({ ...p, name: v }))} />
            <Input label="Phone Number" value={newPatient.phone} onChange={v => setNewPatient(p => ({ ...p, phone: v }))} />
            <Input label="Doctor" value={newPatient.doctor} onChange={v => setNewPatient(p => ({ ...p, doctor: v }))} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCheckIn(false)}>
                <ThemedText style={{ color: COLORS.muted }}>Cancel</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitBtn, !newPatient.name && { opacity: 0.5 }]}
                disabled={!newPatient.name}
                onPress={() => setShowCheckIn(false)}
              >
                <Ionicons name="log-in" size={16} color="#fff" />
                <ThemedText style={{ color: "#fff", fontWeight: "700" }}>Check-In</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ===================== SMALL COMPONENTS ===================== */

const Stat = ({ value, label }: any) => (
  <View style={styles.stat}>
    <ThemedText style={styles.statValue}>{value}</ThemedText>
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
  </View>
);

const Meta = ({ icon, label }: any) => (
  <View style={styles.metaItem}>
    <Ionicons name={icon} size={14} color={COLORS.muted} />
    <ThemedText style={styles.metaText}>{label}</ThemedText>
  </View>
);

const Action = ({ icon, label, filled }: any) => (
  <TouchableOpacity style={[styles.actionBtn, filled && styles.actionFilled]}>
    <Ionicons name={icon} size={14} color={filled ? "#fff" : COLORS.primary} />
    <ThemedText style={{ color: filled ? "#fff" : COLORS.primary, fontWeight: "700", fontSize: 13 }}>
      {label}
    </ThemedText>
  </TouchableOpacity>
);

const Input = ({ label, value, onChange }: any) => (
  <View style={{ marginBottom: 14 }}>
    <ThemedText style={styles.inputLabel}>{label}</ThemedText>
    <TextInput value={value} onChangeText={onChange} style={styles.input} />
  </View>
);

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#fff" },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 4 },

  headerStats: { flexDirection: "row", gap: 12, marginTop: 16 },
  stat: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 12,
    borderRadius: 12,
    minWidth: 110,
    alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "800", color: "#fff" },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.8)" },

  controls: { flexDirection: "row", gap: 12, padding: 20 },
  searchBox: {
    flex: 1, flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.card, borderRadius: 12,
    paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  checkInBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: COLORS.primary, paddingHorizontal: 16,
    borderRadius: 12,
  },
  checkInText: { color: "#fff", fontWeight: "700" },

  filters: { paddingHorizontal: 20, marginBottom: 12 },
  filterChip: {
    backgroundColor: COLORS.soft, paddingHorizontal: 16,
    paddingVertical: 0, borderRadius: 20, marginRight: 8,
  },
  filterActive: { backgroundColor: COLORS.primaryDark },
  filterText: { fontSize: 12, fontWeight: "700", color: COLORS.primary },
  filterTextActive: { color: "#fff" },

  list: { paddingHorizontal: 20 },

  card: {
    backgroundColor: COLORS.card, borderRadius: 16,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  patient: { fontSize: 18, fontWeight: "800" },
  doctor: { fontSize: 13, color: COLORS.muted, marginTop: 2 },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },

  meta: { flexDirection: "row", gap: 16, marginTop: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, color: COLORS.muted },

  actions: { flexDirection: "row", gap: 12, marginTop: 14 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
    borderRadius: 10, paddingVertical: 10,
    backgroundColor: COLORS.soft,
  },
  actionFilled: { backgroundColor: COLORS.primary },

  empty: { alignItems: "center", paddingVertical: 60 },
  emptyText: { marginTop: 12, fontSize: 16, color: COLORS.muted },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modal: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 20 },

  inputLabel: { fontSize: 13, fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },

  modalActions: { flexDirection: "row", gap: 12, marginTop: 20 },
  cancelBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 14, borderRadius: 12,
    backgroundColor: COLORS.bg,
  },
  submitBtn: {
    flex: 1, flexDirection: "row", gap: 8,
    alignItems: "center", justifyContent: "center",
    paddingVertical: 14, borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
});
