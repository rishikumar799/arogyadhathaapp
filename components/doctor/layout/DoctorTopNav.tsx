import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// SESSION
import { loadSession } from "@/lib/authPersist";
import { loadWebSession } from "@/lib/webPersist";

// ASSETS
import logo from "@/assets/images/Arogyadathalogo.png";
import doctorAvatar from "@/assets/images/man.png";

// LOCATION
import LocationPickerSheet from "@/components/common/LocationPickerSheet";
import { useLocation } from "@/contexts/LocationContext";

// ✅ DOCTOR PROFILE MODAL (NEW)
import DoctorProfileMenuModal from "@/components/doctor/layout/DoctorProfileMenuModal";

/* ================= COLORS ================= */

const COLORS = {
  bgStart: "#022C22",
  bgEnd: "#064E3B",

  glass: "rgba(236,253,243,0.12)",
  glassBorder: "rgba(167,243,208,0.35)",

  text: "#ECFDF5",
  muted: "#A7F3D0",
  brand: "#16A34A",
  danger: "#DC2626",
};

/* ================= MAIN ================= */

export default function DoctorTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = Platform.OS !== "web";

  const slideAnim = useRef(new Animated.Value(360)).current;

  const [doctorName, setDoctorName] = useState("Doctor");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const { location, loading } = useLocation();

  const locationLabel = loading
    ? "Detecting location..."
    : location.city
    ? `${location.city}${location.district ? ", " + location.district : ""}`
    : "Select Location";

  const isActive = (base: string) =>
    pathname === base || pathname.startsWith(base + "/");

  /* ================= LOAD SESSION ================= */

  useEffect(() => {
    (async () => {
      const session =
        Platform.OS === "web"
          ? loadWebSession()
          : await loadSession();

      if (session?.name) setDoctorName(session.name);
    })();
  }, []);

  /* ================= DRAWER ANIM ================= */

  useEffect(() => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(360);
    }
  }, [menuOpen]);

  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          {/* LEFT */}
          <View style={styles.left}>
            <Image source={logo} style={styles.logo} />
            <View>
              <Text style={styles.appName}>Arogyadatha</Text>

              <TouchableOpacity
                style={styles.locationRow}
                onPress={() => setShowLocation(true)}
              >
                <Ionicons name="location" size={13} color={COLORS.brand} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {locationLabel}
                </Text>
                <Ionicons name="chevron-down" size={12} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.right}>
            <TouchableOpacity onPress={() => setProfileOpen(true)}>
              <Image source={doctorAvatar} style={styles.avatar} />
            </TouchableOpacity>

            {isMobile && (
              <TouchableOpacity
                onPress={() => setMenuOpen(true)}
                style={styles.menuBtn}
              >
                <Ionicons name="menu" size={26} color={COLORS.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* LOCATION */}
      <LocationPickerSheet
        visible={showLocation}
        onClose={() => setShowLocation(false)}
      />

      {/* ================= MOBILE DRAWER ================= */}
      {isMobile && (
        <Modal visible={menuOpen} transparent animationType="none">
          <Pressable
            style={styles.backdrop}
            onPress={() => setMenuOpen(false)}
          />

          <Animated.View
            style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
          >
            <LinearGradient
              colors={[COLORS.bgStart, COLORS.bgEnd]}
              style={styles.drawerInner}
            >
              {/* HEADER */}
              <View style={styles.drawerHeader}>
                <View style={styles.drawerBrand}>
                  <Image source={logo} style={styles.drawerLogo} />
                  <Text style={styles.drawerTitle}>Arogyadatha</Text>
                </View>
                <Pressable onPress={() => setMenuOpen(false)}>
                  <Ionicons name="close" size={22} color={COLORS.text} />
                </Pressable>
              </View>

              {/* NAV */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <NavItem icon="grid-outline" label="Dashboard" active={pathname === "/doctor"} onPress={() => go("/doctor")} />
                <NavItem icon="calendar-outline" label="Appointments" active={isActive("/doctor/appointments")} onPress={() => go("/doctor/appointments")} />
                <NavItem icon="people-outline" label="Patients" active={isActive("/doctor/patients")} onPress={() => go("/doctor/patients")} />
                <NavItem icon="chatbubble-outline" label="Consultations" active={isActive("/doctor/consultations")} onPress={() => go("/doctor/consultations")} />
                <NavItem icon="document-text-outline" label="Prescriptions" active={isActive("/doctor/prescriptions")} onPress={() => go("/doctor/prescriptions")} />
                <NavItem icon="bar-chart-outline" label="Reports" active={isActive("/doctor/reports")} onPress={() => go("/doctor/reports")} />
                <NavItem icon="time-outline" label="Schedule" active={isActive("/doctor/schedule")} onPress={() => go("/doctor/schedule")} />
                <NavItem icon="settings-outline" label="Settings" active={isActive("/doctor/settings")} onPress={() => go("/doctor/settings")} />

                <View style={{ height: 24 }} />
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </Modal>
      )}

      {/* ================= DOCTOR PROFILE MODAL ================= */}
      <DoctorProfileMenuModal
        visible={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}

/* ================= COMPONENTS ================= */

function NavItem({ icon, label, onPress, active }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, active && styles.itemActive]}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={icon}
          size={18}
          color={active ? COLORS.brand : COLORS.muted}
        />
      </View>
      <Text style={[styles.label, active && { color: COLORS.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  gradient: {
    paddingTop: Platform.OS === "ios" ? 48 : Platform.OS === "android" ? 42 : 18,
    paddingBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  container: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  right: { flexDirection: "row", alignItems: "center", gap: 14 },

  logo: { width: 42, height: 42 },
  appName: { fontSize: 17, fontWeight: "800", color: COLORS.text },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -2,
  },

  locationText: { fontSize: 12, color: COLORS.muted },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.muted,
  },

  menuBtn: { padding: 6 },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },

  drawer: { position: "absolute", right: 0, top: 0, bottom: 0, width: "85%" },
  drawerInner: { flex: 1 },

  drawerHeader: {
    height: 68,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  drawerBrand: { flexDirection: "row", alignItems: "center", gap: 10 },
  drawerLogo: { width: 34, height: 34 },
  drawerTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginHorizontal: 14,
    marginBottom: 6,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 999,
  },

  itemActive: {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(240,253,244,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  label: { fontSize: 15, fontWeight: "600", color: COLORS.muted },
});
