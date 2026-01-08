import { ThemedText } from "@/components/themed-text";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";

export default function AppSettingsScreen() {
  const [settings, setSettings] = useState({
    enableRegistrations: true,
    requireApproval: true,
    auditLogging: true,
    multiHospitalAccess: true,
    maintenanceMode: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.title}>App Settings</ThemedText>

      {/* Platform Controls */}
      <Section title="Platform Controls">
        <Setting
          label="Enable New Registrations"
          description="Allow hospitals and users to register on the platform"
          value={settings.enableRegistrations}
          onToggle={() => toggle("enableRegistrations")}
        />

        <Setting
          label="Require Admin Approval"
          description="New accounts must be approved by Super Admin"
          value={settings.requireApproval}
          onToggle={() => toggle("requireApproval")}
        />

        <Setting
          label="Maintenance Mode"
          description="Temporarily disable access for non-admin users"
          value={settings.maintenanceMode}
          onToggle={() => toggle("maintenanceMode")}
        />
      </Section>

      {/* Security & Compliance */}
      <Section title="Security & Compliance">
        <Setting
          label="Audit Logging"
          description="Track all critical actions across the system"
          value={settings.auditLogging}
          onToggle={() => toggle("auditLogging")}
        />

        <Setting
          label="Multi-Hospital Access"
          description="Allow users to operate across multiple hospitals"
          value={settings.multiHospitalAccess}
          onToggle={() => toggle("multiHospitalAccess")}
        />
      </Section>

      {/* Defaults & Limits */}
      <Section title="Defaults & Limits">
        <Info text="• Default user roles and permissions" />
        <Info text="• Appointment limits per hospital" />
        <Info text="• Storage and upload limits" />
        <Info text="• Feature access per subscription (future)" />
      </Section>

      {/* Branding */}
      <Section title="Branding">
        <Info text="• App name and logo" />
        <Info text="• Primary brand colors" />
        <Info text="• Email & notification templates" />
      </Section>
    </ScrollView>
  );
}

/* ---------- Components ---------- */

function Section({ title, children }: any) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );
}

function Setting({ label, description, value, onToggle }: any) {
  return (
    <View style={styles.settingRow}>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.settingLabel}>{label}</ThemedText>
        <ThemedText style={styles.muted}>{description}</ThemedText>
      </View>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}

function Info({ text }: { text: string }) {
  return <ThemedText style={styles.info}>{text}</ThemedText>;
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  page: { padding: 24 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  settingLabel: {
    fontWeight: "600",
  },
  muted: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },
  info: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
});
