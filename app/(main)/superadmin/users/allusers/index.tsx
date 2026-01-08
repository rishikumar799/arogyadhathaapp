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

  yellow: "#D97706",
  yellowSoft: "#FEF3C7",

  red: "#DC2626",
  redSoft: "#FEE2E2",

  shadow: "rgba(15,23,42,0.08)",
};

const TABS = [
  "All",
  "Doctors",
  "Patients",
  "Diagnostics",
  "Pharmacy",
  "Receptionists",
  "Admins",
  "Hospitals",
];

/* ================= TYPES ================= */

type BaseUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
};

/* ================= ROOT ================= */

export default function AllUsersScreen() {
  const [data, setData] = useState<Record<string, BaseUser[]>>({});
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  /* ================= LOAD USERS (SINGLE SOURCE) ================= */

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "users"));

      const grouped: Record<string, BaseUser[]> = {
        All: [],
        Doctors: [],
        Patients: [],
        Diagnostics: [],
        Pharmacy: [],
        Receptionists: [],
        Admins: [],
        Hospitals: [],
      };

      snap.forEach(d => {
        const u = d.data() as any;
        const role = (u.role || "").toLowerCase().trim();

        const user: BaseUser = {
          id: d.id,
          name: u.name || "Unnamed",
          email: u.email || "-",
          phone: u.phone,
          status: u.status || "approved",
        };

        grouped.All.push(user);

        if (role === "doctor") grouped.Doctors.push(user);
        else if (role === "patient") grouped.Patients.push(user);
        else if (role === "diagnostics") grouped.Diagnostics.push(user);
        else if (role === "pharmacy") grouped.Pharmacy.push(user);
        else if (role === "receptionist") grouped.Receptionists.push(user);
        else if (role === "admin" || role === "superadmin")
          grouped.Admins.push(user);
        else if (role === "hospital") grouped.Hospitals.push(user);
      });

      setData(grouped);
    };

    load();
  }, []);

  /* ================= SEARCH FILTER ================= */

  const filtered = useMemo(() => {
    const list = data[activeTab] || [];
    const q = search.toLowerCase().trim();
    if (!q) return list;

    return list.filter(u =>
      `${u.name} ${u.email} ${u.phone || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [data, activeTab, search]);

  const getStatusStyle = (status?: string) => {
    switch ((status || "approved").toLowerCase()) {
      case "pending":
        return { bg: COLORS.yellowSoft, color: COLORS.yellow };
      case "rejected":
        return { bg: COLORS.redSoft, color: COLORS.red };
      default:
        return { bg: COLORS.greenSoft, color: COLORS.green };
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>All Users</ThemedText>
        <ThemedText style={styles.subtitle}>
          View and manage platform registrations
        </ThemedText>
      </View>

      {/* CONTROLS */}
      <View style={styles.fixedControls}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsContainer}>
            {TABS.map(tab => {
              const active = activeTab === tab;
              const count = data[tab]?.length || 0;

              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tab, active && styles.tabActive]}
                >
                  <ThemedText
                    style={[styles.tabText, active && styles.tabTextActive]}
                  >
                    {tab} ({count})
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="Search by name, email or phone"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
      </View>

      {/* LIST */}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="people-outline" size={42} color={COLORS.textMuted} />
            <ThemedText style={styles.emptyText}>
              No users found in this category
            </ThemedText>
          </View>
        )}

        {filtered.map(user => {
          const status = getStatusStyle(user.status);

          return (
            <View key={user.id} style={styles.card}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={18} color={COLORS.green} />
              </View>

              <View style={styles.info}>
                <ThemedText style={styles.name}>{user.name}</ThemedText>
                <ThemedText style={styles.email}>{user.email}</ThemedText>
              </View>

              <View style={styles.right}>
                {!!user.phone && (
                  <ThemedText style={styles.phone}>{user.phone}</ThemedText>
                )}
                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                  <ThemedText
                    style={[styles.badgeText, { color: status.color }]}
                  >
                    {user.status}
                  </ThemedText>
                </View>
              </View>
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

  fixedControls: { marginBottom: 16 },

  tabsContainer: { flexDirection: "row", gap: 10, marginBottom: 14 },
  tab: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 999,
    justifyContent: "center",
    backgroundColor: COLORS.card,
  },
  tabActive: {
    backgroundColor: COLORS.greenSoft,
    borderWidth: 1,
    borderColor: COLORS.green,
  },
  tabText: { fontSize: 13, fontWeight: "600", color: COLORS.textMuted },
  tabTextActive: { color: COLORS.green },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600", color: COLORS.textDark },
  email: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  right: { alignItems: "flex-end", gap: 6 },
  phone: { fontSize: 12, color: COLORS.textMuted },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: "600" },

  emptyWrap: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: { fontSize: 14, color: COLORS.textMuted },
});
