import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SCREEN_W = Dimensions.get("window").width;
const CARD_WIDTH = Math.min(760, SCREEN_W - 64);

export const HealthCarousel = ({ CARDS }: { CARDS: any[] }) => {
  
  const carouselRef = useRef<ScrollView>(null);
  const [activeCard, setActiveCard] = useState(0);

  /* AUTOPLAY every 4 sec */
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeCard + 1) % CARDS.length;
      setActiveCard(next);
      carouselRef.current?.scrollTo({
        x: next * (CARD_WIDTH + 16),
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeCard]);

  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (CARD_WIDTH + 16));
    setActiveCard(idx);
  };

  return (
    <View style={{ marginTop: 14 }}>
      
      {/* SCROLL CARDS */}
      <ScrollView
        ref={carouselRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingLeft: 24 }}
      >
        {CARDS.map((card, i) => (
          <LinearGradient
            key={i}
            colors={card.gradient}
            style={styles.carouselCard}
          >
            <Text style={styles.carouselTitle}>{card.title}</Text>
            <Text style={styles.carouselSub}>{card.subtitle}</Text>

            <TouchableOpacity style={styles.carouselBtn}>
              <Text style={styles.carouselBtnText}>{card.cta}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* DOTS */}
      <View style={styles.dotsRow}>
        {CARDS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, activeCard === i && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

/* ----------------- STYLES ----------------- */
const styles = StyleSheet.create({
  carouselCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 16,
    padding: 18,
    minHeight: 120,
    justifyContent: "space-between",
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  carouselSub: {
    color: "rgba(255,255,255,0.92)",
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  carouselBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  carouselBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(15,23,42,0.12)",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
  },
});
