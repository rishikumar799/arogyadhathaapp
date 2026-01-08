import { loadWebSession } from "@/lib/webPersist";
import { Redirect, Stack, useSegments } from "expo-router";
import { Platform } from "react-native";

export default function MainLayout() {
  const segments = useSegments();

  if (Platform.OS === "web") {
  const session = loadWebSession();

  if (!session?.uid || !session?.role) {
    return null; // ⛔ stop rendering, DO NOT redirect
  }

  const role = session.role.toLowerCase();
  const routeRole = segments[1];

  if (routeRole && routeRole !== role) {
    return <Redirect href={`/(main)/${role}`} />;
  }
}


  return <Stack screenOptions={{ headerShown: false }} />;
}
