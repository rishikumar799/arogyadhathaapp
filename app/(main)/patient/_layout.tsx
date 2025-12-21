import { Stack, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import PatientBottomNav from "@/components/patient/PatientBottomNav";
import PatientTopNav from "@/components/patient/PatientTopNav";

export default function PatientLayout() {
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1];

  const hideHeader = currentRoute === "index"; // Home screen → no header

  return (
    <View style={styles.wrapper}>
      {/* TOP NAV */}
      {!hideHeader && <PatientTopNav />}

      {/* MAIN SCREEN AREA */}
      <View style={styles.screenArea}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade", // smooth elegant transitions
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="appointments" />
          <Stack.Screen name="diagnostics" />
          <Stack.Screen name="medicines" />
          <Stack.Screen name="symptom-checker" />
        </Stack>
      </View>

      {/* BOTTOM NAV ALWAYS */}
      <PatientBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  screenArea: {
    flex: 1,
    paddingBottom: 70, // prevent screen content from going under bottom nav
  },
});
