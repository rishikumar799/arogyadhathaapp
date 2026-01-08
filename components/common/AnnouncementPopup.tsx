import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  uid: string;
  role: string;
};

export default function AnnouncementPopup({ uid, role }: Props) {
  const [announcement, setAnnouncement] = useState<any | null>(null);

  /* ---------------- LOAD ON LOGIN ---------------- */

  useEffect(() => {
    if (!uid || !role) return;

    const timer = setTimeout(() => {
      loadAnnouncement();
    }, 300);

    return () => clearTimeout(timer);
  }, [uid, role]);

  /* ---------------- LOAD ANNOUNCEMENT ---------------- */

  const loadAnnouncement = async () => {
    const now = Timestamp.now();

    const snap = await getDocs(
      query(
        collection(db, "announcements"),
        where("active", "==", true)
      )
    );

    for (const d of snap.docs) {
      const a = d.data();

      // 🎯 role filter
      if (a.target !== "all" && a.target !== role.toLowerCase()) continue;

      // ⏱ time window
      if (now.toMillis() < a.startAt.toMillis()) continue;
      if (now.toMillis() > a.endAt.toMillis()) continue;

      // ✅ show popup
      setAnnouncement({ id: d.id, ...a });
      break;
    }
  };

  /* ---------------- GOT IT ---------------- */

  const onGotIt = async () => {
    if (!announcement) return;

    // 🔥 Firestore auto-creates collection & doc
    await setDoc(
      doc(db, "announcementViews", announcement.id, "views", uid),
      {
        uid,
        role: role.toLowerCase(),
        createdAt: Timestamp.now(),
      }
    );

    setAnnouncement(null);
  };

  if (!announcement) return null;

  /* ---------------- UI ---------------- */

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ThemedText style={styles.title}>Announcement</ThemedText>

          <ThemedText style={styles.message}>
            {announcement.message}
          </ThemedText>

          <TouchableOpacity style={styles.btn} onPress={onGotIt}>
            <ThemedText style={styles.btnText}>Got it</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 18,
  },
  btn: {
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
