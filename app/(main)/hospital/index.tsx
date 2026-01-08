import AnnouncementPopup from "@/components/common/AnnouncementPopup";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { clearSession } from "@/lib/authPersist";
import { auth } from "@/lib/firebaseConfig";
import { clearWebSession, loadWebSession } from "@/lib/webPersist";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// 🔐 YOU MUST PASS REAL UID & ROLE
import { loadSession } from "@/lib/authPersist";

export default function HospitalIndex() {
  const router = useRouter();

  // 🔐 get session safely
  const session =
    Platform.OS === "web" ? loadWebSession() : loadSession();

  const uid = session?.uid;
  const role = session?.role || "hospital";

  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        clearWebSession();
      } else {
        await clearSession();
      }
      await signOut(auth);
    } catch (err) {
      console.log("Hospital logout failed", err);
    }

    router.replace("/onboarding");
  };

  return (
    <ThemedView style={styles.container}>
      {/* 🔔 ANNOUNCEMENT POPUP */}
      {!!uid && (
        <AnnouncementPopup uid={uid} role={role} />
      )}

      <ThemedText type="title">Hospital</ThemedText>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  logoutBtn: {
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
