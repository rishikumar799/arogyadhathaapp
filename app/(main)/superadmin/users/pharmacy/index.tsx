import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { restoreUser, softDeleteUser } from "@/lib/userManagement";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
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

export default function PharmacyPage() {
  const router = useRouter();

  const [activePharmacies, setActivePharmacies] = useState<any[]>([]);
  const [deletedPharmacies, setDeletedPharmacies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= ACTIVE PHARMACY ================= */

  useEffect(() => {
  const q = collection(db, "pharmacies");

  return onSnapshot(q, snap => {
    const data = snap.docs.map(d => ({
      id: d.id,
      deleted: false,
      ...d.data(),
    }));

    setActivePharmacies(data);
    setLoading(false);
  });
}, []);


  /* ================= DELETED PHARMACY ================= */

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
            .trim() === "pharmacy"
        );

      setDeletedPharmacies(deleted);
    });
  }, []);

  /* ================= MERGE + SEARCH ================= */

  const pharmacies = useMemo(() => {
    const deletedMap = new Map<string, any>();
    deletedPharmacies.forEach(p => deletedMap.set(p.id, p));

    const merged: any[] = [];

    activePharmacies.forEach(p => {
      if (!deletedMap.has(p.id)) merged.push(p);
    });

    deletedPharmacies.forEach(p => merged.push(p));

    const q = search.toLowerCase().trim();
    if (!q) return merged;

    return merged.filter(p =>
      `${p.name || ""} ${p.email || ""} ${p.phone || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [activePharmacies, deletedPharmacies, search]);

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
          <ThemedText style={styles.title}>Pharmacy</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage and view registered pharmacies
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/superadmin/users/adduser")}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <ThemedText style={styles.addText}>
            Add Pharmacy
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          placeholder="Search pharmacy..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LOADING */}
      {loading && (
        <ThemedText style={styles.empty}>
          Loading pharmacies…
        </ThemedText>
      )}

      {/* LIST */}
      {!loading &&
        pharmacies.map(p => (
          <View
            key={p.id}
            style={[
              styles.card,
              p.deleted && styles.cardDeleted,
            ]}
          >
            <View style={styles.left}>
              <Ionicons
                name="medkit-outline"
                size={34}
                color={
                  p.deleted ? COLORS.textMuted : COLORS.green
                }
              />

              <View>
                <ThemedText style={styles.name}>
                  {p.name || "Unnamed"}
                </ThemedText>
                <ThemedText style={styles.meta}>
                  {p.email}
                </ThemedText>

                {p.deleted && (
                  <ThemedText style={styles.deletedTag}>
                    Deleted
                  </ThemedText>
                )}
              </View>
            </View>

            <View style={styles.actions}>
              {!p.deleted && (
                <>
                  <IconBtn
                    icon="eye-outline"
                    onPress={() =>
                      router.push(
                        `/superadmin/users/pharmacy/view/${p.id}`
                      )
                    }
                  />
                  <IconBtn
                    icon="create-outline"
                    onPress={() =>
                      router.push(
                        `/superadmin/users/pharmacy/edit/${p.id}`
                      )
                    }
                  />
                  <IconBtn
                    icon="trash-outline"
                    danger
                    onPress={() =>
                      softDeleteUser(
                        p.id,
                        "SUPER_ADMIN_UID"
                      )
                    }
                  />
                </>
              )}

              {p.deleted && (
                <IconBtn
                  icon="refresh-outline"
                  restore
                  onPress={() => restoreUser(p.id)}
                />
              )}
            </View>
          </View>
        ))}

      {!loading && pharmacies.length === 0 && (
        <ThemedText style={styles.empty}>
          No pharmacies found
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
