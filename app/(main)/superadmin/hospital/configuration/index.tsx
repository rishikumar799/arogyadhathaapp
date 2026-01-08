import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
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
};

/* ================= TYPES ================= */

type Hospital = {
  id: string;
  name?: string;
  email?: string;
};

type HospitalConfig = {
  registrationApprovals: boolean;
  staffManagement: boolean;
  rolePermissions: boolean;
  moduleDoctors: boolean;
  modulePatients: boolean;
  moduleDiagnostics: boolean;
  modulePharmacy: boolean;
  branding: boolean;
  reports: boolean;
};

/* ================= LABELS ================= */

const LABELS: Record<keyof HospitalConfig, string> = {
  registrationApprovals: "Registration Approvals",
  staffManagement: "Staff Management",
  rolePermissions: "Role Permissions",
  moduleDoctors: "Doctors Module",
  modulePatients: "Patients Module",
  moduleDiagnostics: "Diagnostics Module",
  modulePharmacy: "Pharmacy Module",
  branding: "Branding",
  reports: "Reports",
};

/* ================= DEFAULT CONFIG ================= */
/* 👇 THIS IS WHERE YOU CONTROL DEFAULT ON/OFF */

const DEFAULT_CONFIG: HospitalConfig = {
  registrationApprovals: true,

  // 🔒 MUST be OFF initially
  staffManagement: false,
  rolePermissions: false,
  reports: false,

  // ✅ Core medical modules
  moduleDoctors: true,
  modulePatients: true,
  moduleDiagnostics: true,

  // ❌ Optional
  modulePharmacy: false,
  branding: false,
};


/* ================= ROOT ================= */

export default function HospitalConfigurationListScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [configs, setConfigs] = useState<Record<string, HospitalConfig>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /* ---------- LOAD ONCE (BACKEND = SOURCE OF TRUTH) ---------- */
 useEffect(() => {
  const load = async () => {
    // 1️⃣ Fetch users + configs in parallel
    const [usersSnap, configsSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "hospitalConfigs")),
    ]);

    // 2️⃣ Build config map from backend
    const configMap: Record<string, HospitalConfig> = {};
    configsSnap.forEach(d => {
      configMap[d.id] = d.data() as HospitalConfig;
    });

    const hospitalList: Hospital[] = [];
    const createPromises: Promise<any>[] = [];

    // 3️⃣ Process hospitals
    usersSnap.forEach(d => {
      const u = d.data() as any;
      if ((u.role || "").toLowerCase() !== "hospital") return;

      hospitalList.push({
        id: d.id,
        name: u.name,
        email: u.email,
      });

      // 4️⃣ Create config ONLY if missing
      if (!configMap[d.id]) {
        configMap[d.id] = DEFAULT_CONFIG;

        createPromises.push(
          setDoc(doc(db, "hospitalConfigs", d.id), {
            ...DEFAULT_CONFIG,
            createdAt: serverTimestamp(),
          })
        );
      }
    });

    // 5️⃣ Fire & forget config creation (non-blocking)
    if (createPromises.length) {
      Promise.all(createPromises).catch(console.error);
    }

    // 6️⃣ Update UI immediately
    setHospitals(hospitalList);
    setConfigs(configMap);
  };

  load();
}, []);

  /* ---------- SEARCH ---------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return hospitals;

    return hospitals.filter(h =>
      `${h.name || ""} ${h.email || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [search, hospitals]);

  /* ---------- TOGGLE (UI → BACKEND SYNC) ---------- */
  const toggleFeature = async (
    hospitalId: string,
    key: keyof HospitalConfig
  ) => {
    const nextValue = !configs[hospitalId][key];

    // ✅ Update UI instantly
    setConfigs(prev => ({
      ...prev,
      [hospitalId]: {
        ...prev[hospitalId],
        [key]: nextValue,
      },
    }));

    // ✅ Persist to backend
    await setDoc(
      doc(db, "hospitalConfigs", hospitalId),
      {
        [key]: nextValue,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.title}>
        Hospital Configuration
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Super Admin → Permissions
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

      <ScrollView>
        {filtered.map(h => {
          const open = openId === h.id;
          const cfg = configs[h.id];

          return (
            <View key={h.id} style={styles.card}>
              <TouchableOpacity
                style={styles.headerRow}
                onPress={() => setOpenId(open ? null : h.id)}
              >
                <View>
                  <ThemedText style={styles.name}>{h.name}</ThemedText>
                  <ThemedText style={styles.meta}>{h.email}</ThemedText>
                </View>
                <Ionicons
                  name={open ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>

              {open && cfg && (
                <View style={styles.dropdown}>
                  {(Object.keys(DEFAULT_CONFIG) as (keyof HospitalConfig)[]).map(k => (
                    <View key={k} style={styles.row}>
                      <ThemedText>{LABELS[k]}</ThemedText>
                      <Switch
                        value={cfg[k]}
                        onValueChange={() => toggleFeature(h.id, k)}
                      />
                    </View>
                  ))}
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
  wrapper: { flex: 1, padding: 24, backgroundColor: COLORS.bg },

  title: { fontSize: 26, fontWeight: "700", color: COLORS.textDark },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 14 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 14 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
  },

  headerRow: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: { fontWeight: "600", color: COLORS.textDark },
  meta: { fontSize: 12, color: COLORS.textMuted },

  dropdown: {
    borderTopWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
});