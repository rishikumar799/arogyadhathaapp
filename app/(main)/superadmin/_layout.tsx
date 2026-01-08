import { loadWebSession } from "@/lib/webPersist";
import { Redirect, Slot } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

import SuperAdminSideNav from "@/components/superadmin/layout/SuperAdminSideNav";
import SuperAdminTopNav from "@/components/superadmin/layout/SuperAdminTopNav";

export default function SuperAdminLayout() {
  /* 🔐 KEEP THIS LOGIC — DO NOT TOUCH */
  if (Platform.OS === "web") {
    const session = loadWebSession();

    if (!session?.uid) {
      return null; // ⛔ intentionally no redirect
    }

    if (session.role?.toLowerCase() !== "superadmin") {
      return <Redirect href={`/(main)/${session.role.toLowerCase()}`} />;
    }
  }

  /* 📱 MOBILE */
  if (Platform.OS !== "web") {
    return (
      <View style={styles.mobilePage}>
        <SuperAdminTopNav />
        <Slot />
      </View>
    );
  }

  /* 🖥️ WEB */
  return (
    <View style={styles.webPage}>
      <SuperAdminSideNav />

      <View style={styles.webContent}>
        <SuperAdminTopNav />
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webPage: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
  },
  webContent: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mobilePage: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});
