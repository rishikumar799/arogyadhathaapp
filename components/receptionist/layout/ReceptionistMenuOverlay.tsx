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
  { label: "Dashboard", icon: "grid-outline", path: "/receptionist" },
  { label: "Appointments", icon: "calendar-outline", path: "/receptionist/appointments" },
  { label: "Patients", icon: "people-outline", path: "/receptionist/patients" },
  { label: "New Appointment", icon: "add-circle-outline", path: "/receptionist/new-appointment" },
  { label: "Billing", icon: "document-text-outline", path: "/receptionist/billing" },
  { label: "Profile", icon: "person-outline", path: "/receptionist/profile" },
  { label: "Settings", icon: "settings-outline", path: "/receptionist/settings" },
];

/* ================= MAIN ================= */

export default function ReceptionistMenuOverlay({
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
