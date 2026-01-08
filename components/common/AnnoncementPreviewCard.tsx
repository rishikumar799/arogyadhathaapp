import { ThemedText } from "@/components/themed-text";
import { Image, StyleSheet, View } from "react-native";

export default function AnnouncementPreviewCard({ message, image, start, end, role }) {
  return (
    <View style={styles.card}>
      {image && <Image source={{ uri: image }} style={styles.img} />}
      
      <ThemedText style={styles.title}>Announcement</ThemedText>
      <ThemedText style={styles.msg}>{message}</ThemedText>

      <ThemedText style={styles.meta}>
        {start.toLocaleString()} → {end.toLocaleString()}
      </ThemedText>

      <ThemedText style={styles.role}>
        Visible to: {role.toUpperCase()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:"#fff",
    borderRadius:18,
    padding:16,
  },
  img:{
    height:120,
    borderRadius:14,
    marginBottom:10,
  },
  title:{ fontWeight:"800", fontSize:16 },
  msg:{ marginVertical:6 },
  meta:{ fontSize:12, color:"#64748B" },
  role:{ marginTop:6, fontWeight:"600" },
});
