import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= AROGYADATHA COLORS ================= */
const COLORS = {
  dark: "#064E3B",
  mid: "#065F46",
  primary: "#10B981",
  soft: "#ECFDF5",
  bg: "#F8FAFC",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#64748B",
};

/* ================= TYPES ================= */
type TestItem = {
  id: string;
  name: string;
  group: string;
  price: number;
  tat: string;
  active: boolean;
};

/* ================= SAMPLE DATA ================= */
const INITIAL_TESTS: TestItem[] = [
  {
    id: "1",
    name: "Complete Blood Count",
    group: "Hematology",
    price: 500,
    tat: "2h",
    active: true,
  },
  {
    id: "2",
    name: "Lipid Profile",
    group: "Biochemistry",
    price: 800,
    tat: "4h",
    active: true,
  },
];

export default function DiagnosticsTests() {
  const [tests, setTests] = useState(INITIAL_TESTS);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [price, setPrice] = useState("");
  const [tat, setTat] = useState("");

  const groups = useMemo(() => {
    return ["All", ...new Set(tests.map((t) => t.group))];
  }, [tests]);

  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const s = t.name.toLowerCase().includes(search.toLowerCase());
      const g = activeGroup === "All" || t.group === activeGroup;
      return s && g && t.active;
    });
  }, [tests, search, activeGroup]);

  const addTest = () => {
    if (!name || !group || !price || !tat) return;

    setTests((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        group,
        price: Number(price),
        tat,
        active: true,
      },
    ]);

    setName("");
    setGroup("");
    setPrice("");
    setTat("");
    setShowAdd(false);
  };

  const renderTest = ({ item }: { item: TestItem }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.testName}>{item.name}</ThemedText>
        <View style={styles.metaRow}>
          <View style={styles.groupPill}>
            <ThemedText style={styles.groupText}>{item.group}</ThemedText>
          </View>
          <ThemedText style={styles.tat}>TAT: {item.tat}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.price}>₹{item.price}</ThemedText>
    </View>
  );

  return (
    <View style={styles.page}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Test Catalog</ThemedText>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAdd(true)}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ================= SEARCH ================= */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.muted} />
        <TextInput
          placeholder="Search tests…"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* ================= FILTER ================= */}
      <View style={styles.filterRow}>
        {groups.map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setActiveGroup(g)}
            style={[
              styles.filter,
              activeGroup === g && styles.filterActive,
            ]}
          >
            <ThemedText
              style={[
                styles.filterText,
                activeGroup === g && styles.filterTextActive,
              ]}
            >
              {g}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ================= LIST ================= */}
      <FlatList
        data={filteredTests}
        renderItem={renderTest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* ================= CENTER MODAL ================= */}
      <Modal visible={showAdd} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add Test</ThemedText>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <Ionicons name="close" size={22} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            <View>
              <TextInput
                placeholder="Test Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Group (e.g. Biochemistry)"
                value={group}
                onChangeText={setGroup}
                style={styles.input}
              />
              <TextInput
                placeholder="Price"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                style={styles.input}
              />
              <TextInput
                placeholder="Turnaround Time (e.g. 4h)"
                value={tat}
                onChangeText={setTat}
                style={styles.input}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <ThemedText style={styles.cancel}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addTest}>
                <ThemedText style={styles.saveText}>Save Test</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    backgroundColor: COLORS.mid,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filter: {
    backgroundColor: COLORS.soft,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterActive: { backgroundColor: COLORS.dark },
  filterText: { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
  filterTextActive: { color: "#fff" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },
  testName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  metaRow: { flexDirection: "row", alignItems: "center" },
  groupPill: {
    backgroundColor: COLORS.soft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 12,
  },
  groupText: { color: COLORS.primary, fontSize: 12, fontWeight: "600" },
  tat: { color: COLORS.muted, fontSize: 13, fontWeight: "600" },
  price: { fontSize: 18, fontWeight: "800", color: COLORS.primary },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: Platform.OS === "web" ? 420 : "100%",
    maxWidth: 420,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cancel: { color: COLORS.muted, fontWeight: "600" },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
