import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { db } from "@/lib/firebaseConfig";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { loadWebSession } from "@/lib/webPersist";

/* ================= CONSTANTS ================= */

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E5E7EB",
  textDark: "#0F172A",
  textMuted: "#64748B",
  green: "#16A34A",
  softGreen: "#DCFCE7",
};

const ACTIVITY_TABS = [
  { label: "All", value: "all" },
  { label: "Doctor", value: "doctor" },
  { label: "Patient", value: "patient" },
  { label: "Diagnostics", value: "diagnostics" },
  { label: "Pharmacy", value: "pharmacy" },
  { label: "Receptionist", value: "receptionist" },
  { label: "Hospital", value: "hospital" },
  { label: "Admin", value: "admin" },
];

/* ================= ROOT ================= */

export default function WebDashboard() {
  const [displayName, setDisplayName] = useState("User");

  const [stats, setStats] = useState({
    totalUsers: 0,
    doctors: 0,
    patients: 0,
    diagnostics: 0,
    pharmacy: 0,
    receptionists: 0,
    admins: 0,
    hospitals: 0,
    pendingRequests: 0,
  });

  const [activities, setActivities] = useState<any[]>([]);
  const [activitySearch, setActivitySearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  /* ================= LOAD NAME ================= */

  useEffect(() => {
    if (Platform.OS === "web") {
      const session = loadWebSession();
      const name =
        session?.name ||
        session?.user?.name ||
        session?.email ||
        "User";
      setDisplayName(name);
    }
  }, []);

  /* ================= USER COUNTS ================= */

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), snap => {
      const nextStats = {
        totalUsers: snap.size,
        doctors: 0,
        patients: 0,
        diagnostics: 0,
        pharmacy: 0,
        receptionists: 0,
        admins: 0,
        hospitals: 0,
        pendingRequests: 0,
      };

      snap.forEach(d => {
        const role = String(d.data()?.role || "")
          .toLowerCase()
          .trim();

        if (role === "doctor") nextStats.doctors++;
        else if (role === "patient") nextStats.patients++;
        else if (role === "diagnostics") nextStats.diagnostics++;
        else if (role === "pharmacy") nextStats.pharmacy++;
        else if (role === "receptionist")
          nextStats.receptionists++;
        else if (role === "hospital") nextStats.hospitals++;
        else if (role === "admin" || role === "superadmin")
          nextStats.admins++;
      });

      setStats(prev => ({
        ...nextStats,
        pendingRequests: prev.pendingRequests,
      }));
    });

    const unsubReq = onSnapshot(
      query(
        collection(db, "requests"),
        where("status", "==", "pending")
      ),
      snap =>
        setStats(prev => ({
          ...prev,
          pendingRequests: snap.size,
        }))
    );

    return () => {
      unsubUsers();
      unsubReq();
    };
  }, []);

  /* ================= ACTIVITY LOGS ================= */

  useEffect(() => {
    const q = query(
      collection(db, "activityLogs"),
      orderBy("createdAt", "desc"),
      limit(40)
    );

    return onSnapshot(q, snap => {
      setActivities(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          type: String(d.data()?.type || "other")
            .toLowerCase()
            .trim(),
        }))
      );
    });
  }, []);

  /* ================= FILTER ================= */

  const filteredActivities = useMemo(() => {
    const q = activitySearch.toLowerCase().trim();

    return activities.filter(a => {
      const tabOk =
        activeTab === "all" || a.type === activeTab;

      const searchOk =
        !q ||
        String(a.message || "")
          .toLowerCase()
          .includes(q);

      return tabOk && searchOk;
    });
  }, [activities, activitySearch, activeTab]);

  /* ================= UI ================= */

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.title}>
        Welcome back, {displayName} 👋
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Live system overview
      </ThemedText>

      <View style={styles.row}>
        <Stat title="Total Users" value={stats.totalUsers} icon="people-outline" />
        <Stat title="Doctors" value={stats.doctors} icon="medkit-outline" />
        <Stat title="Patients" value={stats.patients} icon="person-outline" />
        <Stat title="Diagnostics" value={stats.diagnostics} icon="flask-outline" />
        <Stat title="Pharmacy" value={stats.pharmacy} icon="business-outline" />
        <Stat title="Receptionists" value={stats.receptionists} icon="headset-outline" />
        <Stat title="Admins" value={stats.admins} icon="shield-checkmark-outline" />
        <Stat title="Hospitals" value={stats.hospitals} icon="home-outline" />
        <Stat title="Pending Requests" value={stats.pendingRequests} icon="alert-circle-outline" highlight />
      </View>

      {/* ================= RECENT ACTIVITY ================= */}

      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>
          Recent Activity
        </ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabs}>
            {ACTIVITY_TABS.map(t => (
              <TouchableOpacity
                key={t.value}
                onPress={() => setActiveTab(t.value)}
                style={[
                  styles.tab,
                  activeTab === t.value && styles.tabActive,
                ]}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    activeTab === t.value &&
                      styles.tabTextActive,
                  ]}
                >
                  {t.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            placeholder="Search activity..."
            value={activitySearch}
            onChangeText={setActivitySearch}
            style={styles.searchInput}
          />
        </View>

        {/* 🔥 SCROLLABLE ACTIVITY LIST */}
        <ScrollView
          style={styles.activityScroller}
          showsVerticalScrollIndicator
        >
          {filteredActivities.length === 0 && (
            <ThemedText style={styles.muted}>
              No activity found
            </ThemedText>
          )}

          {filteredActivities.map(a => (
            <View key={a.id} style={styles.activity}>
              <View style={styles.dot} />
              <ThemedText style={styles.activityText}>
                {a.message}
              </ThemedText>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

/* ================= STAT ================= */

function Stat({ title, value, icon, highlight }: any) {
  return (
    <View
      style={[
        styles.stat,
        highlight && { backgroundColor: COLORS.softGreen },
      ]}
    >
      <View style={styles.icon}>
        <Ionicons name={icon} size={20} color={COLORS.green} />
      </View>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { padding: 24, gap: 20, backgroundColor: COLORS.bg },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 14, color: COLORS.textMuted },

  row: { flexDirection: "row", flexWrap: "wrap", gap: 16 },

  stat: {
    width: 220,
    backgroundColor: COLORS.card,
    padding: 18,
    borderRadius: 16,
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  statTitle: { fontSize: 13, color: COLORS.textMuted },
  statValue: { fontSize: 22, fontWeight: "700" },

  card: { backgroundColor: COLORS.card, borderRadius: 18, padding: 20 },

  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },

  tabs: { flexDirection: "row", gap: 10, marginBottom: 12 },

  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
  },

  tabActive: {
    backgroundColor: COLORS.softGreen,
    borderWidth: 1,
    borderColor: COLORS.green,
  },

  tabText: { fontSize: 13, color: COLORS.textMuted, fontWeight: "600" },
  tabTextActive: { color: COLORS.green },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },

  searchInput: { flex: 1, marginLeft: 6 },

  activityScroller: {
    maxHeight: 260, // 🔥 KEY FIX
  },

  activity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  activityText: { fontSize: 14 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },

  muted: { color: COLORS.textMuted },
});
