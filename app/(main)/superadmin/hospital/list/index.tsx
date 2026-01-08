import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
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
};

/* ================= TYPES ================= */

type Hospital = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
};

/* ================= ROOT ================= */

export default function HospitalListScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState("");

  /* ---------- REALTIME USERS (SOURCE OF TRUTH) ---------- */
  useEffect(() => {
    const q = query(collection(db, "users"));

    const unsub = onSnapshot(q, snap => {
      const list: Hospital[] = [];

      snap.forEach(d => {
        const u = d.data() as any;
        const role = (u.role || "").toLowerCase().trim();

        // ✅ ONLY REAL HOSPITAL USERS
        if (role !== "hospital") return;

        list.push({
          id: d.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          status: u.status || "approved",
        });
      });

      setHospitals(list);
    });

    return unsub;
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

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.title}>Hospitals</ThemedText>
      <ThemedText style={styles.subtitle}>
        Registered hospital accounts
      </ThemedText>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          placeholder="Search hospitals"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {filtered.length === 0 && (
          <ThemedText style={{ textAlign: "center", marginTop: 40 }}>
            No hospitals found
          </ThemedText>
        )}

        {filtered.map(h => (
          <View key={h.id} style={styles.card}>
            <View style={styles.avatar}>
              <Ionicons name="business" size={18} color={COLORS.green} />
            </View>

            <View style={{ flex: 1 }}>
              <ThemedText style={styles.name}>
                {h.name || "Unnamed Hospital"}
              </ThemedText>
              <ThemedText style={styles.meta}>{h.email}</ThemedText>
              {!!h.phone && (
                <ThemedText style={styles.meta}>{h.phone}</ThemedText>
              )}
            </View>

            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>
                {h.status}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 24, backgroundColor: COLORS.bg },
  title: { fontSize: 26, fontWeight: "700", color: COLORS.textDark },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 14 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
    marginBottom: 18,
  },

  searchInput: { flex: 1 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
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

  name: { fontSize: 15, fontWeight: "600", color: COLORS.textDark },
  meta: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  badge: {
    backgroundColor: COLORS.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, fontWeight: "600", color: COLORS.green },
});
