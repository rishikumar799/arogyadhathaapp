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

// SESSION
import { clearSession, loadSession } from "@/lib/authPersist";
import { clearWebSession, loadWebSession } from "@/lib/webPersist";

// FIREBASE
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";

// ID BUILDER
import { buildEntityId } from "@/lib/userUtils";

/* ================= CONSTANTS ================= */

// Matches ReceptionistTopNav total height on mobile
const MOBILE_TOP_NAV_HEIGHT = 96;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ReceptionistProfileMenuModal({
  visible,
  onClose,
}: Props) {
  const router = useRouter();

  const [receptionistName, setReceptionistName] = useState("Receptionist");
  const [receptionistId, setReceptionistId] = useState("");

  // animations
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  /* ================= LOAD SESSION ================= */
  useEffect(() => {
    if (!visible) return;

    (async () => {
      const session =
        Platform.OS === "web"
          ? loadWebSession()
          : await loadSession();

      if (session?.name) {
        setReceptionistName(session.name);
      }

      if (session?.uid) {
        setReceptionistId(buildEntityId(session.uid, "REC"));
      }
    })();
  }, [visible]);

  /* ================= ANIMATION ================= */
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

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    Platform.OS === "web"
      ? clearWebSession()
      : await clearSession();

    try {
      await signOut(auth);
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
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {receptionistName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{receptionistName}</Text>
            {receptionistId ? (
              <Text style={styles.id}>{receptionistId}</Text>
            ) : null}
            <Text style={styles.role}>Receptionist</Text>
          </View>
        </View>

        {/* ================= MENU ================= */}
        <MenuRow
          icon="person-outline"
          label="Profile"
          onPress={() => {
            onClose();
            router.push("/receptionist/profile");
          }}
        />

        <MenuRow
          icon="settings-outline"
          label="Settings"
          onPress={() => {
            onClose();
            router.push("/receptionist/settings");
          }}
        />

        <MenuRow
          icon="lock-closed-outline"
          label="Security"
          onPress={() => {
            onClose();
            router.push("/receptionist/security/password");
          }}
        />

        {/* ================= LOGOUT ================= */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

/* ================= SUB COMPONENT ================= */

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Ionicons name={icon as any} size={18} color="#065F46" />
      <Text style={styles.rowText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  card: {
    position: "absolute",
    right: 8,
    top: Platform.OS === "web" ? 90 : MOBILE_TOP_NAV_HEIGHT - 50,
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

  id: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },

  role: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
    marginTop: 2,
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
