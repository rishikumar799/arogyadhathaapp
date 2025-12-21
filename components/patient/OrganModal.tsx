import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  organ: {
    id: string;
    score: number | null;
    status: string;
  };
  onClose: () => void;
};

export default function OrganModal({ organ, onClose }: Props) {
  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Title */}
          <Text style={styles.title}>
            {organ.id.toUpperCase()} Health
          </Text>

          {/* Status */}
          <Text style={styles.label}>Current Status</Text>
          <Text
            style={[
              styles.value,
              organ.status === "Critical Attention" && styles.critical,
              organ.status === "Healthy" && styles.healthy,
            ]}
          >
            {organ.status}
          </Text>

          {/* Score */}
          <Text style={styles.label}>Health Score</Text>
          <Text style={styles.value}>
            {organ.score === null
              ? "Awaiting diagnostics"
              : `${organ.score}%`}
          </Text>

          {/* Upload Placeholder */}
          <Pressable style={styles.uploadBtn}>
            <Text style={styles.uploadText}>
              Upload Medical Report
            </Text>
            <Text style={styles.uploadSub}>
              PDF / Image • Doctor or Lab report
            </Text>
          </Pressable>

          {/* AI Placeholder */}
          <Pressable style={styles.aiBtn}>
            <Text style={styles.aiText}>
              AI Diagnostics – Coming Soon
            </Text>
          </Pressable>

          {/* Close */}
          <Pressable onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
    color: "#0F172A",
  },

  label: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 10,
  },

  value: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
    color: "#0F172A",
  },

  healthy: {
    color: "#16A34A",
  },

  critical: {
    color: "#EF4444",
  },

  uploadBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
  },

  uploadText: {
    fontWeight: "800",
    textAlign: "center",
    color: "#0F172A",
  },

  uploadSub: {
    marginTop: 4,
    fontSize: 11,
    textAlign: "center",
    color: "#64748B",
  },

  aiBtn: {
    backgroundColor: "#22C55E",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
  },

  aiText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
  },

  close: {
    textAlign: "center",
    marginTop: 16,
    fontWeight: "700",
    color: "#475569",
  },
});
