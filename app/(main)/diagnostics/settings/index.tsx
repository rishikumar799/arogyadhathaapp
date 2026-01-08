// 📁 diagnostics/settings/index.tsx

import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

// 🔐 AUTH / SESSION
import { clearSession } from "@/lib/authPersist";
import { auth } from "@/lib/firebaseConfig";
import { clearWebSession } from "@/lib/webPersist";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";

/* 🌿 AROGYADATHA COLORS */
const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#10B981",
  primaryDark: "#065F46",
  soft: "#ECFDF5",
  muted: "#64748B",
  text: "#0F172A",
  border: "#E2E8F0",
  danger: "#DC2626",
};

export default function Settings() {
  const router = useRouter();

  /* ===== STATE ===== */
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [cloudBackup, setCloudBackup] = useState(true);

  /* ===== LOGOUT ===== */
  const handleLogout = async () => {
    try {
      Platform.OS === "web"
        ? clearWebSession()
        : await clearSession();

      await signOut(auth);
    } catch {
      // silent fail (same pattern as top nav)
    }

    router.replace("/onboarding");
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Settings</ThemedText>
        <ThemedText style={styles.subtitle}>
          Manage diagnostics preferences
        </ThemedText>
      </View>

      {/* GENERAL */}
      <Section title="General">
        <ToggleRow
          icon="notifications-outline"
          label="Push Notifications"
          value={notifications}
          onChange={setNotifications}
        />
        <ToggleRow
          icon="save-outline"
          label="Auto Save Reports"
          value={autoSave}
          onChange={setAutoSave}
        />
      </Section>

      {/* APPEARANCE */}
      <Section title="Appearance">
        <ToggleRow
          icon="moon-outline"
          label="Dark Mode"
          value={darkMode}
          onChange={setDarkMode}
        />
        <NavRow icon="color-palette-outline" label="Theme" />
        <NavRow icon="language-outline" label="Language" />
      </Section>

      {/* DATA & BACKUP */}
      <Section title="Data & Backup">
        <ToggleRow
          icon="cloud-outline"
          label="Cloud Backup"
          value={cloudBackup}
          onChange={setCloudBackup}
        />
        <NavRow icon="download-outline" label="Export Reports" />
      </Section>

      {/* SECURITY */}
      <Section title="Security">
        <NavRow icon="lock-closed-outline" label="Change Password" />
        <NavRow icon="shield-checkmark-outline" label="Two-Factor Auth" />
      </Section>

      {/* DANGER ZONE */}
      <Section title="Danger Zone">
        <TouchableOpacity
          style={[styles.row, styles.dangerRow]}
          onPress={handleLogout}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <ThemedText style={[styles.rowLabel, { color: COLORS.danger }]}>
              Sign Out
            </ThemedText>
          </View>
        </TouchableOpacity>
      </Section>

      {/* ABOUT */}
      <View style={styles.aboutCard}>
        <Ionicons
          name="information-circle-outline"
          size={22}
          color={COLORS.primaryDark}
        />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <ThemedText style={styles.aboutTitle}>Arogyadatha</ThemedText>
          <ThemedText style={styles.aboutText}>
            Diagnostics Management System
          </ThemedText>
          <ThemedText style={styles.aboutSub}>Version 2.0.1</ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}

/* ================= SUB COMPONENTS ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={20} color={COLORS.primaryDark} />
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function NavRow({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={20} color={COLORS.primaryDark} />
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  header: {
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },

  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  dangerRow: {
    backgroundColor: "#FEF2F2",
  },

  aboutCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: COLORS.soft,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  aboutText: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  aboutSub: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
});
