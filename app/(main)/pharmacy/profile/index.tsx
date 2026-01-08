import { ThemedText } from "@/components/themed-text";
import { auth, db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
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

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    pharmacyName: "",
    licenseNumber: "",
    address: "",
    experience: "",
    specialization: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), userData);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleChangePassword = () => {
    Alert.alert("Change Password", "Password change link will be sent to your email", [
      { text: "Cancel", style: "cancel" },
      { text: "Send Link", onPress: () => Alert.alert("Sent", "Password reset link sent to your email") }
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => auth.signOut() }
    ]);
  };

  const renderField = (label, value, fieldName, multiline = false) => (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      {isEditing ? (
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={userData[fieldName]}
          onChangeText={(text) => setUserData(prev => ({ ...prev, [fieldName]: text }))}
          multiline={multiline}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor={COLORS.muted}
        />
      ) : (
        <ThemedText style={styles.fieldValue}>{value || "Not set"}</ThemedText>
      )}
    </View>
  );

  const STATS = [
    { label: "Prescriptions Today", value: "156", icon: "document-text", color: COLORS.primary },
    { label: "Patients Served", value: "2,540", icon: "people", color: COLORS.secondary },
    { label: "Accuracy Rate", value: "99.8%", icon: "checkmark-circle", color: COLORS.success },
  ];

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {userData.name ? userData.name.split(' ').map(n => n[0]).join('') : "P"}
                </ThemedText>
              </View>
              <TouchableOpacity style={styles.editPhotoButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.name}>{userData.name || "Pharmacist"}</ThemedText>
              <ThemedText style={styles.role}>Licensed Pharmacist</ThemedText>
              <ThemedText style={styles.email}>{userData.email}</ThemedText>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color="#FFFFFF" />
            <ThemedText style={styles.editButtonText}>{isEditing ? "Save" : "Edit"}</ThemedText>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* STATS */}
      <View style={styles.statsContainer}>
        {STATS.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <View>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* PROFILE DETAILS */}
      <View style={styles.detailsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          <Ionicons name="person-circle" size={24} color={COLORS.primary} />
        </View>

        {renderField("Full Name", userData.name, "name")}
        {renderField("Email", userData.email, "email")}
        {renderField("Phone Number", userData.phone, "phone")}
        {renderField("Address", userData.address, "address", true)}

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Professional Information</ThemedText>
          <Ionicons name="medkit" size={24} color={COLORS.primary} />
        </View>

        {renderField("Pharmacy Name", userData.pharmacyName, "pharmacyName")}
        {renderField("License Number", userData.licenseNumber, "licenseNumber")}
        {renderField("Years of Experience", userData.experience, "experience")}
        {renderField("Specialization", userData.specialization, "specialization")}
      </View>

      {/* ACTIONS */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
          <Ionicons name="key" size={20} color={COLORS.primary} />
          <ThemedText style={styles.actionButtonText}>Change Password</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications" size={20} color={COLORS.primary} />
          <ThemedText style={styles.actionButtonText}>Notification Settings</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
          <ThemedText style={styles.actionButtonText}>Privacy & Security</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={COLORS.danger} />
          <ThemedText style={[styles.actionButtonText, { color: COLORS.danger }]}>Logout</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  profileSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatarContainer: { position: "relative", marginRight: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 32, fontWeight: "800", color: "#FFFFFF" },
  editPhotoButton: { position: "absolute", bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#FFFFFF" },
  profileInfo: { flex: 1 },
  name: { fontSize: 24, color: "#FFFFFF", fontWeight: "800", marginBottom: 4 },
  role: { fontSize: 16, color: "rgba(255,255,255,0.9)", marginBottom: 4 },
  email: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  editButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 },
  editButtonText: { fontSize: 14, color: "#FFFFFF", fontWeight: "600" },
  statsContainer: { paddingHorizontal: 24, marginVertical: 20, flexDirection: "row", gap: 12 },
  statCard: { flex: 1, backgroundColor: COLORS.bg, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  statValue: { fontSize: 18, fontWeight: "800", color: COLORS.text, marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.muted, fontWeight: "600" },
  detailsSection: { paddingHorizontal: 24, marginBottom: 30 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  fieldContainer: { marginBottom: 20 },
  fieldLabel: { fontSize: 14, color: COLORS.muted, fontWeight: "600", marginBottom: 6 },
  fieldValue: { fontSize: 16, color: COLORS.text, fontWeight: "500", paddingVertical: 10, paddingHorizontal: 12, backgroundColor: COLORS.soft, borderRadius: 8 },
  input: { fontSize: 16, color: COLORS.text, fontWeight: "500", paddingVertical: 10, paddingHorizontal: 12, backgroundColor: COLORS.soft, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  multilineInput: { minHeight: 80, textAlignVertical: "top" },
  actionsSection: { paddingHorizontal: 24, marginBottom: 40, gap: 12 },
  actionButton: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.soft, paddingHorizontal: 20, paddingVertical: 16, borderRadius: 12, gap: 12 },
  logoutButton: { backgroundColor: "#FEF2F2" },
  actionButtonText: { fontSize: 16, color: COLORS.primary, fontWeight: "600", flex: 1 },
});