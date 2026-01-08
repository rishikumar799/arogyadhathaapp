import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

/* ================= CONSTANTS ================= */

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  textDark: "#0F172A",
  textMuted: "#64748B",
  green: "#16A34A",
  border: "#16a34a",
};

const CONTAINER_PADDING = 24;
const GAP = 16;

const ROLES = [
  {
    key: "doctor",
    title: "Doctors",
    subtitle: "View and manage all registered doctors",
    icon: "medkit-outline",
    route: "/superadmin/users/doctors",
    color: "#2563EB",
    soft: "#DBEAFE",
  },
  {
    key: "patient",
    title: "Patients",
    subtitle: "Access patient records and profiles",
    icon: "people-outline",
    route: "/superadmin/users/patients",
    color: "#16A34A",
    soft: "#DCFCE7",
  },
  {
    key: "diagnostics",
    title: "Diagnostics",
    subtitle: "Manage laboratory staff and reports",
    icon: "flask-outline",
    route: "/superadmin/users/diagnostics",
    color: "#7C3AED",
    soft: "#EDE9FE",
  },
  {
    key: "receptionist",
    title: "Receptionists",
    subtitle: "Control receptionist access and duties",
    icon: "headset-outline",
    route: "/superadmin/users/receptionists",
    color: "#EA580C",
    soft: "#FFEDD5",
  },
  {
    key: "pharmacy",
    title: "Pharmacy",
    subtitle: "View and manage pharmacy users",
    icon: "business-outline",
    route: "/superadmin/users/pharmacy",
    color: "#9333EA",
    soft: "#F3E8FF",
  },
  {
    key: "hospital",
    title: "Hospitals",
    subtitle: "Registered hospitals and sub-admins",
    icon: "home-outline",
    route: "/superadmin/users/hospitals",
    color: "#065F46",
    soft: "#D1FAE5",
  },
  {
    key: "allusers",
    title: "All Users",
    subtitle: "View all users across roles",
    icon: "layers-outline",
    route: "/superadmin/users/allusers",
    color: "#0F172A",
    soft: "#E5E7EB",
  },
  {
    key: "adduser",
    title: "Add User",
    subtitle: "Create a new user account",
    icon: "person-add-outline",
    route: "/superadmin/users/adduser",
    color: "#16A34A",
    soft: "#DCFCE7",
  },
];

/* ================= ROOT ================= */

export default function ManageUsersIndex() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [totalUsers, setTotalUsers] = useState(0);

  const screenWidth = Dimensions.get("window").width;

  /* ================= RESPONSIVE COLUMNS ================= */

  const columns = useMemo(() => {
    if (screenWidth < 600) return 2;     // mobile
    if (screenWidth < 1024) return 3;    // tablet
    return 4;                            // laptop / desktop
  }, [screenWidth]);

  const cardWidth = useMemo(() => {
    const available =
      screenWidth - CONTAINER_PADDING * 2 - GAP * (columns - 1);
    return Math.floor(available / columns);
  }, [screenWidth, columns]);

  /* ================= LOAD COUNTS ================= */

  useEffect(() => {
    const loadCounts = async () => {
      const snap = await getDocs(collection(db, "users"));
      const map: Record<string, number> = {};
      let total = 0;

      snap.forEach(doc => {
        total++;
        const role = String(doc.data()?.role || "")
          .toLowerCase()
          .trim();
        map[role] = (map[role] || 0) + 1;
      });

      setCounts(map);
      setTotalUsers(total);
    };

    loadCounts();
  }, []);

  /* ================= UI ================= */

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Manage Users</ThemedText>
        <ThemedText style={styles.subtitle}>
          View and organize all user groups in the system
        </ThemedText>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {ROLES.map(role => {
          const count =
            role.key === "allusers"
              ? totalUsers
              : counts[role.key] || 0;

          return (
            <UserCard
              key={role.key}
              role={role}
              width={cardWidth}
              count={count}
              onPress={() => router.push(role.route)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

/* ================= CARD ================= */

function UserCard({ role, count, onPress, width }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.card,
        { width },
        hovered && Platform.OS === "web" && styles.cardHover,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: role.soft }]}>
        <Ionicons name={role.icon} size={22} color={role.color} />
      </View>

      <ThemedText style={styles.cardTitle}>{role.title}</ThemedText>
      <ThemedText style={styles.cardSubtitle}>
        {role.subtitle}
      </ThemedText>

      <View style={styles.countPill}>
        <ThemedText style={styles.countText}>
          {count} users
        </ThemedText>
      </View>
    </Pressable>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: CONTAINER_PADDING,
    backgroundColor: COLORS.bg,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
    paddingBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 3,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
     transitionDuration: "200ms",
  },

  cardHover: {
    transform: [{ scale: 1.04 }],
    shadowRadius: 2,
  },

  cardPressed: {
    transform: [{ scale: 0.98 }],
  },

  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  countPill: {
    marginTop: 14,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F0FDF4",
  },

  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.green,
  },
});
