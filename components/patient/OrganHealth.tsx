// components/patient/OrganHealth.tsx
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");
const IS_LAPTOP = SCREEN_W >= 900;

type Org = {
  name: string;
  value: number | null;
  status: string;
  image: any;
  bg: string;
  color: string;
};

export default function OrganHealth({ items }: { items: Org[] }) {
  return (
    <View>
      {!IS_LAPTOP && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
        >
          {items.map((org) => {
            const hasData = typeof org.value === "number";

            return (
              <View key={org.name} style={styles.mobileCard}>
                {/* GREY BASE RING */}
                <View style={styles.ringBase}>
                  {/* ACTIVE COLORED RING (ONLY IF DATA EXISTS) */}
                  {hasData && (
                    <View
                      style={[
                        styles.ringActive,
                        { borderColor: org.color },
                      ]}
                    />
                  )}

                  {/* INNER BLOB */}
                  <View
                    style={[
                      styles.blob,
                      { backgroundColor: hasData ? org.bg : "#F1F5F9" },
                    ]}
                  >
                    <Image source={org.image} style={styles.imgMobile} />
                  </View>
                </View>

                {/* NAME */}
                <Text style={styles.name}>{org.name}</Text>

                {/* VALUE */}
                <Text style={styles.value}>
                  {hasData ? `${org.value}%` : "--"}
                </Text>

                {/* STATUS */}
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: hasData
                        ? `${org.color}18`
                        : "#E5E7EB",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: hasData ? org.color : "#64748B" },
                    ]}
                  >
                    {hasData ? org.status : "Awaiting diagnostics"}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mobileCard: {
    width: 140,
    borderRadius: 18,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    marginRight: 12,
    elevation: 5,
  },

  ringBase: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  ringActive: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
  },

  blob: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  imgMobile: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },

  value: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  statusPill: {
    marginTop: 8,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
