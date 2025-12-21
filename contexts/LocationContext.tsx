import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

export type LocationState = {
  state?: string | null;
  district?: string | null;
  city?: string | null;
  locality?: string | null;
};

type LocationContextType = {
  location: LocationState;
  detectedLocation: LocationState | null;
  loading: boolean;
  setManualLocation: (loc: LocationState) => void;
  acceptDetectedLocation: () => void;
  rejectDetectedLocation: () => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

const STORAGE_KEY = "@app_location";
const SOURCE_KEY = "@app_location_source";
const LAST_PROMPT_CITY_KEY = "@last_prompt_city"; // ✅ IMPORTANT

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationState>({});
  const [detectedLocation, setDetectedLocation] =
    useState<LocationState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedRaw = await AsyncStorage.getItem(STORAGE_KEY);
        const lastPromptCity = await AsyncStorage.getItem(LAST_PROMPT_CITY_KEY);

        const savedLocation: LocationState | null = savedRaw
          ? JSON.parse(savedRaw)
          : null;

        if (savedLocation) {
          setLocation(savedLocation);
        }

        if (Platform.OS !== "web") {
          const { status } =
            await Location.requestForegroundPermissionsAsync();

          if (status === "granted") {
            const pos = await Location.getCurrentPositionAsync({});
            const geo = await Location.reverseGeocodeAsync(pos.coords);

            if (geo[0]) {
              const detected: LocationState = {
                city: geo[0].city || geo[0].subregion || null,
                district: geo[0].district || geo[0].region || null,
                state: geo[0].region || null,
                locality:
                  geo[0].neighborhood ||
                  geo[0].subLocality ||
                  geo[0].street ||
                  null,
              };

              // FIRST INSTALL → auto save
              if (!savedLocation) {
                setLocation(detected);
                await AsyncStorage.multiSet([
                  [STORAGE_KEY, JSON.stringify(detected)],
                  [SOURCE_KEY, "auto"],
                ]);
              }

              // LOCATION CHANGED → ask ONLY ONCE per city
              if (
                savedLocation?.city &&
                savedLocation.city !== detected.city &&
                lastPromptCity !== detected.city
              ) {
                setDetectedLocation(detected);
                await AsyncStorage.setItem(
                  LAST_PROMPT_CITY_KEY,
                  detected.city ?? ""
                );
              }
            }
          }
        }
      } catch {
        // silent fail – never block UI
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= ACTIONS ================= */

  const setManualLocation = async (loc: LocationState) => {
    setLocation(loc);
    setDetectedLocation(null);

    await AsyncStorage.multiSet([
      [STORAGE_KEY, JSON.stringify(loc)],
      [SOURCE_KEY, "manual"],
      [LAST_PROMPT_CITY_KEY, ""], // reset prompt memory
    ]);
  };

  const acceptDetectedLocation = async () => {
    if (!detectedLocation) return;

    setLocation(detectedLocation);
    setDetectedLocation(null);

    await AsyncStorage.multiSet([
      [STORAGE_KEY, JSON.stringify(detectedLocation)],
      [SOURCE_KEY, "auto"],
      [LAST_PROMPT_CITY_KEY, ""], // reset prompt memory
    ]);
  };

  const rejectDetectedLocation = () => {
    setDetectedLocation(null);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        detectedLocation,
        loading,
        setManualLocation,
        acceptDetectedLocation,
        rejectDetectedLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used inside LocationProvider");
  }
  return ctx;
}
