import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= SCREEN ================= */

export default function SupportTicketsScreen() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const q = query(
      collection(db, "supportTickets"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "supportTickets", id), { status });
    loadTickets();
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.title}>Support Tickets</ThemedText>
      <ThemedText style={styles.subtitle}>
        System issues, escalations, and admin-level requests
      </ThemedText>

      <View style={styles.card}>
        {tickets.length === 0 && (
          <ThemedText style={styles.empty}>
            No support tickets found
          </ThemedText>
        )}

        {tickets.map(ticket => (
          <View key={ticket.id} style={styles.ticket}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.subject}>
                {ticket.subject}
              </ThemedText>

              <ThemedText style={styles.message}>
                {ticket.message}
              </ThemedText>

              <View style={styles.metaRow}>
                <Meta label="Role" value={ticket.role} />
                <Meta label="User" value={ticket.userEmail} />
                <Meta
                  label="Created"
                  value={ticket.createdAt?.toDate().toLocaleString()}
                />
              </View>
            </View>

            <View style={styles.actions}>
              {ticket.status !== "resolved" && (
                <>
                  {ticket.status === "open" && (
                    <ActionBtn
                      label="In Progress"
                      onPress={() =>
                        updateStatus(ticket.id, "in_progress")
                      }
                    />
                  )}
                  <ActionBtn
                    label="Resolve"
                    success
                    onPress={() =>
                      updateStatus(ticket.id, "resolved")
                    }
                  />
                </>
              )}

              {ticket.status === "resolved" && (
                <StatusBadge text="Resolved" />
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/* ================= SUB COMPONENTS ================= */

function Meta({ label, value }: any) {
  return (
    <View style={styles.meta}>
      <ThemedText style={styles.metaLabel}>{label}</ThemedText>
      <ThemedText style={styles.metaValue}>{value}</ThemedText>
    </View>
  );
}

function ActionBtn({ label, onPress, success }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.actionBtn,
        success && styles.actionSuccess,
      ]}
    >
      <ThemedText
        style={[
          styles.actionText,
          success && styles.actionTextSuccess,
        ]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

function StatusBadge({ text }: any) {
  return (
    <View style={styles.statusBadge}>
      <Ionicons name="checkmark-circle" size={14} color="#166534" />
      <ThemedText style={styles.statusText}>{text}</ThemedText>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: { padding: 24 },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },

  empty: {
    textAlign: "center",
    color: "#94A3B8",
    paddingVertical: 40,
  },

  ticket: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
  },

  subject: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },

  message: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  meta: {
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  metaLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },

  metaValue: {
    fontSize: 11,
    fontWeight: "800",
  },

  actions: {
    justifyContent: "center",
    gap: 8,
    marginLeft: 12,
  },

  actionBtn: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  actionSuccess: {
    backgroundColor: "#DCFCE7",
  },

  actionText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
  },

  actionTextSuccess: {
    color: "#166534",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#166534",
  },
});
