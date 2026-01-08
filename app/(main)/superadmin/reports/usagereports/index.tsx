import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function SystemInsightsScreen() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const configsSnap = await getDocs(collection(db, "hospitalConfigs"));

    let approved = 0;
    let pending = 0;

    usersSnap.forEach((d) => {
      d.data().status === "approved" ? approved++ : pending++;
    });

    setStats({
      totalUsers: usersSnap.size,
      approved,
      pending,
      configs: configsSnap.size,
    });
  };

  if (!stats) return null;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.title}>System Insights</ThemedText>

      {/* Health Analytics */}
      <Section title="Health Analytics">
        <Stat label="Total Users" value={stats.totalUsers} />
        <Stat label="Approved Users" value={stats.approved} />
        <Stat label="Pending Users" value={stats.pending} />
        <Stat label="Hospitals Configured" value={stats.configs} />
      </Section>

      {/* Error Trends */}
      <Section title="Error Trends">
        <ThemedText style={styles.placeholder}>
          Crash & error analytics integration pending.
        </ThemedText>
      </Section>

      {/* Performance Overview */}
      <Section title="Performance Overview">
        <ThemedText style={styles.placeholder}>
          API latency, sync health, uptime metrics coming soon.
        </ThemedText>
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
  placeholder: { color: "#64748B" },
});
