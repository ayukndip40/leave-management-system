import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { formatDateRange } from "../../utils/date";

export interface LeaveRequestCardProps {
  leave_request_uuid: string;
  leave_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  onPress: () => void;
}

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
};

type StatusKey = LeaveRequestCardProps["status"];

const STATUS_STYLE: Record<
  StatusKey,
  {
    backgroundColor: string;
    color: string;
    icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  }
> = {
  Pending: {
    backgroundColor: "#FEF3C7",
    color: "#B45309",
    icon: "clock-outline",
  },
  Approved: {
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    icon: "check-circle-outline",
  },
  Rejected: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    icon: "close-circle-outline",
  },
  Cancelled: {
    backgroundColor: "#F1F5F9",
    color: "#475569",
    icon: "cancel",
  },
};

export default function LeaveRequestCard({
  leave_name,
  start_date,
  end_date,
  total_days,
  status,
  onPress,
}: LeaveRequestCardProps) {
  const statusStyle = STATUS_STYLE[status];
  const dayLabel = total_days === 1 ? "day" : "days";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.leadingIcon}>
          <MaterialCommunityIcons
            name="calendar-text"
            size={22}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.main}>
          <Text style={styles.leaveName} numberOfLines={1}>
            {leave_name}
          </Text>
          <Text style={styles.dateRange} numberOfLines={2}>
            {formatDateRange(start_date, end_date)}
          </Text>
        </View>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusStyle.backgroundColor },
          ]}
        >
          <MaterialCommunityIcons
            name={statusStyle.icon}
            size={14}
            color={statusStyle.color}
          />
          <Text
            style={[styles.statusText, { color: statusStyle.color }]}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.daysChip}>
          <MaterialCommunityIcons
            name="calendar-range"
            size={16}
            color={COLORS.primary}
          />
          <Text style={styles.daysText}>
            {total_days} {dayLabel}
          </Text>
        </View>

        <View style={styles.chevronWrap}>
          <Text style={styles.viewDetails}>View</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.muted}
          />
        </View>
      </View>
    </Pressable>
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
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  leadingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  main: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },

  leaveName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 4,
  },

  dateRange: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    maxWidth: 118,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  daysChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  daysText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.ink,
  },

  chevronWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  viewDetails: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },
});
