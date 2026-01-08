import { loadWebSession } from "@/lib/webPersist";
import { Redirect, Slot, usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import DoctorBottomNav from "@/components/doctor/layout/DoctorBottomNav";
import DoctorMenuOverlay from "@/components/doctor/layout/DoctorMenuOverlay";
import DoctorSideNav from "@/components/doctor/layout/DoctorSideNav";
import DoctorTopNav from "@/components/doctor/layout/DoctorTopNav";

export default function DoctorLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const active =
    pathname === "/doctor"
      ? "doctor"
      : pathname.split("/")[2] || "doctor";

  /* ================= WEB AUTH ================= */
  if (Platform.OS === "web") {
    const s = loadWebSession();
    if (!s?.uid) return null;
    if (s.role?.toLowerCase() !== "doctor")
      return <Redirect href={`/(main)/${s.role?.toLowerCase()}`} />;
  }

  /* ================= MOBILE ================= */
  if (Platform.OS !== "web") {
    return (
      <View style={styles.mobile}>
        <DoctorTopNav />
        <Slot />

        <DoctorBottomNav
          active={active}
          onChange={(key) => router.push(`/doctor/${key}`)}
          onMenu={() => setMenuOpen(true)}
        />

        <DoctorMenuOverlay
          visible={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={(path) => router.push(path)}
        />
      </View>
    );
  }

  /* ================= WEB ================= */
  return (
    <View style={styles.web}>
      <DoctorSideNav />
      <View style={styles.content}>
        <DoctorTopNav />
        <Slot />
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  web: { flex: 1, flexDirection: "row", backgroundColor: "#F8FAFC" },
  content: { flex: 1, backgroundColor: "#F8FAFC" },
  mobile: { flex: 1, backgroundColor: "#F8FAFC" },
});
