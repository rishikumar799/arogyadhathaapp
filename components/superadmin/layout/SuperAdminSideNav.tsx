import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

// SESSION
import { clearSession } from "@/lib/authPersist";
import { clearWebSession } from "@/lib/webPersist";

// FIREBASE
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";

/* ================= CONSTANTS ================= */

const SIDENAV = {
  expanded: 260,
  collapsed: 76,
};

const COLORS = {
  brand: "#16A34A",
  bgStart: "#022C22",
  bgEnd: "#064E3B",
  activeGlass: "rgba(167,243,208,0.18)",
  activeBorder: "rgba(167,243,208,0.35)",
  hoverGlass: "rgba(236,253,243,0.14)",
  iconBg: "rgba(240,253,244,0.12)",
  text: "#ECFDF5",
  textMuted: "#A7F3D0",
  danger: "#DC2626",
};

/* ================= ROOT ================= */

export default function SuperAdminSideNav() {
  const router = useRouter();
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

  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") clearWebSession();
      else await clearSession();
      await signOut(auth);
    } catch (e) {
      console.log("SideNav logout failed", e);
    }
    router.replace("/onboarding");
  };

  return (
    <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={StyleSheet.absoluteFill}
      />

      {/* BRAND */}
      <View style={styles.brand}>
        <Image
          source={{
            uri: "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/Arogyadathaicon.png",
          }}
          style={styles.logo}
        />
        {!collapsed && (
          <ThemedText style={styles.brandText}>Arogyadatha</ThemedText>
        )}
      </View>

      {/* COLLAPSE */}
      {Platform.OS === "web" && (
        <Pressable
          onPress={() => setCollapsed(!collapsed)}
          style={({ hovered }) => [
            styles.collapseBtn,
            hovered && styles.collapseBtnHover,
          ]}
        >
          <Ionicons
            name={collapsed ? "chevron-forward" : "chevron-back"}
            size={16}
            color="#ECFDF5"
          />
        </Pressable>
      )}

      {/* NAV */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <NavItem icon="grid-outline" label="Dashboard" href="/superadmin" collapsed={collapsed} />

        <NavSection title="Users" collapsed={collapsed}>
          <NavItem icon="person-add-outline" label="Add User" href="/superadmin/users/adduser" collapsed={collapsed} />
          <NavItem icon="people-outline" label="All Users" href="/superadmin/users/allusers" collapsed={collapsed} />
          <NavItem icon="person-circle-outline" label="Manage Users" href="/superadmin/users/manageusers" collapsed={collapsed} />
        </NavSection>

        <NavSection title="Requests" collapsed={collapsed}>
          <NavItem icon="alert-circle-outline" label="Registration Requests" href="/superadmin/requests" collapsed={collapsed} />
        </NavSection>

        <NavSection title="Hospitals" collapsed={collapsed}>
          <NavItem icon="add-circle-outline" label="Add Hospital" href="/superadmin/hospital/addhospital" collapsed={collapsed} />
          <NavItem icon="business-outline" label="Hospitals List" href="/superadmin/hospital/list" collapsed={collapsed} />
          <NavItem icon="people-outline" label="Hospital Staff" href="/superadmin/hospital/staff" collapsed={collapsed} />
          <NavItem icon="settings-outline" label="Configuration" href="/superadmin/hospital/configuration" collapsed={collapsed} />
        </NavSection>

        <NavSection title="Reports" collapsed={collapsed}>
          <NavItem icon="bar-chart-outline" label="Usage Reports" href="/superadmin/reports/usagereports" collapsed={collapsed} />
          <NavItem icon="pulse-outline" label="Health Analytics" href="/superadmin/reports/healthanalytics" collapsed={collapsed} />
          <NavItem icon="document-text-outline" label="Audit Logs" href="/superadmin/reports/auditlogs" collapsed={collapsed} />
        </NavSection>

        <NavSection title="System" collapsed={collapsed}>
          <NavItem icon="settings-outline" label="App Settings" href="/superadmin/system/appsettings" collapsed={collapsed} />
          <NavItem icon="notifications-outline" label="Announcements" href="/superadmin/system/announcements" collapsed={collapsed} />
          <NavItem icon="shield-checkmark-outline" label="Security" href="/superadmin/system/security" collapsed={collapsed} />
          <NavItem icon="cloud-outline" label="Integrations" href="/superadmin/system/integrations" collapsed={collapsed} />
        </NavSection>

        <NavSection title="Support" collapsed={collapsed}>
          <NavItem icon="help-circle-outline" label="Help Center" href="/superadmin/support/helpcenter" collapsed={collapsed} />
          <NavItem icon="chatbubbles-outline" label="Support Tickets" href="/superadmin/support/supporttickets" collapsed={collapsed} />
        </NavSection>
      </ScrollView>

      {/* LOGOUT */}
      <NavItem
        icon="log-out-outline"
        label="Logout"
        collapsed={collapsed}
        danger
        onPressOverride={handleLogout}
      />
    </Animated.View>
  );
}

/* ================= SECTIONS ================= */

function NavSection({ title, collapsed, children }: any) {
  if (collapsed) return <>{children}</>;
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );
}

/* ================= NAV ITEM ================= */

const NavItem = memo(function NavItem({
  icon,
  label,
  href,
  collapsed,
  danger,
  onPressOverride,
}: any) {
  const router = useRouter();
  const segments = useSegments();
  const [hovered, setHovered] = useState(false);

  const pathname = "/" + segments.filter(s => !s.startsWith("(")).join("/");

  const isDashboard = href === "/superadmin";
  const isActive = isDashboard
    ? pathname === "/superadmin"
    : href
    ? pathname === href || pathname.startsWith(href + "/")
    : false;

  return (
    <Pressable
      onPress={() => (onPressOverride ? onPressOverride() : router.push(href))}
      onHoverIn={() => Platform.OS === "web" && setHovered(true)}
      onHoverOut={() => Platform.OS === "web" && setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <View
        style={[
          styles.navItem,
          isActive && styles.navItemActive,
          hovered && styles.navItemHover,
          collapsed && styles.navItemCollapsed,
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
          <ThemedText style={[styles.label, danger && { color: COLORS.danger }]}>
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
    paddingVertical: 16,
    overflow: "visible",
    zIndex: 10,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  logo: { width: 32, height: 32, borderRadius: 8 },
  brandText: { fontSize: 15, fontWeight: "700", color: COLORS.text },

  collapseBtn: {
    position: "absolute",
    top: 22,
    right: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  collapseBtnHover: { backgroundColor: "#15803D" },

  section: { marginTop: 22 },

  sectionTitle: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: COLORS.textMuted,
    marginLeft: 20,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 10,
    borderRadius: 999,
  },

  navItemCollapsed: { justifyContent: "center", paddingHorizontal: 0 },

  navItemActive: {
    backgroundColor: COLORS.activeGlass,
    borderWidth: 1,
    borderColor: COLORS.activeBorder,
  },

  navItemHover: {
    backgroundColor: COLORS.hoverGlass,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },

  label: { fontSize: 14, color: COLORS.text, fontWeight: "600" },
});
