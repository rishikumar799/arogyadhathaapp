import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= CONFIG ================= */

// Patients do NOT have approval / pending
const EDITABLE_FIELDS_BY_ROLE: Record<string, string[]> = {
  patient: ["firstName", "lastName", "name", "phone"],
};

/* ================= PAGE ================= */

export default function EditPatientPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // ✅ loader state

  /* ================= LOAD USER ================= */

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const snap = await getDoc(doc(db, "users", id));

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const data = snap.data();
      const role = (data.role || "").toLowerCase();

      setUserData({ ...data, role });

      const editableFields = EDITABLE_FIELDS_BY_ROLE[role] || [];
      const initialForm: Record<string, string> = {};

      editableFields.forEach(field => {
        initialForm[field] = data[field] ?? "";
      });

      setForm(initialForm);
      setLoading(false);
    };

    load();
  }, [id]);

  /* ================= UPDATE FIELD ================= */

  const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  /* ================= SAVE ================= */

 const save = async () => {
  if (!id || !userData || saving) return;

  try {
    setSaving(true);

    const payload = {
      ...form,
      role: "patient",
      uid: id,
    };

    await Promise.all([
      updateDoc(doc(db, "users", id), payload),
      updateDoc(doc(db, "patients", id), payload),
    ]);

    router.back();
  } finally {
    setSaving(false);
  }
};

  /* ================= UI ================= */

  if (loading) {
    return (
      <View style={styles.center}>
        <ThemedText>Loading patient…</ThemedText>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <ThemedText>Patient not found</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.wrapper}>
      {/* BACK */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={18} />
      </TouchableOpacity>

      <ThemedText style={styles.title}>Edit Patient</ThemedText>

      {/* READ ONLY */}
      <ReadOnly label="Email" value={userData.email} />
      <ReadOnly label="Role" value="patient" />
      <ReadOnly label="UID" value={id} />

      {/* EDITABLE */}
      {Object.keys(form).map(key => (
        <View key={key}>
          <ThemedText style={styles.label}>
            {formatLabel(key)}
          </ThemedText>
          <TextInput
            value={form[key]}
            onChangeText={v => updateField(key, v)}
            style={styles.input}
          />
        </View>
      ))}

      {/* SAVE BUTTON WITH LOADER */}
      <TouchableOpacity
        style={[
          styles.saveBtn,
          saving && styles.saveBtnDisabled,
        ]}
        onPress={save}
        disabled={saving}
      >
        {saving && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ marginRight: 8 }}
          />
        )}
        <ThemedText style={styles.saveText}>
          {saving ? "Saving..." : "Save Changes"}
        </ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= HELPERS ================= */

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, s => s.toUpperCase());
}

function ReadOnly({ label, value }: any) {
  return (
    <View>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.readOnly}>
        <ThemedText>{value || "-"}</ThemedText>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  readOnly: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  saveBtnDisabled: {
    backgroundColor: "#86EFAC", // lighter green
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
});
