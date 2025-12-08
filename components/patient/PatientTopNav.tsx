import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { logoutUser } from "@/lib/logout";

export default function PatientTopNav() {
  const router = useRouter();

  const performLogout = async () => {
    try {
      if (Platform.OS === "web") {
        await logoutUser("web");
      } else {
        await logoutUser("mobile");
      }

      // ✅ HARD RESET – DO NOT CHANGE
      setTimeout(() => {
        router.replace("/onboarding");
      }, 80);
    } catch (e) {
      console.log("Logout failed", e);
    }
  };

  const handleLogout = () => {
    // ✅ WEB (Alert does NOT work properly)
    if (Platform.OS === "web") {
      const confirmLogout =
        typeof window !== "undefined"
          ? window.confirm("Do you really want to logout?")
          : false;

      if (confirmLogout) {
        performLogout();
      }
      return;
    }

    // ✅ MOBILE (iOS / Android)
    Alert.alert("Logout", "Do you really want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  return (
    <View style={styles.nav}>
      <Text style={styles.brand}>Arogyadhatha</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 64,
    backgroundColor: "#16A34A",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  logoutBtn: {
    padding: 6,
  },
});
