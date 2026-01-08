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

export default function DoctorSideNav() {
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

      {/* PROFILE HEADER */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={28} color={COLORS.brand} />
        </View>

        {!collapsed && (
          <>
            <ThemedText style={styles.doctorName}>Dr. Doctor</ThemedText>
            <ThemedText style={styles.doctorRole}>Doctor</ThemedText>
          </>
        )}
      </View>

      {/* COLLAPSE BUTTON */}
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <Nav icon="grid-outline" label="Dashboard" href="/doctor" active={pathname === "/doctor"} collapsed={collapsed} />
        <Nav icon="calendar-outline" label="Appointments" href="/doctor/appointments" active={pathname.startsWith("/doctor/appointments")} collapsed={collapsed} />
        <Nav icon="people-outline" label="Patients" href="/doctor/patients" active={pathname.startsWith("/doctor/patients")} collapsed={collapsed} />
        <Nav icon="chatbox-ellipses-outline" label="Consultations" href="/doctor/consultations" active={pathname.startsWith("/doctor/consultations")} collapsed={collapsed} />
        <Nav icon="medkit-outline" label="Prescriptions" href="/doctor/prescriptions" active={pathname.startsWith("/doctor/prescriptions")} collapsed={collapsed} />
        <Nav icon="document-text-outline" label="Reports" href="/doctor/reports" active={pathname.startsWith("/doctor/reports")} collapsed={collapsed} />
        <Nav icon="time-outline" label="Schedule" href="/doctor/schedule" active={pathname.startsWith("/doctor/schedule")} collapsed={collapsed} />
        <Nav icon="person-outline" label="Profile" href="/doctor/profile" active={pathname.startsWith("/doctor/profile")} collapsed={collapsed} />
        <Nav icon="settings-outline" label="Settings" href="/doctor/settings" active={pathname.startsWith("/doctor/settings")} collapsed={collapsed} />
      </ScrollView>

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
          <ThemedText style={[styles.label, danger && { color: COLORS.danger }]}>
            {label}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  sidebar: {
    paddingTop: 36,              // 🔥 SPACE FROM TOP HEADER
    paddingBottom: 16,
    overflow: "visible",
    zIndex: 999,                 // 🔥 ABOVE HEADER
    elevation: 999,
  },

  profileHeader: {
    alignItems: "center",
    marginBottom: 22,
  },

  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  doctorName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  doctorRole: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  collapseBtn: {
    position: "absolute",
    top: 86,                    // 🔥 pushed down
    right: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 9999,
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

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
});
