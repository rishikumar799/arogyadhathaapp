import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ViewReceptionistPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [receptionist, setReceptionist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!id) return;

  const load = async () => {
    // 1️⃣ Approved receptionist
    let snap = await getDoc(doc(db, "receptionists", id));

    // 2️⃣ Fallback: pending
    if (!snap.exists()) {
      snap = await getDoc(doc(db, "requests", id));
    }

    if (snap.exists()) {
      setReceptionist(snap.data());
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

  if (!receptionist) {
    return (
      <ThemedText style={styles.center}>
        Receptionist not found
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
        {receptionist.name || "Unnamed Receptionist"}
      </ThemedText>

      <Label label="Email" value={receptionist.email} />
      <Label label="Phone" value={receptionist.phone} />
      <Label label="Role" value={receptionist.role} />
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
