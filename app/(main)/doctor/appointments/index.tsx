import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= AROGYADATHA THEME ================= */

const COLORS = {
  bg: "#FFFFFF",
  bannerDark: "#064E3B",
  bannerMid: "#065F46",
  primary: "#10B981",
  soft: "#ECFDF5",
  text: "#0F172A",
  textwhite: "#FFFFFF",
  muted: "#64748B",
  border: "#E2E8F0",
};

/* ================= PLACEHOLDER DATA ================= */

const EMPTY: any[] = [];

/* ================= COMPONENT ================= */

export default function DoctorAppointmentsIndex() {
  return (
    <View style={styles.container}>
      {/* ===== HEADER / BANNER ===== */}
      {/* ===== COMPACT HEADER ===== */}
<View style={styles.header}>
  <View style={styles.headerLeft}>
    <ThemedText style={styles.title}>Appointments</ThemedText>
    <ThemedText style={styles.subtitle}>
      Manage your daily schedule
    </ThemedText>
  </View>

  <View style={styles.headerRight}>
    <StatBox label="Today" value="—" />
    <StatBox label="This Week" value="—" />
  </View>
</View>


      {/* ===== SEARCH + FILTER ===== */}
      <View style={styles.controls}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            placeholder="Search patient or reason"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.filters}>
          {["All", "Pending", "Confirmed", "In Progress", "Completed"].map(
            f => (
              <TouchableOpacity key={f} style={styles.filterBtn}>
                <ThemedText style={styles.filterText}>{f}</ThemedText>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* ===== LIST / EMPTY STATE ===== */}
      <FlatList
        data={EMPTY}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={COLORS.muted}
            />
            <ThemedText style={styles.emptyTitle}>
              No appointments yet
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Appointments will appear here once backend is connected
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}

/* ================= SMALL COMPONENTS ================= */

const StatBox = ({ label, value }) => (
  <View style={styles.statBox}>
    <ThemedText style={styles.statValue}>{value}</ThemedText>
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  /* ===== HEADER ===== */

header: {
  backgroundColor: COLORS.bannerDark,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 16,
  borderBottomWidth: 1,
  borderColor: COLORS.border,
  flexWrap: "wrap",
},

headerLeft: {
  maxWidth: "60%",
},

headerRight: {
  flexDirection: "row",
  gap: 12,
},

title: {
  fontSize: 24,
  fontWeight: "800",
  color: COLORS.textwhite,
  marginBottom: 4,
},

subtitle: {
  fontSize: 14,
  color: COLORS.muted,
},

statBox: {
  backgroundColor: COLORS.soft,
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 12,
  alignItems: "center",
  minWidth: 90,
  borderWidth: 1,
  borderColor: COLORS.border,
},

statValue: {
  color: COLORS.text,
  fontSize: 18,
  fontWeight: "800",
},

statLabel: {
  color: COLORS.muted,
  fontSize: 12,
  fontWeight: "600",
},


  /* ===== CONTROLS ===== */

  controls: {
    padding: 24,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.soft,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },

  input: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    color: COLORS.text,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.soft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },

  /* ===== LIST ===== */

  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexGrow: 1,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    color: COLORS.text,
  },

  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 280,
  },
});
