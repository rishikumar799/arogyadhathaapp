import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= CONSTANTS ================= */

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E5E7EB",
  textDark: "#0F172A",
  textMuted: "#64748B",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  shadow: "rgba(15,23,42,0.08)",
};

const INNER_TABS = [
  "Doctors",
  "Diagnostics",
  "Pharmacy",
  "Receptionists",
  "Patients",
];

/* ================= TYPES ================= */

type Hospital = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
};

/* ================= ROOT ================= */

export default function HospitalStaffScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState("");
  const [openHospitalId, setOpenHospitalId] = useState<string | null>(null);
  const [activeInnerTab, setActiveInnerTab] = useState<Record<string, string>>(
    {}
  );

  /* ---------- LOAD HOSPITALS (SOURCE = USERS ONLY) ---------- */
  useEffect(() => {
    const load = async () => {
      const usersSnap = await getDocs(collection(db, "users"));

      const list: Hospital[] = [];

      usersSnap.forEach(d => {
        const u = d.data() as any;
        const role = (u.role || "").toLowerCase();

        if (role === "hospital") {
          list.push({
            id: d.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            status: u.status || "approved",
          });
        }
      });

      setHospitals(list);
    };

    load();
  }, []);

  /* ---------- SEARCH ---------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return hospitals;

    return hospitals.filter(h =>
      `${h.name || ""} ${h.email || ""} ${h.phone || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [search, hospitals]);

  const toggleHospital = (id: string) => {
    setOpenHospitalId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Hospital Staff</ThemedText>
        <ThemedText style={styles.subtitle}>
          Manage hospital staff accounts
        </ThemedText>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          placeholder="Search hospitals"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* LIST */}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {filtered.map(h => {
          const isOpen = openHospitalId === h.id;
          const activeTab = activeInnerTab[h.id] || INNER_TABS[0];

          return (
            <View key={h.id} style={styles.card}>
              {/* HEADER */}
              <TouchableOpacity
                onPress={() => toggleHospital(h.id)}
                style={styles.cardHeader}
                activeOpacity={0.8}
              >
                <View style={styles.avatar}>
                  <Ionicons name="business" size={18} color={COLORS.green} />
                </View>

                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.name}>
                    {h.name || "Unnamed Hospital"}
                  </ThemedText>
                  {!!h.email && (
                    <ThemedText style={styles.meta}>{h.email}</ThemedText>
                  )}
                </View>

                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>

              {/* DROPDOWN */}
              {isOpen && (
                <View style={styles.dropdown}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.innerTabs}
                  >
                    {INNER_TABS.map(tab => {
                      const active = tab === activeTab;
                      return (
                        <TouchableOpacity
                          key={tab}
                          onPress={() =>
                            setActiveInnerTab(prev => ({
                              ...prev,
                              [h.id]: tab,
                            }))
                          }
                          style={[
                            styles.innerTab,
                            active && styles.innerTabActive,
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.innerTabText,
                              active && styles.innerTabTextActive,
                            ]}
                          >
                            {tab}
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  <View style={styles.placeholder}>
                    <ThemedText style={styles.placeholderText}>
                      No {activeTab.toLowerCase()} registered yet
                    </ThemedText>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },

  header: { marginBottom: 14 },
  title: { fontSize: 26, fontWeight: "700", color: COLORS.textDark },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
    marginBottom: 18,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
  },

  name: { fontSize: 15, fontWeight: "600", color: COLORS.textDark },
  meta: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  dropdown: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 14,
  },

  innerTabs: { flexDirection: "row", gap: 8, marginBottom: 12 },
  innerTab: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 999,
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  innerTabActive: { backgroundColor: COLORS.greenSoft },
  innerTabText: { fontSize: 12, fontWeight: "600", color: COLORS.textMuted },
  innerTabTextActive: { color: COLORS.green },

  placeholder: { paddingVertical: 16, alignItems: "center" },
  placeholderText: { fontSize: 13, color: COLORS.textMuted },
});
