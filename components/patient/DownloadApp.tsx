// components/patient/DownloadApp.tsx
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DownloadApp() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Download The App</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn}>
          <Image source={require("@/assets/images/getitonandroid.png")} style={styles.img} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Image source={require("@/assets/images/getitonapple.png")} style={styles.img} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24, alignItems: "center", paddingVertical: 18 },
  title: { fontSize: 14, fontWeight: "800", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12, justifyContent: "center" },
  btn: { backgroundColor: "transparent", paddingHorizontal: 6, paddingVertical: 6, borderRadius: 8 },
  img: { width: 140, height: 44, resizeMode: "contain" },
});
