import { loadWebSession } from "@/lib/webPersist";
import { Redirect, Slot, usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

/* ===== PHARMACY LAYOUT COMPONENTS ===== */
import PharmacyBottomNav from "@/components/pharmacy/layout/PharmacyBottomNav";
import PharmacyMenuOverlay from "@/components/pharmacy/layout/PharmacyMenuOverlay";
import PharmacySideNav from "@/components/pharmacy/layout/PharmacySideNav";
import PharmacyTopNav from "@/components/pharmacy/layout/PharmacyTopNav";

export default function PharmacyLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const active =
    pathname === "/pharmacy"
      ? "pharmacy"
      : pathname.split("/")[2] || "pharmacy";

  /* ================= WEB AUTH ================= */
  if (Platform.OS === "web") {
    const session = loadWebSession();
    if (!session?.uid) return null;

    if (session.role?.toLowerCase() !== "pharmacy") {
      return <Redirect href={`/(main)/${session.role?.toLowerCase()}`} />;
    }
  }

  /* ================= MOBILE ================= */
  if (Platform.OS !== "web") {
    return (
      <View style={styles.mobile}>
        <PharmacyTopNav />
        <Slot />

        <PharmacyBottomNav
          active={active}
          onChange={(key: string) => router.push(`/pharmacy/${key}`)}
          onMenu={() => setMenuOpen(true)}
        />

        <PharmacyMenuOverlay
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
      <PharmacySideNav />
      <View style={styles.content}>
        <PharmacyTopNav />
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
