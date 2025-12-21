"use client";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "@/lib/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* PAGE ENTRY ANIMATION */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  /* LOGO ENTRY */
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  /* CONTENT ENTRY */
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(25)).current;

  /* INPUT GLOW */
  const glowAnim = useRef(new Animated.Value(0)).current;

  /* MODAL ANIMS */
  const modalFade = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 550,
        delay: 80,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 550,
        delay: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* Input glow */
  function glow(on: boolean) {
    Animated.timing(glowAnim, {
      toValue: on ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  /* Modal animation */
  function playModal() {
    modalFade.setValue(0);
    modalScale.setValue(0.8);

    Animated.parallel([
      Animated.timing(modalFade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(modalScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }

  /* HANDLE SUBMIT */
  async function handleSubmit() {
    if (!email) {
      setErrorMsg("Please enter your email");
      setErrorModal(true);
      playModal();
      return;
    }

    try {
      // CHECK EMAIL IN FIRESTORE
      const q = query(
        collection(db, "users"),
        where("email", "==", email.toLowerCase())
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setErrorMsg("This email is not registered");
        setErrorModal(true);
        playModal();
        return;
      }

      // SEND RESET EMAIL
      await sendPasswordResetEmail(auth, email);

      setSuccessModal(true);
      playModal();
    } catch (err: any) {
      setErrorMsg("Something went wrong. Try again.");
      setErrorModal(true);
      playModal();
    }
  }

  return (
    <View style={styles.screen}>
      {LinearGradient && (
  <LinearGradient
    colors={["#ECF2FF", "#E7F9FF", "#E4FFF3"]}
    style={styles.gradient}
  />
)}


      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={styles.container}>
          {/* LOGO */}
          <Animated.View
            style={[
              styles.logoRow,
              {
                opacity: logoFade,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={{
                uri: "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/newlogo",
              }}
              style={styles.logo}
            />
            <Text style={styles.logoText}>Arogyadatha</Text>
          </Animated.View>

          {/* CONTENT */}
          <Animated.View
            style={{
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            }}
          >
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your registered email to receive reset instructions.
            </Text>

            {/* INPUT GLOW */}
            <Animated.View
              style={[
                styles.inputGlow,
                {
                  borderColor: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#dce7f2", "#13C84A"],
                  }),
                  shadowOpacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.25],
                  }),
                },
              ]}
            >
              <TextInput
                placeholder="example@gmail.com"
                placeholderTextColor="#9dafc1"
                value={email}
                onChangeText={setEmail}
                onFocus={() => glow(true)}
                onBlur={() => glow(false)}
                style={styles.input}
              />
            </Animated.View>

            {/* BUTTON */}
            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
              <Text style={styles.btnText}>Send Reset Link</Text>
            </TouchableOpacity>

            {/* BACK */}
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-in")}
            >
              <Text style={styles.footerText}>
                Remember your password?{" "}
                <Text style={styles.footerLink}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      {/* SUCCESS MODAL */}
      {successModal && (
        <Animated.View
          style={[styles.modalOverlay, { opacity: modalFade }]}
        >
          <Animated.View
            style={[styles.modalCard, { transform: [{ scale: modalScale }] }]}
          >
            <Text style={styles.modalTitle}>Email Sent</Text>
            <Text style={styles.modalMsg}>
              A reset link has been sent to your email.{"\n"}
              Please check your inbox.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setSuccessModal(false)}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}

      {/* ERROR MODAL */}
      {errorModal && (
        <Animated.View
          style={[styles.modalOverlay, { opacity: modalFade }]}
        >
          <Animated.View
            style={[styles.modalCard, { transform: [{ scale: modalScale }] }]}
          >
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMsg}>{errorMsg}</Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setErrorModal(false)}
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
    width: "100%",
    alignSelf: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  logo: { width: 42, height: 42, marginRight: 10, borderRadius: 8 },
  logoText: { fontSize: 32, fontWeight: "900", color: "#13C84A" },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#0b233b",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#516b82",
    marginBottom: 32,
  },

  inputGlow: {
    borderWidth: 2,
    borderRadius: 14,
    backgroundColor: "#fff",
    shadowColor: "#13C84A",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    marginBottom: 16,
  },

  input: {
    height: 50,
    fontSize: 15,
    paddingHorizontal: 16,
    color: "#0b233b",
  },

  btn: {
    backgroundColor: "#13C84A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 17 },

  footerText: {
    marginTop: 16,
    textAlign: "center",
    color: "#243b54",
  },
  footerLink: { color: "#13C84A", fontWeight: "800" },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  modalMsg: {
    fontSize: 15,
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
