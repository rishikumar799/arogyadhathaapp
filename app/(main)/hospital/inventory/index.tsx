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

const inventoryStats = [
  { label: "Total Items", value: "1,248", icon: "cube", color: COLORS.primary },
  { label: "Low Stock", value: "28", icon: "alert-circle", color: COLORS.warning },
  { label: "Out of Stock", value: "12", icon: "close-circle", color: COLORS.danger },
  { label: "Categories", value: "42", icon: "layers", color: COLORS.success },
];

const lowStockItems = [
  { name: "Paracetamol 500mg", current: 12, min: 50, category: "Medicines" },
  { name: "Surgical Gloves", current: 45, min: 100, category: "Supplies" },
  { name: "IV Fluid Set", current: 8, min: 30, category: "Equipment" },
];

const recentOrders = [
  { id: "ORD-001", supplier: "MediCorp", items: 24, status: "Delivered" },
  { id: "ORD-002", supplier: "HealthPlus", items: 18, status: "In Transit" },
  { id: "ORD-003", supplier: "PharmaDirect", items: 32, status: "Pending" },
];

export default function InventoryPage() {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Inventory</ThemedText>
          <ThemedText style={styles.subtitle}>Stock Management</ThemedText>
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newButtonText}>New Order</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        {inventoryStats.map((stat, idx) => (
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
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Low Stock Alerts</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>Reorder All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {lowStockItems.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                <ThemedText style={styles.itemCategory}>{item.category}</ThemedText>
                <ThemedText style={styles.itemLimit}>Min: {item.min} | Current: {item.current}</ThemedText>
              </View>
              <View style={styles.itemRight}>
                <View style={styles.stockLevel}>
                  <ThemedText style={styles.stockValue}>{item.current}</ThemedText>
                  <ThemedText style={styles.stockLabel}>left</ThemedText>
                </View>
                <TouchableOpacity style={styles.orderButton}>
                  <Ionicons name="cart" size={16} color={COLORS.primary} />
                  <ThemedText style={styles.orderText}>Order</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Orders</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {recentOrders.map((order, idx) => (
            <View key={idx} style={styles.orderRow}>
              <View style={styles.orderInfo}>
                <ThemedText style={styles.orderId}>{order.id}</ThemedText>
                <ThemedText style={styles.orderSupplier}>{order.supplier}</ThemedText>
                <ThemedText style={styles.orderItems}>{order.items} items</ThemedText>
              </View>
              <View style={styles.orderRight}>
                <View style={[styles.statusBadge, { 
                  backgroundColor: order.status === 'Delivered' ? COLORS.success + '20' : 
                                  order.status === 'In Transit' ? COLORS.info + '20' : COLORS.warning + '20' 
                }]}>
                  <ThemedText style={[styles.statusText, { 
                    color: order.status === 'Delivered' ? COLORS.success : 
                           order.status === 'In Transit' ? COLORS.info : COLORS.warning 
                  }]}>
                    {order.status}
                  </ThemedText>
                </View>
                <TouchableOpacity style={styles.trackButton}>
                  <ThemedText style={styles.trackText}>Track</ThemedText>
                </TouchableOpacity>
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
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  itemCategory: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  itemLimit: { fontSize: 11, color: COLORS.danger, marginTop: 2 },
  itemRight: { alignItems: "flex-end" },
  stockLevel: { alignItems: "center", marginBottom: 8 },
  stockValue: { fontSize: 20, fontWeight: "800", color: COLORS.danger },
  stockLabel: { fontSize: 11, color: COLORS.muted },
  orderButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  orderText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
  orderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  orderSupplier: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  orderItems: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  orderRight: { alignItems: "flex-end" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  statusText: { fontSize: 11, fontWeight: "600" },
  trackButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  trackText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
});