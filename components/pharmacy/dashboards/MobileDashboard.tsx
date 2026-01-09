import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

/* ================= PHARMACY MOBILE THEME ================= */

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#065F46",
  primaryLight: "#34D399",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  soft: "#ECFDF5",
};

/* ================= DATA ================= */

const KPI = [
  { label: "Prescriptions", value: "86", icon: "document-text", color: COLORS.primary },
  { label: "Pending", value: "12", icon: "time", color: COLORS.warning },
  { label: "Low Stock", value: "6", icon: "alert-circle", color: COLORS.danger },
  { label: "Revenue", value: "₹42,800", icon: "cash", color: COLORS.success },
];

const QUICK_ACTIONS = [
  { label: "New Bill", icon: "add-circle", color: COLORS.primary },
  { label: "Dispense", icon: "checkmark-done", color: COLORS.success },
  { label: "Inventory", icon: "cube", color: COLORS.info },
  { label: "Suppliers", icon: "people", color: COLORS.warning },
];

const PENDING_ORDERS = [
  { name: "John Carter", items: 3, status: "Waiting", color: COLORS.warning },
  { name: "Emily Stone", items: 1, status: "Ready", color: COLORS.success },
  { name: "Michael Ross", items: 5, status: "Insurance", color: COLORS.info },
];

const LOW_STOCK = [
  { name: "Paracetamol 500mg", qty: 12 },
  { name: "Amoxicillin", qty: 8 },
  { name: "Insulin", qty: 5 },
];

/* ================= MAIN ================= */

export default function PharmacyDashboardMobile() {
  const [pharmacyName, setPharmacyName] = useState("Pharmacy");
  const [dateTime, setDateTime] = useState("");

  /* ===== LOAD PHARMACY NAME ===== */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async user => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setPharmacyName(snap.data()?.name || "Pharmacy");
      }
    });
    return unsub;
  }, []);

  /* ===== LIVE DATE ===== */
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateTime(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };
    update();
  }, []);

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}  contentContainerStyle={{ paddingBottom: 100 }}>
      {/* ===== HEADER ===== */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary]}
        style={styles.header}
      >
        <ThemedText style={styles.greeting}>Welcome back</ThemedText>
        <ThemedText style={styles.title}>{pharmacyName}</ThemedText>
        <ThemedText style={styles.subtitle}>{dateTime}</ThemedText>
      </LinearGradient>

      {/* ===== KPI SCROLL ===== */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kpiScroll}
      >
        {KPI.map((k, i) => (
          <View key={i} style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: k.color + "20" }]}>
              <Ionicons name={k.icon as any} size={22} color={k.color} />
            </View>
            <ThemedText style={styles.kpiValue}>{k.value}</ThemedText>
            <ThemedText style={styles.kpiLabel}>{k.label}</ThemedText>
          </View>
        ))}
      </ScrollView>

      {/* ===== QUICK ACTIONS ===== */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity key={i} style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: a.color }]}>
                <Ionicons name={a.icon as any} size={22} color="#FFF" />
              </View>
              <ThemedText style={styles.actionText}>{a.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== PENDING ORDERS ===== */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Pending Orders</ThemedText>
        <View style={styles.card}>
          {PENDING_ORDERS.map((o, i) => (
            <View key={i} style={styles.row}>
              <View>
                <ThemedText style={styles.rowTitle}>{o.name}</ThemedText>
                <ThemedText style={styles.rowSub}>{o.items} medicines</ThemedText>
              </View>
              <View style={[styles.badge, { backgroundColor: o.color + "20" }]}>
                <ThemedText style={[styles.badgeText, { color: o.color }]}>
                  {o.status}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ===== LOW STOCK ===== */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Low Stock Alerts</ThemedText>
        <View style={styles.card}>
          {LOW_STOCK.map((m, i) => (
            <View key={i} style={styles.row}>
              <ThemedText style={styles.rowTitle}>{m.name}</ThemedText>
              <ThemedText style={styles.stockQty}>{m.qty} left</ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 16,
  },
  greeting: { color: "rgba(255,255,255,0.9)", fontSize: 14 },
  title: { color: "#FFF", fontSize: 26, fontWeight: "800", marginVertical: 4 },
  subtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13 },

  kpiScroll: { paddingHorizontal: 16, gap: 14 },
  kpiCard: {
    width: width * 0.42,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kpiIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  kpiValue: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  kpiLabel: { fontSize: 12, color: COLORS.muted },

  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
    color: COLORS.text,
  },

  actionCard: {
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 100,
    marginRight: 14,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionText: { fontSize: 12, fontWeight: "600", color: COLORS.text },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowTitle: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  rowSub: { fontSize: 12, color: COLORS.muted },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, fontWeight: "700" },

  stockQty: { fontSize: 13, fontWeight: "700", color: COLORS.danger },
});
