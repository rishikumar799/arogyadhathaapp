import { loadWebSession } from "@/lib/webPersist";
import { Redirect, Slot, usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import ReceptionistBottomNav from "@/components/receptionist/layout/ReceptionistBottomNav";
import ReceptionistMenuOverlay from "@/components/receptionist/layout/ReceptionistMenuOverlay";
import ReceptionistSideNav from "@/components/receptionist/layout/ReceptionistSideNav";
import ReceptionistTopNav from "@/components/receptionist/layout/ReceptionistTopNav";

export default function ReceptionistLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const active =
    pathname === "/receptionist"
      ? "receptionist"
      : pathname.split("/")[2] || "receptionist";

  /* ================= WEB AUTH ================= */
  if (Platform.OS === "web") {
    const s = loadWebSession();
    if (!s?.uid) return null;

    if (s.role?.toLowerCase() !== "receptionist") {
      return <Redirect href={`/(main)/${s.role?.toLowerCase()}`} />;
    }
  }

  /* ================= MOBILE ================= */
  if (Platform.OS !== "web") {
    return (
      <View style={styles.mobile}>
        <ReceptionistTopNav />
        <Slot />

        <ReceptionistBottomNav
          active={active}
          onChange={(key) => router.push(`/receptionist/${key}`)}
          onMenu={() => setMenuOpen(true)}
        />

        <ReceptionistMenuOverlay
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
      <ReceptionistSideNav />
      <View style={styles.content}>
        <ReceptionistTopNav />
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
