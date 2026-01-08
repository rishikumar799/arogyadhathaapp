import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#10B981",
  primaryLight: "#34D399",
  primaryDark: "#065F46",
  soft: "#ECFDF5",
  warning: "#F59E0B",
  info: "#3B82F6",
  success: "#10B981",
  danger: "#EF4444",
  muted: "#64748B",
  text: "#0F172A",
  border: "#E2E8F0",
};

export default function Settings() {
  const [notifications, setNotifications] = useState({
    appointmentReminders: true,
    patientCheckIns: true,
    billingAlerts: false,
    systemUpdates: true,
  });

  const [appSettings, setAppSettings] = useState({
    autoCheckIn: false,
    darkMode: false,
    language: "English",
    timeFormat: "12h",
  });

  const handleNotificationToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const handleSettingToggle = (key: string) => {
    setAppSettings({
      ...appSettings,
      [key]: !appSettings[key as keyof typeof appSettings],
    });
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: () => {
            setNotifications({
              appointmentReminders: true,
              patientCheckIns: true,
              billingAlerts: false,
              systemUpdates: true,
            });
            setAppSettings({
              autoCheckIn: false,
              darkMode: false,
              language: "English",
              timeFormat: "12h",
            });
            Alert.alert("Success", "Settings have been reset to default.");
          }
        },
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    icon, 
    iconColor, 
    showSwitch = false, 
    showArrow = false,
    switchValue,
    onToggle,
    onPress 
  }: any) => {
    return (
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={onPress}
        disabled={!onPress && !showSwitch}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: `${iconColor}15` }]}>
            <Ionicons name={icon} size={20} color={iconColor} />
          </View>
          
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingTitle}>{title}</ThemedText>
            {subtitle && (
              <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
            )}
          </View>
        </View>
        
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onToggle}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor="#FFFFFF"
          />
        ) : showArrow ? (
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Settings</ThemedText>
          <ThemedText style={styles.subtitle}>Customize your experience</ThemedText>
        </View>
      </View>

      {/* General Settings */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>General Settings</ThemedText>
        
        <View style={styles.settingsList}>
          <SettingItem
            title="Auto Check-In"
            subtitle="Automatically check in returning patients"
            icon="log-in"
            iconColor={COLORS.primary}
            showSwitch
            switchValue={appSettings.autoCheckIn}
            onToggle={() => handleSettingToggle("autoCheckIn")}
          />
          
          <SettingItem
            title="Dark Mode"
            subtitle="Use dark theme"
            icon="moon"
            iconColor={COLORS.info}
            showSwitch
            switchValue={appSettings.darkMode}
            onToggle={() => handleSettingToggle("darkMode")}
          />
          
          <SettingItem
            title="Language"
            subtitle={appSettings.language}
            icon="language"
            iconColor={COLORS.success}
            showArrow
            onPress={() => Alert.alert("Language", "Select language")}
          />
          
          <SettingItem
            title="Time Format"
            subtitle={appSettings.timeFormat === "12h" ? "12-hour format" : "24-hour format"}
            icon="time"
            iconColor={COLORS.warning}
            showArrow
            onPress={() => Alert.alert("Time Format", "Select time format")}
          />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
        
        <View style={styles.settingsList}>
          <SettingItem
            title="Appointment Reminders"
            subtitle="Get notified about upcoming appointments"
            icon="calendar"
            iconColor={COLORS.primary}
            showSwitch
            switchValue={notifications.appointmentReminders}
            onToggle={() => handleNotificationToggle("appointmentReminders")}
          />
          
          <SettingItem
            title="Patient Check-Ins"
            subtitle="Notifications for patient arrivals"
            icon="person"
            iconColor={COLORS.info}
            showSwitch
            switchValue={notifications.patientCheckIns}
            onToggle={() => handleNotificationToggle("patientCheckIns")}
          />
          
          <SettingItem
            title="Billing Alerts"
            subtitle="Notifications for payments and invoices"
            icon="cash"
            iconColor={COLORS.success}
            showSwitch
            switchValue={notifications.billingAlerts}
            onToggle={() => handleNotificationToggle("billingAlerts")}
          />
          
          <SettingItem
            title="System Updates"
            subtitle="Important system updates and maintenance"
            icon="warning"
            iconColor={COLORS.warning}
            showSwitch
            switchValue={notifications.systemUpdates}
            onToggle={() => handleNotificationToggle("systemUpdates")}
          />
        </View>
      </View>

      {/* Data & Privacy */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Data & Privacy</ThemedText>
        
        <View style={styles.settingsList}>
          <SettingItem
            title="Data Backup"
            subtitle="Last backup: Today, 2:30 AM"
            icon="cloud"
            iconColor={COLORS.info}
            showArrow
            onPress={() => Alert.alert("Backup", "Manage data backup settings")}
          />
          
          <SettingItem
            title="Privacy Settings"
            subtitle="Manage your privacy preferences"
            icon="shield-checkmark"
            iconColor={COLORS.success}
            showArrow
            onPress={() => Alert.alert("Privacy", "Privacy settings")}
          />
          
          <SettingItem
            title="Clear Cache"
            subtitle="Free up storage space"
            icon="trash"
            iconColor={COLORS.danger}
            onPress={() => Alert.alert("Clear Cache", "Cache cleared successfully!")}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        
        <View style={styles.settingsList}>
          <SettingItem
            title="App Version"
            subtitle="Version 2.4.1"
            icon="information-circle"
            iconColor={COLORS.muted}
          />
          
          <SettingItem
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            icon="document-text"
            iconColor={COLORS.muted}
            showArrow
            onPress={() => Alert.alert("Terms", "Terms of Service")}
          />
          
          <SettingItem
            title="Privacy Policy"
            subtitle="How we handle your data"
            icon="lock-closed"
            iconColor={COLORS.muted}
            showArrow
            onPress={() => Alert.alert("Privacy Policy", "Privacy Policy")}
          />
          
          <SettingItem
            title="Contact Support"
            subtitle="Get help from our support team"
            icon="headset"
            iconColor={COLORS.muted}
            showArrow
            onPress={() => Alert.alert("Support", "Contact support team")}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Ionicons name="refresh" size={20} color={COLORS.warning} />
          <ThemedText style={styles.resetText}>Reset to Default</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="save" size={20} color="#FFFFFF" />
          <ThemedText style={styles.saveText}>Save All Changes</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  
  section: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 16,
  },
  
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "500",
  },
  
  actions: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    gap: 12,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: `${COLORS.warning}10`,
    paddingVertical: 16,
    borderRadius: 12,
  },
  resetText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.warning,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});