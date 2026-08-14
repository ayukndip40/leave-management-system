import { useCallback, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";

import Screen from "../../../../components/Layout/Screen";
import PageHeader from "../../../../components/Layout/PageHeader";
import SectionTitle from "../../../../components/Dashboard/SectionTitle";
import DashboardGrid from "../../../../components/Dashboard/DashboardGrid";
import StatsCard from "../../../../components/Dashboard/StatsCard";
import QuickActionCard from "../../../../components/Dashboard/QuickActionCard";
import RecentActivityCard from "../../../../components/Dashboard/RecentActivityCard";

import dashboardService, {
  AdminDashboardStats,
  RecentActivity,
} from "../../../../services/api/dashboardService";

const COLORS = {
  bg: "#F4F7FC",
  primary: "#2563EB",
};

const initialStats: AdminDashboardStats = {
  employees: 0,
  departments: 0,
  leaveTypes: 0,
  hrUsers: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats>(initialStats);

  const [activities, setActivities] = useState<RecentActivity[]>([]);

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const dashboardStats = await dashboardService.getAdminStats();

      let recentActivities: RecentActivity[] = [];

      try {
        recentActivities = await dashboardService.getRecentActivities();
      } catch (error) {
        console.log("Recent activity not available:", error);
      }

      setStats(dashboardStats);

      setActivities(recentActivities);
    } catch (error) {
      console.log("Dashboard loading error:", error);
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
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Screen>
      <PageHeader title="Admin Dashboard" />

      <SectionTitle title="Statistics" />

      <DashboardGrid>
        <StatsCard
          title="Employees"
          value={stats.employees}
          icon="account-group"
        />

        <StatsCard
          title="Departments"
          value={stats.departments}
          icon="office-building"
        />

        <StatsCard
          title="Leave Types"
          value={stats.leaveTypes}
          icon="calendar"
        />

        <StatsCard
          title="HR Users"
          value={stats.hrUsers}
          icon="account-tie"
        />
      </DashboardGrid>

      <SectionTitle title="Quick Actions" />

      <DashboardGrid>
        <QuickActionCard
          title="Employees"
          icon="account-plus"
          onPress={() => router.push("/(protected)/admin/employees")}
        />

        <QuickActionCard
          title="Departments"
          icon="office-building-plus"
          onPress={() => router.push("/(protected)/admin/departments")}
        />

        <QuickActionCard
          title="Leave Types"
          icon="calendar-plus"
          onPress={() => router.push("/(protected)/admin/leave-types")}
        />

        <QuickActionCard
          title="Public Holidays"
          icon="calendar-star"
          onPress={() => router.push("/(protected)/admin/public-holidays")}
        />
      </DashboardGrid>

      <SectionTitle title="Recent Activity" />

      {activities.map((activity) => (
        <RecentActivityCard
          key={activity.id}
          title={activity.title}
          description={activity.description}
          time={activity.time}
          icon={activity.icon}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },
});