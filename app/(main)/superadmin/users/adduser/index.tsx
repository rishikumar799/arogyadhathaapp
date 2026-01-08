import { ThemedText } from "@/components/themed-text";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

/* =====================================================
   ROLE DEFINITIONS (LOWERCASE — SOURCE OF TRUTH)
===================================================== */

const ROLE_VALUES = [
  "doctor",
  "patient",
  "diagnostics",
  "pharmacy",
  "receptionist",
  "hospital",
] as const;

const ROLE_LABELS: Record<(typeof ROLE_VALUES)[number], string> = {
  doctor: "Doctor",
  patient: "Patient",
  diagnostics: "Diagnostics",
  pharmacy: "Pharmacy",
  receptionist: "Receptionist",
  hospital: "Hospital",
};

const ROLE_COLLECTION_MAP: Record<string, string> = {
  doctor: "doctors",
  patient: "patients",
  diagnostics: "diagnostics",
  pharmacy: "pharmacies",
  receptionist: "receptionists",
  hospital: "hospitals",
};

/* =====================================================
   SCREEN
===================================================== */

export default function AddUserScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] =
    useState<(typeof ROLE_VALUES)[number] | "">("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanRole = role?.toLowerCase().trim();

    if (!cleanName) return Alert.alert("Name is required");
    if (!/^\d{10}$/.test(cleanPhone))
      return Alert.alert("Phone must be 10 digits");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return Alert.alert("Invalid email");
    if (!password) return Alert.alert("Password required");
    if (!cleanRole) return Alert.alert("Select a role");

    const roleCollection = ROLE_COLLECTION_MAP[cleanRole];
    if (!roleCollection)
      return Alert.alert("Invalid role mapping");

    setLoading(true);

    try {
      /* ========== AUTH ========== */
      const cred = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const uid = cred.user.uid;
      const createdAt = serverTimestamp();

      /* ========== SHARED PAYLOAD ========== */
      const basePayload = {
        uid,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: cleanRole,
        status: "approved",
        createdAt,
        createdBy: "admin",
      };

      /* ========== WRITE BOTH (GUARANTEED) ========== */
      await Promise.all([
        setDoc(doc(db, "users", uid), basePayload),
        setDoc(doc(db, roleCollection, uid), basePayload),
      ]);

      /* ========== HOSPITAL CONFIG ========== */
      if (cleanRole === "hospital") {
        await setDoc(doc(db, "hospitalConfigs", uid), {
          registrationApprovals: true,
          staffManagement: false,
          rolePermissions: false,
          moduleDoctors: true,
          modulePatients: true,
          moduleDiagnostics: true,
          modulePharmacy: false,
          branding: false,
          reports: false,
          createdAt,
        });
      }

      Alert.alert("Success", "User created successfully");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "User creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.heading}>Add User</ThemedText>

      <View style={styles.card}>
        <Input placeholder="Full Name" value={name} onChange={setName} />
        <Input placeholder="Email" value={email} onChange={setEmail} />
        <Input
          placeholder="Phone"
          value={phone}
          onChange={setPhone}
          keyboardType="phone-pad"
        />
        <Input
          placeholder="Password"
          value={password}
          onChange={setPassword}
          secure
        />

        <View style={styles.roleWrap}>
          {ROLE_VALUES.map(r => (
            <Pressable
              key={r}
              onPress={() => setRole(r)}
              style={[
                styles.roleBtn,
                role === r && styles.roleBtnActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.roleText,
                  role === r && styles.roleTextActive,
                ]}
              >
                {ROLE_LABELS[r]}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleCreate}
          disabled={loading}
          style={[styles.submit, loading && { opacity: 0.7 }]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText style={styles.submitText}>
              Create User
            </ThemedText>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* =====================================================
   INPUT
===================================================== */

function Input({
  placeholder,
  value,
  onChange,
  keyboardType,
  secure,
}: any) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      keyboardType={keyboardType}
      secureTextEntry={secure}
      onChangeText={onChange}
      style={styles.input}
      placeholderTextColor="#94A3B8"
    />
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  page: { padding: 24 },
  heading: { fontSize: 26, fontWeight: "800", marginBottom: 20 },
  card: { backgroundColor: "#FFF", padding: 20, borderRadius: 18, gap: 14 },
  input: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    fontSize: 15,
  },
  roleWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  roleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
  },
  roleBtnActive: { backgroundColor: "#DCFCE7" },
  roleText: { fontSize: 13, fontWeight: "600" },
  roleTextActive: { color: "#15803D" },
  submit: {
    marginTop: 14,
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
});
