import LocationChangePrompt from "@/components/common/LocationChangePrompt";
import { LocationProvider } from "@/contexts/LocationContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>

      {/* 🔔 Global location-change confirmation */}
      <LocationChangePrompt />
    </LocationProvider>
  );
}
