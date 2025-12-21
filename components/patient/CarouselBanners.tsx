// components/patient/CarouselBanners.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");
const CAROUSEL_W = Math.min(760, SCREEN_W - 64);

type Banner = { title: string; subtitle: string; cta: string; gradient: string[] };

export default function CarouselBanners({ banners }: { banners: Banner[] }) {
  const ref = useRef<ScrollView | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const next = (active + 1) % banners.length;
      setActive(next);
      ref.current?.scrollTo({ x: next * (CAROUSEL_W + 16), animated: true });
    }, 4000);
    return () => clearInterval(id);
  }, [active, banners.length]);

  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (CAROUSEL_W + 16));
    setActive(idx);
  };

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
        ref={(r) => (ref.current = r)}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {banners.map((b, i) => (
          <LinearGradient key={i} colors={b.gradient} style={styles.card}>
            <Text style={styles.title}>{b.title}</Text>
            <Text style={styles.sub}>{b.subtitle}</Text>
            <TouchableOpacity style={styles.cta}><Text style={styles.ctaText}>{b.cta}</Text></TouchableOpacity>
          </LinearGradient>
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {banners.map((_, i) => (
          <View key={i} style={[styles.dot, active === i && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 14 },
  card: { width: CAROUSEL_W, marginRight: 16, borderRadius: 16, padding: 18, minHeight: 120, justifyContent: "space-between" },
  title: { color: "#fff", fontSize: 18, fontWeight: "800" },
  sub: { color: "rgba(255,255,255,0.92)", marginTop: 6, fontSize: 13, lineHeight: 18 },
  cta: { marginTop: 12, alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  ctaText: { color: "#fff", fontWeight: "700" },
  dotsRow: { flexDirection: "row", justifyContent: "center", marginTop: 8, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(15,23,42,0.12)", marginHorizontal: 4 },
  dotActive: { backgroundColor: "#fff", width: 10, height: 10 },
});
