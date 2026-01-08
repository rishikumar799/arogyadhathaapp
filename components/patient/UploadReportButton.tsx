import { uploadMedicalReport } from "@/lib/uploadMedicalReport";
import { validateMedicalFile } from "@/lib/validateMedicalFile";
import React from "react";
import { Alert, Platform, Pressable, StyleSheet, Text } from "react-native";
let DocumentPicker: any = null;

if (Platform.OS !== "web") {
  DocumentPicker = require("expo-document-picker");
}

export default function UploadReportButton({
  uid,
  organKey,
}: {
  uid: string;
  organKey: string;
}) {
  const handleUpload = async () => {
    try {
      // 🌐 WEB UPLOAD
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/pdf,image/*";

        input.onchange = async () => {
          if (!input.files || !input.files[0]) return;
          const file = input.files[0];

          // ✅ VALIDATION
          const validation = validateMedicalFile(file);
          if (!validation.valid) {
            alert(validation.message);
            return;
          }

          await uploadMedicalReport({ uid, organKey, file });
          alert("Report uploaded successfully. Awaiting review.");
        };

        input.click();
        return;
      }

      // 📱 MOBILE UPLOAD
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const file = await fetch(asset.uri).then((r) => r.blob());

      // ✅ VALIDATION
      const validation = validateMedicalFile(file);
      if (!validation.valid) {
        Alert.alert("Invalid File", validation.message);
        return;
      }

      await uploadMedicalReport({ uid, organKey, file });
      Alert.alert("Success", "Report uploaded successfully. Awaiting review.");
    } catch (err) {
      console.error("Upload failed", err);
      Alert.alert("Upload Failed", "Something went wrong. Please try again.");
    }
  };

  return (
    <Pressable style={styles.btn} onPress={handleUpload}>
      <Text style={styles.text}>Upload Medical Report</Text>
      <Text style={styles.sub}>PDF / Image • Doctor or Lab report</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
  },
  text: {
    fontWeight: "800",
    textAlign: "center",
    color: "#0F172A",
  },
  sub: {
    marginTop: 4,
    fontSize: 11,
    textAlign: "center",
    color: "#64748B",
  },
});
