import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { clearSession } from "@/lib/authPersist";
import { auth } from "@/lib/firebaseConfig";
import { clearWebSession } from "@/lib/webPersist";
import { signOut } from "firebase/auth";

/* ================= CONSTANTS ================= */

const SIDENAV = { expanded: 260, collapsed: 76 };

const COLORS = {
  brand: "#16A34A",
  bgStart: "#022C22",
  bgEnd: "#064E3B",
  activeGlass: "rgba(167,243,208,0.18)",
  activeBorder: "rgba(167,243,208,0.35)",
  iconBg: "rgba(240,253,244,0.12)",
  text: "#ECFDF5",
  textMuted: "#A7F3D0",
  danger: "#DC2626",
};

/* ================= MAIN ================= */

export default function PharmacySideNav() {
  const router = useRouter();
  const segments = useSegments();

  const [collapsed, setCollapsed] = useState(false);
  const widthAnim = useRef(new Animated.Value(SIDENAV.expanded)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: collapsed ? SIDENAV.collapsed : SIDENAV.expanded,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [collapsed]);

  const pathname =
    "/" + segments.filter(s => !s.startsWith("(")).join("/");

  /* ================= LOGOUT ================= */

  const logout = async () => {
    Platform.OS === "web" ? clearWebSession() : await clearSession();
    await signOut(auth);
    router.replace("/onboarding");
  };

  return (
    <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={StyleSheet.absoluteFill}
      />

      {/* ================= PROFILE HEADER ================= */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={28} color={COLORS.brand} />
        </View>

        {!collapsed && (
          <>
            <ThemedText style={styles.name}>Pharmacist</ThemedText>
            <ThemedText style={styles.role}>Front Desk</ThemedText>
          </>
        )}
      </View>

      {/* ================= COLLAPSE ================= */}
      {Platform.OS === "web" && (
        <Pressable
          onPress={() => setCollapsed(!collapsed)}
          style={styles.collapseBtn}
        >
          <Ionicons
            name={collapsed ? "chevron-forward" : "chevron-back"}
            size={16}
            color="#ECFDF5"
          />
        </Pressable>
      )}

      {/* ================= NAV ITEMS ================= */}
    {/* ================= NAV ITEMS ================= */}
<ScrollView showsVerticalScrollIndicator={false}>
  <Nav
    icon="grid-outline"
    label="Dashboard"
    href="/pharmacy"
    active={pathname === "/pharmacy"}
    collapsed={collapsed}
  />

  <Nav
    icon="document-text-outline"
    label="Prescriptions"
    href="/pharmacy/prescriptions"
    active={pathname.startsWith("/pharmacy/prescriptions")}
    collapsed={collapsed}
  />

  <Nav
    icon="people-outline"
    label="Patients"
    href="/pharmacy/patients"
    active={pathname.startsWith("/pharmacy/patients")}
    collapsed={collapsed}
  />

  <Nav
    icon="cube-outline"
    label="Inventory"
    href="/pharmacy/inventory"
    active={pathname.startsWith("/pharmacy/inventory")}
    collapsed={collapsed}
  />

  <Nav
    icon="card-outline"
    label="Billing"
    href="/pharmacy/billing"
    active={pathname.startsWith("/pharmacy/billing")}
    collapsed={collapsed}
  />

  <Nav
    icon="bar-chart-outline"
    label="Reports"
    href="/pharmacy/reports"
    active={pathname.startsWith("/pharmacy/reports")}
    collapsed={collapsed}
  />

  <Nav
    icon="person-outline"
    label="Profile"
    href="/pharmacy/profile"
    active={pathname.startsWith("/pharmacy/profile")}
    collapsed={collapsed}
  />

  <Nav
    icon="settings-outline"
    label="Settings"
    href="/pharmacy/settings"
    active={pathname.startsWith("/pharmacy/settings")}
    collapsed={collapsed}
  />
</ScrollView>


      {/* ================= LOGOUT ================= */}
      <Nav
        icon="log-out-outline"
        label="Logout"
        collapsed={collapsed}
        danger
        onPress={logout}
      />
    </Animated.View>
  );
}

/* ================= NAV ITEM ================= */

const Nav = memo(function Nav({
  icon,
  label,
  href,
  active,
  collapsed,
  danger,
  onPress,
}: any) {
  const router = useRouter();

  return (
    <Pressable onPress={() => (onPress ? onPress() : router.push(href))}>
      <View
        style={[
          styles.nav,
          active && styles.active,
          collapsed && styles.collapsed,
        ]}
      >
        <View style={styles.iconWrap}>
          <Ionicons
            name={icon}
            size={18}
            color={danger ? COLORS.danger : COLORS.brand}
          />
        </View>

        {!collapsed && (
          <ThemedText
            style={[styles.label, danger && { color: COLORS.danger }]}
          >
            {label}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
});

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  sidebar: {
    paddingTop: 36,
    paddingBottom: 16,
    zIndex: 999,
    elevation: 999,
  },
  profileHeader: { alignItems: "center", marginBottom: 22 },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  name: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  role: { fontSize: 12, color: COLORS.textMuted },
  collapseBtn: {
    position: "absolute",
    top: 86,
    right: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 10,
    borderRadius: 999,
  },
  collapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  active: {
    backgroundColor: COLORS.activeGlass,
    borderWidth: 1,
    borderColor: COLORS.activeBorder,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 14, fontWeight: "600", color: COLORS.text },
});
