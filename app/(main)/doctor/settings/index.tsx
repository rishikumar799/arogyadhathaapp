import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

const COLORS = {
  bg: "#FFFFFF", primary: "#10B981", text: "#0F172A", textLight: "#334155",
  muted: "#64748B", border: "#E2E8F0", soft: "#ECFDF5",
};

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  return (
    <ScrollView style={styles.container}  contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Settings</ThemedText>
        <ThemedText style={styles.subtitle}>Customize your experience</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="person-circle" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Profile Information</ThemedText>
            <ThemedText style={styles.settingDescription}>Update your personal details</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Password & Security</ThemedText>
            <ThemedText style={styles.settingDescription}>Change password and security settings</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="card" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Billing & Subscription</ThemedText>
            <ThemedText style={styles.settingDescription}>Manage your subscription plan</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="notifications" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Push Notifications</ThemedText>
            <ThemedText style={styles.settingDescription}>Receive app notifications</ThemedText>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="moon" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Dark Mode</ThemedText>
            <ThemedText style={styles.settingDescription}>Switch to dark theme</ThemedText>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="save" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Auto-save Documents</ThemedText>
            <ThemedText style={styles.settingDescription}>Automatically save your work</ThemedText>
          </View>
          <Switch
            value={autoSave}
            onValueChange={setAutoSave}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="mail" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Email Updates</ThemedText>
            <ThemedText style={styles.settingDescription}>Receive email notifications</ThemedText>
          </View>
          <Switch
            value={emailUpdates}
            onValueChange={setEmailUpdates}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>App Settings</ThemedText>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="language" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Language</ThemedText>
            <ThemedText style={styles.settingDescription}>English (US)</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="time" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Time Zone</ThemedText>
            <ThemedText style={styles.settingDescription}>Eastern Time (ET)</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="calendar" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Calendar Settings</ThemedText>
            <ThemedText style={styles.settingDescription}>Manage calendar integrations</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Support</ThemedText>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="help-circle" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Help Center</ThemedText>
            <ThemedText style={styles.settingDescription}>Get help and support</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="document-text" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Terms & Privacy</ThemedText>
            <ThemedText style={styles.settingDescription}>View terms and privacy policy</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>About App</ThemedText>
            <ThemedText style={styles.settingDescription}>Version 1.0.0 • MedCare Pro</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.dangerSection}>
        <TouchableOpacity style={styles.dangerButton}>
          <Ionicons name="trash" size={20} color="#DC2626" />
          <ThemedText style={styles.dangerButtonText}>Delete Account</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out" size={20} color="#FFFFFF" />
          <ThemedText style={styles.logoutButtonText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.muted },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { 
    fontSize: 18, fontWeight: "700", color: COLORS.text,
    marginBottom: 16 
  },
  settingItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.soft, padding: 16,
    borderRadius: 12, marginBottom: 12
  },
  settingIcon: { marginRight: 16 },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 2 },
  settingDescription: { fontSize: 14, color: COLORS.muted },
  dangerSection: { paddingHorizontal: 24, paddingBottom: 32 },
  dangerButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#FEE2E2", padding: 16,
    borderRadius: 12, marginBottom: 12, gap: 8
  },
  dangerButtonText: { color: "#DC2626", fontWeight: "600", fontSize: 16 },
  logoutButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.primary, padding: 16,
    borderRadius: 12, gap: 8
  },
  logoutButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
});