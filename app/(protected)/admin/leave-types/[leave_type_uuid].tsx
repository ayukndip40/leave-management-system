import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../../../components/Layout/Screen";
import PageHeader from "../../../../components/Layout/PageHeader";
import SectionTitle from "../../../../components/Dashboard/SectionTitle";
import AppButton from "../../../../components/Button/AppButton";

import { LeaveType } from "../../../../types/leaveType";
import { getLeaveTypeByUuid } from "../../../../services/api/leaveTypeService";

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
  successBg: "#F0FDF4",
  successText: "#16A34A",
  dangerBg: "#FEF2F2",
  dangerText: "#DC2626",
  neutralBg: "#F1F5F9",
  neutralText: "#64748B",
};

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

function DetailRow({
  icon,
  label,
  value,
  iconColor,
  isLast,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  iconColor?: string;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        gap: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: COLORS.primarySoft,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={iconColor || COLORS.primary}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, fontWeight: "600", color: COLORS.muted, marginBottom: 2 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.ink }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function LeaveTypeDetailsScreen() {
  const { leave_type_uuid } = useLocalSearchParams<{
    leave_type_uuid: string;
  }>();

  const [leaveType, setLeaveType] = useState<LeaveType | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchLeaveType = async () => {
    try {
      const response = await getLeaveTypeByUuid(leave_type_uuid);

      setLeaveType(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leave_type_uuid) {
      fetchLeaveType();
    }
  }, [leave_type_uuid]);

  if (loading) {
    return (
      <Screen>
        <PageHeader />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </Screen>
    );
  }

  if (!leaveType) {
    return (
      <Screen>
        <PageHeader />

        <SectionTitle title="Leave Type" />

        <View
          style={{
            alignItems: "center",
            paddingVertical: 40,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: COLORS.primarySoft,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <MaterialCommunityIcons
              name="calendar-remove-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.ink }}>
            Leave type not found
          </Text>
        </View>
      </Screen>
    );
  }

  const statusStyle = getStatusStyle(leaveType.status);

  return (
    <Screen>
      <PageHeader />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <SectionTitle title={leaveType.leave_name} />

        <View
          style={{
            backgroundColor: statusStyle.bg,
            borderRadius: 100,
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: statusStyle.text,
              textTransform: "capitalize",
            }}
          >
            {leaveType.status}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: COLORS.card,
          borderRadius: 20,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          marginBottom: 20,
        }}
      >
        <DetailRow
          icon="text-box-outline"
          label="Description"
          value={leaveType.description || "No description"}
        />

        <DetailRow
          icon="calendar-range"
          label="Maximum Days"
          value={leaveType.maximum_days.toString()}
        />

        <DetailRow
          icon={leaveType.paid_leave ? "cash-check" : "cash-remove"}
          label="Paid Leave"
          value={leaveType.paid_leave ? "Yes" : "No"}
        />

        <DetailRow
          icon={leaveType.requires_document ? "file-check-outline" : "file-remove-outline"}
          label="Requires Document"
          value={leaveType.requires_document ? "Yes" : "No"}
        />

        <DetailRow
          icon="palette"
          label="Color"
          value={leaveType.color}
          iconColor={leaveType.color}
          isLast
        />
      </View>

      <AppButton
        title="Edit Leave Type"
        icon="pencil-outline"
        onPress={() =>
          router.push(
            `/(protected)/admin/leave-types/edit?leave_type_uuid=${leaveType.leave_type_uuid}`
          )
        }
      />
    </Screen>
  );
}