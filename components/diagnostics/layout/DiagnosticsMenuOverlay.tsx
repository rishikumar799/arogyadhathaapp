import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= MENU ITEMS ================= */

const ITEMS = [
  {
    label: "Test Catalog",
    icon: "list-outline",
    path: "/diagnostics/tests",
  },
  {
    label: "Orders",
    icon: "flask-outline",
    path: "/diagnostics/orders",
  },
  {
    label: "Reports",
    icon: "document-text-outline",
    path: "/diagnostics/reports",
  },
  {
    label: "Analytics",
    icon: "bar-chart-outline",
    path: "/diagnostics/analytics",
  },
  {
    label: "Profile",
    icon: "person-outline",
    path: "/diagnostics/profile",
  },
  {
    label: "Settings",
    icon: "settings-outline",
    path: "/diagnostics/settings",
  },
];

/* ================= COMPONENT ================= */

export default function DiagnosticsMenuOverlay({
  visible,
  onClose,
  onNavigate,
}: {
  visible: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide">
      <LinearGradient colors={["#021B14", "#064E3B"]} style={styles.root}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={26} color="#ECFDF5" />
          </Pressable>
        </View>

        {/* ITEMS */}
        {ITEMS.map(item => (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => {
              onNavigate(item.path);
              onClose();
            }}
          >
            <Ionicons name={item.icon as any} size={22} color="#A7F3D0" />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    </Modal>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ECFDF5",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ECFDF5",
  },
});
