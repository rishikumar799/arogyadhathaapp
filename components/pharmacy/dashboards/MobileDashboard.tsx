import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

/* ================= THEME ================= */

const COLORS = {
  bg: "#FFFFFF",
  card: "#FFFFFF",
  primary: "#16A34A",
  primaryLight: "#34D399",
  primaryDark: "#065F46",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  soft: "#ECFDF5",
};

/* ================= GRADIENT CARD ================= */

const GradientCard = ({ children, colors, style }: any) => (
  <LinearGradient
    colors={colors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.gradientCard, style]}
  >
    {children}
  </LinearGradient>
);

/* ================= MAIN ================= */

export default function PharmacyDashboardMobile() {
  const [pharmacyName, setPharmacyName] = useState("Pharmacy");
  const [dateTime, setDateTime] = useState("");
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [refreshing, setRefreshing] = useState(false);

  const [prescriptions, setPrescriptions] = useState([
    { id: "1", patient: "John Carter", items: 3 },
    { id: "2", patient: "Emily Stone", items: 1 },
  ]);

  const [pendingOrders] = useState([
    { id: "1", patient: "Robert Chen", wait: "15 min" },
    { id: "2", patient: "Maria Garcia", wait: "25 min" },
  ]);

  const [lowStock] = useState([
    { id: "1", name: "Paracetamol", qty: 12 },
    { id: "2", name: "Insulin", qty: 5 },
  ]);

  /* ===== LOAD PHARMACY NAME ===== */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async user => {
      if (!user) return;

      const snap = await getDoc(doc(db, "pharmacies", user.uid));
      if (snap.exists()) {
        setPharmacyName(snap.data()?.name || "Pharmacy");
      }
    });

    return unsub;
  }, []);

  /* ===== LIVE DATE + TIME ===== */
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateTime(
        now.toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const handleDispense = (id: string) => {
    Alert.alert("Dispense Medicine", "Confirm dispense?", [
      { text: "Cancel" },
      { text: "Dispense" },
    ]);
  };

  /* ================= RENDER ================= */

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
        <ThemedText style={styles.title}>{pharmacyName}</ThemedText>
        <ThemedText style={styles.date}>{dateTime}</ThemedText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ===== KPI ===== */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiRow}>
          <GradientCard colors={[COLORS.primary, COLORS.primaryLight]} style={styles.kpiCard}>
            <ThemedText style={styles.kpiValue}>{prescriptions.length}</ThemedText>
            <ThemedText style={styles.kpiLabel}>Prescriptions</ThemedText>
          </GradientCard>

          <GradientCard colors={["#F59E0B", "#FBBF24"]} style={styles.kpiCard}>
            <ThemedText style={styles.kpiValue}>{pendingOrders.length}</ThemedText>
            <ThemedText style={styles.kpiLabel}>Pending Orders</ThemedText>
          </GradientCard>

          <GradientCard colors={["#EF4444", "#F87171"]} style={styles.kpiCard}>
            <ThemedText style={styles.kpiValue}>{lowStock.length}</ThemedText>
            <ThemedText style={styles.kpiLabel}>Low Stock</ThemedText>
          </GradientCard>
        </ScrollView>

        {/* ===== TABS ===== */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {["prescriptions", "orders", "inventory"].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText
                style={[styles.tabText, activeTab === tab && styles.activeTabText]}
              >
                {tab.toUpperCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ===== CONTENT ===== */}
        <View style={styles.section}>
          {activeTab === "prescriptions" &&
            prescriptions.map(p => (
              <View key={p.id} style={styles.card}>
                <ThemedText style={styles.cardTitle}>{p.patient}</ThemedText>
                <ThemedText style={styles.subText}>{p.items} medicines</ThemedText>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => handleDispense(p.id)}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <ThemedText style={styles.btnText}>Dispense</ThemedText>
                </TouchableOpacity>
              </View>
            ))}

          {activeTab === "orders" &&
            pendingOrders.map(o => (
              <View key={o.id} style={styles.card}>
                <ThemedText style={styles.cardTitle}>{o.patient}</ThemedText>
                <ThemedText style={styles.subText}>Waiting {o.wait}</ThemedText>
              </View>
            ))}

          {activeTab === "inventory" &&
            lowStock.map(s => (
              <View key={s.id} style={styles.card}>
                <ThemedText style={styles.cardTitle}>{s.name}</ThemedText>
                <ThemedText style={styles.subText}>{s.qty} left</ThemedText>
              </View>
            ))}
        </View>

        {/* bottom space for bottom nav */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    backgroundColor: COLORS.primaryDark,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  greeting: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  title: { color: "#fff", fontSize: 26, fontWeight: "800" },
  date: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 },

  kpiRow: { padding: 16 },
  kpiCard: { width: 160, marginRight: 12, padding: 16, borderRadius: 16 },
  kpiValue: { fontSize: 28, fontWeight: "800", color: "#fff" },
  kpiLabel: { fontSize: 13, color: "#fff" },

  tabs: { paddingHorizontal: 16, marginBottom: 16 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.soft,
    borderRadius: 12,
    marginRight: 8,
  },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: "700", color: COLORS.muted },
  activeTabText: { color: "#fff" },

  section: { paddingHorizontal: 16 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  subText: { fontSize: 12, color: COLORS.muted, marginBottom: 8 },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },

  gradientCard: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
});
