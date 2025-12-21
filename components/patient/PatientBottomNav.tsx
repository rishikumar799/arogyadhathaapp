// components/patient/PatientBottomNav.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");
const IS_LARGE = SCREEN_W >= 900;

/**
 * Mobile primary (5) items:
 * left -> Symptom Checker, Appointments, (center) Home, Diagnostics, Medicines
 *
 * Web (desktop) - show full menu horizontally (you already have a big menu),
 * so we expose the same items plus fallback to everything else if needed.
 */
const MOBILE_ITEMS = [
  { key: "symptom", label: "Symptom", route: "/(main)/patient/symptom-checker", icon: "pulse" },
  { key: "appointments", label: "Appointments", route: "/(main)/patient/appointments", icon: "calendar" },
  { key: "home", label: "Home", route: "/(main)/patient", icon: "home" }, // center elevated
  { key: "diagnostics", label: "Diagnostics", route: "/(main)/patient/lab-reports", icon: "flask" },
  { key: "medicines", label: "Medicines", route: "/(main)/patient/medicines", icon: "medkit" },
];

/**
 * For web, optionally show expanded nav. Keep same basic structure
 * but allow horizontal scroll + arrow buttons handled by parent when needed.
 */
export default function PatientBottomNav() {
  const router = useRouter();
  const segments = useSegments(); // expo-router hook to get current path segments
  const current = useMemo(() => {
    // derive current route key by matching last segment or full route.
    // fallback to 'home' for patient index
    const seg = segments?.[segments.length - 1] ?? "";
    if (seg.includes("symptom")) return "symptom";
    if (seg.includes("appointments")) return "appointments";
    if (seg === "" || seg === "patient" || seg === "index") return "home";
    if (seg.includes("lab") || seg.includes("reports")) return "diagnostics";
    if (seg.includes("medicines")) return "medicines";
    return "home";
  }, [segments]);

  // animated scale values for each item
  const scalesRef = useRef(
    MOBILE_ITEMS.map((_, i) => new Animated.Value(i === getIndexByKey(current) ? 1.14 : 1))
  );

  // keep scales in sync with route changes
  useEffect(() => {
    const toIndex = getIndexByKey(current);
    scalesRef.current.forEach((val, i) => {
      Animated.timing(val, {
        toValue: i === toIndex ? 1.14 : 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  }, [current]);

  function getIndexByKey(key: string) {
    const idx = MOBILE_ITEMS.findIndex((it) => it.key === key);
    return idx >= 0 ? idx : 2; // default to center index (home)
  }

  function handlePress(item: typeof MOBILE_ITEMS[number]) {
    // small tap animation for immediate feedback
    const idx = getIndexByKey(item.key);
    const val = scalesRef.current[idx];
    Animated.sequence([
      Animated.timing(val, { toValue: 1.22, duration: 120, useNativeDriver: true }),
      Animated.timing(val, { toValue: 1.14, duration: 160, useNativeDriver: true }),
    ]).start();

    router.push(item.route);
  }

  // render single item (mobile)
  function renderMobileItem(item: typeof MOBILE_ITEMS[number], index: number) {
    const scale = scalesRef.current[index];
    const isCenter = item.key === "home";
    const wrapperStyle = [
      styles.itemWrap,
      isCenter && styles.centerWrap,
      { transform: [{ scale }] },
    ];

    return (
      <Pressable
        key={item.key}
        onPress={() => handlePress(item)}
        android_ripple={{ color: "rgba(0,0,0,0.06)" }}
        style={({ pressed }) => [
          styles.itemPress,
          pressed && { opacity: 0.85 },
        ]}
      >
        <Animated.View style={wrapperStyle}>
          {/* center home elevated button */}
          {isCenter ? (
            <View style={styles.centerButtonOuter}>
              <View style={styles.centerButtonInner}>
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </View>
            </View>
          ) : (
            <View style={styles.iconStack}>
              <View style={styles.iconBg}>
                <Ionicons name={item.icon as any} size={22} color="#166534" />
              </View>
              <Text style={styles.itemLabel}>{item.label}</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    );
  }

  // Web variant: horizontally scrollable list with labels and active state
  function renderWebNav() {
    return (
      <View style={styles.webContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.webScroll}>
          {MOBILE_ITEMS.map((it, i) => {
            const isActive = getIndexByKey(current) === i;
            return (
              <Pressable
                key={it.key}
                onPress={() => router.push(it.route)}
                style={({ pressed }) => [
                  styles.webItem,
                  isActive && styles.webItemActive,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={[styles.webIconWrap, isActive && styles.webIconWrapActive]}>
                  <Ionicons name={it.icon as any} size={20} color={isActive ? "#fff" : "#064e3b"} />
                </View>
                <Text style={[styles.webLabel, isActive ? { color: "#064e3b", fontWeight: "800" } : undefined]}>
                  {it.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // show full web nav on large screens, compact floating on mobile
  if (Platform.OS === "web" || IS_LARGE) {
    return <View style={styles.wrapperWeb}>{renderWebNav()}</View>;
  }

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View style={styles.shadowSpacer} />
      <View style={styles.container}>
        <View style={styles.row}>
          {MOBILE_ITEMS.map((it, idx) => renderMobileItem(it, idx))}
        </View>
      </View>
    </View>
  );
}

/* ------------------------------- STYLES ------------------------------- */

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: "center",
    zIndex: 60,
    // allow taps to pass through outside of area
  },
  shadowSpacer: {
    height: 8,
  },
  container: {
    width: "94%",
    borderRadius: 20,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    height: 72,
    width: "100%",
    borderRadius: 18,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  // mobile item
  itemPress: {
    flex: 1,
    alignItems: "center",
  },
  itemWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBg: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "rgba(228,255,235,0.95)", // soft white-green tint
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  iconStack: {
    alignItems: "center",
  },
  itemLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "700",
    color: "#064e3b",
    textAlign: "center",
  },

  // center home
  centerWrap: {
    marginTop: -22,
  },
  centerButtonOuter: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "rgba(22,163,74,0.12)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  centerButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  // web styles
  wrapperWeb: {
    position: "relative",
    width: "100%",
    backgroundColor: "transparent",
    paddingVertical: 8,
  },
  webContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  webScroll: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  webItem: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  webItemActive: {
    transform: [{ translateY: -4 }],
  },
  webIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "rgba(240, 255, 250, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  webIconWrapActive: {
    backgroundColor: "#16A34A",
  },
  webLabel: {
    fontSize: 12,
    color: "#064e3b",
    fontWeight: "600",
  },
});
