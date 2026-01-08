import { ThemedText } from "@/components/themed-text";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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

const EDITABLE_FIELDS_BY_ROLE: Record<string, string[]> = {
  diagnostics: ["firstName", "lastName", "name", "phone", "status"],
};

const STATUS_OPTIONS = ["pending", "approved"];

/* ================= PAGE ================= */

export default function EditDiagnosticsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD USER ================= */

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      let snap = await getDoc(doc(db, "users", id));
      let source: "users" | "requests" = "users";

      if (!snap.exists()) {
        snap = await getDoc(doc(db, "requests", id));
        source = "requests";
      }

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const data = snap.data();
      const role = String(data.role || "").toLowerCase().trim();

      setUserData({ ...data, role, __source: source });

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

    const newStatus = form.status;
    const oldStatus = userData.status;

    const payload = {
      ...userData,
      ...form,
      uid: id,
      role: "diagnostics",
    };

    delete payload.__source;

    /* ================= STATUS CHANGED ================= */

    if (newStatus !== oldStatus) {
      // ⏸️ MOVE TO PENDING
      if (newStatus === "pending") {
        await Promise.all([
          setDoc(doc(db, "requests", id), payload),
          deleteDoc(doc(db, "users", id)),
          deleteDoc(doc(db, "diagnostics", id)),
        ]);
      }

      // ✅ APPROVE USER
      if (newStatus === "approved") {
        await Promise.all([
          setDoc(doc(db, "users", id), payload),
          setDoc(doc(db, "diagnostics", id), payload),
          deleteDoc(doc(db, "requests", id)),
        ]);
      }
    }

    /* ================= STATUS UNCHANGED ================= */

    else {
      await Promise.all([
        updateDoc(doc(db, "users", id), form),
        updateDoc(doc(db, "diagnostics", id), form),
      ]);
    }

    router.back();
  } finally {
    setSaving(false);
  }
};


  /* ================= UI ================= */

  if (loading) {
    return (
      <View style={styles.center}>
        <ThemedText>Loading diagnostics…</ThemedText>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <ThemedText>User not found</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.wrapper}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={18} />
      </TouchableOpacity>

      <ThemedText style={styles.title}>Edit Diagnostics</ThemedText>

      <ReadOnly label="Email" value={userData.email} />
      <ReadOnly label="Role" value="diagnostics" />
      <ReadOnly label="UID" value={id} />

      {Object.keys(form).map(key => (
        <View key={key}>
          <ThemedText style={styles.label}>
            {formatLabel(key)}
          </ThemedText>

          {key === "status" ? (
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => updateField("status", s)}
                  style={[
                    styles.statusBtn,
                    form.status === s && styles.statusActive,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.statusText,
                      form.status === s && styles.statusTextActive,
                    ]}
                  >
                    {s}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TextInput
              value={form[key]}
              onChangeText={v => updateField(key, v)}
              style={styles.input}
            />
          )}
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
            style={{ marginRight: 10 }}
          />
        )}
        <ThemedText style={styles.saveText}>
          {saving ? "Saving…" : "Save Changes"}
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
  wrapper: { flex: 1, padding: 24, backgroundColor: "#F8FAFC" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
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
  statusRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statusBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  statusActive: { backgroundColor: "#16A34A" },
  statusText: { fontWeight: "600" },
  statusTextActive: { color: "#fff" },

  saveBtn: {
    flexDirection: "row",
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveBtnDisabled: {
    backgroundColor: "#86EFAC", // lighter green
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
