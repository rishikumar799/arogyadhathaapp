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

/* ================= SESSION ================= */
import { loadSession } from "@/lib/authPersist";
import { loadWebSession } from "@/lib/webPersist";

/* ================= ASSETS ================= */
import logo from "@/assets/images/Arogyadathalogo.png";
import hospitalAvatar from "@/assets/images/man.png";

/* ================= LOCATION ================= */
import LocationPickerSheet from "@/components/common/LocationPickerSheet";
import { useLocation } from "@/contexts/LocationContext";

/* ================= PROFILE ================= */
import HospitalProfileMenuModal from "@/components/hospital/layout/HospitalProfileMenuModal";

/* ================= COLORS ================= */

const COLORS = {
  bgStart: "#022C22",
  bgEnd: "#064E3B",
  glass: "rgba(236,253,243,0.12)",
  glassBorder: "rgba(167,243,208,0.35)",
  text: "#ECFDF5",
  muted: "#A7F3D0",
  brand: "#16A34A",
};

/* ================= ROLE BASED NAV ================= */

type NavItem = { icon: any; label: string; path: string; exact?: boolean };
type NavGroup = { title: string; items: NavItem[] };

const NAV_BY_ROLE: Record<string, NavGroup[]> = {
  hospital: [
    {
      title: "Core",
      items: [
        { icon: "grid-outline", label: "Dashboard", path: "/hospital", exact: true },
        { icon: "calendar-outline", label: "Appointments", path: "/hospital/appointments" },
      ],
    },
    {
      title: "Users",
      items: [
        { icon: "people-outline", label: "Patients", path: "/hospital/patients" },
        { icon: "medkit-outline", label: "Doctors", path: "/hospital/doctors" },
        { icon: "flask-outline", label: "Diagnostics", path: "/hospital/diagnostics" },
        { icon: "bandage-outline", label: "Pharmacy", path: "/hospital/pharmacy" },
        { icon: "headset-outline", label: "Reception", path: "/hospital/reception" },
      ],
    },
    {
      title: "Operations",
      items: [
        { icon: "business-outline", label: "Departments", path: "/hospital/departments" },
        { icon: "bed-outline", label: "Rooms & Beds", path: "/hospital/rooms" },
        { icon: "cube-outline", label: "Inventory", path: "/hospital/inventory" },
      ],
    },
    {
      title: "Finance",
      items: [
        { icon: "card-outline", label: "Billing", path: "/hospital/billing" },
        { icon: "bar-chart-outline", label: "Reports", path: "/hospital/reports" },
      ],
    },
    {
      title: "System",
      items: [
        { icon: "settings-outline", label: "Settings", path: "/hospital/settings" },
      ],
    },
  ],
};

/* ================= MAIN ================= */

export default function HospitalTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = Platform.OS !== "web";

  const slideAnim = useRef(new Animated.Value(360)).current;

  const [role, setRole] = useState("hospital");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const { location, loading } = useLocation();

  const locationLabel = loading
    ? "Detecting location..."
    : location.city
    ? `${location.city}${location.district ? ", " + location.district : ""}`
    : "Select Location";

  /* ================= SESSION ================= */

  useEffect(() => {
    (async () => {
      const session =
        Platform.OS === "web" ? loadWebSession() : await loadSession();
      if (session?.role) setRole(session.role.toLowerCase());
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

  /* ================= ACTIVE LOGIC (FIXED) ================= */

  const isActive = (path: string, exact = false) =>
    exact
      ? pathname === path
      : pathname === path || pathname.startsWith(path + "/");

  const NAV_GROUPS = NAV_BY_ROLE[role] || [];

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={styles.gradient}>
        <View style={styles.container}>
          <View style={styles.left}>
            <Image source={logo} style={styles.logo} />
            <View>
              <Text style={styles.appName}>Arogyadatha</Text>
              <TouchableOpacity
                style={styles.locationRow}
                onPress={() => setShowLocation(true)}
              >
                <Ionicons name="location" size={13} color={COLORS.brand} />
                <Text style={styles.locationText}>{locationLabel}</Text>
                <Ionicons name="chevron-down" size={12} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.right}>
            <TouchableOpacity onPress={() => setProfileOpen(true)}>
              <Image source={hospitalAvatar} style={styles.avatar} />
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

      <LocationPickerSheet
        visible={showLocation}
        onClose={() => setShowLocation(false)}
      />

      {/* ================= MOBILE DRAWER ================= */}
      {isMobile && (
        <Modal visible={menuOpen} transparent>
          <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />

          <Animated.View
            style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
          >
            <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={styles.drawerInner}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {NAV_GROUPS.map(group => (
                  <View key={group.title}>
                    <Text style={styles.groupTitle}>{group.title}</Text>
                    {group.items.map(item => (
                      <NavItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        active={isActive(item.path, item.exact)}
                        onPress={() => go(item.path)}
                      />
                    ))}
                  </View>
                ))}
                <View style={{ height: 28 }} />
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </Modal>
      )}

      <HospitalProfileMenuModal
        visible={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}

/* ================= NAV ITEM ================= */

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
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6 },
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
  drawerInner: { flex: 1, paddingTop: 18 },

  groupTitle: {
    marginLeft: 22,
    marginTop: 18,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
  },

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
