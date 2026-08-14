import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Button from "../../../../components/Button/AppButton";

const COLORS = {
  bg: "#F4F7FC",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
};

export default function HrHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={26}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.title}>HR Dashboard</Text>
            <Text style={styles.subtitle}>
              Welcome to the Human Resources Portal
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Quick actions</Text>

        <View style={styles.section}>
          <ActionCard
            icon="calendar-check-outline"
            title="Manage Leave Requests"
            subtitle="Review, approve, and track team leave"
            onPress={() => router.push("/hr/leave")}
          />

          <ActionCard
            icon="account-group-outline"
            title="Manage Employees"
            subtitle="View and edit employee records"
            onPress={() => router.push("/hr/employees")}
          />
        </View>
      </View>
    </SafeAreaView>
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
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <MaterialCommunityIcons name={icon} size={24} color={COLORS.primary} />
      </View>

      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>

      <Button title="Open" onPress={onPress} style={styles.cardButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  hero: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 24,
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  heroText: {
    flex: 1,
    paddingTop: 2,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.3,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
  },

  section: {
    gap: 12,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  cardText: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 2,
  },

  cardSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 18,
  },

  cardButton: {
    minWidth: 72,
  },
});