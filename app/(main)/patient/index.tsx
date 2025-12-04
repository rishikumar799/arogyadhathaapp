import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function PatientHomeScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setUser(snap.data());
    };

    load();
  }, []);

  return (
    <ScrollView style={styles.page}>
      {/* HEADER */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Arogyadhatha
        </ThemedText>

        <ThemedText style={styles.username}>
          {user ? user.fullName : "User"}
        </ThemedText>
      </ThemedView>

      {/* BASIC INFO */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Profile Info</ThemedText>

        <ThemedText style={styles.line}>
          Name: {user?.fullName ?? "---"}
        </ThemedText>
        <ThemedText style={styles.line}>
          Email: {user?.email ?? "---"}
        </ThemedText>
        <ThemedText style={styles.line}>
          Role: {user?.role ?? "patient"}
        </ThemedText>
      </View>

      {/* QUICK BOXES */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Your Services</ThemedText>

        <View style={styles.card}>
          <ThemedText>AI Symptom Checker</ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText>Appointments & History</ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText>Diagnostics</ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText>Medicines</ThemedText>
        </View>
      </View>

      {/* FOOTER MESSAGE */}
      <View style={styles.footer}>
        <ThemedText style={{ textAlign: "center" }}>
          More modules will load based on your backend data.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  username: {
    marginTop: 4,
    fontSize: 14,
    color: "#13c84a",
    fontWeight: "700",
  },
  section: {
    marginTop: 22,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  line: {
    fontSize: 14,
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  footer: {
    marginTop: 40,
    marginBottom: 50,
    paddingHorizontal: 20,
  },
});
