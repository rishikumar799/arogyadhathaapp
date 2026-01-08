import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ViewPatientPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

   const load = async () => {
  // 1️⃣ patients (PRIMARY)
  let snap = await getDoc(doc(db, "patients", id));

  // 2️⃣ fallback to users
  if (!snap.exists()) {
    snap = await getDoc(doc(db, "users", id));
  }

  if (snap.exists()) {
    setPatient(snap.data());
  }

  setLoading(false);
};


    load();
  }, [id]);

  if (loading) {
    return <ThemedText style={styles.center}>Loading…</ThemedText>;
  }

  if (!patient) {
    return (
      <ThemedText style={styles.center}>
        Patient not found
      </ThemedText>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={18} />
      </TouchableOpacity>

      <ThemedText style={styles.title}>
        {patient.name || "Unnamed Patient"}
      </ThemedText>

      <Label label="Email" value={patient.email} />
      <Label label="Phone" value={patient.phone} />
      <Label label="Role" value={patient.role} />
      <Label label="Status" value={patient.status} />
      <Label label="UID" value={id} />
    </View>
  );
}

function Label({ label, value }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText>{value || "-"}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 24, backgroundColor: "#F8FAFC" },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  label: {
    fontWeight: "600",
    color: "#64748B",
  },
  center: {
    textAlign: "center",
    marginTop: 100,
  },
});
