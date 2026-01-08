import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");
const IS_WEB = SCREEN_W >= 900;

type Org = {
  key: string;
  name: string;
  value: number | null;
  status: string;
  image: any;
  bg: string;
  color: string;
};

type Props = {
  items: Org[];
  onSelect: (org: Org) => void;
};

function OrganCard({ org, onPress }: { org: Org; onPress: () => void }) {
  const hasData = typeof org.value === "number";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.ringBase}>
        {hasData && (
          <View style={[styles.ringActive, { borderColor: org.color }]} />
        )}

        <View
          style={[
            styles.blob,
            { backgroundColor: hasData ? org.bg : "#F1F5F9" },
          ]}
        >
          <Image source={org.image} style={styles.img} />
        </View>
      </View>

      <Text style={styles.name}>{org.name}</Text>

      <Text style={styles.value}>
        {hasData ? `${org.value}%` : "--"}
      </Text>

      <View
        style={[
          styles.statusPill,
          {
            backgroundColor: hasData ? `${org.color}18` : "#E5E7EB",
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
    </TouchableOpacity>
  );
}

export default function OrganHealth({ items, onSelect }: Props) {
  return (
    <View>
      {!IS_WEB && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((org) => (
            <OrganCard
              key={org.key}
              org={org}
              onPress={() => onSelect(org)}
            />
          ))}
        </ScrollView>
      )}

      {IS_WEB && (
        <View style={styles.grid}>
          {items.map((org) => (
            <OrganCard
              key={org.key}
              org={org}
              onPress={() => onSelect(org)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    borderRadius: 18,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    marginRight: 12,
    elevation: 5,
  },
  grid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 22,
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
  img: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
  },
  value: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
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
