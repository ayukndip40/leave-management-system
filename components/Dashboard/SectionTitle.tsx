import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  primary: "#2563EB",
};

interface Props {
  title: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
}

export default function SectionTitle({
  title,
  onSeeAll,
  seeAllLabel = "See all",
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>

      {onSeeAll ? (
        <TouchableOpacity onPress={onSeeAll} hitSlop={8}>
          <Text style={styles.seeAll}>{seeAllLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },

  title: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.3,
  },

  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
});