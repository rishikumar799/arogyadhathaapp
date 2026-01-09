import { loadWebSession } from "@/lib/webPersist";
import { Redirect, Slot, usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

/* ===== PHARMACY LAYOUT COMPONENTS ===== */
import HospitalBottomNav from "@/components/hospital/layout/HospitalBottomNav";
import HospitalMenuOverlay from "@/components/hospital/layout/HospitalMenuOverlay";
import HospitalSideNav from "@/components/hospital/layout/HospitalSideNav";
import HospitalTopNav from "@/components/hospital/layout/HospitalTopNav";

export default function HospitalLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const active =
    pathname === "/hospital"
      ? "hospital"
      : pathname.split("/")[2] || "hospital";

  /* ================= WEB AUTH ================= */
  if (Platform.OS === "web") {
    const session = loadWebSession();
    if (!session?.uid) return null;

    if (session.role?.toLowerCase() !== "hospital") {
      return <Redirect href={`/(main)/${session.role?.toLowerCase()}`} />;
    }
  }

  /* ================= MOBILE ================= */
  if (Platform.OS !== "web") {
    return (
      <View style={styles.mobile}>
        <HospitalTopNav />
        <Slot />

        <HospitalBottomNav
          active={active}
          onChange={(key: string) => router.push(`/hospital/${key}`)}
          onMenu={() => setMenuOpen(true)}
        />

        <HospitalMenuOverlay
          visible={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={(path: string) => router.push(path)}
        />
      </View>
    );
  }

  /* ================= WEB ================= */
  return (
    <View style={styles.web}>
      <HospitalSideNav />
      <View style={styles.content}>
        <HospitalTopNav />
        <Slot />
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  web: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mobile: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});
