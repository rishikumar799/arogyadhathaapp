import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

/* ================= CONSTANTS ================= */

const { width, height } = Dimensions.get("window");

const BAR_WIDTH = width * 0.92;
const BAR_HEIGHT = 76;

const FAB_SIZE = 70;
const FAB_RADIUS = FAB_SIZE / 2;

const SHEET_HEIGHT = height * 0.48;

const DOT_SIZE = 6;
const DOT_TOP = 6;

/* ================= COLORS ================= */

const COLORS = {
  bgStart: "#021B14",
  bgEnd: "#064E3B",
  glass: "rgba(236,253,243,0.12)",
  glassBorder: "rgba(167,243,208,0.35)",
  text: "#ECFDF5",
  muted: "#A7F3D0",
  brand: "#16A34A",
  inactive: "#6B7280",
  white: "#FFFFFF",
};

/* ================= NAV DATA ================= */

/**
 * MOST FREQUENT ACTIONS
 * (Always visible on bottom bar)
 */
const MAIN_TABS = [
  { icon: "grid-outline", label: "Home", route: "/receptionist", exact: true },
  { icon: "people-outline", label: "Patients", route: "/receptionist/patients" },
  { icon: "calendar-outline", label: "Appts", route: "/receptionist/appointments" },
  { icon: "checkmark-done-outline", label: "Check-In", route: "/receptionist/check-in" },
];

/**
 * SECONDARY / OCCASIONAL ACTIONS
 * (Accessible via FAB)
 */
const MORE_MENU = [
  
  {
    icon: "medkit-outline",
    label: "Doctors & Schedules",
    route: "/receptionist/schedules",
  },
  {
    icon: "document-text-outline",
    label: "Billing",
    route: "/receptionist/billing",
  },
  {
    icon: "person-outline",
    label: "Profile",
    route: "/receptionist/profile",
  },
  {
    icon: "settings-outline",
    label: "Settings",
    route: "/receptionist/settings",
  },
];

/* ================= MAIN ================= */

export default function ReceptionistBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [tabLayouts, setTabLayouts] = useState<number[]>([]);

  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const sheetScale = useRef(new Animated.Value(0.96)).current;
  const dotX = useRef(new Animated.Value(0)).current;
  const fabRotate = useRef(new Animated.Value(0)).current;

  const isActive = (route: string, exact?: boolean) =>
    exact
      ? pathname === route
      : pathname === route || pathname.startsWith(route + "/");

  const activeIndex = MAIN_TABS.findIndex(tab =>
    isActive(tab.route, tab.exact)
  );

  /* ================= DOT INDICATOR ================= */

  useEffect(() => {
    if (activeIndex < 0 || !tabLayouts[activeIndex]) return;

    Animated.spring(dotX, {
      toValue: tabLayouts[activeIndex] - DOT_SIZE / 2,
      damping: 20,
      stiffness: 180,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, tabLayouts]);

  /* ================= FAB ================= */

  const rotate = fabRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const openMenu = () => {
    setVisible(true);
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.spring(sheetScale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(fabRotate, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const closeMenuInstant = () => {
    setVisible(false);
    translateY.setValue(SHEET_HEIGHT);
    sheetScale.setValue(0.96);
    fabRotate.setValue(0);
  };

  return (
    <>
      {/* ================= MORE SHEET ================= */}
      <Modal transparent visible={visible} animationType="none">
        <Pressable style={styles.backdrop} onPress={closeMenuInstant} />

        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY }, { scale: sheetScale }] },
          ]}
        >
          <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={styles.sheetInner}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>More</Text>
              <TouchableOpacity onPress={closeMenuInstant}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {MORE_MENU.map(item => {
              const active = isActive(item.route);

              return (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.sheetItem, active && styles.sheetItemActive]}
                  onPress={() => {
                    closeMenuInstant();
                    router.replace(item.route);
                  }}
                >
                  <View style={styles.sheetIcon}>
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={active ? COLORS.brand : COLORS.muted}
                    />
                  </View>
                  <Text style={[styles.sheetText, active && { color: COLORS.text }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </LinearGradient>
        </Animated.View>
      </Modal>

      {/* ================= BOTTOM BAR ================= */}
      <View style={styles.wrapper}>
        <View style={styles.bar}>
          <Svg width={BAR_WIDTH} height={BAR_HEIGHT}>
            <Path d={getPath()} fill={COLORS.white} />
          </Svg>

          <Animated.View
            pointerEvents="none"
            style={[styles.dot, { transform: [{ translateX: dotX }] }]}
          />

          <View style={styles.row}>
            {MAIN_TABS.slice(0, 2).map((t, i) => renderTab(t, i))}
            <View style={{ width: FAB_SIZE }} />
            {MAIN_TABS.slice(2).map((t, i) => renderTab(t, i + 2))}
          </View>
        </View>

        {/* ================= FAB ================= */}
        <Animated.View style={[styles.fabWrap, { transform: [{ rotate }] }]}>
          <Svg width={FAB_SIZE + 16} height={FAB_SIZE + 16}>
            <Circle
              cx={(FAB_SIZE + 16) / 2}
              cy={(FAB_SIZE + 16) / 2}
              r={FAB_RADIUS + 6}
              fill="rgba(22,163,74,0.18)"
            />
          </Svg>

          <Pressable onPress={openMenu} style={styles.fab}>
            <Ionicons name="add" size={34} color="#fff" />
          </Pressable>
        </Animated.View>
      </View>
    </>
  );

  function renderTab(tab: any, index: number) {
    const active = isActive(tab.route, tab.exact);

    return (
      <TouchableOpacity
        key={tab.route}
        style={styles.tab}
        onLayout={e => {
          const x = e.nativeEvent.layout.x + e.nativeEvent.layout.width / 2;
          setTabLayouts(prev => {
            const copy = [...prev];
            copy[index] = x;
            return copy;
          });
        }}
        onPress={() => router.replace(tab.route)}
      >
        <Ionicons
          name={tab.icon}
          size={22}
          color={active ? COLORS.brand : COLORS.inactive}
        />
        <Text style={[styles.tabText, { color: active ? COLORS.brand : COLORS.inactive }]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  }
}

/* ================= SVG ================= */

function getPath() {
  const r = BAR_HEIGHT / 2;
  const c = BAR_WIDTH / 2;

  return `
    M${r} 0
    H${c - 75}
    C${c - 40} 0 ${c - 40} 52 ${c} 52
    C${c + 40} 52 ${c + 40} 0 ${c + 75} 0
    H${BAR_WIDTH - r}
    A${r} ${r} 0 0 1 ${BAR_WIDTH} ${r}
    V${BAR_HEIGHT - r}
    A${r} ${r} 0 0 1 ${BAR_WIDTH - r} ${BAR_HEIGHT}
    H${r}
    A${r} ${r} 0 0 1 0 ${BAR_HEIGHT - r}
    V${r}
    A${r} ${r} 0 0 1 ${r} 0
    Z
  `;
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 18,
    width: "100%",
    alignItems: "center",
  },
  bar: { width: BAR_WIDTH, height: BAR_HEIGHT },
  row: {
    position: "absolute",
    width: "100%",
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  tab: { width: 70, alignItems: "center" },
  tabText: { fontSize: 11, fontWeight: "600", marginTop: 2 },
  dot: {
    position: "absolute",
    top: DOT_TOP,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: COLORS.brand,
  },
  fabWrap: {
    position: "absolute",
    top: -FAB_RADIUS + 6,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_RADIUS,
    backgroundColor: COLORS.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SHEET_HEIGHT,
  },
  sheetInner: { flex: 1, padding: 16 },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginBottom: 6,
  },
  sheetItemActive: {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  sheetIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(240,253,244,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetText: { fontSize: 15, fontWeight: "600", color: COLORS.muted },
});
