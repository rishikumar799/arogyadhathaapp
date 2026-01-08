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

const ITEMS = [
  { label: "Prescriptions", icon: "document-text-outline", path: "/doctor/prescriptions" },
  { label: "Reports", icon: "bar-chart-outline", path: "/doctor/reports" },
  { label: "Profile", icon: "person-outline", path: "/doctor/profile" },
  { label: "Settings", icon: "settings-outline", path: "/doctor/settings" },
];

export default function DoctorMenuOverlay({
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
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={26} color="#ECFDF5" />
          </Pressable>
        </View>

        {ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => {
              onNavigate(item.path);
              onClose();
            }}
          >
            <Ionicons name={item.icon} size={22} color="#A7F3D0" />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#ECFDF5" },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  label: { fontSize: 16, fontWeight: "600", color: "#ECFDF5" },
});
