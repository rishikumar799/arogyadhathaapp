// components/patient/SearchSheet.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SearchSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: visible ? 1 : 0, duration: 220, useNativeDriver: true }).start();
  }, [visible]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [360, 0] });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
          <LinearGradient colors={["#022C22", "#065F46", "#16A34A"]} style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Search</Text>
              <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color="#fff" /></TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Ionicons name="search" size={18} color="#fff" />
              <Text style={styles.placeholder}>Search doctors, hospitals, tests…</Text>
            </View>

            <View style={styles.chips}>
              <View style={styles.chip}><Text style={styles.chipText}>Book Appointment</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>Order Medicines</Text></View>
              <View style={styles.chip}><Text style={styles.chipText}>Upload Report</Text></View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  container: { paddingHorizontal: 12, paddingBottom: 18 },
  sheet: { borderRadius: 20, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "700", color: "#fff" },
  field: { flexDirection: "row", alignItems: "center", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8, marginTop: 12, backgroundColor: "rgba(255,255,255,0.15)" },
  placeholder: { marginLeft: 8, fontSize: 12, color: "#F5F5F5" },
  chips: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  chip: { flex: 1, marginHorizontal: 4, borderRadius: 999, paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.06)" },
  chipText: { fontSize: 11, textAlign: "center", fontWeight: "600", color: "#DCFCE7" },
});
