import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import profileImg from "@/assets/images/man.png";
import logo from "@/assets/images/newlogo.png";
import SearchPopup from "./SearchPopup";

// LOCATION
import LocationPickerSheet from "@/components/common/LocationPickerSheet";
import { useLocation } from "@/contexts/LocationContext";

// PROFILE MENU
import ProfileMenuModal from "@/components/patient/ProfileMenuModal";

// SESSION STORES
import { loadSession } from "@/lib/authPersist";
import { loadWebSession } from "@/lib/webPersist";

export default function PatientTopNav() {
  const router = useRouter();

  const [showSearch, setShowSearch] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { location, loading } = useLocation();

  const [userName, setUserName] = useState("User");
  const [patientId, setPatientId] = useState("PAT001");

  // ✅ LOAD USER FROM CORRECT SESSION STORE
  useEffect(() => {
    (async () => {
      const session =
        Platform.OS === "web"
          ? loadWebSession()
          : await loadSession();

      if (session?.name) setUserName(session.name);
      if (session?.patientId) setPatientId(session.patientId);
    })();
  }, []);

  const topSpacing =
    Platform.OS === "ios" || Platform.OS === "android" ? 40 : 10;

  const locationLabel = loading
    ? "Detecting location..."
    : location.city
    ? `${location.city}${location.district ? ", " + location.district : ""}`
    : "Select Location";

  return (
    <>
      <LinearGradient
        colors={["#02371F", "#065F46", "#0FAF5C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { paddingTop: topSpacing }]}
      >
        <View style={styles.container}>
          {/* LEFT */}
          <View style={styles.leftWrap}>
            <Image source={logo} style={styles.logo} />

            <View style={styles.titleBlock}>
              <Text style={styles.appName}>Arogyadhatha</Text>

              <TouchableOpacity onPress={() => setShowLocation(true)}>
                <Text style={styles.locationText} numberOfLines={1}>
                  {locationLabel}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setShowSearch(true)}
            >
              <Ionicons name="search" size={20} color="#ECFDF5" />
            </TouchableOpacity>
          </View>

          {/* RIGHT */}
          <View style={styles.rightWrap}>
            <TouchableOpacity style={styles.langPill}>
              <Text style={styles.langText}>EN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#ECFDF5"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowProfileMenu(true)}>
              <Image source={profileImg} style={styles.profileImg} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <SearchPopup visible={showSearch} onClose={() => setShowSearch(false)} />

      <LocationPickerSheet
        visible={showLocation}
        onClose={() => setShowLocation(false)}
      />

      <ProfileMenuModal
        visible={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        userName={userName}
        patientId={patientId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  gradient: { width: "100%", paddingBottom: 10 },
  container: {
    height: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 32, height: 32, resizeMode: "contain" },
  titleBlock: { flexDirection: "column", maxWidth: 140 },
  appName: { fontSize: 15, fontWeight: "800", color: "#ECFDF5" },
  locationText: { fontSize: 11, color: "#D1FAE5", marginTop: -2 },
  iconBtn: { padding: 6 },
  rightWrap: { flexDirection: "row", alignItems: "center", gap: 12 },
  langPill: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  langText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF" },
  profileImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
});
