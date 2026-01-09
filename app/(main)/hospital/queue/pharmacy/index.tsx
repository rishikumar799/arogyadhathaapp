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
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const categories = [
  { name: "Antibiotics", count: 45, icon: "medkit" },
  { name: "Pain Relief", count: 32, icon: "bandage" },
  { name: "Cardiac", count: 28, icon: "heart" },
  { name: "Diabetes", count: 36, icon: "flask" },
];

const lowStock = [
  { name: "Paracetamol 500mg", stock: 12, min: 50 },
  { name: "Amoxicillin 250mg", stock: 8, min: 30 },
  { name: "Insulin Glargine", stock: 5, min: 20 },
];

export default function PharmacyPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Pharmacy</ThemedText>
          <ThemedText style={styles.subtitle}>Medication Management</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>New Order</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>1,248</ThemedText>
          <ThemedText style={styles.statLabel}>Total Medicines</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>42</ThemedText>
          <ThemedText style={styles.statLabel}>Categories</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>8</ThemedText>
          <ThemedText style={styles.statLabel}>Low Stock</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
        <View style={styles.categoriesGrid}>
          {categories.map((cat, idx) => (
            <TouchableOpacity key={idx} style={styles.categoryCard}>
              <View style={styles.categoryIcon}>
                <Ionicons name={cat.icon as any} size={24} color={COLORS.primary} />
              </View>
              <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
              <ThemedText style={styles.categoryCount}>{cat.count} items</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Low Stock Alert</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>Reorder</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.stockCard}>
          {lowStock.map((item, idx) => (
            <View key={idx} style={styles.stockRow}>
              <View>
                <ThemedText style={styles.stockName}>{item.name}</ThemedText>
                <ThemedText style={styles.stockInfo}>Min: {item.min} | Current: {item.stock}</ThemedText>
              </View>
              <View style={styles.stockStatus}>
                <ThemedText style={styles.stockQty}>{item.stock}</ThemedText>
                <ThemedText style={styles.stockLabel}>left</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  newButton: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  newButtonText: { color: "#fff", fontWeight: "600" },
  stats: { paddingHorizontal: 24, flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statNumber: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: "600" },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  categoryCard: { width: "48%", backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  categoryIcon: { marginBottom: 12 },
  categoryName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  categoryCount: { fontSize: 12, color: COLORS.muted },
  stockCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  stockRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  stockName: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  stockInfo: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  stockStatus: { alignItems: "center" },
  stockQty: { fontSize: 20, fontWeight: "800", color: COLORS.danger },
  stockLabel: { fontSize: 11, color: COLORS.muted },
});