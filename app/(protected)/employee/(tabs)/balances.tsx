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
import { useFocusEffect } from "expo-router";

import leaveBalanceService, {
  LeaveBalance,
} from "../../../../services/api/leaveBalanceService";

const COLORS = {
  bg: "#F4F7FC",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
  danger: "#DC2626",
  dangerSoft: "#FEF2F2",
  warning: "#F59E0B",
  warningSoft: "#FFFBEB",
  success: "#16A34A",
  successSoft: "#F0FDF4",
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
    <View style={[styles.statCard, accent && styles.statCardAccent]}>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function LeaveBalancesScreen() {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBalances = async () => {
    try {
      const data = await leaveBalanceService.getMyLeaveBalances();

      setBalances(data);
    } catch (error) {
      console.error("Failed to load leave balances:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBalances();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadBalances();
  };

  const getRemainingColor = (remaining: number, allocated: number) => {
    const percentage = (remaining / allocated) * 100;

    if (percentage <= 25) return COLORS.danger;
    if (percentage <= 50) return COLORS.warning;

    return COLORS.success;
  };

  const getRemainingBg = (remaining: number, allocated: number) => {
    const percentage = (remaining / allocated) * 100;

    if (percentage <= 25) return COLORS.dangerSoft;
    if (percentage <= 50) return COLORS.warningSoft;

    return COLORS.successSoft;
  };

  const stats = useMemo(() => {
    const totalAllocated = balances.reduce(
      (sum, item) => sum + item.allocated_days,
      0
    );
    const totalUsed = balances.reduce((sum, item) => sum + item.used_days, 0);
    const totalRemaining = balances.reduce(
      (sum, item) => sum + item.remaining_days,
      0
    );

    return { totalAllocated, totalUsed, totalRemaining };
  }, [balances]);

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <MaterialCommunityIcons
            name="wallet-outline"
            size={26}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.title}>Leave balances</Text>
          <Text style={styles.subtitle}>
            See how many days you have allocated, used, and remaining.
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <SummaryStat label="Allocated" value={stats.totalAllocated} />
        <SummaryStat label="Used" value={stats.totalUsed} accent />
        <SummaryStat label="Remaining" value={stats.totalRemaining} />
      </View>

      {balances.length > 0 ? (
        <Text style={styles.sectionLabel}>Your leave types</Text>
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
        data={balances}
        keyExtractor={(item) => item.id.toString()}
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
                name="wallet-outline"
                size={40}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No leave balances available</Text>
            <Text style={styles.emptyText}>
              Once your leave allocations are set up, your balances will show
              up here.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const remainingColor = getRemainingColor(
            item.remaining_days,
            item.allocated_days
          );
          const remainingBg = getRemainingBg(
            item.remaining_days,
            item.allocated_days
          );
          const usedPct = Math.min(
            100,
            Math.round((item.used_days / item.allocated_days) * 100)
          );

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.leave_name}</Text>
                <View style={[styles.yearPill]}>
                  <Text style={styles.yearPillText}>{item.year}</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${usedPct}%`, backgroundColor: remainingColor },
                  ]}
                />
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Allocated</Text>
                  <Text style={styles.gridValue}>
                    {item.allocated_days} day(s)
                  </Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Used</Text>
                  <Text style={styles.gridValue}>
                    {item.used_days} day(s)
                  </Text>
                </View>
              </View>

              <View
                style={[styles.remainingBanner, { backgroundColor: remainingBg }]}
              >
                <Text style={styles.remainingLabel}>Remaining</Text>
                <Text style={[styles.remainingValue, { color: remainingColor }]}>
                  {item.remaining_days} day(s)
                </Text>
              </View>
            </View>
          );
        }}
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
    marginBottom: 20,
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
    backgroundColor: COLORS.warningSoft,
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

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.ink,
    flexShrink: 1,
  },

  yearPill: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  yearPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 16,
  },

  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  gridItem: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  gridLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
    fontWeight: "600",
  },

  gridValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.ink,
  },

  remainingBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  remainingLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.ink,
  },

  remainingValue: {
    fontSize: 16,
    fontWeight: "800",
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