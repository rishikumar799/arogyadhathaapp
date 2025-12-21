import { useLocation } from "@/contexts/LocationContext";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function LocationChangePrompt() {
  const {
    detectedLocation,
    location,
    acceptDetectedLocation,
    rejectDetectedLocation,
  } = useLocation();

  if (!detectedLocation) return null;

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Location change detected</Text>

          <Text style={styles.text}>
            You are now in{" "}
            <Text style={styles.bold}>{detectedLocation.city}</Text>.
            {"\n"}
            Do you want to update location
            {location?.city ? ` from ${location.city}?` : "?"}
          </Text>

          <View style={styles.row}>
            <Pressable
              style={styles.btnGhost}
              onPress={rejectDetectedLocation}
            >
              <Text>Keep current</Text>
            </Pressable>

            <Pressable
              style={styles.btnPrimary}
              onPress={acceptDetectedLocation}
            >
              <Text style={styles.btnText}>Switch</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "86%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 16,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  btnGhost: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  btnPrimary: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
