"use client";
import { saveSession } from "@/lib/authPersist";
import { signUpUser } from "@/lib/userService";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";

const roles = [
  "Receptionist",
  "Diagnostics",
  "Doctor",
  "Patient",
  "Hospital",
  "Pharmacy",
];

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  /* MODAL ANIM */
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  /* PAGE ANIMATION — FROM BOTTOM TO TOP */
  const pageFade = useRef(new Animated.Value(0)).current;
  const pageSlide = useRef(new Animated.Value(180)).current; // deeper bottom

  /* LOGO */
  const logoScale = useRef(new Animated.Value(0.7)).current;

  /* GLOW ANIMATIONS FOR INPUTS */
  const glowName = useRef(new Animated.Value(0)).current;
  const glowPhone = useRef(new Animated.Value(0)).current;
  const glowEmail = useRef(new Animated.Value(0)).current;
  const glowPass = useRef(new Animated.Value(0)).current;
  const glowConfirm = useRef(new Animated.Value(0)).current;
  const glowRole = useRef(new Animated.Value(0)).current;

 function glow(anim: Animated.Value, on: boolean) {
  Animated.timing(anim, {
    toValue: on ? 1 : 0,
    duration: 200,
    useNativeDriver: false,
  }).start();
}


  /* TYPE FIX: STYLES FOR GLOW */
function glowStyle(anim: Animated.Value) {
  return {
    borderColor: anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#dae9f5", "#13C84A"],
    }) as unknown as string,

    shadowColor: "#13C84A",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,

    shadowOpacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.25],
    }) as unknown as number,
  };
}


  /* PAGE ENTRY */
  useEffect(() => {
    pageFade.setValue(0);
    pageSlide.setValue(180);
    logoScale.setValue(0.7);

    Animated.parallel([
      Animated.timing(pageFade, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
      Animated.timing(pageSlide, {
        toValue: 0,
        duration: 1400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* BACK HANDLER */
  useEffect(() => {
    const onBack = () => {
      if (roleModalOpen) {
        closeRoleModal();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [roleModalOpen]);

  /* OPEN MODAL */
  const openRoleModal = () => {
    setRoleModalOpen(true);
    Animated.parallel([
      Animated.timing(overlayAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start();
  };

  /* CLOSE */
  const closeRoleModal = (selected?: string) => {
    Animated.parallel([
      Animated.timing(overlayAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 40, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      if (selected) setRole(selected);
      setRoleModalOpen(false);
    });
  };

  /* SIGN UP */
 async function handleSignup() {
  const cleanFirst = firstName.trim();
const cleanLast = lastName.trim();
const fullName = `${cleanFirst} ${cleanLast}`.trim();

  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();
  const cleanPass = password.trim();
  const cleanConfirm = confirm.trim();

  // ---------------------------------------------------
  // 1. NAME VALIDATION (same as web validateName)
  // ---------------------------------------------------


if (!cleanFirst) {
  return alert("First name is required.");
}

const nameRegex = /^[a-zA-Z\s.'-]{2,}$/;

if (!nameRegex.test(cleanFirst)) {
  return alert("First name contains invalid characters.");
}

if (cleanLast && !nameRegex.test(cleanLast)) {
  return alert("Last name contains invalid characters.");
}

  // ---------------------------------------------------
  // 2. PHONE VALIDATION (same as web validatePhone)
  // ---------------------------------------------------
  if (!cleanPhone) {
    return alert("Phone number is required.");
  }

  if (!/^\d+$/.test(cleanPhone)) {
    return alert("Please enter a valid phone number.");
  }

  if (cleanPhone.length !== 10) {
    return alert("Phone number must contain exactly 10 digits.");
  }

  // ---------------------------------------------------
  // 3. EMAIL VALIDATION (same as web validateEmail)
  // ---------------------------------------------------
  if (!cleanEmail) {
    return alert("Email is required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return alert("Please enter a valid email address.");
  }

  // ---------------------------------------------------
  // 4. PASSWORD VALIDATION (same as web validatePassword)
  // ---------------------------------------------------
  if (!cleanPass) {
    return alert("Password is required.");
  }

  if (cleanPass.length < 6) {
    return alert("Password must be at least 6 characters long.");
  }

  if (cleanPass !== cleanConfirm) {
    return alert("Passwords do not match.");
  }

  // ---------------------------------------------------
  // 5. ROLE VALIDATION
  // ---------------------------------------------------
  if (!role) {
    return alert("Please select a role.");
  }

  // ---------------------------------------------------
  // 6. CALL BACKEND
  // ---------------------------------------------------
  setLoading(true);

  try {
    const res = await signUpUser({
  name: fullName,           // backward compatibility
  firstName: cleanFirst,   // source of truth
  lastName: cleanLast,     // source of truth
  phone: cleanPhone,
  email: cleanEmail,
  password: cleanPass,
  role,
});


    setLoading(false);

    // SAFETY
    if (!res || typeof res !== "object") {
      return alert("Signup failed. Try again.");
    }

    // ERROR HANDLING (same as web)
    if (!res.success) {
      const msg = String(res.message || "").toLowerCase();

      if (
        msg.includes("email") &&
        (msg.includes("already") ||
          msg.includes("exists") ||
          msg.includes("in use"))
      ) {
        return alert("Email already in use.");
      }

      if (msg.includes("weak")) {
        return alert("Password is too weak.");
      }

      return alert("Signup failed: " + res.message);
    }

    // ---------------------------------------------------
    // 7. SUCCESS HANDLING
    // ---------------------------------------------------

    // Patient -> auto-approved
   if (res.status === "approved" && role === "Patient") {
  // SAVE SESSION FOR AUTO LOGIN
 await saveSession({
  role: "patient",
  status: "approved",
  uid: res.uid,
  email: cleanEmail,
  name: `${cleanFirst} ${cleanLast}`.trim(),
});


  router.replace("/(main)/patient");
  return;
}


    // Non-patient -> pending modal
    if (res.status === "pending") {
      setSuccessModal(true);
      return;
    }

    // fallback
    alert("Signup complete.");
  } catch (err) {
    setLoading(false);
    alert("Something went wrong. Try again.");
  }
}


  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#ECF2FF", "#E7F9FF", "#E4FFF3"]}
        style={styles.gradient}
      />

      <Animated.View
        style={{
          flex: 1,
          opacity: pageFade,
          transform: [{ translateY: pageSlide }],
        }}
      >
        <ScrollView contentContainerStyle={styles.centered}>
          
          {/* LOGO */}
          <Animated.View style={[styles.logoRow, { transform: [{ scale: logoScale }] }]}>
            <Image
              source={{ uri: "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/newlogo" }}
              style={styles.logo}
            />
            <Text style={styles.logoText}>Arogyadatha</Text>
          </Animated.View>

          {/* FORM */}
          <View style={{ width: "100%" }}>
            
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Sign up to manage your health records.</Text>

            {/* FULL NAME */}
            <Animated.View style={[styles.glowBox, glowStyle(glowName), { flex: 1 }]}>
    <TextInput
      placeholder="First Name"
      value={firstName}
      onChangeText={setFirstName}
    />
  </Animated.View>

  <Animated.View style={[styles.glowBox, glowStyle(glowName), { flex: 1 }]}>
    <TextInput
      placeholder="Last Name"
      value={lastName}
      onChangeText={setLastName}
    />
  </Animated.View>

            {/* PHONE */}
            <Animated.View style={[styles.glowBox, glowStyle(glowPhone)]}>
              <TextInput
                style={styles.input}
                placeholder="Phone"
                placeholderTextColor="#9dafc1"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                onFocus={() => glow(glowPhone, true)}
                onBlur={() => glow(glowPhone, false)}
              />
            </Animated.View>

            {/* EMAIL */}
            <Animated.View style={[styles.glowBox, glowStyle(glowEmail)]}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9dafc1"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => glow(glowEmail, true)}
                onBlur={() => glow(glowEmail, false)}
              />
            </Animated.View>

            {/* PASSWORD */}
            <Animated.View style={[styles.glowBox, glowStyle(glowPass)]}>
              <View style={styles.passwordWrap}>
                <TextInput
                  style={[styles.input, { marginBottom: 0 }]}
                  placeholder="Password"
                  placeholderTextColor="#9dafc1"
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => glow(glowPass, true)}
                  onBlur={() => glow(glowPass, false)}
                />
                <TouchableOpacity
                  style={styles.eye}
                  onPress={() => setShowPass(!showPass)}
                >
                  <Feather name={showPass ? "eye" : "eye-off"} size={20} color="#677f99" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* CONFIRM PASSWORD */}
            <Animated.View style={[styles.glowBox, glowStyle(glowConfirm)]}>
              <View style={styles.passwordWrap}>
                <TextInput
                  style={[styles.input, { marginBottom: 0 }]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9dafc1"
                  secureTextEntry={!showConfirm}
                  value={confirm}
                  onChangeText={setConfirm}
                  onFocus={() => glow(glowConfirm, true)}
                  onBlur={() => glow(glowConfirm, false)}
                />
                <TouchableOpacity
                  style={styles.eye}
                  onPress={() => setShowConfirm(!showConfirm)}
                >
                  <Feather name={showConfirm ? "eye" : "eye-off"} size={20} color="#677f99" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* ROLE SELECT */}
            <Animated.View style={[styles.glowBox, glowStyle(glowRole)]}>
              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => {
                  glow(glowRole, true);
                  openRoleModal();
                }}
                onBlur={() => glow(glowRole, false)}
              >
                <Text style={{ color: role ? "#0a2a3a" : "#9dafc1" }}>
                  {role || "register as..."}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* REGISTER BUTTON */}
          <TouchableOpacity
  style={[styles.btn, loading && { opacity: 0.7 }]}
  disabled={loading}
  onPress={handleSignup}
>
  {loading ? (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ActivityIndicator
        size="small"
        color="#fff"
        style={{ marginRight: 8 }}
      />
      <Text style={styles.btnText}>Creating...</Text>
    </View>
  ) : (
    <Text style={styles.btnText}>Register</Text>
  )}
</TouchableOpacity>


            {/* FOOTER */}
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-in")}
              style={styles.footer}
            >
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.footerLink}>Log In</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </Animated.View>

      {/* LOADING */}
      {/* commented out the loader of the entire page  */}
      {/* {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#13C84A" />
        </View>
      )} */}

      {/* ROLE MODAL */}
      {roleModalOpen && (
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableWithoutFeedback onPress={() => closeRoleModal()}>
            <View style={styles.overlayBg} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.modalCard,
              { transform: [{ scale: scaleAnim }, { translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.modalTitle}>Choose Role</Text>

            <ScrollView style={{ maxHeight: 360 }}>
              {roles.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => closeRoleModal(r)}
                  style={[styles.roleItem, role === r && styles.roleItemSelected]}
                >
                  <Text
                    style={[
                      styles.roleText,
                      role === r && styles.roleTextSelected,
                    ]}
                  >
                    {r}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => closeRoleModal()}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}

      {/* SUCCESS MODAL */}
      {successModal && (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>Registration Successful</Text>
            <Text style={styles.successMsg}>
              Your account has been created.{"\n"}
              Please wait for approval.
            </Text>

            <TouchableOpacity
              style={styles.successBtn}
              onPress={async () => {
              setSuccessModal(false);
await saveSession(null); // optional: reset stale data
router.replace("/(auth)/sign-in");

              }}
            >
              <Text style={styles.successBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },
  gradient: { ...StyleSheet.absoluteFillObject, zIndex: -1 },

  centered: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingVertical: 40,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: { width: 42, height: 42, marginRight: 10, borderRadius: 8 },
  logoText: { fontSize: 32, fontWeight: "900", color: "#13C84A" },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: "#0b233b",
  },
  subtitle: {
    textAlign: "center",
    color: "#516b82",
    fontSize: 14,
    marginBottom: 28,
  },

  glowBox: {
    borderWidth: 2,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 0 },
  },

  input: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0b233b",
  },

  passwordWrap: { justifyContent: "center" },
  eye: {
    position: "absolute",
    right: 16,
    top: 14,
  },

  roleButton: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  btn: {
    backgroundColor: "#13C84A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
  },

  footer: { marginTop: 20, alignItems: "center" },
  footerText: { color: "#243b54" },
  footerLink: { color: "#13C84A", fontWeight: "800" },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.34)",
  },

  modalCard: {
    width: Math.min(520, 500),
    maxWidth: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 20,
    maxHeight: "80%",
  },

  modalTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  roleItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#f7fbff",
    marginBottom: 12,
  },
  roleItemSelected: {
    backgroundColor: "#e6f4ff",
    borderWidth: 1,
    borderColor: "#b5d8ff",
  },
  roleText: {
    fontSize: 15,
    color: "#12304d",
    fontWeight: "600",
  },
  roleTextSelected: {
    color: "#0071e3",
  },

  modalCancel: {
    paddingVertical: 14,
    marginTop: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 14,
  },
  modalCancelText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#444",
  },

  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    width: "80%",
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  successMsg: {
    fontSize: 15,
    textAlign: "center",
    color: "#516b82",
    marginBottom: 22,
  },
  successBtn: {
    backgroundColor: "#13C84A",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  successBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});

