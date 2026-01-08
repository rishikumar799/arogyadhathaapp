import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AuditComplianceScreen() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "activityLogs"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setLogs(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.title}>Audit & Compliance</ThemedText>

      {/* Audit Logs */}
      <Section title="Audit Logs">
        {logs.map((l) => (
          <LogItem key={l.id} log={l} />
        ))}
      </Section>

      {/* Critical Actions */}
      <Section title="Critical Actions">
        <ThemedText style={styles.placeholder}>
          High-impact actions (role changes, deletions) will appear here.
        </ThemedText>
      </Section>

      {/* Security Events */}
      <Section title="Security Events">
        <ThemedText style={styles.placeholder}>
          Login anomalies, access violations (coming soon).
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

function LogItem({ log }: any) {
  return (
    <View style={styles.log}>
      <ThemedText style={styles.msg}>{log.message}</ThemedText>
      <ThemedText style={styles.time}>
        {log.createdAt?.toDate?.().toLocaleString?.()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 18,
  },
  section: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  log: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  msg: { fontWeight: "600" },
  time: { fontSize: 12, color: "#64748B" },
  placeholder: { color: "#64748B" },
});
