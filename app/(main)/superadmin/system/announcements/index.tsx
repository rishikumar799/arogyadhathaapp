import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ---------------- CONSTANTS ---------------- */

const ROLES = [
  "hospital",
  "doctor",
  "patient",
  "diagnostics",
  "pharmacy",
  "receptionist",
  "admin",
];

/* ================= SCREEN ================= */

export default function AnnouncementsScreen() {
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [endAt, setEndAt] = useState<Date | null>(null);

  const [search, setSearch] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, any>>({});

  /* ---------------- LOAD ANNOUNCEMENTS ---------------- */

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const snap = await getDocs(collection(db, "announcements"));
    setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  /* ---------------- REALTIME VIEW COUNTS ---------------- */

useEffect(() => {
  const loadCounts = async () => {
    const counts: any = {};

    for (const a of announcements) {
      counts[a.id] = {
        hospital: 0,
        doctor: 0,
        patient: 0,
        diagnostics: 0,
        pharmacy: 0,
        receptionist: 0,
        admin: 0,
      };

      const snap = await getDocs(
        collection(db, "announcementViews", a.id, "views")
      );

      snap.forEach(d => {
        const role = (d.data().role || "").toLowerCase();
        if (counts[a.id][role] !== undefined) {
          counts[a.id][role]++;
        }
      });
    }

    setViewCounts(counts);
  };

  if (announcements.length) loadCounts();
}, [announcements]);




  /* ---------------- PUBLISH ---------------- */

  const publish = async () => {
    if (!message || !startAt || !endAt) {
      alert("Please complete all fields");
      return;
    }

    if (endAt <= startAt) {
      alert("End time must be after start time");
      return;
    }

    await addDoc(collection(db, "announcements"), {
      message,
      target,
      startAt: Timestamp.fromDate(startAt),
      endAt: Timestamp.fromDate(endAt),
      active: true,
      createdAt: serverTimestamp(),
    });

    setMessage("");
    setStartAt(null);
    setEndAt(null);

    loadAnnouncements();
  };

  /* ---------------- ACTIONS ---------------- */

  const stopAnnouncement = async (id: string) => {
    await updateDoc(doc(db, "announcements", id), { active: false });
    loadAnnouncements();
  };

  const rerunAnnouncement = async (a: any) => {
    const now = Timestamp.now();
    await updateDoc(doc(db, "announcements", a.id), {
      active: true,
      startAt: now,
      endAt: Timestamp.fromMillis(now.toMillis() + 24 * 60 * 60 * 1000),
    });
    loadAnnouncements();
  };

  /* ---------------- STATUS ---------------- */

  const getStatus = (a: any) => {
    const now = Date.now();
    if (!a.active) return "Stopped";
    if (now < a.startAt.toMillis()) return "Upcoming";
    if (now > a.endAt.toMillis()) return "Expired";
    return "Running";
  };

  const filtered = announcements.filter((a) =>
    a.message.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.title}>Announcements</ThemedText>

      {/* CREATE */}
      <View style={styles.createCard}>
        <ThemedText style={styles.section}>Create Announcement</ThemedText>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Write system update, downtime alert, or important notice…"
          multiline
          style={styles.textArea}
        />

        {Platform.OS === "web" && (
          <View style={styles.timeRow}>
            <input
              type="datetime-local"
              onChange={(e) => setStartAt(new Date(e.target.value))}
              style={styles.webInput}
            />
            <input
              type="datetime-local"
              onChange={(e) => setEndAt(new Date(e.target.value))}
              style={styles.webInput}
            />
          </View>
        )}

        <TouchableOpacity style={styles.publishBtn} onPress={publish}>
          <ThemedText style={styles.publishText}>
            Publish Announcement
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search announcements…"
          style={styles.searchInput}
        />
      </View>

      {/* LIST */}
      <View style={styles.listCard}>
        <ThemedText style={styles.section}>All Announcements</ThemedText>

        {filtered.map((a) => {
          const status = getStatus(a);

          return (
            <View key={a.id} style={styles.announceItem}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.msg}>{a.message}</ThemedText>

                <ThemedText style={styles.meta}>
                  {a.target.toUpperCase()} • {status}
                </ThemedText>

                <ThemedText style={styles.time}>
                  {a.startAt.toDate().toLocaleString()} →{" "}
                  {a.endAt.toDate().toLocaleString()}
                </ThemedText>

                {/* VIEW COUNTS */}
                <View style={styles.viewStats}>
                  {ROLES.map((r) => (
                    <View key={r} style={styles.viewPill}>
                      <ThemedText style={styles.viewRole}>{r}</ThemedText>
                      <ThemedText style={styles.viewCount}>
                        {viewCounts[a.id]?.[r] || 0}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.actions}>
                {status === "Running" && (
                  <ActionBtn
                    label="Stop"
                    danger
                    onPress={() => stopAnnouncement(a.id)}
                  />
                )}
                {(status === "Expired" || status === "Stopped") && (
                  <ActionBtn
                    label="Re-run"
                    onPress={() => rerunAnnouncement(a)}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

/* ---------------- SUB ---------------- */

function ActionBtn({ label, onPress, danger }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionBtn, danger && styles.actionDanger]}
    >
      <ThemedText
        style={[styles.actionText, danger && styles.actionTextDanger]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES (UNCHANGED) ---------------- */

const styles = StyleSheet.create({
  page: { padding: 24 },
  title: { fontSize: 28, fontWeight: "900", marginBottom: 20 },
  section: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  createCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },
  textArea: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  timeRow: { flexDirection: "row", gap: 12 },
  webInput: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    border: "1px solid #E5E7EB",
  },
  publishBtn: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 20,
  },
  publishText: { color: "#fff", fontWeight: "800" },
  searchBox: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    marginBottom: 18,
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
  },
  announceItem: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  msg: { fontWeight: "700", marginBottom: 4 },
  meta: { fontSize: 12, color: "#64748B" },
  time: { fontSize: 11, color: "#94A3B8" },
  actions: { justifyContent: "center", marginLeft: 10 },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    marginBottom: 6,
  },
  actionDanger: { backgroundColor: "#FEE2E2" },
  actionText: { fontSize: 12, fontWeight: "700", color: "#166534" },
  actionTextDanger: { color: "#991B1B" },
  viewStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  viewPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
  },
  viewRole: { fontSize: 11, color: "#64748B", fontWeight: "600" },
  viewCount: { fontSize: 11, fontWeight: "800" },
});
