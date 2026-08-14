import { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import Button from "../../../../components/Button/AppButton";
import LeaveRequestCard from "../../../../components/Leave/LeaveRequestCard";
import leaveService, {
  LeaveRequest,
} from "../../../../services/api/leaveService";

const COLORS = {
  bg: "#F4F7FC",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
};

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <View
      style={[
        styles.statCard,
        accent && styles.statCardAccent,
      ]}
    >
      <Text
        style={[
          styles.statValue,
          accent && styles.statValueAccent,
        ]}
      >
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function MyLeavesScreen() {
  const router = useRouter();

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaveRequests = async () => {
    try {
      const data = await leaveService.getMyLeaveRequests();
      setLeaveRequests(data);
    } catch (error) {
      console.error("Failed to load leave requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLeaveRequests();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaveRequests();
  };

  const stats = useMemo(() => {
    const pending = leaveRequests.filter(
      (item) => item.status === "Pending"
    ).length;
    const approved = leaveRequests.filter(
      (item) => item.status === "Approved"
    ).length;

    return {
      total: leaveRequests.length,
      pending,
      approved,
    };
  }, [leaveRequests]);

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={26}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.title}>My leave requests</Text>
          <Text style={styles.subtitle}>
            Track submissions, approvals, and history in one place.
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <SummaryStat label="Total" value={stats.total} />
        <SummaryStat label="Pending" value={stats.pending} accent />
        <SummaryStat label="Approved" value={stats.approved} />
      </View>

      <View style={styles.ctaCard}>
        <View style={styles.ctaCopy}>
          <Text style={styles.ctaTitle}>Need time off?</Text>
          <Text style={styles.ctaSubtitle}>
            Submit a new leave request in a few steps.
          </Text>
        </View>
        <Button
          title="Apply for leave"
          icon="plus"
          onPress={() => router.push("/employee/leave/create")}
        />
      </View>

      {leaveRequests.length > 0 ? (
        <Text style={styles.sectionLabel}>Recent requests</Text>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={leaveRequests}
        keyExtractor={(item) => item.leave_request_uuid}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={styles.list}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={40}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No leave requests yet</Text>
            <Text style={styles.emptyText}>
              When you apply for leave, your requests will show up here with
              status and dates.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <LeaveRequestCard
            leave_request_uuid={item.leave_request_uuid}
            leave_name={item.leave_name}
            start_date={item.start_date}
            end_date={item.end_date}
            total_days={item.total_days}
            status={item.status}
            onPress={() =>
              router.push(`/employee/leave/${item.leave_request_uuid}`)
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },

  headerBlock: {
    marginBottom: 4,
  },

  hero: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 18,
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

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statCardAccent: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.ink,
    marginBottom: 2,
  },

  statValueAccent: {
    color: "#B45309",
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
  },

  ctaCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },

  ctaCopy: {
    gap: 4,
  },

  ctaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.ink,
  },

  ctaSubtitle: {
    fontSize: 13,
    lineHeight: 18,
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

  emptyContainer: {
    marginTop: 24,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 24,
  },

  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 8,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 300,
  },
});
