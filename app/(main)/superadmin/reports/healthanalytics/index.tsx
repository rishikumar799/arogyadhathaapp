import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ReportsScreen() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const hospitalsSnap = await getDocs(collection(db, "hospitals"));
    const requestsSnap = await getDocs(collection(db, "requests"));

    const roleCounts: Record<string, number> = {};

    usersSnap.forEach((d) => {
      const role = d.data().role;
      if (!role) return;
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    setData({
      totalUsers: usersSnap.size,
      hospitals: hospitalsSnap.size,
      requests: requestsSnap.size,
      roleCounts,
    });
  };

  if (!data) return null;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.title}>Reports</ThemedText>

      {/* Usage Reports */}
      <Section title="Usage Reports">
        <Stat label="Total Users" value={data.totalUsers} />
        <Stat label="Hospitals Registered" value={data.hospitals} />
        <Stat label="Pending Requests" value={data.requests} />
      </Section>

      {/* Growth Reports */}
      <Section title="Growth Reports">
        {Object.keys(data.roleCounts).map((r) => (
          <Stat
            key={r}
            label={`${r.toUpperCase()} Accounts`}
            value={data.roleCounts[r]}
          />
        ))}
      </Section>

      {/* Activity Summary */}
      <Section title="Activity Summary">
        <Stat label="Total Active Roles" value={Object.keys(data.roleCounts).length} />
        <Stat label="Platform Entities" value={data.hospitals + data.totalUsers} />
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: any) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.section}>{title}</ThemedText>
      {children}
    </View>
  );
}

function Stat({ label, value }: any) {
  return (
    <View style={styles.stat}>
      <ThemedText>{label}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
  },
  section: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  stat: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  value: { fontWeight: "700" },
});
