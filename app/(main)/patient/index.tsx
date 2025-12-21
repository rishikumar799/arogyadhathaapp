// app/(main)/patient/index.tsx
import useAuth from "@/hooks/useAuth";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import CarouselBanners from "@/components/patient/CarouselBanners";
import DownloadApp from "@/components/patient/DownloadApp";
import MedicineAssistance from "@/components/patient/MedicineAssistance";
import OrganHealth from "@/components/patient/OrganHealth";
import PatientHeader from "@/components/patient/PatientHeader";
import QuickAccess from "@/components/patient/QuickAccess";
import ScoreGuide from "@/components/patient/ScoreGuide";
import SearchSheet from "@/components/patient/SearchSheet";

import { QUICK_ACCESS_ITEMS } from "@/components/patient/QuickAccessItems";

import brainImg from "@/assets/images/brain.png";
import heartImg from "@/assets/images/heart.png";
import kidneysImg from "@/assets/images/kidneys.png";
import liverImg from "@/assets/images/liver.png";
import lungsImg from "@/assets/images/lungs.png";
import stomachImg from "@/assets/images/stomach.png";

const CARDS = [
  { title: "Link your NTR Vaidyaseva & ABHA ID", subtitle: "Store all health records in one secure place.", cta: "Link Now", gradient: ["#7C3AED", "#06B6D4"] },
  { title: "Health Tip of the Day", subtitle: "Drink 8–10 glasses of water daily. Small habits, big impact.", cta: "Read Tip", gradient: ["#06B6D4", "#34D399"] },
  { title: "Seasonal Advisory", subtitle: "Allergy season ahead. Get preventive medication.", cta: "Learn More", gradient: ["#F97316", "#FB7185"] },
];

const ORG = [
  { name: "Heart", value: 85, status: "Needs Monitoring", image: heartImg, bg: "rgba(255,182,193,0.4)", color: "#F59E0B" },
  { name: "Liver", value: 70, status: "Critical Attention", image: liverImg, bg: "rgba(255,210,150,0.4)", color: "#EF4444" },
  { name: "Kidneys", value: 90, status: "Good", image: kidneysImg, bg: "rgba(180,255,200,0.4)", color: "#22C55E" },
  { name: "Lungs", value: 92, status: "Good", image: lungsImg, bg: "rgba(185,225,255,0.4)", color: "#22C55E" },
  { name: "Brain", value: 98, status: "Healthy", image: brainImg, bg: "rgba(220,210,255,0.45)", color: "#16A34A" },
  { name: "Stomach", value: 93, status: "Healthy", image: stomachImg, bg: "rgba(255,200,200,0.4)", color: "#16A34A" },
];

export default function PatientDashboard() {
  const scrollRef = useRef<ScrollView | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);

  // 🔑 AUTH LIVES HERE
  const { user, initializing } = useAuth();

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <View style={styles.page}>
      <ScrollView
        ref={(r) => (scrollRef.current = r)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* ✅ PASS NAME AS PROP */}
        <PatientHeader name={userName} loading={initializing} />

        <QuickAccess items={QUICK_ACCESS_ITEMS} />
        <CarouselBanners banners={CARDS} />
        <OrganHealth items={ORG} />
        <ScoreGuide />
        <MedicineAssistance />
        <DownloadApp />
      </ScrollView>

      <SearchSheet visible={searchVisible} onClose={() => setSearchVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F8FAFC" },
});
