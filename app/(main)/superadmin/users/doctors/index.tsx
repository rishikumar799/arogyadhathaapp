import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { restoreUser, softDeleteUser } from "@/lib/userManagement";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= COLORS ================= */

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  textDark: "#0F172A",
  textMuted: "#64748B",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  red: "#DC2626",
  redSoft: "#FEE2E2",
};

/* ================= ROOT ================= */

export default function DoctorsPage() {
  const router = useRouter();

  const [activeDoctors, setActiveDoctors] = useState<any[]>([]);
  const [deletedDoctors, setDeletedDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= ACTIVE DOCTORS (NO ROLE QUERY) ================= */

 useEffect(() => {
  const q = collection(db, "doctors");

  return onSnapshot(q, snap => {
    const doctors = snap.docs.map(d => ({
      id: d.id,
      deleted: false,
      ...d.data(),
    }));

    setActiveDoctors(doctors);
    setLoading(false);
  });
}, []);


  /* ================= DELETED DOCTORS ================= */

  useEffect(() => {
    const q = collection(db, "usermanagement");

    return onSnapshot(q, snap => {
      const deleted = snap.docs
        .map(d => ({
          id: d.id,
          deleted: true,
          ...d.data(),
        }))
        .filter(u =>
          String(u.role || "")
            .toLowerCase()
            .trim() === "doctor"
        );

      setDeletedDoctors(deleted);
    });
  }, []);

  /* ================= MERGE + DEDUPE ================= */

  const doctors = useMemo(() => {
    const deletedMap = new Map<string, any>();
    deletedDoctors.forEach(d => deletedMap.set(d.id, d));

    const merged: any[] = [];

    // active doctors ONLY if not deleted
    activeDoctors.forEach(d => {
      if (!deletedMap.has(d.id)) {
        merged.push(d);
      }
    });

    // deleted doctors always last
    deletedDoctors.forEach(d => merged.push(d));

    const q = search.toLowerCase().trim();
    if (!q) return merged;

    return merged.filter(d =>
      `${d.name || ""} ${d.email || ""} ${d.phone || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [activeDoctors, deletedDoctors, search]);

  /* ================= UI ================= */

  return (
    <ScrollView style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/superadmin/users/manageusers")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={18} />
        </TouchableOpacity>

        <View>
          <ThemedText style={styles.title}>Doctors</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage and view registered doctors
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/superadmin/users/adduser")}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <ThemedText style={styles.addText}>Add Doctor</ThemedText>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          placeholder="Search doctors..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LOADING */}
      {loading && (
        <ThemedText style={styles.empty}>
          Loading doctors…
        </ThemedText>
      )}

      {/* LIST */}
      {!loading &&
        doctors.map(d => (
          <View
            key={d.id}
            style={[
              styles.card,
              d.deleted && styles.cardDeleted,
            ]}
          >
            <View style={styles.left}>
              <Ionicons
                name="person-circle-outline"
                size={36}
                color={d.deleted ? COLORS.textMuted : COLORS.green}
              />

              <View>
                <ThemedText style={styles.name}>
                  {d.name || "Unnamed"}
                </ThemedText>
                <ThemedText style={styles.meta}>
                  {d.email}
                </ThemedText>

                {d.deleted && (
                  <ThemedText style={styles.deletedTag}>
                    Deleted
                  </ThemedText>
                )}
              </View>
            </View>

            <View style={styles.actions}>
              {!d.deleted && (
                <>
                  <IconBtn
                    icon="eye-outline"
                    onPress={() =>
                      router.push(
                        `/superadmin/users/doctors/view/${d.id}`
                      )
                    }
                  />
                  <IconBtn
                    icon="create-outline"
                    onPress={() =>
                      router.push(
                        `/superadmin/users/doctors/edit/${d.id}`
                      )
                    }
                  />
                  <IconBtn
                    icon="trash-outline"
                    danger
                    onPress={() =>
                      softDeleteUser(d.id, "SUPER_ADMIN_UID")
                    }
                  />
                </>
              )}

              {d.deleted && (
                <IconBtn
                  icon="refresh-outline"
                  restore
                  onPress={() => restoreUser(d.id)}
                />
              )}
            </View>
          </View>
        ))}

      {!loading && doctors.length === 0 && (
        <ThemedText style={styles.empty}>
          No doctors found
        </ThemedText>
      )}
    </ScrollView>
  );
}

/* ================= ICON BUTTON ================= */

function IconBtn({ icon, onPress, danger, restore }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.iconBtn,
        danger && { backgroundColor: COLORS.redSoft },
        restore && { backgroundColor: COLORS.greenSoft },
      ]}
    >
      <Ionicons
        name={icon}
        size={16}
        color={
          danger
            ? COLORS.red
            : restore
            ? COLORS.green
            : COLORS.textDark
        }
      />
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.bg, padding: 24 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },

  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 14, color: COLORS.textMuted },

  addBtn: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: COLORS.green,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
  },

  addText: { color: "#fff", fontWeight: "600" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 20,
  },

  searchInput: { flex: 1, marginLeft: 8 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  cardDeleted: {
    opacity: 0.6,
    borderWidth: 1,
    borderColor: COLORS.redSoft,
  },

  left: { flexDirection: "row", gap: 12, alignItems: "center" },

  name: { fontSize: 15, fontWeight: "600" },
  meta: { fontSize: 12, color: COLORS.textMuted },

  deletedTag: {
    marginTop: 4,
    fontSize: 11,
    color: COLORS.red,
    fontWeight: "700",
    backgroundColor: COLORS.redSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: "flex-start",
  },

  actions: { flexDirection: "row", gap: 8 },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  empty: {
    textAlign: "center",
    color: COLORS.textMuted,
    marginTop: 60,
  },
});
