import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ViewDiagnosticsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      // 1️⃣ diagnostics collection (PRIMARY)
      let snap = await getDoc(doc(db, "diagnostics", id));

      // 2️⃣ fallback to users
      if (!snap.exists()) {
        snap = await getDoc(doc(db, "users", id));
      }

      // 3️⃣ fallback to requests (pending)
      if (!snap.exists()) {
        snap = await getDoc(doc(db, "requests", id));
      }

      if (snap.exists()) {
        setDiagnostics(snap.data());
      }

      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <ThemedText style={styles.center}>
        Loading…
      </ThemedText>
    );
  }

  if (!diagnostics) {
    return (
      <ThemedText style={styles.center}>
        Diagnostics not found
      </ThemedText>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={18} />
      </TouchableOpacity>

      <ThemedText style={styles.title}>
        {diagnostics.name || "Unnamed Diagnostics"}
      </ThemedText>

      <Label label="Email" value={diagnostics.email} />
      <Label label="Phone" value={diagnostics.phone} />
      <Label label="Role" value={diagnostics.role || "diagnostics"} />
      <Label label="Status" value={diagnostics.status || "approved"} />
      <Label label="UID" value={id} />
    </View>
  );
}

/* ================= HELPERS ================= */

function Label({ label, value }: any) {
  return (
    <>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText>{value || "-"}</ThemedText>
    </>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    marginTop: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  center: {
    textAlign: "center",
    marginTop: 100,
  },
});
