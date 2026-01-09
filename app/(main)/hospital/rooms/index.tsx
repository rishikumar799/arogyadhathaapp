import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#065F46",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const roomStats = [
  { label: "Total Beds", value: "120", icon: "bed", color: COLORS.primary },
  { label: "Occupied", value: "97", icon: "person", color: COLORS.warning },
  { label: "Available", value: "23", icon: "checkmark-circle", color: COLORS.success },
  { label: "ICU Beds", value: "18", icon: "medkit", color: COLORS.danger },
];

const roomTypes = [
  { type: "General Ward", total: 60, occupied: 52, available: 8, color: "#065F46" },
  { type: "ICU", total: 18, occupied: 16, available: 2, color: "#DC2626" },
  { type: "Private Rooms", total: 30, occupied: 21, available: 9, color: "#0EA5E9" },
  { type: "Semi-Private", total: 12, occupied: 8, available: 4, color: "#8B5CF6" },
];

const availableRooms = [
  { number: "301", type: "Private", floor: "3rd Floor" },
  { number: "205", type: "General", floor: "2nd Floor" },
  { number: "412", type: "ICU", floor: "4th Floor" },
];

export default function RoomsPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Rooms & Beds</ThemedText>
          <ThemedText style={styles.subtitle}>Room Allocation Management</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>Allocate Room</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        {roomStats.map((stat, idx) => (
          <View key={idx} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + "20" }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Room Types Status</ThemedText>
        <View style={styles.roomsCard}>
          {roomTypes.map((room, idx) => (
            <View key={idx} style={styles.roomTypeRow}>
              <View style={styles.roomTypeInfo}>
                <View style={[styles.roomTypeDot, { backgroundColor: room.color }]} />
                <View>
                  <ThemedText style={styles.roomTypeName}>{room.type}</ThemedText>
                  <ThemedText style={styles.roomTypeTotal}>Total: {room.total} beds</ThemedText>
                </View>
              </View>
              <View style={styles.roomStats}>
                <View style={styles.roomStat}>
                  <ThemedText style={styles.roomStatValue}>{room.occupied}</ThemedText>
                  <ThemedText style={styles.roomStatLabel}>Occupied</ThemedText>
                </View>
                <View style={styles.roomStat}>
                  <ThemedText style={[styles.roomStatValue, { color: COLORS.success }]}>{room.available}</ThemedText>
                  <ThemedText style={styles.roomStatLabel}>Available</ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Available Rooms</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.availableCard}>
          {availableRooms.map((room, idx) => (
            <TouchableOpacity key={idx} style={styles.availableRoom}>
              <View style={styles.roomNumber}>
                <ThemedText style={styles.roomNumberText}>{room.number}</ThemedText>
                <ThemedText style={styles.roomTypeText}>{room.type}</ThemedText>
              </View>
              <View style={styles.roomDetails}>
                <ThemedText style={styles.roomFloor}>{room.floor}</ThemedText>
                <ThemedText style={styles.roomStatus}>Available</ThemedText>
              </View>
              <TouchableOpacity style={styles.selectButton}>
                <ThemedText style={styles.selectButtonText}>Select</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  newButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  newButtonText: { color: "#fff", fontWeight: "600" },
  stats: { paddingHorizontal: 20, flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  statCard: { width: "47%", backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  roomsCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  roomTypeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  roomTypeInfo: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  roomTypeDot: { width: 10, height: 10, borderRadius: 5 },
  roomTypeName: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  roomTypeTotal: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  roomStats: { flexDirection: "row", gap: 20 },
  roomStat: { alignItems: "center" },
  roomStatValue: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  roomStatLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  availableCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  availableRoom: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  roomNumber: { width: 80 },
  roomNumberText: { fontSize: 20, fontWeight: "700", color: COLORS.primary },
  roomTypeText: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  roomDetails: { flex: 1, marginLeft: 16 },
  roomFloor: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  roomStatus: { fontSize: 12, color: COLORS.success, fontWeight: "600", marginTop: 2 },
  selectButton: { backgroundColor: COLORS.primary + "10", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  selectButtonText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
});