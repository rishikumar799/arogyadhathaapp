import { loadSession } from "@/lib/authPersist";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SplashScreen() {
  const zoomAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function decideRoute() {
      // tiny delay ensures storage is ready
      await new Promise((res) => setTimeout(res, 150));

      const session = await loadSession();

      if (session && session.role && session.status === "approved") {
        // always lowerCase role → valid path
        router.replace(`/(main)/${session.role.toLowerCase()}`);
        return;
      }

      // no session → go to onboarding
      router.replace("/onboarding");
    }

    Animated.timing(zoomAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        decideRoute();
      });
    });
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View
        style={{ transform: [{ scale: zoomAnim }], opacity: fadeAnim }}
      >
        <Image
          source={{
            uri: "https://ik.imagekit.io/7z0x3rycfi/arogyadhatha/newlogo",
          }}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
