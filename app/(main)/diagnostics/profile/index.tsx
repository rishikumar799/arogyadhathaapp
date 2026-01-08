import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { loadSession } from "@/lib/authPersist";
import { auth, db } from "@/lib/firebaseConfig";
import { loadWebSession } from "@/lib/webPersist";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  signOut,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";

/* ================= COLORS ================= */
const COLORS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#10B981",
  muted: "#64748B",
  border: "#E2E8F0",
};

export default function EditProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [uid, setUid] = useState<string | null>(null);
  const [originalEmail, setOriginalEmail] = useState("");

  const [form, setForm] = useState({
    name: "",
    labName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalTitle, setModalTitle] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);

  const [reauthModal, setReauthModal] = useState(false);
  const [password, setPassword] = useState("");

  function openModal(title: string, msg: string) {
    setModalTitle(title);
    setModalMsg(msg);
  }

  function closeModal() {
    setModalTitle("");
    setModalMsg("");
    setNeedsEmailVerification(false);
  }

  /* ================= LOAD ================= */
  useEffect(() => {
    (async () => {
      const session =
        Platform.OS === "web"
          ? await loadWebSession()
          : await loadSession();

      if (!session?.uid) {
        setLoading(false);
        return;
      }

      setUid(session.uid);

      const snap = await getDoc(doc(db, "diagnostics", session.uid));
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          name: d?.name ?? "",
          labName: d?.labName ?? "",
          phone: d?.phone ?? "",
          email: d?.email ?? "",
          address: d?.address ?? "",
        });
        setOriginalEmail(d?.email ?? "");
      }

      setLoading(false);
    })();
  }, []);

  /* ================= VALIDATION ================= */
  function validate(): boolean {
    if (!form.name.trim()) {
      openModal("Missing Field", "Laboratory name is required.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      openModal("Invalid Email", "Enter a valid email address.");
      return false;
    }

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      openModal("Invalid Phone", "Phone must be exactly 10 digits.");
      return false;
    }

    return true;
  }

  /* ================= SAVE ================= */
  const onSavePress = async () => {
    if (!validate()) return;

    const emailChanged =
      form.email.trim().toLowerCase() !==
      originalEmail.trim().toLowerCase();

    if (!emailChanged) {
      await saveProfileWithoutEmail();
      openModal("Success", "Profile updated successfully.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      openModal("Session Expired", "Please log in again.");
      return;
    }

    if (!user.emailVerified) {
      setNeedsEmailVerification(true);
      openModal(
        "Verify Email First",
        "Please verify your current email to continue."
      );
      return;
    }

    setReauthModal(true);
  };

  /* ================= SAVE PROFILE (NO EMAIL) ================= */
  async function saveProfileWithoutEmail() {
    if (!uid) return;

    const payload = {
      name: form.name.trim(),
      labName: form.labName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      updatedAt: serverTimestamp(),
    };

    const batch = writeBatch(db);
    batch.set(doc(db, "users", uid), payload, { merge: true });
    batch.set(doc(db, "diagnostics", uid), payload, { merge: true });
    await batch.commit();
  }

  /* ================= PASSWORD CONFIRM ================= */
  async function handleReauthAndUpdate() {
    if (!auth.currentUser) return;

    try {
      setSaving(true);

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        password
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      // 🔐 Send verification to NEW email
      await verifyBeforeUpdateEmail(
        auth.currentUser,
        form.email.trim()
      );

      openModal(
        "Verify New Email",
        "A verification link has been sent to your new email. Please verify it to complete the email change."
      );

      // ❌ DO NOT update Firestore email here

      setTimeout(async () => {
        await signOut(auth);
        router.replace("/onboarding");
      }, 1200);
    } catch (e: any) {
      openModal(
        "Authentication Failed",
        e.code === "auth/wrong-password"
          ? "Incorrect password."
          : e.message
      );
    } finally {
      setSaving(false);
      setReauthModal(false);
      setPassword("");
    }
  }

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading profile…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 160 }}>
          <Field label="Laboratory Name *" value={form.name}
            onChange={(v: string) => setForm(p => ({ ...p, name: v }))} />

          <Field label="Department" value={form.labName}
            onChange={(v: string) => setForm(p => ({ ...p, labName: v }))} />

          <Field label="Phone" keyboardType="phone-pad" value={form.phone}
            onChange={(v: string) =>
              setForm(p => ({ ...p, phone: v.replace(/[^0-9]/g, "") }))
            } />

          <Field label="Email" autoCapitalize="none" value={form.email}
            onChange={(v: string) => setForm(p => ({ ...p, email: v }))} />

          <Field label="Address" value={form.address}
            onChange={(v: string) => setForm(p => ({ ...p, address: v }))} />
        </ScrollView>

        <View style={[styles.saveWrap, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={onSavePress}
            disabled={saving}
          >
            {saving && <ActivityIndicator color="#fff" />}
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* INFO MODAL */}
      {modalMsg !== "" && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <Text style={styles.modalMsg}>{modalMsg}</Text>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={async () => {
                  if (needsEmailVerification && auth.currentUser) {
                    await sendEmailVerification(auth.currentUser);
                    openModal(
                      "Verification Sent",
                      "We sent a verification email. After verifying, come back and press Save again."
                    );
                    return;
                  }
                  closeModal();
                }}
              >
                <Text style={styles.modalBtnText}>
                  {needsEmailVerification ? "Send Verification Email" : "OK"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* PASSWORD MODAL */}
      <Modal transparent visible={reauthModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Password</Text>
            <Text style={styles.modalMsg}>
              Enter your password to continue.
            </Text>

            <TextInput
              secureTextEntry
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            <TouchableOpacity
              style={[styles.modalBtn, { marginTop: 12 }]}
              onPress={handleReauthAndUpdate}
            >
              <Text style={styles.modalBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= FIELD ================= */
function Field({ label, value, onChange, ...props }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholderTextColor={COLORS.muted}
        {...props}
      />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  field: { marginBottom: 16 },
  label: { fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
  },

  saveWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 20,
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
  },

  saveText: { color: "#fff", fontWeight: "800" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  modalMsg: {
    textAlign: "center",
    color: "#374151",
    marginBottom: 20,
  },

  modalBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  modalBtnText: { color: "#fff", fontWeight: "800" },
});
