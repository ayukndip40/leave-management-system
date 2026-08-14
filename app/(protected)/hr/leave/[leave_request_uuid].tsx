import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { formatDateRange } from "../../../../utils/date";

import hrLeaveService, {
  HrLeaveRequestDetails,
} from "../../../../services/api/hrLeaveService";
import LeaveAttachments from "../../../../components/Leave/LeaveAttachments";
import AppButton from "../../../../components/Button/AppButton";

const COLORS = {
  ink: "#050505",
  muted: "#65676B",
  border: "#E4E6EB",
  card: "#FFFFFF",
  bg: "#F0F2F5",
  primary: "#1877F2",
};

function getStatusStyle(status: string) {
  switch (status) {
    case "Approved":
      return { bg: "#E7F6EC", text: "#31A24C" };
    case "Rejected":
      return { bg: "#FDECEA", text: "#E41E3F" };
    case "Cancelled":
      return { bg: COLORS.bg, text: COLORS.muted };
    default:
      return { bg: "#FFF4E5", text: "#F7981D" };
  }
}

function InfoRow({
  icon,
  label,
  value,
  isLast,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <MaterialCommunityIcons name={icon} size={20} color={COLORS.muted} />
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function HrLeaveDetailsScreen() {
  const { leave_request_uuid } = useLocalSearchParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [leave, setLeave] = useState<HrLeaveRequestDetails | null>(null);

  useEffect(() => {
    loadLeave();
  }, []);

  const handleApprove = () => {
    Alert.alert(
      "Approve Leave",
      "Are you sure you want to approve this leave request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: async () => {
            console.log("PARAM:", leave_request_uuid);
            console.log("TYPE:", typeof leave_request_uuid);

            try {
              await hrLeaveService.approveLeave(leave.leave_request_uuid);

              Alert.alert("Success", "Leave approved successfully.");

              router.back();
            } catch (error) {
              console.error(error);

              Alert.alert("Error", "Failed to approve leave.");
            }
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      "Reject Leave",
      "Are you sure you want to reject this leave request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              await hrLeaveService.rejectLeave(leave.leave_request_uuid);

              Alert.alert("Success", "Leave rejected successfully.");

              router.back();
            } catch (error) {
              console.error(error);

              Alert.alert("Error", "Failed to reject leave.");
            }
          },
        },
      ]
    );
  };

  const loadLeave = async () => {
    console.log("PARAM:", leave_request_uuid);

    console.log("TYPE:", typeof leave_request_uuid);

    try {
      const data = await hrLeaveService.getLeaveRequestByUuid(
        leave_request_uuid as string
      );

      setLeave(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

    if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!leave) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <Text style={styles.notFoundText}>Leave request not found.</Text>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusStyle(leave.status);
  const initials = leave.employee_name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.heroText}>
          <Text style={styles.employeeName}>{leave.employee_name}</Text>
          <Text style={styles.employeeNumber}>{leave.employee_number}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.badgeText, { color: statusStyle.text }]}>
            {leave.status}
          </Text>
        </View>
      </View>

      <Text style={styles.groupLabel}>Details</Text>
      <View style={styles.group}>
        <InfoRow icon="tag-outline" label="Leave type" value={leave.leave_name} />
        <InfoRow
          icon="calendar-range"
          label="Leave period"
          value={formatDateRange(leave.start_date, leave.end_date)}
        />
        <InfoRow
          icon="calendar-check-outline"
          label="Working days"
          value={String(leave.total_days)}
          isLast
        />
      </View>

      <Text style={styles.groupLabel}>Reason</Text>
      <View style={styles.group}>
        <View style={styles.reasonBox}>
          <Text style={styles.reasonText}>{leave.reason}</Text>
        </View>
      </View>

      <Text style={styles.groupLabel}>Attachments</Text>
      <View style={styles.group}>
        <View style={styles.reasonBox}>
          <LeaveAttachments attachments={leave.attachments || []} />
        </View>
      </View>

      {leave.status === "Pending" && (
        <View style={styles.actions}>
          <AppButton title="Approve" onPress={handleApprove} />
          <AppButton title="Reject" variant="danger" onPress={handleReject} />
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },

  notFoundText: {
    fontSize: 15,
    color: COLORS.muted,
  },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  heroText: {
    flex: 1,
  },

  employeeName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.ink,
  },

  employeeNumber: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.muted,
  },

  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 20,
    marginBottom: 6,
    marginLeft: 4,
  },

  group: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  rowCopy: {
    flex: 1,
  },

  rowLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },

  rowValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.ink,
    marginTop: 1,
  },

  reasonBox: {
    padding: 14,
  },

  reasonText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.ink,
  },

  actions: {
    marginTop: 24,
    gap: 4,
  },
});