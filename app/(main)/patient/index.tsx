import React, { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

import CarouselBanners from "@/components/patient/CarouselBanners";
import DownloadApp from "@/components/patient/DownloadApp";
import MedicineAssistance from "@/components/patient/MedicineAssistance";
import OrganHealth from "@/components/patient/OrganHealth";
import PatientHeader from "@/components/patient/PatientHeader";
import QuickAccess from "@/components/patient/QuickAccess";
import ScoreGuide from "@/components/patient/ScoreGuide";
import SearchSheet from "@/components/patient/SearchSheet";

// 🔔 NEW: Announcement Popup
import AnnouncementPopup from "@/components/common/AnnouncementPopup";

// 🔥 MODAL
import OrganHealthModal from "@/components/patient/OrganModal";

import { QUICK_ACCESS_ITEMS } from "@/components/patient/QuickAccessItems";
import { loadSession } from "@/lib/authPersist";
import { getOrganHealth } from "@/lib/useOrganHealth";
import { loadWebSession } from "@/lib/webPersist";

import brainImg from "@/assets/images/brain.png";
import heartImg from "@/assets/images/heart.png";
import kidneysImg from "@/assets/images/kidneys.png";
import liverImg from "@/assets/images/liver.png";
import lungsImg from "@/assets/images/lungs.png";
import stomachImg from "@/assets/images/stomach.png";

/* -------------------- STATIC UI DATA -------------------- */

const CARDS = [
  {
    title: "Link your NTR Vaidyaseva & ABHA ID",
    subtitle: "Store all health records in one secure place.",
    cta: "Link Now",
    gradient: ["#7C3AED", "#06B6D4"],
  },
  {
    title: "Health Tip of the Day",
    subtitle: "Drink 8–10 glasses of water daily. Small habits, big impact.",
    cta: "Read Tip",
    gradient: ["#06B6D4", "#34D399"],
  },
  {
    title: "Seasonal Advisory",
    subtitle: "Allergy season ahead. Get preventive medication.",
    cta: "Learn More",
    gradient: ["#F97316", "#FB7185"],
  },
];

const BASE_ORG = [
  { key: "heart", name: "Heart", image: heartImg, color: "#F59E0B", bg: "rgba(255,182,193,0.4)" },
  { key: "liver", name: "Liver", image: liverImg, color: "#EF4444", bg: "rgba(255,210,150,0.4)" },
  { key: "kidneys", name: "Kidneys", image: kidneysImg, color: "#22C55E", bg: "rgba(180,255,200,0.4)" },
  { key: "lungs", name: "Lungs", image: lungsImg, color: "#22C55E", bg: "rgba(185,225,255,0.4)" },
  { key: "brain", name: "Brain", image: brainImg, color: "#16A34A", bg: "rgba(220,210,255,0.45)" },
  { key: "stomach", name: "Stomach", image: stomachImg, color: "#16A34A", bg: "rgba(255,200,200,0.4)" },
];

/* -------------------- SCREEN -------------------- */

export default function PatientDashboard() {
  const scrollRef = useRef<ScrollView | null>(null);

  const [searchVisible, setSearchVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(true);

  const [organBackend, setOrganBackend] = useState<Record<string, any>>({});
  const [selectedOrgan, setSelectedOrgan] = useState<any | null>(null);

  /* -------------------- LOAD SESSION + ORG DATA -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const session =
          Platform.OS === "web"
            ? loadWebSession()
            : await loadSession();

        if (!session?.uid) return;

        setUid(session.uid);

        const resolvedName =
          session?.name ||
          session?.displayName ||
          session?.fullName ||
          "";

        setUserName(resolvedName);

        const organData = await getOrganHealth(session.uid);
        setOrganBackend(organData);
      } catch (err) {
        console.error("Dashboard init failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -------------------- MERGE UI + BACKEND -------------------- */
  const ORG = BASE_ORG.map((org) => {
    const backend = organBackend[org.key];

    return {
      ...org,
      value: backend?.score ?? null,
      status: backend?.status ?? "Awaiting diagnostics",
      raw: backend ?? null,
    };
  });

  return (
    <View style={styles.page}>
      <ScrollView
        ref={(r) => (scrollRef.current = r)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <PatientHeader name={userName} loading={loading} />

        <QuickAccess items={QUICK_ACCESS_ITEMS} />
        <CarouselBanners banners={CARDS} />

        <OrganHealth
          items={ORG}
          onSelect={(org) => setSelectedOrgan(org)}
        />

        <ScoreGuide />
        <MedicineAssistance />
        <DownloadApp />
      </ScrollView>

      {/* 🔍 SEARCH */}
      <SearchSheet
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />

      {/* 🔔 ANNOUNCEMENT POPUP (GLOBAL, ONCE PER DAY) */}
      {uid && (
        <AnnouncementPopup
          uid={uid}
          role="patient"
        />
      )}

      {/* 🧠 ORGAN HEALTH MODAL */}
      {selectedOrgan && (
        <OrganHealthModal
          visible={!!selectedOrgan}
          organ={selectedOrgan}
          uid={uid}
          onClose={() => setSelectedOrgan(null)}
        />
      )}
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});
