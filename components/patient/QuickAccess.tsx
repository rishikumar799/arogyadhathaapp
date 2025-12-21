// QuickAccess.tsx — Premium Glassmorphism + Tap-only PanResponder + 4 Column Grid
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";

const GREEN = "#0FAF63";

type QuickItem = {
  label: string;
  icon: any;
  route: string;
};

export default function QuickAccess({ items }: { items: QuickItem[] }) {
  const router = useRouter();

  return (
    <View style={styles.section}>
      {/* Ultra-premium glassmorphism card */}
      <BlurView
        intensity={Platform.OS === "android" ? 95 : 60}
        tint="light"
        style={styles.card}
      >
        <View style={styles.cardGlow} />

        <View style={styles.grid}>
          {items.map((it, i) => (
            <PremiumTile key={i} item={it} onNavigate={() => router.push(it.route)} />
          ))}
        </View>
      </BlurView>
    </View>
  );
}

/* -----------------------------------------------------------
   Premium Tile — PanResponder Tap-only (No scroll redirects)
----------------------------------------------------------- */
function PremiumTile({ item, onNavigate }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  const touch = useRef({
    x: 0,
    y: 0,
    t: 0,
    moved: false,
  }).current;

  const MOVE_LIMIT = 12;
  const TAP_TIME = 300;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        touch.x = pageX;
        touch.y = pageY;
        touch.t = Date.now();
        touch.moved = false;

        Animated.timing(scale, {
          toValue: 0.94,
          duration: 120,
          useNativeDriver: true,
        }).start();
      },

      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;

        if (
          Math.abs(pageX - touch.x) > MOVE_LIMIT ||
          Math.abs(pageY - touch.y) > MOVE_LIMIT
        ) {
          touch.moved = true; // DEFINITELY scrolling → NO redirect
        }
      },

      onPanResponderRelease: () => {
        Animated.timing(scale, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }).start();

        const dt = Date.now() - touch.t;

        if (!touch.moved && dt < TAP_TIME) {
          onNavigate(); // REAL TAP ONLY
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.item, { transform: [{ scale }] }]}>
      <View {...panResponder.panHandlers} style={styles.tile}>
        {/* Soft top highlight */}
        <View style={styles.highlight} />

        {/* Light green capsule depth */}
        <View style={styles.innerDepth} />

        {/* Icon */}
        <Image source={item.icon} style={styles.icon} />
      </View>

      <Text style={styles.label}>{item.label}</Text>
    </Animated.View>
  );
}

/* -----------------------------------------------------------
   Styles — Premium Raised Soft UI + Glassmorphism + 4 Columns
----------------------------------------------------------- */
const styles = StyleSheet.create({
  section: {
    marginTop: -20,
    paddingHorizontal: 12,
  },

  // Frosted glass panel
  card: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",

    shadowColor: "rgba(0,0,0,0.25)",
    shadowOpacity: 0.28,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 16 },
    elevation: 16,
  },

  // Inner soft glow to enhance glassmorphism
  cardGlow: {
    position: "absolute",
    top: -50,
    left: -40,
    width: "180%",
    height: "180%",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 80,
    opacity: 0.20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // 4 per row
  item: {
    width: "23.5%",
    alignItems: "center",
    marginBottom: 26,
  },

  // Raised premium soft-UI button
  tile: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 6, height: 10 },
    elevation: 14,
  },

  // Glossy top highlight
  highlight: {
    position: "absolute",
    top: -12,
    left: -12,
    width: "130%",
    height: "130%",
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.65)",
    opacity: 0.50,
    zIndex: -1,
  },

  // Light green capsule depth under icon
  innerDepth: {
    position: "absolute",
    bottom: 16,
    width: "60%",
    height: "18%",
    borderRadius: 14,
    backgroundColor: "rgba(15,175,99,0.20)",
  },

  icon: {
    width: 40,
    height: 40,
    tintColor: GREEN,
    zIndex: 10,
    resizeMode: "contain",
  },

  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#0A0F1E",
  },
});


