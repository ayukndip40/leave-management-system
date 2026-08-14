import { router } from "expo-router";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../../../components/Layout/Screen";
import PageHeader from "../../../../components/Layout/PageHeader";
import SectionTitle from "../../../../components/Dashboard/SectionTitle";
import AppButton from "../../../../components/Button/AppButton";

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
};

export default function AdminLeaveScreen() {
  return (
    <Screen>
      <PageHeader />

      <SectionTitle title="Leave Management" />

      <View style={{ gap: 12, marginTop: 20 }}>
        <ActionCard
          icon="tag-outline"
          title="Leave Types"
          subtitle="Define and edit categories of leave"
          onPress={() => router.push("/(protected)/admin/leave-types")}
        />

        <ActionCard
          icon="calendar-star"
          title="Public Holidays"
          subtitle="Manage the company holiday calendar"
          onPress={() => router.push("/(protected)/admin/public-holidays")}
        />
      </View>
    </Screen>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: COLORS.primarySoft,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name={icon} size={24} color={COLORS.primary} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.ink, marginBottom: 2 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 13, color: COLORS.muted, lineHeight: 18 }}>
          {subtitle}
        </Text>
      </View>

      <AppButton title="Open" onPress={onPress} style={{ minWidth: 72 }} />
    </View>
  );
}