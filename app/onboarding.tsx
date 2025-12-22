// app/onboarding.tsx (PART A of 2)
// Paste PART A first, then PART B below it to form the full file.

"use client";
// import { FloatingBlob } from "@/components/animations/flotingBlob";
import { loadSession } from "@/lib/authPersist";
import { signInUser, signUpUser } from "@/lib/userService";
import { loadWebSession, saveWebSession } from "@/lib/webPersist";
import Feather from "@expo/vector-icons/Feather";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const VIDEOS = [
  "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/pv1",
  "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/pv2",
  "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/pv3",
  "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/pv4",
  "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/pv5",
  "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/pv6",
];

const AUTO_PROGRESS_MS = 3500;
const MobileVideo = Platform.OS !== "web" ? Video : null;

/* ===========================
   Helper UI components
   - SoftPremiumModal (used for errors & success on web)
   - LoadingButton (button with left loader)
   =========================== */

type ModalProps = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  okLabel?: string;
};

function SoftPremiumModal({ visible, title, message, onClose, okLabel = "OK" }: ModalProps) {
  // Fade + scale animated modal
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 260, easing: Easing.out(Easing.exp), useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 160, useNativeDriver: true }).start();
    }
  }, [visible, anim]);

  if (!visible) return null;

  return (
    <View style={modalStyles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          modalStyles.card,
          {
            opacity: anim,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.96, 1],
                }),
              },
            ],
          },
        ]}
      >
        {title ? <Text style={modalStyles.title}>{title}</Text> : null}
        <Text style={modalStyles.message}>{message}</Text>

        <TouchableOpacity onPress={onClose} style={modalStyles.button}>
          <Text style={modalStyles.buttonText}>{okLabel}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

/* LoadingButton for web: left small loader + pale left area while loading */
type LoadingButtonProps = {
  loading?: boolean;
  label: string;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
};
function LoadingButton({ loading, label, onPress, style, disabled }: LoadingButtonProps) {
  return (
    <TouchableOpacity
      style={[
        webStyles.webButton,
        style,
        (disabled || loading) && { opacity: 0.6 },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {/* CENTERED ROW */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        
        {/* LOADER */}
        {loading && (
          <ActivityIndicator
            size="small"
            color="#ffffff"
            style={{ marginRight: 10 }}   // <<< perfect 10px space
          />
        )}

        {/* TEXT */}
        <Text style={webStyles.webButtonText}>{label}</Text>

      </View>
    </TouchableOpacity>
  );
}





/* ===========================
   Web-only validation helpers
   (we only run validations when Platform.OS === "web")
   =========================== */

const isWeb = Platform.OS === "web";

function validateEmail(email: string) {
  if (!email) return "Email is required";
  // simple RFC-like email regex (practical)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return "Please enter a valid email";
  return null;
}

function validateName(name: string) {
  if (!name) return "Name is required";
  if (name.trim().length < 3) return "Name must be at least 3 letters";
  // letters, spaces and basic punctuation
  const re = /^[a-zA-Z\s.'-]{2,}$/;
  if (!re.test(name.trim())) return "Name contains invalid characters";
  return null;
}

export function validatePhone(phone: string) {
  const clean = phone.trim();

  // 1. Only digits allowed
  if (!/^\d+$/.test(clean)) {
    return "Please enter a valid phone number.";
  }

  // 2. Length must be 10
  if (clean.length !== 10) {
    return "Phone number must contain exactly 10 digits.";
  }

  return null; // valid
}

function validatePassword(password: string) {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

/* ===========================
   START Main component
   =========================== */

export default function Onboarding() {
  const router = useRouter();
 useEffect(() => {
  async function checkSessions() {
    
    if (Platform.OS !== "web") {
      // MOBILE SESSION ONLY
      const mobile = await loadSession();
      if (mobile && mobile.role && mobile.status === "approved") {
        router.replace(`/(main)/${mobile.role.toLowerCase()}`);
        return;
      }

      return; // STOP HERE (mobile only)
    }

    // WEB SESSION ONLY
    const web = loadWebSession();
    if (web && web.role && web.status === "approved") {
      router.replace(`/(main)/${web.role.toLowerCase()}`);
      return;
    }

    // else → stay on onboarding
  }

  checkSessions();
}, []);



  // slider
  const flatRef = useRef<FlatList | null>(null);
  const [index, setIndex] = useState<number>(0);

  // web auth (right pane)
  const [showSignup, setShowSignup] = useState(false);


  // sign-in / sign-up states
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [suFirstName, setSuFirstName] = useState("");
const [suLastName, setSuLastName] = useState("");

  const [suPhone, setSuPhone] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suRole, setSuRole] = useState("");
  // password visibilities
const [showSiPass, setShowSiPass] = useState(false);
const [showSuPass, setShowSuPass] = useState(false);
const [showSuConfirm, setShowSuConfirm] = useState(false);

  const [hovered, setHovered] = useState<string | null>(null);

const roles = ["Patient", "Doctor", "Diagnostics", "Pharmacy", "Hospital", "Receptionist"];

// Floating dropdown system
const roleInputRef = useRef(null);
const [dropdownTop, setDropdownTop] = useState(0);
const [dropdownLeft, setDropdownLeft] = useState(0);
const [dropdownWidth, setDropdownWidth] = useState(280);
const [roleOpen, setRoleOpen] = useState(false);
const roleAnim = useRef(new Animated.Value(0)).current;
const toggleRole = () => {
  if (roleOpen) {
    Animated.timing(roleAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setRoleOpen(false));
  } else {
    setRoleOpen(true);
    Animated.timing(roleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
};


  // animated progress values
  const progressValues = useRef(VIDEOS.map(() => new Animated.Value(0))).current;

  // Small UI entry animations for the web right column (optional visual polish)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 420, easing: Easing.out(Easing.exp), useNativeDriver: true }),
      Animated.timing(logoScale, { toValue: 1, duration: 900, easing: Easing.out(Easing.exp), useNativeDriver: true }),
      Animated.timing(logoFade, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(contentFade, { toValue: 1, duration: 480, delay: 80, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 480, delay: 80, useNativeDriver: true }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeNavigate = (path: string) => {
    try {
      setTimeout(() => {
        try {
          router.replace(path);
        } catch {
          setTimeout(() => router.replace(path), 120);
        }
      }, 30);
    } catch {}
  };

  const startProgress = (i: number) => {
    progressValues.forEach((pv, idx) => {
      pv.stopAnimation();
      if (idx < i) pv.setValue(1);
      else if (idx > i) pv.setValue(0);
    });

    progressValues[i].setValue(0);
    Animated.timing(progressValues[i], {
      toValue: 1,
      duration: AUTO_PROGRESS_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        if (i < VIDEOS.length - 1) {
          goTo(i + 1);
        } else {
          if (!isWeb) safeNavigate("/(auth)/sign-in");
        }
      }
    });
  };

  const goTo = (i: number) => {
    setIndex(i);
    flatRef.current?.scrollToOffset({ offset: i * width, animated: true });
  };

  useEffect(() => {
    progressValues.forEach((pv, idx) => {
      pv.stopAnimation();
      if (idx < index) pv.setValue(1);
      else pv.setValue(0);
    });

    startProgress(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const next = () => {
    if (index < VIDEOS.length - 1) goTo(index + 1);
    else safeNavigate("/(auth)/sign-in");
  };

  const skip = () => safeNavigate("/(auth)/sign-in");

  /* ===========================
     WEB Modal state + loaders
     - webModalVisible, webModalMessage
     - signInLoading, signUpLoading control
     =========================== */
  const [webModalVisible, setWebModalVisible] = useState(false);
  const [webModalMessage, setWebModalMessage] = useState("");
  const [webModalTitle, setWebModalTitle] = useState<string | undefined>(undefined);

  // button loaders for web
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

/* PART A ends here — continue with PART B which contains handlers and the UI rendering (web + mobile) */

// app/onboarding.tsx (PART B of 2)
// Paste this immediately after PART A. Together they form the complete file.

  /* ===========================
     WEB: SignIn / SignUp handlers (with validation + nice modal UX)
     - NOTE: We only validate on web. Mobile handlers remain as before if used elsewhere.
     =========================== */

  const showWebModal = (title: string | undefined, message: string) => {
    setWebModalTitle(title);
    setWebModalMessage(message);
    setWebModalVisible(true);
  };

  const closeWebModal = () => {
    setWebModalVisible(false);
    setWebModalMessage("");
    setWebModalTitle(undefined);
  };

/* ==========================================================
   FINAL HANDLE SIGN-IN FLOW (WEB + MOBILE SAFE)
   ========================================================== */

const handleSignIn = async () => {
  if (isWeb) {
    if (!siEmail.trim() || !siPassword.trim()) {
      showWebModal("Missing Fields", "Please enter email and password.");
      return;
    }

    const emailErr = validateEmail(siEmail);
    if (emailErr) {
      showWebModal("Invalid Email", emailErr);
      return;
    }
  }

  setSignInLoading(true);

  try {
    const email = siEmail.trim().toLowerCase();
    const res = await signInUser(email, siPassword);

    setSignInLoading(false);

    const code = (res.message || "").toUpperCase();

    if (code === "EMAIL_NOT_REGISTERED") {
      showWebModal("Email Not Registered", "Please create an account first.");
      return;
    }

    if (code === "WRONG_PASSWORD") {
      showWebModal("Incorrect Password", "The password you entered is wrong.");
      return;
    }

    if (code === "INVALID_EMAIL") {
      showWebModal("Invalid Email", "Please enter a valid email.");
      return;
    }

    if (code === "EMAIL_NOT_VERIFIED") {
      showWebModal("Email Not Verified", "Please verify your email before logging in.");
      return;
    }

    if (res.status === "pending") {
      showWebModal("Approval Pending", "Your account is waiting for approval.");
      return;
    }

   if (res.success && res.status === "approved") {
  const role = (res.role || "patient").toLowerCase();

  // 🔑 BUILD DISPLAY NAME SAFELY
  const displayName =
  res.name?.trim() ||
  `${res.firstName || ""} ${res.lastName || ""}`.trim() ||
  "User";


  if (isWeb) {
    saveWebSession({
      role,
      status: "approved",
      uid: res.uid,
      email,
      name: displayName,   // ✅ THIS FIXES HELLO USERNAME
    });
  }

  safeNavigate(`/(main)/${role}`);
  return;
}


    showWebModal("Login Error", "Something went wrong.");

  } catch (err) {
    setSignInLoading(false);
    showWebModal("Login Error", "Unexpected server error.");
  }
};










  const handleSignUp = async () => {
    if (isWeb) {
      // web-only validations
      const firstErr = validateName(suFirstName);
if (firstErr) {
  showWebModal("Sign Up Error", "First name is required");
  return;
}

const lastErr = validateName(suLastName);
if (lastErr) {
  showWebModal("Sign Up Error", "Last name is required");
  return;
}


      const emailErr = validateEmail(suEmail);
      if (emailErr) {
        showWebModal("Sign Up Error", emailErr);
        return;
      }

      const phoneErr = validatePhone(suPhone);
      if (phoneErr) {
        showWebModal("Sign Up Error", phoneErr);
        return;
      }

      const passErr = validatePassword(suPassword);
      if (passErr) {
        showWebModal("Sign Up Error", passErr);
        return;
      }

      if (suPassword !== suConfirm) {
        showWebModal("Sign Up Error", "Passwords do not match");
        return;
      }

      if (!suRole) {
        showWebModal("Sign Up Error", "Please select a role");
        return;
      }
    }

    setSignUpLoading(true);
    try {
      const firstName = suFirstName.trim();
const lastName = suLastName.trim();
const fullName = `${firstName} ${lastName}`.trim();

const res = await signUpUser({
  name: fullName,     // backward compatibility
  firstName,          // NEW
  lastName,           // NEW
  phone: suPhone,
  email: suEmail.trim(),
  password: suPassword,
  role: suRole,
});


      setSignUpLoading(false);

      if (!res || typeof res !== "object") {
        showWebModal("Sign Up Error", "Signup failed. Try again.");
        return;
      }

      if (!res.success) {
        const msg = (res.message || "").toLowerCase();
        if (msg.includes("email") && (msg.includes("already") || msg.includes("in use") || msg.includes("exists"))) {
          showWebModal("Sign Up Error", "Email already in use.");
        } else {
          showWebModal("Sign Up Error", res.message || "Signup failed");
        }
        return;
      }

      // if created and pending (non-patient) -> show pending modal
      if (res.status === "pending") {
        showWebModal("Profile Pending", "Registration successful. Please wait for admin approval.");
        setShowSignup(false);
        return;
      }

      // if patient -> auto redirect to patient dashboard
      // ✅ AUTO LOGIN AFTER SIGN UP (WEB SAFE)
if (res.status === "approved") {
  const role = suRole.toLowerCase();

  const displayName = `${suFirstName.trim()} ${suLastName.trim()}`.trim();

  if (isWeb) {
    saveWebSession({
      uid: res.uid,
      role,
      status: "approved",
      email: suEmail.trim().toLowerCase(),
      name: displayName || "User",
    });
  }

  safeNavigate(`/(main)/${role}`);
  return;
}

    } catch (err) {
      setSignUpLoading(false);
      console.warn("signUp error:", err);
      showWebModal("Sign Up Error", "Something went wrong. Try again.");
    }
  };

  /* ===================== WEB UI ===================== */
  if (isWeb) {
    return (
      <View style={styles.page}>
        <View style={styles.centerCardWrap}>
          <View style={styles.centerCard}>
            {/* LEFT – video (unchanged) */}
            <View style={styles.leftColumn}>
              <video
                key={index}
                src={VIDEOS[index]}
                autoPlay
                muted
                playsInline
                onEnded={() => {
                  if (index < VIDEOS.length - 1) setIndex((s) => s + 1);
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />

              {/* glass overlay bottom */}
              <View style={styles.webOverlay}>
                <View style={styles.overlayGlass}>
                  <Text style={styles.overlayTitle}>
                    {[
                      "Arogyadhatha: Smarter Health, Better Care",
                      "Care When It Matters Most",
                      "Precision Diagnostics",
                      "Smarter Insights",
                      "Connected Hospital",
                      "Future of Healthcare",
                    ][index]}
                  </Text>

                  <Text style={styles.overlaySubtitle}>
                    {[
                      "Experience intelligent healthcare powered by deep insights.",
                      "Your health is in safe hands.",
                      "Monitor your health accurately.",
                      "Advanced analysis & clarity.",
                      "Unified hospital workflow.",
                      "Future-ready AI healthcare.",
                    ][index]}
                  </Text>

                  <View style={styles.webDotsRow}>
                    {VIDEOS.map((_, i) => {
                      const pv = progressValues[i];
                      const widthInterpolate =
                        i === index ? pv.interpolate({ inputRange: [0, 1], outputRange: ["10%", "100%"] }) : undefined;

                      if (i < index) {
                        return <View key={i} style={styles.filledCircle} />;
                      } else if (i === index) {
                        return (
                          <View key={i} style={styles.barBase}>
                            <Animated.View style={[styles.barFill, { width: widthInterpolate as any }]} />
                          </View>
                        );
                      } else {
                        return <View key={i} style={styles.emptyCircle} />;
                      }
                    })}
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                    <TouchableOpacity
                      style={styles.startBtn}
                      onPress={() => (index < VIDEOS.length - 1 ? goTo(index + 1) : safeNavigate("/(auth)/sign-in"))}
                    >
                      <Text style={styles.startBtnText}>{index === VIDEOS.length - 1 ? "Start" : "Next"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* RIGHT — web auth card (updated) */}
            <Animated.View
              style={[
                styles.webRightColumn,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* LOGO */}
              <Animated.View style={[styles.webLogoRow, { opacity: logoFade, transform: [{ scale: logoScale }] }]}>
                <Image source={{ uri: "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/newlogo" }} style={styles.webLogo} />
                <Text style={styles.webLogoText}>Arogyadatha</Text>
              </Animated.View>

              {/* TABS */}
              <View style={styles.webTabs}>
                <Pressable onPress={() => setShowSignup(false)} style={[styles.webTabBtn, !showSignup && styles.webTabActive]}>
                  <Text style={[styles.webTabText, !showSignup && styles.webTabTextActive]}>Sign In</Text>
                </Pressable>

                <Pressable onPress={() => setShowSignup(true)} style={[styles.webTabBtn, showSignup && styles.webTabActive]}>
                  <Text style={[styles.webTabText, showSignup && styles.webTabTextActive]}>Sign Up</Text>
                </Pressable>
              </View>

              {/* CONTENT */}
              <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
  {!showSignup ? (
    /* ================= SIGN-IN FORM ================= */
    <View>

  {/* EMAIL */}
  <View style={styles.webInputOuter}>
    <TextInput
      placeholder="you@example.com"
      placeholderTextColor="#90A0B2"
      value={siEmail}
      onChangeText={setSiEmail}
      style={styles.webInput}
    />
  </View>

  {/* PASSWORD + EYE */}
  <View style={[styles.webInputOuter, { flexDirection: "row", alignItems: "center" }]}>
    <TextInput
      placeholder="Password"
      placeholderTextColor="#90A0B2"
      secureTextEntry={!showSiPass}
      value={siPassword}
      onChangeText={setSiPassword}
      style={[styles.webInput, { flex: 1 }]}
    />

    <Pressable
      onPress={() => setShowSiPass(!showSiPass)}
      style={{ paddingHorizontal: 10, cursor: "pointer" }}
    >
      <Feather
        name={showSiPass ? "eye" : "eye-off"}
        size={20}
        color="#677f99"
      />
    </Pressable>
  </View>

  {/* FORGOT PASSWORD TOP RIGHT */}
  <TouchableOpacity
    onPress={() => router.push("/(auth)/forgetPassword")}
    style={{ alignSelf: "flex-end", marginTop: 6, marginBottom: 12 }}
  >
    <Text style={styles.webForgot}>Forgot Password?</Text>
  </TouchableOpacity>

  {/* SIGN IN BUTTON */}
  <LoadingButton loading={signInLoading} label="Sign In" onPress={handleSignIn} />

  {/* BOTTOM: Don't have an account? Sign Up */}
   <View
    style={{
      marginTop: 18,
      flexDirection: "row",
      justifyContent: "center",
    }}
  >
    <Text style={{ color: "#556", fontSize: 14 }}>
      Don’t have an account?{" "}
    </Text>

    <TouchableOpacity onPress={() => setShowSignup(true)}>
      <Text style={{ color: "#0b8f6d", fontWeight: "700", fontSize: 14 }}>
        Sign Up
      </Text>
    </TouchableOpacity>
  </View>

</View>

  ) : (
    /* ================= SIGN-UP FORM ================= */
    <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>

      {/* FULL NAME */}
      {/* FIRST + LAST NAME */}
<View style={{ flexDirection: "row", gap: 10 }}>
  <View style={[styles.webInputOuter, { flex: 1 }]}>
    <TextInput
      placeholder="First Name"
      value={suFirstName}
      onChangeText={setSuFirstName}
      style={styles.webInput}
    />
  </View>

  <View style={[styles.webInputOuter, { flex: 1 }]}>
    <TextInput
      placeholder="Last Name"
      value={suLastName}
      onChangeText={setSuLastName}
      style={styles.webInput}
    />
  </View>
</View>


      {/* PHONE */}
      <View style={styles.webInputOuter}>
        <TextInput
          placeholder="Phone"
          value={suPhone}
          onChangeText={setSuPhone}
          style={styles.webInput}
        />
      </View>

      {/* EMAIL */}
      <View style={styles.webInputOuter}>
        <TextInput
          placeholder="Email"
          value={suEmail}
          onChangeText={setSuEmail}
          style={styles.webInput}
        />
      </View>

      {/* PASSWORD + EYE ICON */}
<View style={[styles.webInputOuter, { flexDirection: "row", alignItems: "center" }]}>
  <TextInput
    placeholder="Password"
    secureTextEntry={!showSuPass}
    value={suPassword}
    onChangeText={setSuPassword}
    style={[styles.webInput, { flex: 1 }]}
  />

  <Pressable
    onPress={() => setShowSuPass(!showSuPass)}
    style={{ paddingHorizontal: 10, cursor: "pointer" }}
  >
    <Feather
      name={showSuPass ? "eye" : "eye-off"}
      size={20}
      color="#677f99"
    />
  </Pressable>
</View>

{/* CONFIRM PASSWORD + EYE ICON */}
<View style={[styles.webInputOuter, { flexDirection: "row", alignItems: "center" }]}>
  <TextInput
    placeholder="Confirm Password"
    secureTextEntry={!showSuConfirm}
    value={suConfirm}
    onChangeText={setSuConfirm}
    style={[styles.webInput, { flex: 1 }]}
  />

  <Pressable
    onPress={() => setShowSuConfirm(!showSuConfirm)}
    style={{ paddingHorizontal: 10, cursor: "pointer" }}
  >
    <Feather
      name={showSuConfirm ? "eye" : "eye-off"}
      size={20}
      color="#677f99"
    />
  </Pressable>
</View>


      {/* ROLE DROPDOWN (unchanged) */}
      <Pressable
        ref={roleInputRef}
        onLayout={(e) => {
          const { x, y, width } = e.nativeEvent.layout;
          const DROPDOWN_HEIGHT = roles.length * 48;
          setDropdownTop(y - DROPDOWN_HEIGHT - 12);
          setDropdownLeft(x);
          setDropdownWidth(width);
        }}
        onPress={toggleRole}
      >
        <Animated.View
          style={[
            styles.webInputOuter,
            { borderColor: roleOpen ? "#13C84A" : "#dce7f2" },
          ]}
        >
          <Text style={{ color: suRole ? "#000" : "#90A0B2" }}>
            {suRole || "Select Role"}
          </Text>
        </Animated.View>
      </Pressable>

      {roleOpen && (
        <Animated.View
          style={{
            position: "absolute",
            top: dropdownTop,
            left: dropdownLeft,
            width: dropdownWidth,
            opacity: roleAnim,
            transform: [
              {
                translateY: roleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, 0],
                }),
              },
              {
                scale: roleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1],
                }),
              },
            ],
            backgroundColor: "#fff",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#dce7f2",
            overflow: "hidden",
            elevation: 6,
            shadowColor: "#000",
            shadowOpacity: 0.14,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            zIndex: 999,
          }}
        >
          {roles.map((r, idx) => {
            const isSelected = suRole === r;
            const isHovered = hovered === r;

            return (
              <Pressable
                key={r}
                onHoverIn={() => setHovered(r)}
                onHoverOut={() => setHovered(null)}
                onPress={() => {
                  setSuRole(r);
                  toggleRole();
                }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderBottomWidth: idx === roles.length - 1 ? 0 : 1,
                  borderColor: "#efefef",
                  backgroundColor: isSelected
                    ? "#dff8ec"
                    : isHovered
                    ? "#f4fff9"
                    : "#fff",
                  transition: "background-color 150ms ease",
                  cursor: "pointer",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: isSelected ? "700" : "500",
                    color: isSelected ? "#0b8f6d" : "#000",
                  }}
                >
                  {r}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
      )}

      <LoadingButton loading={signUpLoading} label="Create Account" onPress={handleSignUp} />
 {/* BOTTOM: Already have an account? Login */}
   <View
    style={{
      marginTop: 18,
      flexDirection: "row",
      justifyContent: "center",
    }}
  >
    <Text style={{ color: "#556", fontSize: 14 }}>
      Already have an account?{" "}
    </Text>

    <TouchableOpacity onPress={() => setShowSignup(false)}>
      <Text style={{ color: "#0b8f6d", fontWeight: "700", fontSize: 14 }}>
        Login
      </Text>
    </TouchableOpacity>
  </View>
    </ScrollView>
  )}
</Animated.View>

            </Animated.View>
          </View>
        </View>

        {/* Soft premium modal */}
        <SoftPremiumModal visible={webModalVisible} title={webModalTitle} message={webModalMessage} onClose={closeWebModal} />

      </View>
    );
  }

  /* ===================== MOBILE UI (unchanged) ===================== */
return (
  <View style={{ flex: 1, backgroundColor: "#000" }}>
    <FlatList
      ref={flatRef}
      data={VIDEOS}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, i) => String(i)}
      onMomentumScrollEnd={(e) => {
        const i = Math.round(e.nativeEvent.contentOffset.x / width);
        setIndex(i);
      }}
      renderItem={({ item }) => (
        <View style={{ width, height }}>

          {/* ======== VIDEO BACKGROUND ======== */}
          <View style={{ width: "100%", height: "100%", zIndex: 1 }}>
            {MobileVideo ? (
              <MobileVideo
                source={{ uri: item }}
                shouldPlay
                isLooping={false}
                isMuted
                resizeMode={ResizeMode.COVER}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <View style={{ flex: 1, backgroundColor: "#000" }} />
            )}
          </View>

          {/* ======== GLASSMORPHISM CARD ======== */}
          <View style={[styles.mobileOverlay, { zIndex: 20 }]}>
            <View style={[styles.overlayGlassMobile, { zIndex: 21 }]}>

              {/* Content */}
              <Text style={styles.mobileTitle}>
                {[
                  "Arogyadhatha: Smarter Health, Better Care",
                  "Care When It Matters Most",
                  "Precision Diagnostics",
                  "Smarter Insights",
                  "Connected Hospital",
                  "Future of Healthcare",
                ][index]}
              </Text>

              <Text style={styles.mobileSub}>
                {[
                  "Experience intelligent healthcare powered by deep insights.",
                  "Your health is in safe hands.",
                  "Monitor your health accurately.",
                  "Advanced analysis & clarity.",
                  "Unified hospital workflow.",
                  "Future-ready AI care.",
                ][index]}
              </Text>

              <View style={styles.mobileBottomRow}>
                <View style={styles.dotsContainer}>
                  {VIDEOS.map((_, i) => {
                    const pv = progressValues[i];
                    if (i < index) return <View key={i} style={styles.smallFilledCircle} />;

                    if (i === index) {
                      const w = pv.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["10%", "100%"],
                      });
                      return (
                        <View key={i} style={styles.smallBarBase}>
                          <Animated.View style={[styles.smallBarFill, { width: w as any }]} />
                        </View>
                      );
                    }

                    return <View key={i} style={styles.smallEmptyCircle} />;
                  })}
                </View>

                <TouchableWithoutFeedback onPress={next}>
                  <View style={styles.mobileNextCircle}>
                    <Text style={styles.mobileNextText}>
                      {index === VIDEOS.length - 1 ? "Start" : "Next"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <Pressable onPress={skip} style={styles.mobileSkip}>
                <Text style={styles.mobileSkipText}>Skip</Text>
              </Pressable>

            </View>
          </View>

        </View>
      )}
    />
  </View>
);



}



/* ===================== STYLES ===================== */
const webStyles = StyleSheet.create({
  webButton: {
  backgroundColor: "#13C84A",
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 14,
  marginTop: 10,
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",   // IMPORTANT
  overflow: "hidden",
},


  webButtonLoading: {
    backgroundColor: "#c8d7ec",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    overflow: "hidden",
  },
  loaderArea: {
    width: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  loaderAreaActive: {
    width: 48,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  buttonLabelWrap: { flex: 1, alignItems: "center", justifyContent: "center" },

  webButtonText: { color: "#fff", fontWeight: "800", fontSize: 17 },
});

const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  card: {
    width: Math.min(520, 520),
    backgroundColor: "#ffffff",
    padding: 22,
    borderRadius: 14,
    elevation: 12,
    marginHorizontal: 20,
    alignItems: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.12)" as any, // some RNW friendly property; safe fallback on native
  },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 8, color: "#0b233b" },
  message: { fontSize: 15, color: "#516b82", textAlign: "center", marginBottom: 18 },
  button: {
    backgroundColor: "#13C84A",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 12,
    alignSelf: "stretch",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});

/* Reuse and combine existing styles from original file (left column + mobile) */
const styles = StyleSheet.create({
  /* page bg */
  page: {
    flex: 1,
    backgroundColor: "#0f3f36",
    alignItems: "center",
    justifyContent: "center",
  },

  centerCardWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  centerCard: {
    width: Math.min(width - 40, 1100),
    height: Math.min(height - 80, 720),
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    flexDirection: "row",
    alignSelf: "center",
    elevation: 10,
  },

  /* Left */
  leftColumn: { flex: 1, position: "relative", backgroundColor: "#000" },

  webOverlay: { position: "absolute", left: 20, right: 20, bottom: 22 },
  overlayGlass: {
  borderRadius: 18,
  padding: 24,

  // frosted glass blur (web-only)
  ...(Platform.OS === "web"
    ? {
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
      }
    : {}),

  // background tint with green premium glow
  backgroundColor:
    Platform.OS === "web"
      ? "rgba(19, 200, 74, 0.12)"
      : "rgba(0,0,0,0.35)",

  // border glow (web only)
  ...(Platform.OS === "web"
    ? {
        borderWidth: 1,
        borderColor: "rgba(19, 200, 74, 0.45)",
        boxShadow: "0 8px 30px rgba(19,200,74,0.25)",
      }
    : {}),

  overflow: "hidden",
  position: "relative",
  alignItems: "center",
} as any,

  overlayTitle: { color: "#32cd11", fontSize: 25, fontWeight: "800", textAlign: "center" },
  overlaySubtitle: { color: "#e7e7e7", fontSize: 16, marginTop: 8, textAlign: "center" },

  webDotsRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },

  filledCircle: {
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: "#13c84a",
    marginHorizontal: 6,
  },
  emptyCircle: {
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.20)",
    marginHorizontal: 6,
  },
  barBase: {
    width: 60,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 6,
  },
  barFill: { height: "100%", backgroundColor: "#13c84a", borderRadius: 6 },

  startBtn: {
    backgroundColor: "#13c84a",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 6,
  },
  startBtnText: { color: "#fff", fontWeight: "700" },

  /* RIGHT — NEW WEB UI */
  webRightColumn: {
    width: 450,
    paddingVertical: 24,
    paddingHorizontal: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  webLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  webLogo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 10,
  },

  webLogoText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#13C84A",
  },

  webTabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  webTabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginHorizontal: 5,
  },

  webTabActive: {
    backgroundColor: "#dff8ec",
  },

  webTabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "700",
  },

  webTabTextActive: {
    color: "#0b8f6d",
  },

  webInputOuter: {
    borderWidth: 2,
    borderColor: "#dce7f2",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 50,
    justifyContent: "center",
  },

 webInput: {
  fontSize: 15,
  color: "#0b233b",

  // 🔥 WEB FOCUS FIX
  outlineStyle: "none",        // removes black outline
  outlineWidth: 0,
  boxShadow: "none",           // removes browser glow
} as any,


  webButton: {
    backgroundColor: "#13C84A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  webButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
  },

  webForgot: {
    textAlign: "center",
    marginTop: 12,
    fontWeight: "700",
    color: "#0b8f6d",
  },

  webRoleDropdown: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 10,
    paddingVertical: 6,
    maxHeight: 200,
  },

  webRoleItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },

 
 
 
 
 
 
 /* ===================== PREMIUM MOBILE GLASS (UPDATED FULL STYLE BLOCK) ===================== */
mobileOverlay: {
  position: "absolute",
  left: 18,
  right: 18,
  bottom: 36,
  zIndex: 20,
},

overlayGlassMobile: {
  padding: 28,
  borderRadius: 28,

  // CLEAN FROSTED GLASS
  backgroundColor: "rgba(255,255,255,0.08)",  
  backdropFilter: "blur(20px)",               // Expo-web + Skia
  WebkitBackdropFilter: "blur(20px)",

  // THIN GREEN ACCENT BORDER
  borderWidth: 1,
  borderColor: "rgba(19,200,74,0.65)",

  // SOFT DEPTH (no glow, no neon)
  shadowColor: "rgba(0,0,0,0.55)",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.25,
  shadowRadius: 18,
  elevation: 10,

  overflow: "hidden",
  position: "relative",
},

mobileTitle: {
  color: "#13c84a",
  fontSize: 26,
  fontWeight: "900",
  textAlign: "center",
  letterSpacing: 0.6,
  lineHeight: 34,
},

mobileSub: {
  color: "rgba(255,255,255,0.9)",
  marginTop: 10,
  fontSize: 15,
  textAlign: "center",
  lineHeight: 22,
  opacity: 0.9,
},


/* ===== BOTTOM BAR ===== */
mobileBottomRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 20,
},

dotsContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  flex: 1,
},

smallFilledCircle: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: "#13c84a",
},

smallEmptyCircle: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: "rgba(255,255,255,0.22)",
},

smallBarBase: {
  width: 100,
  height: 10,
  borderRadius: 6,
  backgroundColor: "rgba(255,255,255,0.18)",
  overflow: "hidden",
},

smallBarFill: {
  height: "100%",
  backgroundColor: "#13c84a",
  borderRadius: 6,
},

mobileNextCircle: {
  width: 66,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#13c84a",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 12,

  // subtle floating shadow
  shadowColor: "#13c84a",
  shadowOpacity: 0.22,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 10,
},

mobileNextText: {
  color: "#fff",
  fontWeight: "800",
  fontSize: 15,
  letterSpacing: 0.4,
},

mobileSkip: {
  position: "absolute",
  right: 0,
  top: -32,
  zIndex: 40,
},

mobileSkipText: {
  color: "rgba(255,255,255,0.9)",
  fontWeight: "700",
  fontSize: 14,
  letterSpacing: 0.4,
},
});