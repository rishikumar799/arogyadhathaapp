import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= COLORS ================= */

const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",

  primary: "#10B981",
  primaryLight: "#34D399",
  primaryDark: "#065F46",

  soft: "#ECFDF5",
  warning: "#F59E0B",
  success: "#10B981",
  danger: "#EF4444",

  muted: "#64748B",
  text: "#0F172A",
  border: "#E2E8F0",
};

const { width } = Dimensions.get("window");
const IS_SMALL = width < 380;

/* ================= MAIN ================= */

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    role: "Senior Receptionist",
    email: "sarah.j@arogyadatha.com",
    phone: "+91 9876543210",
    employeeId: "EMP-2024-001",
    department: "Reception",
    joinDate: "2023-01-15",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (key: string, value: string) => {
    setEditedProfile({ ...editedProfile, [key]: value });
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>My Profile</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage your account information
          </ThemedText>
        </View>

        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={18} color="#FFF" />
            {!IS_SMALL && (
              <ThemedText style={styles.editText}>Edit</ThemedText>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <ThemedText style={styles.saveText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ===== PROFILE CARD ===== */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {profile.name.split(" ").map(n => n[0]).join("")}
            </ThemedText>
          </View>

          <View style={{ flex: 1 }}>
            <ThemedText style={styles.name}>{profile.name}</ThemedText>
            <ThemedText style={styles.role}>{profile.role}</ThemedText>
            <View style={styles.idBadge}>
              <ThemedText style={styles.idText}>
                {profile.employeeId}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Appointments" value="156" />
          <Divider />
          <Stat label="Days Worked" value="42" />
          <Divider />
          <Stat label="Efficiency" value="98%" />
        </View>
      </View>

      {/* ===== PERSONAL INFO ===== */}
      <Section title="Personal Information">
        <Field
          label="Full Name"
          value={isEditing ? editedProfile.name : profile.name}
          editable={isEditing}
          onChange={v => handleChange("name", v)}
        />
        <Field
          label="Email"
          value={isEditing ? editedProfile.email : profile.email}
          editable={isEditing}
          keyboardType="email-address"
          onChange={v => handleChange("email", v)}
        />
        <Field
          label="Phone"
          value={isEditing ? editedProfile.phone : profile.phone}
          editable={isEditing}
          keyboardType="phone-pad"
          onChange={v => handleChange("phone", v)}
        />
        <Field label="Employee ID" value={profile.employeeId} />
        <Field
          label="Department"
          value={isEditing ? editedProfile.department : profile.department}
          editable={isEditing}
          onChange={v => handleChange("department", v)}
        />
        <Field label="Join Date" value={profile.joinDate} />
      </Section>

      {/* ===== ACTIONS ===== */}
      <Section title="Account Actions">
        <Action icon="key-outline" label="Change Password" />
        <Action icon="notifications-outline" label="Notification Settings" />
        <Action icon="shield-checkmark-outline" label="Privacy & Security" />
        <Action icon="help-circle-outline" label="Help & Support" />
      </Section>

      {/* ===== SIGN OUT ===== */}
      <TouchableOpacity style={styles.signOut}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    {children}
  </View>
);

const Field = ({ label, value, editable, onChange, keyboardType }: any) => (
  <View style={styles.field}>
    <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
    {editable ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        keyboardType={keyboardType}
      />
    ) : (
      <ThemedText style={styles.fieldValue}>{value}</ThemedText>
    )}
  </View>
);

const Action = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.actionRow}>
    <Ionicons name={icon} size={20} color={COLORS.primary} />
    <ThemedText style={styles.actionText}>{label}</ThemedText>
    <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
  </TouchableOpacity>
);

const Stat = ({ label, value }: any) => (
  <View style={styles.stat}>
    <ThemedText style={styles.statValue}>{value}</ThemedText>
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
  </View>
);

const Divider = () => <View style={styles.divider} />;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 160 },

  header: {
    paddingTop: 48,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primaryDark,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  title: { fontSize: 28, fontWeight: "800", color: "#FFF" },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.85)" },

  editButton: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editText: { color: "#FFF", fontWeight: "600" },

  editActions: { flexDirection: "row", gap: 8 },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(239,68,68,0.15)",
  },
  cancelText: { color: COLORS.danger, fontWeight: "600" },
  saveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  saveText: { color: "#FFF", fontWeight: "600" },

  profileCard: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  avatarRow: { flexDirection: "row", marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: { color: "#FFF", fontSize: 28, fontWeight: "800" },

  name: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  role: { fontSize: 14, color: COLORS.muted, marginBottom: 6 },

  idBadge: {
    backgroundColor: COLORS.soft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  idText: { fontSize: 12, color: COLORS.primary, fontWeight: "700" },

  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  stat: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 20, fontWeight: "800", color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.muted },
  divider: { width: 1, backgroundColor: COLORS.border },

  section: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 16 },

  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, color: COLORS.muted, marginBottom: 6 },
  fieldValue: { fontSize: 16, fontWeight: "600", color: COLORS.text },

  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  signOut: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: `${COLORS.danger}10`,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  signOutText: { color: COLORS.danger, fontSize: 16, fontWeight: "700" },
});
