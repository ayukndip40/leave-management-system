import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primarySoft: "rgba(37, 99, 235, 0.1)",
  successBg: "#F0FDF4",
  successText: "#16A34A",
  dangerBg: "#FEF2F2",
  dangerText: "#DC2626",
  neutralBg: "#F1F5F9",
  neutralText: "#64748B",
};

interface LeaveTypeCardProps {
  leaveName: string;
  description?: string;
  maximumDays: number;
  paidLeave: boolean;
  requiresDocument: boolean;
  color: string;
  status: string;
  onPress: () => void;
}

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "active") {
    return { bg: COLORS.successBg, text: COLORS.successText };
  }
  if (normalized === "inactive") {
    return { bg: COLORS.dangerBg, text: COLORS.dangerText };
  }
  return { bg: COLORS.neutralBg, text: COLORS.neutralText };
}

export default function LeaveTypeCard({
  leaveName,
  description,
  maximumDays,
  paidLeave,
  requiresDocument,
  color,
  status,
  onPress,
}: LeaveTypeCardProps) {
  const statusStyle = getStatusStyle(status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: `${color}20` }]}>
          <MaterialCommunityIcons
            name="calendar-account"
            size={22}
            color={color}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>{leaveName}</Text>
          {description ? (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>

        <View
          style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name="calendar-range"
            size={14}
            color={COLORS.muted}
          />
          <Text style={styles.metaText}>{maximumDays} days max</Text>
        </View>

        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name={paidLeave ? "cash-check" : "cash-remove"}
            size={14}
            color={COLORS.muted}
          />
          <Text style={styles.metaText}>
            {paidLeave ? "Paid" : "Unpaid"}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name={requiresDocument ? "file-check-outline" : "file-remove-outline"}
            size={14}
            color={COLORS.muted}
          />
          <Text style={styles.metaText}>
            {requiresDocument ? "Doc required" : "No doc"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 2,
  },

  description: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 18,
  },

  statusPill: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
  },
});