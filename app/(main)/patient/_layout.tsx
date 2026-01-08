import { loadWebSession } from "@/lib/webPersist";
import { Redirect, Stack, useSegments } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import PatientBottomNav from "@/components/patient/PatientBottomNav";
import PatientTopNav from "@/components/patient/PatientTopNav";

export default function PatientLayout() {
  const segments = useSegments();

  // 🔒 WEB ROLE GUARD
 if (Platform.OS === "web") {
  const session = loadWebSession();

  if (!session?.uid) {
    return null; // ⛔ let RootLayout handle onboarding
  }

  if (session.role?.toLowerCase() !== "patient") {
    return <Redirect href={`/(main)/${session.role.toLowerCase()}`} />;
  }
}


  // ---------------- YOUR EXISTING LOGIC ----------------
  const currentRoute = segments[segments.length - 1];
  const hideHeader = currentRoute === "index";

  return (
    <View style={styles.wrapper}>
      {!hideHeader && <PatientTopNav />}

      <View style={styles.screenArea}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="appointments" />
          <Stack.Screen name="diagnostics" />
          <Stack.Screen name="medicines" />
          <Stack.Screen name="symptom-checker" />
        </Stack>
      </View>

      <PatientBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F8FAFC" },
  screenArea: { flex: 1, paddingBottom: 70 },
});
