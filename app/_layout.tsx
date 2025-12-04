import { Redirect, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      {/* Redirect browser root to splash */}
      <Redirect href="/splash" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </>
  );
}
