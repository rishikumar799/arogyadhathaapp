import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ViewDoctorPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

 const load = async () => {
  let snap = await getDoc(doc(db, "doctors", id));

  if (!snap.exists()) {
    snap = await getDoc(doc(db, "usermanagement", id));
  }

  if (snap.exists()) setDoctor(snap.data());
  setLoading(false);
};


    load();
  }, [id]);

  if (loading) {
    return <ThemedText style={styles.center}>Loading…</ThemedText>;
  }

  if (!doctor) {
    return <ThemedText style={styles.center}>Doctor not found</ThemedText>;
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={18} />
      </TouchableOpacity>

      <ThemedText style={styles.title}>{doctor.name}</ThemedText>
      <ThemedText style={styles.label}>Email</ThemedText>
      <ThemedText>{doctor.email}</ThemedText>

      <ThemedText style={styles.label}>Phone</ThemedText>
      <ThemedText>{doctor.phone || "-"}</ThemedText>

      <ThemedText style={styles.label}>Role</ThemedText>
      <ThemedText>{doctor.role}</ThemedText>
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
  label: { marginTop: 12, fontWeight: "600", color: "#64748B" },
  center: { textAlign: "center", marginTop: 100 },
});
