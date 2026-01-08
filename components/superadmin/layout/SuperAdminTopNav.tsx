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
import { clearSession, loadSession } from "@/lib/authPersist";
import { clearWebSession, loadWebSession } from "@/lib/webPersist";

// FIREBASE
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";

// ASSETS
import logo from "@/assets/images/Arogyadathalogo.png";
import adminAvatar from "@/assets/images/man.png";

// LOCATION (same as Patient)
import LocationPickerSheet from "@/components/common/LocationPickerSheet";
import { useLocation } from "@/contexts/LocationContext";

/* ================= COLORS ================= */

const COLORS = {
  bgStart: "#021B14",
  bgEnd: "#064E3B",

  glass: "rgba(236,253,243,0.12)",
  glassBorder: "rgba(167,243,208,0.35)",

  text: "#ECFDF5",
  muted: "#A7F3D0",
  brand: "#16A34A",
  danger: "#DC2626",
};

/* ================= ROOT ================= */

export default function SuperAdminTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = Platform.OS !== "web";

  const slideAnim = useRef(new Animated.Value(360)).current;

  const [adminName, setAdminName] = useState("Super Admin");
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

  /* ---------------- LOAD SESSION ---------------- */

  useEffect(() => {
    (async () => {
      const session =
        Platform.OS === "web"
          ? loadWebSession()
          : await loadSession();
      if (session?.name) setAdminName(session.name);
    })();
  }, []);

  /* ---------------- ANIMATION ---------------- */

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

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = async () => {
    try {
      Platform.OS === "web"
        ? clearWebSession()
        : await clearSession();
      await signOut(auth);
    } catch (e) {
      console.log("Logout failed", e);
    }
    setMenuOpen(false);
    router.replace("/onboarding");
  };

  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={styles.gradient}>
        <View style={styles.container}>
          {/* LEFT */}
          <View style={styles.left}>
            <Image source={logo} style={styles.logo} />
            <View>
              <Text style={styles.appName}>Arogyadhatha</Text>
              <TouchableOpacity onPress={() => setShowLocation(true)}>
                <Text style={styles.locationText} numberOfLines={1}>
                  {locationLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.right}>
            <TouchableOpacity onPress={() => setProfileOpen(true)}>
              <Image source={adminAvatar} style={styles.avatar} />
            </TouchableOpacity>

            {isMobile && (
              <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.menuBtn}>
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
        <Modal visible={menuOpen} transparent>
          <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />

          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={styles.drawerInner}>
              {/* FIXED HEADER */}
              <View style={styles.drawerHeader}>
                <View style={styles.drawerBrand}>
                  <Image source={logo} style={styles.drawerLogo} />
                  <Text style={styles.drawerTitle}>Arogyadhatha</Text>
                </View>
                <Pressable onPress={() => setMenuOpen(false)}>
                  <Ionicons name="close" size={22} color={COLORS.text} />
                </Pressable>
              </View>

              {/* SCROLLABLE NAV */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <NavItem icon="grid-outline" label="Dashboard" active={pathname === "/superadmin"} onPress={() => go("/superadmin")} />

                <Section title="Users" />
                <NavItem icon="person-add-outline" label="Add User" active={isActive("/superadmin/users/adduser")} onPress={() => go("/superadmin/users/adduser")} />
                <NavItem icon="people-outline" label="All Users" active={isActive("/superadmin/users/allusers")} onPress={() => go("/superadmin/users/allusers")} />
                <NavItem icon="person-circle-outline" label="Manage Users" active={isActive("/superadmin/users/manageusers")} onPress={() => go("/superadmin/users/manageusers")} />

                <Section title="Requests" />
                <NavItem icon="alert-circle-outline" label="Registration Requests" active={isActive("/superadmin/requests")} onPress={() => go("/superadmin/requests")} />

                <Section title="Hospitals" />
                <NavItem icon="add-circle-outline" label="Add Hospital" active={isActive("/superadmin/hospital/addhospital")} onPress={() => go("/superadmin/hospital/addhospital")} />
                <NavItem icon="business-outline" label="Hospitals List" active={isActive("/superadmin/hospital/list")} onPress={() => go("/superadmin/hospital/list")} />
                <NavItem icon="people-outline" label="Hospital Staff" active={isActive("/superadmin/hospital/staff")} onPress={() => go("/superadmin/hospital/staff")} />
                <NavItem icon="settings-outline" label="Configuration" active={isActive("/superadmin/hospital/configuration")} onPress={() => go("/superadmin/hospital/configuration")} />

                <Section title="Reports" />
                <NavItem icon="bar-chart-outline" label="Usage Reports" active={isActive("/superadmin/reports/usagereports")} onPress={() => go("/superadmin/reports/usagereports")} />
                <NavItem icon="pulse-outline" label="Health Analytics" active={isActive("/superadmin/reports/healthanalytics")} onPress={() => go("/superadmin/reports/healthanalytics")} />
                <NavItem icon="document-text-outline" label="Audit Logs" active={isActive("/superadmin/reports/auditlogs")} onPress={() => go("/superadmin/reports/auditlogs")} />

              <Section title="System" />

<NavItem  icon="settings-outline"  label="App Settings"  active={isActive("/superadmin/system/appsettings")}  onPress={() => go("/superadmin/system/appsettings")}/>

<NavItem  icon="notifications-outline"  label="Announcements"  active={isActive("/superadmin/system/announcements")}  onPress={() => go("/superadmin/system/announcements")}/>

<NavItem icon="shield-checkmark-outline"  label="Security"  active={isActive("/superadmin/system/security")}  onPress={() => go("/superadmin/system/security")}/>

<NavItem icon="cloud-outline"  label="Integrations"  active={isActive("/superadmin/system/integrations")}  onPress={() => go("/superadmin/system/integrations")}/>

                <Section title="Support" />
                <NavItem icon="help-circle-outline" label="Help Center" active={isActive("/superadmin/support/helpcenter")} onPress={() => go("/superadmin/support/helpcenter")} />
                <NavItem icon="chatbubbles-outline" label="Support Tickets" active={isActive("/superadmin/support/supporttickets")} onPress={() => go("/superadmin/support/supporttickets")} />

                <View style={{ height: 24 }} />
              </ScrollView>

              {/* FIXED LOGOUT */}
              <View style={styles.logoutCardWrap}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutCard}>
                  <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </Modal>
      )}

      {/* PROFILE MODAL */}
      <Modal visible={profileOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setProfileOpen(false)}>
          <View style={styles.profileModal}>
            <Image source={adminAvatar} style={styles.profileAvatar} />
            <Text style={styles.profileName}>{adminName}</Text>
            <Text style={styles.profileRole}>Super Admin</Text>

            <ProfileItem icon="person-outline" label="Edit Profile" onPress={() => router.push("/superadmin/profile")} />
            <ProfileItem icon="lock-closed-outline" label="Change Password" onPress={() => router.push("/superadmin/security/password")} />
            <ProfileItem icon="log-out-outline" label="Logout" danger onPress={handleLogout} />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

/* ================= COMPONENTS ================= */

function Section({ title }: any) {
  return <Text style={styles.section}>{title}</Text>;
}

function NavItem({ icon, label, onPress, active }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, active && styles.itemActive]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={active ? COLORS.brand : COLORS.muted} />
      </View>
      <Text style={[styles.label, active && { color: COLORS.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ProfileItem({ icon, label, onPress, danger }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.profileItem}>
      <Ionicons name={icon} size={18} color={danger ? COLORS.danger : "#0F172A"} />
      <Text style={[styles.profileItemText, danger && { color: COLORS.danger }]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  gradient: { paddingTop: Platform.OS !== "web" ? 44 : 18, paddingBottom: 12 },
  container: { height: 70, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  right: { flexDirection: "row", alignItems: "center", gap: 14 },

  logo: { width: 40, height: 40 },
  appName: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  locationText: { fontSize: 11, color: COLORS.muted, marginTop: -2 },

  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: COLORS.muted },
  menuBtn: { padding: 4 },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },

  drawer: { position: "absolute", right: 0, top: 0, bottom: 0, width: "85%" },
  drawerInner: { flex: 1 },

  drawerHeader: { height: 68, paddingHorizontal: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  drawerBrand: { flexDirection: "row", alignItems: "center", gap: 10 },
  drawerLogo: { width: 34, height: 34 },
  drawerTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  section: { marginTop: 18, marginBottom: 6, marginLeft: 22, fontSize: 13, fontWeight: "800", letterSpacing: 1.1, color: COLORS.muted },

  item: { flexDirection: "row", alignItems: "center", gap: 14, marginHorizontal: 14, marginBottom: 6, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 999 },
  itemActive: { backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder },

  iconWrap: { width: 40, height: 40, borderRadius: 14, backgroundColor: "rgba(240,253,244,0.12)", alignItems: "center", justifyContent: "center" },
  label: { fontSize: 15, fontWeight: "600", color: COLORS.muted },

  logoutCardWrap: { padding: 16, borderTopWidth: 1, borderColor: COLORS.glassBorder },
  logoutCard: { flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, paddingVertical: 14, borderRadius: 14 },
  logoutText: { fontSize: 15, fontWeight: "700", color: COLORS.danger },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  profileModal: { width: "80%", backgroundColor: "#fff", borderRadius: 18, padding: 20, alignItems: "center" },
  profileAvatar: { width: 64, height: 64, borderRadius: 32, marginBottom: 10 },
  profileName: { fontSize: 16, fontWeight: "800" },
  profileRole: { fontSize: 13, color: "#64748B", marginBottom: 20 },
  profileItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  profileItemText: { fontSize: 15, fontWeight: "600" },
});
