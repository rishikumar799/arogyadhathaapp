import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#065F46",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const settingsSections = [
  {
    title: "General Settings",
    items: [
      { icon: "business", label: "Hospital Information", description: "Update hospital details" },
      { icon: "time", label: "Working Hours", description: "Set operating hours" },
      { icon: "calendar", label: "Holiday Schedule", description: "Manage holidays" },
    ]
  },
  {
    title: "Notification Settings",
    items: [
      { icon: "notifications", label: "Push Notifications", type: "switch" },
      { icon: "mail", label: "Email Alerts", type: "switch" },
      { icon: "chatbubble", label: "SMS Alerts", type: "switch" },
    ]
  },
  {
    title: "System Settings",
    items: [
      { icon: "lock-closed", label: "Security & Privacy", description: "Manage security settings" },
      { icon: "cloud-upload", label: "Backup & Restore", description: "Data backup settings" },
      { icon: "brush", label: "Appearance", description: "Theme and display" },
    ]
  },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [smsAlerts, setSmsAlerts] = React.useState(false);

  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Settings</ThemedText>
          <ThemedText style={styles.subtitle}>System Configuration</ThemedText>
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
        </TouchableOpacity>
      </View>

      {settingsSections.map((section, sectionIdx) => (
        <View key={sectionIdx} style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
          <View style={styles.settingsCard}>
            {section.items.map((item, itemIdx) => (
              <TouchableOpacity key={itemIdx} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                  </View>
                  <View>
                    <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
                    {item.description && (
                      <ThemedText style={styles.settingDescription}>{item.description}</ThemedText>
                    )}
                  </View>
                </View>
                {item.type === "switch" ? (
                  <Switch
                    value={
                      item.label === "Push Notifications" ? notifications :
                      item.label === "Email Alerts" ? emailAlerts :
                      smsAlerts
                    }
                    onValueChange={
                      item.label === "Push Notifications" ? setNotifications :
                      item.label === "Email Alerts" ? setEmailAlerts :
                      setSmsAlerts
                    }
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Account</ThemedText>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons name="person" size={20} color={COLORS.primary} />
              </View>
              <View>
                <ThemedText style={styles.settingLabel}>Profile Settings</ThemedText>
                <ThemedText style={styles.settingDescription}>Update your profile information</ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons name="key" size={20} color={COLORS.primary} />
              </View>
              <View>
                <ThemedText style={styles.settingLabel}>Change Password</ThemedText>
                <ThemedText style={styles.settingDescription}>Update your login password</ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: "#FEE2E2" }]}>
                <Ionicons name="log-out" size={20} color="#DC2626" />
              </View>
              <View>
                <ThemedText style={[styles.settingLabel, { color: "#DC2626" }]}>Logout</ThemedText>
                <ThemedText style={[styles.settingDescription, { color: "#DC2626" }]}>Sign out from your account</ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  saveButton: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  saveButtonText: { color: "#fff", fontWeight: "600" },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 16 },
  settingsCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  settingItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border + "80" },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 16, flex: 1 },
  settingIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primary + "20", alignItems: "center", justifyContent: "center" },
  settingLabel: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  settingDescription: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  dangerItem: { borderBottomWidth: 0 },
});