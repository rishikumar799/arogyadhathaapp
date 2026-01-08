import { loadWebSession } from "@/lib/webPersist";
import { Slot, usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

/* ✅ DIAGNOSTICS LAYOUT COMPONENTS */
import DiagnosticsBottomNav from "@/components/diagnostics/layout/DiagnosticsBottomNav";
import DiagnosticsMenuOverlay from "@/components/diagnostics/layout/DiagnosticsMenuOverlay";
import DiagnosticsSideNav from "@/components/diagnostics/layout/DiagnosticsSideNav";
import DiagnosticsTopNav from "@/components/diagnostics/layout/DiagnosticsTopNav";

export default function DiagnosticsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  /* ================= ACTIVE TAB (MOBILE) ================= */
  const active =
    pathname === "/diagnostics"
      ? "diagnostics"
      : pathname.split("/")[2] || "diagnostics";

  /* ================= WEB AUTH (FAIL-CLOSED) ================= */
  if (Platform.OS === "web") {
    const session = loadWebSession();

    /**
     * 🔐 SECURITY PRINCIPLE:
     * - No redirects
     * - No role hints
     * - No navigation side-effects
     * - Simply render nothing if invalid
     */
    if (!session?.uid) return null;

    if (session.role?.toLowerCase() !== "diagnostics") {
      return null;
    }
  }

  /* ================= MOBILE LAYOUT ================= */
  if (Platform.OS !== "web") {
    return (
      <View style={styles.mobile}>
        <DiagnosticsTopNav />

        <Slot />

        <DiagnosticsBottomNav
          active={active}
          onChange={(key) => router.push(`/diagnostics/${key}`)}
          onMenu={() => setMenuOpen(true)}
        />

        <DiagnosticsMenuOverlay
          visible={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={(path) => router.push(path)}
        />
      </View>
    );
  }

  /* ================= WEB LAYOUT ================= */
  return (
    <View style={styles.web}>
      <DiagnosticsSideNav />

      <View style={styles.content}>
        <DiagnosticsTopNav />
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
