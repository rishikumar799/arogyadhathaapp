import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// SESSION STORES
import { clearSession, loadSession } from "@/lib/authPersist";
import { clearWebSession, loadWebSession } from "@/lib/webPersist";

// FIREBASE
import { auth as firebaseAuth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";

// ✅ SINGLE SOURCE OF TRUTH
import { buildEntityId } from "@/lib/userUtils";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileMenuModal({ visible, onClose }: Props) {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [patientId, setPatientId] = useState("");

  // Animations
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  /* =========================
     LOAD SESSION (AUTHORITATIVE)
  ========================= */
  useEffect(() => {
    if (!visible) return;

    (async () => {
      const session =
        Platform.OS === "web"
          ? loadWebSession()
          : await loadSession();

      if (session?.name) {
        setUserName(session.name);
      }

      if (session?.uid) {
        // ✅ PATIENT ENTITY ID (STABLE & UNIQUE)
        setPatientId(buildEntityId(session.uid, "PAT"));
      }
    })();
  }, [visible]);

  /* =========================
     OPEN / CLOSE ANIMATION
  ========================= */
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      translateY.setValue(-12);
      scale.setValue(0.96);
    }
  }, [visible]);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = async () => {
    Platform.OS === "web" ? clearWebSession() : await clearSession();

    try {
      await signOut(firebaseAuth);
    } catch {}

    onClose();
    setTimeout(
      () => router.replace("/onboarding"),
      Platform.OS === "web" ? 50 : 150
    );
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.card,
          { opacity, transform: [{ translateY }, { scale }] },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{userName || "User"}</Text>
            {patientId ? <Text style={styles.pid}>{patientId}</Text> : null}
          </View>
        </View>

        {/* MENU */}
        {MENU.map((item) => (
          <TouchableOpacity key={item.label} style={styles.row}>
            <Ionicons name={item.icon as any} size={18} color="#065F46" />
            <Text style={styles.rowText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const MENU = [
  { label: "Wallet", icon: "wallet-outline" },
  { label: "Refer & Earn", icon: "gift-outline" },
  { label: "Insurances", icon: "shield-checkmark-outline" },
  { label: "Crowd Funding", icon: "people-outline" },
  { label: "Health Knowledge", icon: "book-outline" },
  { label: "Surgery Care", icon: "medkit-outline" },
  { label: "Blood Bank", icon: "water-outline" },
];

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.28)" },

  card: {
    position: "absolute",
    right: 14,
    top: Platform.OS === "web" ? 70 : 95,
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 14 },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#065F46",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  name: { fontSize: 15, fontWeight: "700" },
  pid: { fontSize: 11, color: "#6B7280", marginTop: 1 },

  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  rowText: { fontSize: 13, fontWeight: "600", color: "#065F46" },

  logout: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  logoutText: { color: "#DC2626", fontWeight: "700", fontSize: 13 },
});
