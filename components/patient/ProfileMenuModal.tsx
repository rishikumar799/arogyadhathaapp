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

// BACKEND SESSION STORES
import { clearSession, loadSession } from "@/lib/authPersist";
import { clearWebSession, loadWebSession } from "@/lib/webPersist";

// FIREBASE (SECONDARY)
import { auth as firebaseAuth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileMenuModal({ visible, onClose }: Props) {
  const router = useRouter();

  // 🔐 BACKEND USER STATE
  const [userName, setUserName] = useState("User");
  const [patientId, setPatientId] = useState("PAT001");

  // 🔥 ANIMATION VALUES
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  // ✅ LOAD USER FROM BACKEND SESSION (AUTHORITATIVE)
  useEffect(() => {
    if (!visible) return;

    (async () => {
      const session =
        Platform.OS === "web"
          ? loadWebSession()
          : await loadSession();

      if (session?.name) setUserName(session.name);
      if (session?.patientId) setPatientId(session.patientId);
    })();
  }, [visible]);

  // 🔥 OPEN ANIMATION
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

  // 🔴 REAL LOGOUT (SESSION FIRST)
  const handleLogout = async () => {
    if (Platform.OS === "web") {
      clearWebSession();
    } else {
      await clearSession();
    }

    try {
      await signOut(firebaseAuth);
    } catch {}

    onClose();

    setTimeout(() => {
      router.replace("/onboarding");
    }, Platform.OS === "web" ? 50 : 150);
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* BACKDROP */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.backdrop}
      />

      {/* CARD */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.pid}>{patientId}</Text>
          </View>
        </View>

        {/* MENU */}
        {MENU.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.row}
            activeOpacity={0.65}
          >
            <Ionicons name={item.icon as any} size={18} color="#065F46" />
            <Text style={styles.rowText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logout}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
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
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#065F46",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },

  pid: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },

  rowText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#065F46",
  },

  logout: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  logoutText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 13,
  },
});
