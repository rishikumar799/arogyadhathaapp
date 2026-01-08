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

/* ================= PAGE ================= */

export default function ReceptionistsPage() {
  const router = useRouter();

  const [activeReceptionists, setActiveReceptionists] = useState<any[]>([]);
  const [deletedReceptionists, setDeletedReceptionists] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= ACTIVE RECEPTIONISTS ================= */

  useEffect(() => {
  const q = collection(db, "receptionists");

  return onSnapshot(q, snap => {
    const data = snap.docs.map(d => ({
      id: d.id,
      deleted: false,
      ...d.data(),
    }));

    setActiveReceptionists(data);
    setLoading(false);
  });
}, []);


  /* ================= DELETED RECEPTIONISTS ================= */

  useEffect(() => {
    const q = collection(db, "usermanagement");

    return onSnapshot(q, snap => {
      const list = snap.docs
        .map(d => ({
          id: d.id,
          deleted: true,
          ...d.data(),
        }))
        .filter(
          u =>
            String(u.role || "")
              .toLowerCase()
              .trim() === "receptionist"
        );

      setDeletedReceptionists(list);
    });
  }, []);

  /* ================= MERGE + SEARCH ================= */

  const receptionists = useMemo(() => {
    const deletedMap = new Map<string, any>();
    deletedReceptionists.forEach(r => deletedMap.set(r.id, r));

    const merged: any[] = [];

    activeReceptionists.forEach(r => {
      if (!deletedMap.has(r.id)) merged.push(r);
    });

    deletedReceptionists.forEach(r => merged.push(r));

    const q = search.toLowerCase().trim();
    if (!q) return merged;

    return merged.filter(r =>
      `${r.name || ""} ${r.email || ""} ${r.phone || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [activeReceptionists, deletedReceptionists, search]);

  /* ================= UI ================= */

  return (
    <ScrollView style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.push("/superadmin/users/manageusers")
          }
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={18} />
        </TouchableOpacity>

        <View>
          <ThemedText style={styles.title}>
            Receptionists
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage and view registered receptionists
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            router.push("/superadmin/users/adduser")
          }
        >
          <Ionicons name="add" size={18} color="#fff" />
          <ThemedText style={styles.addText}>
            Add Receptionist
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={18}
          color={COLORS.textMuted}
        />
        <TextInput
          placeholder="Search receptionists..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LOADING */}
      {loading && (
        <ThemedText style={styles.empty}>
          Loading receptionists…
        </ThemedText>
      )}

      {/* LIST */}
      {!loading &&
        receptionists.map(r => (
          <View
            key={r.id}
            style={[
              styles.card,
              r.deleted && styles.cardDeleted,
            ]}
          >
            <View style={styles.left}>
              <Ionicons
                name="person-outline"
                size={36}
                color={
                  r.deleted
                    ? COLORS.textMuted
                    : COLORS.green
                }
              />

              <View>
                <ThemedText style={styles.name}>
                  {r.name || "Unnamed"}
                </ThemedText>
                <ThemedText style={styles.meta}>
                  {r.email}
                </ThemedText>

                {r.deleted && (
                  <ThemedText style={styles.deletedTag}>
                    Deleted
                  </ThemedText>
                )}
              </View>
            </View>

            <View style={styles.actions}>
              {!r.deleted && (
                <>
                  <IconBtn
                    icon="eye-outline"
                    onPress={() =>
                      router.push(
                        `/superadmin/users/receptionists/view/${r.id}`
                      )
                    }
                  />
                  <IconBtn
                    icon="create-outline"
                    onPress={() =>
                      router.push(
                        `/superadmin/users/receptionists/edit/${r.id}`
                      )
                    }
                  />
                  <IconBtn
                    icon="trash-outline"
                    danger
                    onPress={() =>
                      softDeleteUser(
                        r.id,
                        "SUPER_ADMIN_UID"
                      )
                    }
                  />
                </>
              )}

              {r.deleted && (
                <IconBtn
                  icon="refresh-outline"
                  restore
                  onPress={() => restoreUser(r.id)}
                />
              )}
            </View>
          </View>
        ))}

      {!loading && receptionists.length === 0 && (
        <ThemedText style={styles.empty}>
          No receptionists found
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
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 24,
  },

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

  left: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

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
