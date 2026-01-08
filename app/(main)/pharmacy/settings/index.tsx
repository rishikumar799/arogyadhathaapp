import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View
} from "react-native";

const COLORS = {
  primary: "#10B981",
  secondary: "#3B82F6",
  accent: "#8B5CF6",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#10B981",
  text: "#0F172A",
  textLight: "#334155",
  muted: "#64748B",
  border: "#E2E8F0",
  soft: "#ECFDF5",
  bg: "#FFFFFF",
};

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    prescriptionAlerts: true,
    lowStockAlerts: true,
    paymentReminders: true,
    systemUpdates: false,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    autoPrint: true,
    autoSave: true,
    biometricLogin: true,
  });

  const handleToggle = (setting, category) => {
    if (category === 'notifications') {
      setNotifications(prev => ({ ...prev, [setting]: !prev[setting] }));
    } else {
      setPreferences(prev => ({ ...prev, [setting]: !prev[setting] }));
    }
  };

  const handleClearCache = () => {
    Alert.alert("Clear Cache", "This will remove temporary files. Continue?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", onPress: () => Alert.alert("Cleared", "Cache cleared successfully!") }
    ]);
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Export all pharmacy data?", [
      { text: "Cancel", style: "cancel" },
      { text: "Export", onPress: () => Alert.alert("Exported", "Data exported successfully!") }
    ]);
  };

  const handleResetSettings = () => {
    Alert.alert("Reset Settings", "Reset all settings to default?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: () => {
        setNotifications({
          prescriptionAlerts: true,
          lowStockAlerts: true,
          paymentReminders: true,
          systemUpdates: false,
        });
        setPreferences({
          darkMode: false,
          autoPrint: true,
          autoSave: true,
          biometricLogin: true,
        });
        Alert.alert("Reset", "Settings reset to default");
      }}
    ]);
  };

  const renderSettingItem = (icon, label, description, value, onToggle, category) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={22} color={COLORS.primary} />
        </View>
        <View style={styles.settingDetails}>
          <ThemedText style={styles.settingLabel}>{label}</ThemedText>
          <ThemedText style={styles.settingDescription}>{description}</ThemedText>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={() => onToggle(category)}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const renderActionItem = (icon, label, description, onPress, color = COLORS.text) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionInfo}>
        <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.actionDetails}>
          <ThemedText style={styles.actionLabel}>{label}</ThemedText>
          <ThemedText style={styles.actionDescription}>{description}</ThemedText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Settings</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Customize your pharmacy experience</ThemedText>
          </View>
          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="save" size={20} color="#FFFFFF" />
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* NOTIFICATION SETTINGS */}
      <View style={styles.settingsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
          <Ionicons name="notifications" size={24} color={COLORS.primary} />
        </View>

        {renderSettingItem(
          "document-text",
          "Prescription Alerts",
          "Get notified for new prescriptions",
          notifications.prescriptionAlerts,
          handleToggle,
          "prescriptionAlerts"
        )}

        {renderSettingItem(
          "warning",
          "Low Stock Alerts",
          "Alerts when inventory is low",
          notifications.lowStockAlerts,
          handleToggle,
          "lowStockAlerts"
        )}

        {renderSettingItem(
          "cash",
          "Payment Reminders",
          "Reminders for pending payments",
          notifications.paymentReminders,
          handleToggle,
          "paymentReminders"
        )}

        {renderSettingItem(
          "refresh",
          "System Updates",
          "Notify about app updates",
          notifications.systemUpdates,
          handleToggle,
          "systemUpdates"
        )}
      </View>

      {/* PREFERENCES */}
      <View style={styles.settingsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
          <Ionicons name="options" size={24} color={COLORS.primary} />
        </View>

        {renderSettingItem(
          "moon",
          "Dark Mode",
          "Switch to dark theme",
          preferences.darkMode,
          handleToggle,
          "darkMode"
        )}

        {renderSettingItem(
          "print",
          "Auto-Print",
          "Automatically print receipts",
          preferences.autoPrint,
          handleToggle,
          "autoPrint"
        )}

        {renderSettingItem(
          "save",
          "Auto-Save",
          "Automatically save changes",
          preferences.autoSave,
          handleToggle,
          "autoSave"
        )}

        {renderSettingItem(
          "finger-print",
          "Biometric Login",
          "Use fingerprint or face ID",
          preferences.biometricLogin,
          handleToggle,
          "biometricLogin"
        )}
      </View>

      {/* DATA MANAGEMENT */}
      <View style={styles.settingsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Data Management</ThemedText>
          <Ionicons name="server" size={24} color={COLORS.primary} />
        </View>

        {renderActionItem(
          "download",
          "Export Data",
          "Export pharmacy data to external storage",
          handleExportData,
          COLORS.secondary
        )}

        {renderActionItem(
          "trash",
          "Clear Cache",
          "Remove temporary files",
          handleClearCache,
          COLORS.warning
        )}

        {renderActionItem(
          "cloud-upload",
          "Backup Data",
          "Create backup to cloud",
          () => Alert.alert("Backup", "Backup feature coming soon"),
          COLORS.success
        )}
      </View>

      {/* ABOUT & SUPPORT */}
      <View style={styles.settingsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>About & Support</ThemedText>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
        </View>

        {renderActionItem(
          "help-circle",
          "Help & Support",
          "Get help using the app",
          () => Alert.alert("Support", "Contact support@pharmacyapp.com"),
          COLORS.info || COLORS.secondary
        )}

        {renderActionItem(
          "document-text",
          "Terms & Conditions",
          "View terms of service",
          () => Alert.alert("Terms", "Terms & conditions"),
          COLORS.muted
        )}

        {renderActionItem(
          "shield-checkmark",
          "Privacy Policy",
          "View privacy policy",
          () => Alert.alert("Privacy", "Privacy policy"),
          COLORS.muted
        )}

        {renderActionItem(
          "star",
          "Rate App",
          "Rate us on app store",
          () => Alert.alert("Rate", "Thank you for your feedback!"),
          COLORS.warning
        )}
      </View>

      {/* DANGER ZONE */}
      <View style={styles.dangerSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: COLORS.danger }]}>Danger Zone</ThemedText>
          <Ionicons name="warning" size={24} color={COLORS.danger} />
        </View>

        <TouchableOpacity style={styles.dangerButton} onPress={handleResetSettings}>
          <Ionicons name="refresh" size={20} color={COLORS.danger} />
          <ThemedText style={[styles.dangerButtonText, { color: COLORS.danger }]}>
            Reset All Settings
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.dangerButton, styles.deleteButton]}>
          <Ionicons name="trash" size={20} color="#FFFFFF" />
          <ThemedText style={[styles.dangerButtonText, { color: "#FFFFFF" }]}>
            Delete Account
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* VERSION */}
      <View style={styles.versionSection}>
        <ThemedText style={styles.versionText}>Pharmacy App v1.2.3</ThemedText>
        <ThemedText style={styles.copyrightText}>© 2024 Pharmacy Management System</ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 32, color: "#FFFFFF", fontWeight: "800", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.9)" },
  saveButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  saveButtonText: { fontSize: 14, color: "#FFFFFF", fontWeight: "600" },
  settingsSection: { paddingHorizontal: 24, marginTop: 30 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text },
  settingItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  settingIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.soft, alignItems: "center", justifyContent: "center", marginRight: 16 },
  settingDetails: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  settingDescription: { fontSize: 13, color: COLORS.muted },
  actionItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  actionInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  actionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 16 },
  actionDetails: { flex: 1 },
  actionLabel: { fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  actionDescription: { fontSize: 13, color: COLORS.muted },
  dangerSection: { paddingHorizontal: 24, marginTop: 30, marginBottom: 40 },
  dangerButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderRadius: 12, gap: 12, backgroundColor: "#FEF2F2", marginBottom: 12 },
  deleteButton: { backgroundColor: COLORS.danger },
  dangerButtonText: { fontSize: 16, fontWeight: "600", flex: 1 },
  versionSection: { alignItems: "center", paddingVertical: 30 },
  versionText: { fontSize: 14, color: COLORS.muted, fontWeight: "600", marginBottom: 4 },
  copyrightText: { fontSize: 12, color: COLORS.muted },
});