import { useLocation } from "@/contexts/LocationContext";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const LOCATIONS = [
  { city: "Hyderabad", district: "Hyderabad", state: "Telangana" },
  { city: "Warangal", district: "Hanamkonda", state: "Telangana" },
  { city: "Vijayawada", district: "Krishna", state: "Andhra Pradesh" },
  { city: "Visakhapatnam", district: "Visakhapatnam", state: "Andhra Pradesh" },
  { city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka" },
  { city: "Chennai", district: "Chennai", state: "Tamil Nadu" },
];

export default function LocationPickerSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { setManualLocation } = useLocation();

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Sheet */}
      <View style={styles.sheet}>
        <Text style={styles.title}>Select Location</Text>

        {LOCATIONS.map((loc) => (
          <Pressable
            key={`${loc.city}-${loc.district}`}
            style={styles.item}
            onPress={() => {
              setManualLocation({
                city: loc.city,
                district: loc.district,
                state: loc.state,
              });
              onClose();
            }}
          >
            <Text style={styles.city}>{loc.city}</Text>
            <Text style={styles.district}>
              {loc.district}, {loc.state}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  city: {
    fontSize: 15,
    fontWeight: "700",
  },
  district: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
