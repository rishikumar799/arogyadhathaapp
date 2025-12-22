import { loadSession } from "@/lib/authPersist";
import { loadWebSession } from "@/lib/webPersist";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text } from "react-native";

export default function PatientHeader() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function loadName() {
      try {
        // ✅ WEB
        if (Platform.OS === "web") {
          const webSession = loadWebSession();
          if (mounted && webSession?.name) {
            setName(webSession.name);
            return;
          }
        }

        // ✅ MOBILE
        const mobileSession = await loadSession();
        if (mounted && mobileSession?.name) {
          setName(mobileSession.name);
          return;
        }

        setName("User");
      } catch {
        setName("User");
      }
    }

    loadName();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <LinearGradient
      colors={["#022C22", "#065F46", "#16A34A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <Text style={styles.greetingText}>
        Hello{ name ? `, ${name}` : "" }
      </Text>

      <Text style={styles.heroTitle}>
        All your care in one app
      </Text>

      <Text style={styles.heroSub}>
        Book appointments, track reports and manage your medicines.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 70,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E6FFF5",
  },
  heroTitle: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  heroSub: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(236,253,245,0.9)",
    lineHeight: 18,
    maxWidth: "90%",
  },
});
