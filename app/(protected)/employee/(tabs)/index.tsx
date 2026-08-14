import { useCallback, useState } from "react";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFocusEffect, router } from "expo-router";

import Screen from "../../../../components/Layout/Screen";
import PageHeader from "../../../../components/Layout/PageHeader";

import DashboardGrid from "../../../../components/Dashboard/DashboardGrid";
import StatsCard from "../../../../components/Dashboard/StatsCard";
import SectionTitle from "../../../../components/Dashboard/SectionTitle";

import AppButton from "../../../../components/Button/AppButton";

import { useAuth } from "../../../../contexts/AuthContext";

import employeeDashboardService, {
  EmployeeDashboardStats,
  EmployeeActivity,
} from "../../../../services/api/employeeDashboardService";

const COLORS = {
  ink: "#050505",
  muted: "#65676B",
  border: "#E4E6EB",
  card: "#FFFFFF",
  bg: "#F0F2F5",
  primary: "#1877F2",
};

const initialStats: EmployeeDashboardStats = {
  leaveBalance: 0,
  pendingLeaves: 0,
  approvedLeaves: 0,
  rejectedLeaves: 0,
};

export default function EmployeeDashboardScreen() {
  const { user } = useAuth();

  const [stats, setStats] = useState<EmployeeDashboardStats>(initialStats);

  const [activities, setActivities] = useState<EmployeeActivity[]>([]);

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardStats, dashboardActivities] = await Promise.all([
        employeeDashboardService.getStats(),
        employeeDashboardService.getActivities(),
      ]);

      setStats(dashboardStats);

      setActivities(dashboardActivities);
    } catch (error) {
      console.log("Employee dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <Screen>
      <PageHeader />

      <Text style={styles.groupLabel}>Leave summary</Text>

      <DashboardGrid>
        <StatsCard title="Balance" value={stats.leaveBalance} icon="calendar-check" />
        <StatsCard title="Pending" value={stats.pendingLeaves} icon="clock-outline" />
        <StatsCard title="Approved" value={stats.approvedLeaves} icon="check-circle" />
        <StatsCard title="Rejected" value={stats.rejectedLeaves} icon="close-circle" />
      </DashboardGrid>

      <Text style={styles.groupLabel}>Quick actions</Text>

      <View style={styles.group}>
        <View style={styles.actionRow}>
          <AppButton
            title="Apply for leave"
            onPress={() => router.push("/employee/leave/create")}
          />
        </View>

        <View style={styles.rowDivider} />

        <View style={styles.actionRow}>
          <AppButton
            title="My leave requests"
            mode="outlined"
            onPress={() => router.push("/employee/(tabs)/leaves")}
          />
        </View>
      </View>

      <Text style={styles.groupLabel}>Recent activity</Text>

      <View style={styles.group}>
        {activities.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No recent activity yet</Text>
          </View>
        ) : (
          activities.map((activity, index) => (
            <View
              key={activity.id}
              style={[
                styles.activityRow,
                index !== activities.length - 1 && styles.rowDivider,
              ]}
            >
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
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

  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  actionRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  activityRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.ink,
  },

  activityDescription: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },

  activityTime: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },

  emptyRow: {
    paddingHorizontal: 14,
    paddingVertical: 20,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
  },
});