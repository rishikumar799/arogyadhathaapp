import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchPopup({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const suggestions = [
    "Book Appointment",
    "Order Medicines",
    "Check Symptoms",
    "Upload Prescription",
    "Find Hospitals",
  ];

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* Background overlay */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[styles.popupWrap, { transform: [{ translateY: slideAnim }] }]}
      >
        <LinearGradient
          colors={["#064E3B", "#0F9F60"]}
          style={styles.popup}
        >
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#fff" />
            <TextInput
              placeholder="Search doctors, labs, medicines..."
              placeholderTextColor="#D1FAE5"
              style={styles.input}
            />
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Suggestions with ticks */}
          <View style={styles.suggestionRow}>
            {suggestions.map((item, i) => (
              <View key={i} style={styles.suggestionChip}>
                <Ionicons name="checkmark-circle" size={14} color="#A7F3D0" />
                <Text style={styles.suggestionText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Quick Options */}
          <View style={styles.quickGrid}>
            {[
              "Doctors",
              "Medicines",
              "Lab Tests",
              "Symptoms",
              "Pharmacy",
              "Hospitals",
            ].map((item, i) => (
              <View key={i} style={styles.quickItem}>
                <Text style={styles.quickText}>{item}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  popupWrap: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  popup: {
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },

  /* Suggestion chips with ticks */
  suggestionRow: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  suggestionText: {
    marginLeft: 4,
    color: "#ECFDF5",
    fontSize: 12,
    fontWeight: "600",
  },

  /* Quick options */
  quickGrid: {
    marginTop: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  quickItem: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  quickText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
