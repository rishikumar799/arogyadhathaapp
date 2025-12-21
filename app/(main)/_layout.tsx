import { Stack } from 'expo-router';
import React from 'react';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,  // hide all headers in main group
      }}
    >
      {/* Patient / doctor / admin screens render here */}
    </Stack>
  );
}
