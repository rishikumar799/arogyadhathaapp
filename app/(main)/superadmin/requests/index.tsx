import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

/* ================= TYPES ================= */

type RequestUser = {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: any;
};

/* ================= HELPERS ================= */

function normalizeRole(role?: string) {
  return (role || "").trim().toLowerCase();
}

const ROLE_COLLECTION_MAP: Record<string, string> = {
  doctor: "doctors",
  patient: "patients",
  diagnostics: "diagnostics",
  pharmacy: "pharmacies",
  receptionist: "receptionists",
  hospital: "hospitals",
};

/* ================= SCREEN ================= */

export default function RequestsScreen() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<RequestUser[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);

    const q = query(
      collection(db, "requests"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    const list = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as any) }))
      .filter((r) => r.status === "pending");

    setRequests(list);
    setLoading(false);
  };

  /* ================= APPROVE ================= */

  const approveRequest = async (req: RequestUser) => {
    try {
      const role = normalizeRole(req.role);
      const roleCollection = ROLE_COLLECTION_MAP[role];

      // 1️⃣ USERS (GLOBAL IDENTITY)
      await setDoc(doc(db, "users", req.uid), {
        uid: req.uid,
        name: req.name,
        email: req.email,
        phone: req.phone,
        role,
        status: "approved",
        createdAt: serverTimestamp(),
      });

      // 2️⃣ ROLE-SPECIFIC COLLECTION
      if (roleCollection) {
        await setDoc(
          doc(db, roleCollection, req.uid),
          {
            uid: req.uid,
            name: req.name,
            email: req.email,
            phone: req.phone,
            status: "approved",
            createdAt: serverTimestamp(),
            approvedFromRequests: true,
          },
          { merge: true }
        );
      }

      // 3️⃣ HOSPITAL CONFIG (ONLY IF HOSPITAL)
      if (role === "hospital") {
        await setDoc(
          doc(db, "hospitalConfigs", req.uid),
          {
            registrationApprovals: true,
            staffManagement: true,
            rolePermissions: true,
            moduleDoctors: true,
            modulePatients: true,
            moduleDiagnostics: true,
            modulePharmacy: true,
            branding: false,
            reports: false,
            createdAt: serverTimestamp(),
            approvedFromRequests: true,
          },
          { merge: true }
        );
      }

      // 4️⃣ DELETE FROM REQUESTS
      await deleteDoc(doc(db, "requests", req.id));

      // 5️⃣ ACTIVITY LOG
      await addDoc(collection(db, "activityLogs"), {
        message: `${role} approved (${req.email})`,
        createdAt: serverTimestamp(),
      });

      fetchRequests();
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  /* ================= REJECT ================= */

  const rejectRequest = async (req: RequestUser) => {
    try {
      await updateDoc(doc(db, "requests", req.id), {
        status: "rejected",
      });

      await addDoc(collection(db, "activityLogs"), {
        message: `${req.role} rejected (${req.email})`,
        createdAt: serverTimestamp(),
      });

      fetchRequests();
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.heading}>
        Registration Requests
      </ThemedText>

      <View style={styles.panel}>
        {requests.length === 0 && (
          <ThemedText style={styles.empty}>
            No pending requests 🎉
          </ThemedText>
        )}

        {requests.map((req) => (
          <View key={req.id} style={styles.card}>
            <View style={styles.header}>
              <ThemedText style={styles.name}>{req.name}</ThemedText>
              <RoleBadge role={req.role} />
            </View>

            <ThemedText style={styles.meta}>{req.email}</ThemedText>
            <ThemedText style={styles.meta}>{req.phone}</ThemedText>

            <View style={styles.actions}>
              <Pressable
                style={[styles.btn, styles.approve]}
                onPress={() => approveRequest(req)}
              >
                <Ionicons name="checkmark" size={16} color="#FFF" />
                <ThemedText style={styles.btnText}>Approve</ThemedText>
              </Pressable>

              <Pressable
                style={[styles.btn, styles.reject]}
                onPress={() => rejectRequest(req)}
              >
                <Ionicons name="close" size={16} color="#FFF" />
                <ThemedText style={styles.btnText}>Reject</ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/* ================= COMPONENTS ================= */

function RoleBadge({ role }: { role: string }) {
  return (
    <View style={styles.badge}>
      <ThemedText style={styles.badgeText}>{role}</ThemedText>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    padding: 24,
    gap: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },
  panel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  empty: {
    color: "#64748B",
  },
  card: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    color: "#15803D",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  approve: { backgroundColor: "#16A34A" },
  reject: { backgroundColor: "#DC2626" },
  btnText: {
    color: "#FFF",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
