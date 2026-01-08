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

import { loadSession } from "@/lib/authPersist";
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

export default function MobileDashboard() {
  /* ---------- NAME ---------- */
  const [displayName, setDisplayName] = useState("User");

  /* ---------- STATS ---------- */
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

  /* ---------- ACTIVITY ---------- */
  const [activities, setActivities] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  /* ================= LOAD NAME ================= */

  useEffect(() => {
    let mounted = true;

    async function loadName() {
      try {
        if (Platform.OS === "web") {
          const webSession = loadWebSession();
          if (mounted && webSession?.name) {
            setDisplayName(webSession.name);
            return;
          }
        }

        const session = await loadSession();
        if (mounted && session?.name) {
          setDisplayName(session.name);
          return;
        }

        setDisplayName("User");
      } catch {
        setDisplayName("User");
      }
    }

    loadName();
    return () => {
      mounted = false;
    };
  }, []);

  /* ================= USER COUNTS ================= */

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), snap => {
      const next = {
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

        if (role === "doctor") next.doctors++;
        else if (role === "patient") next.patients++;
        else if (role === "diagnostics") next.diagnostics++;
        else if (role === "pharmacy") next.pharmacy++;
        else if (role === "receptionist") next.receptionists++;
        else if (role === "hospital") next.hospitals++;
        else if (role === "admin" || role === "superadmin")
          next.admins++;
      });

      setStats(prev => ({
        ...next,
        pendingRequests: prev.pendingRequests,
      }));
    });

    const unsubReq = onSnapshot(
      query(
        collection(db, "requests"),
        where("status", "==", "pending")
      ),
      snap => {
        setStats(prev => ({
          ...prev,
          pendingRequests: snap.size,
        }));
      }
    );

    return () => {
      unsubUsers();
      unsubReq();
    };
  }, []);

  /* ================= ACTIVITY ================= */

  useEffect(() => {
    const q = query(
      collection(db, "activityLogs"),
      orderBy("createdAt", "desc"),
      limit(25)
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

  const filteredActivities = useMemo(() => {
    const q = search.toLowerCase().trim();

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
  }, [activities, activeTab, search]);

  /* ================= UI ================= */

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View>
        <ThemedText style={styles.title}>
          Welcome back, {displayName} 👋
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Live system overview
        </ThemedText>
      </View>

      {/* STATS */}
      <View style={styles.statsGrid}>
        <Stat title="Users" value={stats.totalUsers} icon="people-outline" />
        <Stat title="Doctors" value={stats.doctors} icon="medkit-outline" />
        <Stat title="Patients" value={stats.patients} icon="person-outline" />
        <Stat title="Diagnostics" value={stats.diagnostics} icon="flask-outline" />
        <Stat title="Pharmacy" value={stats.pharmacy} icon="business-outline" />
        <Stat title="Reception" value={stats.receptionists} icon="headset-outline" />
        <Stat title="Hospitals" value={stats.hospitals} icon="home-outline" />
        <Stat title="Admins" value={stats.admins} icon="shield-checkmark-outline" />
        <Stat
          title="Pending"
          value={stats.pendingRequests}
          icon="alert-circle-outline"
          highlight
        />
      </View>

      {/* ACTIVITY */}
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
                    activeTab === t.value && styles.tabTextActive,
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
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <ScrollView style={styles.activityScroller}>
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
        <Ionicons name={icon} size={16} color={COLORS.green} />
      </View>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 18,
    backgroundColor: COLORS.bg,
  },

  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 13, color: COLORS.textMuted },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  stat: {
    width: "31%",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 16,
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  statTitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },

  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
  },

  tabActive: {
    backgroundColor: COLORS.softGreen,
    borderWidth: 1,
    borderColor: COLORS.green,
  },

  tabText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  tabTextActive: {
    color: COLORS.green,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 10,
  },

  searchInput: { flex: 1, marginLeft: 6 },

  activityScroller: {
    maxHeight: 260,
  },

  activity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  activityText: { fontSize: 14 },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },

  muted: { color: COLORS.textMuted },
});
