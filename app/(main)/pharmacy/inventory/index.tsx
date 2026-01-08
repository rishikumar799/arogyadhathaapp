import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const COLORS = {
  primary: "#10B981",
  secondary: "#3B82F6",
  accent: "#8B5CF6",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#10B981",
  text: "#0F172A",
  textLight: "#334155",
  muted: "#64748B",
  border: "#E2E8F0",
  soft: "#ECFDF5",
  bg: "#FFFFFF",
};

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddItem, setShowAddItem] = useState(false);

  const CATEGORIES = [
    "All", "Antibiotics", "Analgesics", "Cardiovascular", "Diabetes", "Respiratory", "Supplies"
  ];

  const INVENTORY_ITEMS = [
    { id: "1", name: "Amoxicillin 500mg", category: "Antibiotics", stock: 125, threshold: 50, price: "$12.50", expiry: "2024-12-31", status: "Good" },
    { id: "2", name: "Paracetamol 500mg", category: "Analgesics", stock: 45, threshold: 100, price: "$5.75", expiry: "2024-10-15", status: "Low" },
    { id: "3", name: "Lisinopril 10mg", category: "Cardiovascular", stock: 89, threshold: 75, price: "$18.25", expiry: "2025-03-20", status: "Good" },
    { id: "4", name: "Metformin 850mg", category: "Diabetes", stock: 62, threshold: 100, price: "$9.80", expiry: "2024-11-30", status: "Low" },
    { id: "5", name: "Insulin Syringes", category: "Supplies", stock: 28, threshold: 50, price: "$3.25", expiry: "2026-05-15", status: "Low" },
    { id: "6", name: "Albuterol Inhaler", category: "Respiratory", stock: 156, threshold: 75, price: "$32.50", expiry: "2024-09-30", status: "Good" },
    { id: "7", name: "Atorvastatin 20mg", category: "Cardiovascular", stock: 92, threshold: 80, price: "$24.75", expiry: "2025-01-15", status: "Good" },
    { id: "8", name: "PPE Kits", category: "Supplies", stock: 15, threshold: 30, price: "$45.00", expiry: "2025-08-31", status: "Critical" },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Good': return COLORS.success;
      case 'Low': return COLORS.warning;
      case 'Critical': return COLORS.danger;
      default: return COLORS.muted;
    }
  };

  const handleReorder = (item) => {
    Alert.alert("Reorder Item", `Order more ${item.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Order Now", onPress: () => Alert.alert("Order Placed", `Order for ${item.name} placed!`) }
    ]);
  };

  const handleUpdateStock = (item) => {
    Alert.prompt("Update Stock", `Update stock for ${item.name}:`, [
      { text: "Cancel", style: "cancel" },
      { text: "Update", onPress: (text) => Alert.alert("Updated", `Stock updated to ${text}`) }
    ]);
  };

  const renderInventoryCard = ({ item }) => (
    <View style={styles.inventoryCard}>
      <View style={styles.cardHeader}>
        <View>
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryBadge, { backgroundColor: COLORS.soft }]}>
              <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
            </View>
            <View style={styles.priceBadge}>
              <ThemedText style={styles.priceText}>{item.price}</ThemedText>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</ThemedText>
        </View>
      </View>

      <View style={styles.stockInfo}>
        <View style={styles.stockLevel}>
          <ThemedText style={styles.stockLabel}>Current Stock</ThemedText>
          <ThemedText style={styles.stockValue}>{item.stock} units</ThemedText>
        </View>
        <View style={styles.stockLevel}>
          <ThemedText style={styles.stockLabel}>Reorder At</ThemedText>
          <ThemedText style={styles.stockValue}>{item.threshold} units</ThemedText>
        </View>
        <View style={styles.stockLevel}>
          <ThemedText style={styles.stockLabel}>Expiry</ThemedText>
          <ThemedText style={styles.stockValue}>{item.expiry}</ThemedText>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${Math.min(100, (item.stock / item.threshold) * 100)}%`,
              backgroundColor: item.stock > item.threshold ? COLORS.success : 
                              item.stock > item.threshold * 0.5 ? COLORS.warning : COLORS.danger 
            }
          ]} 
        />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.reorderButton]}
          onPress={() => handleReorder(item)}
          disabled={item.stock > item.threshold}
        >
          <Ionicons name="cart" size={16} color={item.stock > item.threshold ? COLORS.muted : COLORS.primary} />
          <ThemedText style={[styles.actionButtonText, { color: item.stock > item.threshold ? COLORS.muted : COLORS.primary }]}>
            Reorder
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.updateButton]}
          onPress={() => handleUpdateStock(item)}
        >
          <Ionicons name="pencil" size={16} color={COLORS.secondary} />
          <ThemedText style={[styles.actionButtonText, { color: COLORS.secondary }]}>Update Stock</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Inventory</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Manage medication stock and supplies</ThemedText>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddItem(true)}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <ThemedText style={styles.addButtonText}>Add Item</ThemedText>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{INVENTORY_ITEMS.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Items</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: COLORS.warning }]}>
            {INVENTORY_ITEMS.filter(item => item.status === 'Low').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Low Stock</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: COLORS.danger }]}>
            {INVENTORY_ITEMS.filter(item => item.status === 'Critical').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Critical</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>
            ${INVENTORY_ITEMS.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0).toFixed(2)}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Value</ThemedText>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search inventory..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.muted}
          />
        </View>
      </View>

      {/* CATEGORIES */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, activeCategory === category.toLowerCase() && styles.activeCategory]}
            onPress={() => setActiveCategory(category.toLowerCase())}
          >
            <ThemedText style={[styles.categoryButtonText, activeCategory === category.toLowerCase() && styles.activeCategoryText]}>
              {category}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* INVENTORY LIST */}
      <View style={styles.contentSection}>
        <FlatList
          data={INVENTORY_ITEMS}
          renderItem={renderInventoryCard}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* ADD ITEM MODAL */}
      <Modal visible={showAddItem} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add New Item</ThemedText>
              <TouchableOpacity onPress={() => setShowAddItem(false)}>
                <Ionicons name="close" size={24} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.submitButton}>
              <ThemedText style={styles.submitButtonText}>Add to Inventory</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 32, color: "#FFFFFF", fontWeight: "800", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.9)" },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  addButtonText: { fontSize: 14, color: "#FFFFFF", fontWeight: "600" },
  statsContainer: { flexDirection: "row", paddingHorizontal: 24, marginVertical: 20, gap: 8 },
  statCard: { flex: 1, backgroundColor: COLORS.soft, padding: 12, borderRadius: 12, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "800", color: COLORS.primary, marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.muted, fontWeight: "600", textAlign: "center" },
  searchSection: { paddingHorizontal: 24, marginBottom: 20 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.soft, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.text },
  categoriesScroll: { paddingHorizontal: 24, marginBottom: 20 },
  categoryButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.soft, borderRadius: 12, marginRight: 10 },
  activeCategory: { backgroundColor: COLORS.primary },
  categoryButtonText: { fontSize: 13, fontWeight: "600", color: COLORS.muted },
  activeCategoryText: { color: "#FFFFFF" },
  contentSection: { paddingHorizontal: 24, paddingBottom: 40 },
  inventoryCard: { backgroundColor: COLORS.bg, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  itemName: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  categoryRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 11, color: COLORS.primary, fontWeight: "600" },
  priceBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: "#E0F2FE" },
  priceText: { fontSize: 12, color: COLORS.secondary, fontWeight: "700" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "700" },
  stockInfo: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  stockLevel: { alignItems: "center" },
  stockLabel: { fontSize: 11, color: COLORS.muted, marginBottom: 4 },
  stockValue: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  progressBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 16 },
  progressFill: { height: 6, borderRadius: 3 },
  actionButtons: { flexDirection: "row", gap: 8 },
  actionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 8, gap: 6 },
  reorderButton: { backgroundColor: COLORS.soft },
  updateButton: { backgroundColor: "#E0F2FE" },
  actionButtonText: { fontSize: 12, fontWeight: "600" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: COLORS.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: "700", color: COLORS.text },
  submitButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  submitButtonText: { fontSize: 16, color: "#FFFFFF", fontWeight: "600" },
});