import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name={icon} size={16} color={COLORS.primary} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "31%",
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },

  value: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.ink,
    marginTop: 4,
  },

  title: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 1,
  },
});