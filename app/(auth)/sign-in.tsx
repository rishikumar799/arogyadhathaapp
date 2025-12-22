"use client";
import { saveSession } from "@/lib/authPersist";
import { signInUser } from "@/lib/userService";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";

export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalTitle, setModalTitle] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  // Entry animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  // Inputs
  const emailGlow = useRef(new Animated.Value(0)).current;
  const passGlow = useRef(new Animated.Value(0)).current;

  // Exit
  const exitFade = useRef(new Animated.Value(1)).current;
  const exitSlide = useRef(new Animated.Value(0)).current;

  // Modal animation
  const modalFade = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function glow(ref: Animated.Value) {
    Animated.timing(ref, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function unGlow(ref: Animated.Value) {
    Animated.timing(ref, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function openModal(title: string, msg: string) {
    setModalTitle(title);
    setModalMsg(msg);

    modalFade.setValue(0);
    modalScale.setValue(0.8);

    Animated.parallel([
      Animated.timing(modalFade, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(modalScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }

  // -------------------------
  // LOGIN HANDLER
  // -------------------------
async function handleLogin() {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanPass) {
    return openModal("Missing Fields", "Please enter email and password.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return openModal("Invalid Email", "Please enter a valid email.");
  }

  if (cleanPass.length < 6) {
    return openModal("Weak Password", "Password must be at least 6 characters long.");
  }

  setLoading(true);
  const res = await signInUser(cleanEmail, cleanPass);
  setLoading(false);

  const code = (res.message || "").toUpperCase();

  if (!res.success) {
    if (code === "EMAIL_NOT_REGISTERED") {
      return openModal("Email Not Registered", "This email is not registered. Please create an account.");
    }
    if (code === "WRONG_PASSWORD") {
      return openModal("Incorrect Password", "The password you entered is incorrect.");
    }
    if (code === "INVALID_EMAIL") {
      return openModal("Invalid Email", "Please enter a valid email.");
    }
    if (code === "EMAIL_NOT_VERIFIED") {
      return openModal("Email Not Verified", "Please verify your email before logging in.");
    }
    if (code === "PENDING_APPROVAL") {
      return openModal("Approval Pending", "Your profile is under review. Please wait for admin approval.");
    }
    return openModal("Login Failed", "Something went wrong. Try again.");
  }

  if (res.status === "pending") {
    return openModal("Approval Pending", "Your profile is under verification. Please wait for admin approval.");
  }

  // SAVE SESSION FOR AUTOMATIC LOGIN NEXT TIME
  // 🧠 BUILD DISPLAY NAME SAFELY (SAME AS WEB)
const displayName =
  res.name?.trim() ||
  `${res.firstName || ""} ${res.lastName || ""}`.trim() ||
  "User";


// ✅ SAVE MOBILE SESSION (AUTHORITATIVE)
await saveSession({
  role: res.role,
  status: res.status,
  uid: res.uid,
  email: cleanEmail,
  name: displayName,   // ❤️ THIS FIXES HELLO USER
});


  Animated.parallel([
    Animated.timing(exitFade, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }),
    Animated.timing(exitSlide, {
      toValue: -40,
      duration: 350,
      useNativeDriver: true,
    }),
  ]).start(() => {
    const role = (res.role || "patient").toLowerCase();
    router.replace(`/(main)/${role}`);
  });
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
          opacity: exitFade,
          transform: [{ translateY: exitSlide }],
        }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              width: "100%",
            }}
          >
            {/* LOGO */}
            <Animated.View style={[styles.logoRow, { transform: [{ scale: logoScale }] }]}>
              <Image
                source={{ uri: "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/newlogo" }}
                style={styles.logo}
              />
              <Text style={styles.logoText}>Arogyadatha</Text>
            </Animated.View>

            <Text style={styles.title}>Continue Your Journey</Text>
            <Text style={styles.subtitle}>
              Track, manage, and stay updated with your health data.
            </Text>

            {/* EMAIL */}
            <Text style={styles.label}>Email</Text>
            <Animated.View
              style={[
                styles.inputGlow,
                {
                  borderColor: emailGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#dce7f2", "#13C84A"],
                  }),
                  shadowOpacity: emailGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.25],
                  }),
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                placeholderTextColor="#9dafc1"
                value={email}
                onFocus={() => glow(emailGlow)}
                onBlur={() => unGlow(emailGlow)}
                onChangeText={setEmail}
              />
            </Animated.View>

            {/* PASSWORD */}
            <Text style={styles.label}>Password</Text>
            <Animated.View
              style={[
                styles.inputGlow,
                {
                  borderColor: passGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#dce7f2", "#13C84A"],
                  }),
                  shadowOpacity: passGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.25],
                  }),
                },
              ]}
            >
              <View style={styles.passwordWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9dafc1"
                  secureTextEntry={!showPass}
                  value={password}
                  onFocus={() => glow(passGlow)}
                  onBlur={() => unGlow(passGlow)}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eye}
                  onPress={() => setShowPass(!showPass)}
                >
                  <Feather
                    name={showPass ? "eye" : "eye-off"}
                    size={20}
                    color="#677f99"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* FORGOT */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgetPassword")}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* LOGIN BUTTON */}
            <TouchableOpacity style={styles.btn} disabled={loading} onPress={handleLogin}>
              {loading ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.btnText}>Logging in...</Text>
                </View>
              ) : (
                <Text style={styles.btnText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
              <Text style={styles.footerText}>
                Don’t have an account?{" "}
                <Text style={styles.footerLink}>Register</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </Animated.View>

      {/* MODAL */}
      {modalMsg !== "" && (
        <Animated.View style={[styles.modalOverlay, { opacity: modalFade }]}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: modalScale }] }]}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMsg}>{modalMsg}</Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setModalMsg("")}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },

  gradient: { ...StyleSheet.absoluteFillObject, zIndex: -1 },

  container: {
    minHeight: "100%",
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingVertical: 40,
    maxWidth: 520,
    alignSelf: "center",
    width: "100%",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  logoText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#13C84A",
  },

  logo: {
    width: 42,
    height: 42,
    marginRight: 10,
    borderRadius: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#0b233b",
    marginBottom: 6,
  },

  subtitle: {
    textAlign: "center",
    color: "#516b82",
    marginBottom: 32,
    fontSize: 14,
  },

  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#1f3446",
  },

  inputGlow: {
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: "#fff",
    shadowColor: "#13C84A",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },

  input: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0b233b",
  },

  passwordWrap: { justifyContent: "center" },

  eye: { position: "absolute", right: 16, top: 14 },

  forgotBtn: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { color: "#0071e3", fontWeight: "700" },

  btn: {
    backgroundColor: "#13C84A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },

  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
  },

  footerText: {
    marginTop: 18,
    textAlign: "center",
    color: "#243b54",
  },

  footerLink: {
    color: "#13C84A",
    fontWeight: "800",
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  modalMsg: {
    textAlign: "center",
    color: "#516b82",
    marginBottom: 22,
  },

  modalBtn: {
    backgroundColor: "#13C84A",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  modalBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
