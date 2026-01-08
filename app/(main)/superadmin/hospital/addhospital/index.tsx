import { ThemedText } from "@/components/themed-text";
import { auth, db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= DEFAULT CONFIG ================= */

const DEFAULT_CONFIG = {
  registrationApprovals: true,
  staffManagement: false,
  rolePermissions: false,
  moduleDoctors: true,
  modulePatients: true,
  moduleDiagnostics: true,
  modulePharmacy: false,
  branding: false,
  reports: false,
};

export default function AddHospitalScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const createHospital = async () => {
    if (!name || !email || !phone || !password) {
      alert("All fields required");
      return;
    }

    setLoading(true);

    try {
      /* 1️⃣ CREATE AUTH USER */
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = cred.user.uid;

      /* 2️⃣ USERS COLLECTION (LOGIN + ROLE) */
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        phone,
        role: "hospital",
        status: "approved",
        createdAt: serverTimestamp(),
      });

      /* 3️⃣ HOSPITALS COLLECTION (PROFILE) */
      await setDoc(doc(db, "hospitals", uid), {
        name,
        email,
        phone,
        status: "approved",
        createdAt: serverTimestamp(),
      });

      /* 4️⃣ HOSPITAL CONFIG (PERMISSIONS) */
      await setDoc(doc(db, "hospitalConfigs", uid), {
        ...DEFAULT_CONFIG,
        createdAt: serverTimestamp(),
      });

      /* 5️⃣ ACTIVITY LOG */
      await setDoc(doc(db, "activityLogs", crypto.randomUUID()), {
        message: `Hospital created: ${name} (${email})`,
        createdAt: serverTimestamp(),
      });

      alert("Hospital created successfully 💚");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err: any) {
      alert(err.message || "Failed to create hospital");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ThemedText style={styles.title}>Add Hospital</ThemedText>

      <View style={styles.card}>
        <Input label="Hospital Name" value={name} onChange={setName} />
        <Input label="Email" value={email} onChange={setEmail} />
        <Input label="Phone" value={phone} onChange={setPhone} />
        <Input
          label="Password"
          value={password}
          onChange={setPassword}
          secure
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={createHospital}
          disabled={loading}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <ThemedText style={styles.btnText}>
            {loading ? "Creating..." : "Create Hospital"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Input({ label, value, onChange, secure }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        style={styles.input}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: { padding: 24 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 18 },
  label: { fontSize: 13, marginBottom: 6 },
  input: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    padding: 14,
    borderRadius: 14,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
