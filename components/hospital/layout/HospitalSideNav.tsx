import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  muted: "#A7F3D0",
};

/* ================= MAIN ================= */

export default function HospitalSideNav() {
  const router = useRouter();
  const pathname = usePathname();

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

  const go = (path: string) => router.push(path);

  const isActive = (path: string, exact = false) =>
  exact ? pathname === path : pathname === path || pathname.startsWith(path + "/");


  return (
    <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={StyleSheet.absoluteFill}
      />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Ionicons name="business-outline" size={30} color={COLORS.brand} />
        </View>
        {!collapsed && (
          <>
            <Text style={styles.title}>Hospital Admin</Text>
            <Text style={styles.subtitle}>Management Panel</Text>
          </>
        )}
      </View>

      {/* ================= COLLAPSE BTN ================= */}
      {Platform.OS === "web" && (
        <Pressable
          onPress={() => setCollapsed(!collapsed)}
          style={styles.collapseBtn}
        >
          <Ionicons
            name={collapsed ? "chevron-forward" : "chevron-back"}
            size={16}
            color={COLORS.text}
          />
        </Pressable>
      )}

      {/* ================= NAV ================= */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* DASHBOARD */}
        <NavItem
  icon="grid-outline"
  label="Dashboard"
  active={isActive("/hospital", true)}   // 👈 exact match
  collapsed={collapsed}
  onPress={() => go("/hospital")}
/>


        {/* USERS */}
        <NavGroup title="Users" collapsed={collapsed}>
          <NavItem icon="people-outline" label="Patients" active={isActive("/hospital/patients")} collapsed={collapsed} onPress={() => go("/hospital/patients")} />
          <NavItem icon="medkit-outline" label="Doctors" active={isActive("/hospital/doctors")} collapsed={collapsed} onPress={() => go("/hospital/doctors")} />
          <NavItem icon="flask-outline" label="Diagnostics" active={isActive("/hospital/diagnostics")} collapsed={collapsed} onPress={() => go("/hospital/diagnostics")} />
          <NavItem icon="bandage-outline" label="Pharmacy" active={isActive("/hospital/pharmacy")} collapsed={collapsed} onPress={() => go("/hospital/pharmacy")} />
          <NavItem icon="headset-outline" label="Reception" active={isActive("/hospital/reception")} collapsed={collapsed} onPress={() => go("/hospital/reception")} />
        </NavGroup>

        {/* OPERATIONS */}
        <NavGroup title="Operations" collapsed={collapsed}>
          <NavItem icon="calendar-outline" label="Appointments" active={isActive("/hospital/appointments")} collapsed={collapsed} onPress={() => go("/hospital/appointments")} />
          <NavItem icon="business-outline" label="Departments" active={isActive("/hospital/departments")} collapsed={collapsed} onPress={() => go("/hospital/departments")} />
          <NavItem icon="bed-outline" label="Rooms & Beds" active={isActive("/hospital/rooms")} collapsed={collapsed} onPress={() => go("/hospital/rooms")} />
          <NavItem icon="cube-outline" label="Inventory" active={isActive("/hospital/inventory")} collapsed={collapsed} onPress={() => go("/hospital/inventory")} />
        </NavGroup>

        {/* FINANCE */}
        <NavGroup title="Finance" collapsed={collapsed}>
          <NavItem icon="card-outline" label="Billing" active={isActive("/hospital/billing")} collapsed={collapsed} onPress={() => go("/hospital/billing")} />
          <NavItem icon="bar-chart-outline" label="Reports" active={isActive("/hospital/reports")} collapsed={collapsed} onPress={() => go("/hospital/reports")} />
        </NavGroup>

        {/* SYSTEM */}
        <NavGroup title="System" collapsed={collapsed}>
          <NavItem icon="chatbubbles-outline" label="Communication" active={isActive("/hospital/communication")} collapsed={collapsed} onPress={() => go("/hospital/communication")} />
          <NavItem icon="settings-outline" label="Settings" active={isActive("/hospital/settings")} collapsed={collapsed} onPress={() => go("/hospital/settings")} />
        </NavGroup>

        <View style={{ height: 20 }} />
      </ScrollView>
    </Animated.View>
  );
}

/* ================= NAV GROUP ================= */

const NavGroup = memo(function NavGroup({
  title,
  children,
  collapsed,
}: any) {
  const [open, setOpen] = useState(true);

  return (
    <View>
      <Pressable
        onPress={() => !collapsed && setOpen(!open)}
        style={styles.groupHeader}
      >
        {!collapsed && (
          <>
            <Text style={styles.groupTitle}>{title}</Text>
            <Ionicons
              name={open ? "chevron-up" : "chevron-down"}
              size={14}
              color={COLORS.muted}
            />
          </>
        )}
      </Pressable>
      {open && children}
    </View>
  );
});

/* ================= NAV ITEM ================= */

const NavItem = memo(function NavItem({
  icon,
  label,
  onPress,
  collapsed,
  active,
}: any) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.nav,
          active && styles.active,
          collapsed && styles.center,
        ]}
      >
        <View style={styles.iconWrap}>
          <Ionicons
            name={icon}
            size={18}
            color={active ? COLORS.brand : COLORS.muted}
          />
        </View>
        {!collapsed && (
          <Text style={[styles.label, active && { color: COLORS.text }]}>
            {label}
          </Text>
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
  },

  header: { alignItems: "center", marginBottom: 20 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.muted },

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

  groupHeader: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
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
  center: { justifyContent: "center", paddingHorizontal: 0 },
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
  label: { fontSize: 14, fontWeight: "600", color: COLORS.muted },
});
