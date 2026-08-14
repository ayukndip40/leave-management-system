
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Screen from "../../../../components/Layout/Screen";
import PageHeader from "../../../../components/Layout/PageHeader";
import SectionTitle from "../../../../components/Dashboard/SectionTitle";

export default function HrReportsScreen() {
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title="Reports" />

        <Text style={styles.subtitle}>
          Workforce and leave intelligence
        </Text>

        {/* ============================= */}
        {/* KEY STATISTICS */}
        {/* ============================= */}

        <SectionTitle title="Workforce Overview" />

        <View style={styles.grid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>125</Text>
            <Text style={styles.statLabel}>
              Total Employees
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>
              Currently on Leave
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>
              Pending Requests
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>72%</Text>
            <Text style={styles.statLabel}>
              Leave Utilization
            </Text>
          </View>
        </View>

        {/* ============================= */}
        {/* TOP LEAVE USER */}
        {/* ============================= */}

        <SectionTitle title="Top Leave Insights" />

        <View style={styles.highlightCard}>
          <Text style={styles.cardLabel}>
            🏆 EMPLOYEE WITH MOST LEAVE
          </Text>

          <Text style={styles.highlightName}>
            John Doe
          </Text>

          <Text style={styles.highlightValue}>
            24 days taken
          </Text>

          <Text style={styles.cardDescription}>
            Engineering Department
          </Text>
        </View>

        {/* ============================= */}
        {/* DEPARTMENT */}
        {/* ============================= */}

        <View style={styles.highlightCard}>
          <Text style={styles.cardLabel}>
            🏢 DEPARTMENT WITH HIGHEST LEAVE
          </Text>

          <Text style={styles.highlightName}>
            IT Department
          </Text>

          <Text style={styles.highlightValue}>
            68 days used
          </Text>

          <Text style={styles.cardDescription}>
            Highest leave utilization across
            departments.
          </Text>
        </View>

        {/* ============================= */}
        {/* LEAVE TYPE */}
        {/* ============================= */}

        <View style={styles.highlightCard}>
          <Text style={styles.cardLabel}>
            📅 MOST REQUESTED LEAVE
          </Text>

          <Text style={styles.highlightName}>
            Annual Leave
          </Text>

          <Text style={styles.highlightValue}>
            42 requests
          </Text>

          <Text style={styles.cardDescription}>
            Most frequently requested leave type.
          </Text>
        </View>

        {/* ============================= */}
        {/* MONTHLY TREND */}
        {/* ============================= */}

        <SectionTitle title="Leave Trend" />

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            Monthly Leave Requests
          </Text>

          <View style={styles.barRow}>
            <Text style={styles.month}>Jan</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: "35%" },
                ]}
              />
            </View>
            <Text style={styles.barValue}>12</Text>
          </View>

          <View style={styles.barRow}>
            <Text style={styles.month}>Feb</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: "55%" },
                ]}
              />
            </View>
            <Text style={styles.barValue}>19</Text>
          </View>

          <View style={styles.barRow}>
            <Text style={styles.month}>Mar</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: "45%" },
                ]}
              />
            </View>
            <Text style={styles.barValue}>15</Text>
          </View>

          <View style={styles.barRow}>
            <Text style={styles.month}>Apr</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: "75%" },
                ]}
              />
            </View>
            <Text style={styles.barValue}>27</Text>
          </View>
        </View>

        {/* ============================= */}
        {/* HR ATTENTION */}
        {/* ============================= */}

        <SectionTitle title="HR Attention" />

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>
            ⚠️ Items requiring attention
          </Text>

          <Text style={styles.warningItem}>
            • 3 employees have used more than
            80% of their leave allocation.
          </Text>

          <Text style={styles.warningItem}>
            • 5 leave requests are waiting for
            approval.
          </Text>

          <Text style={styles.warningItem}>
            • IT has the highest leave
            utilization.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: -8,
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },

  statValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2563EB",
  },

  statLabel: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748B",
  },

  highlightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 10,
  },

  highlightName: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
  },

  highlightValue: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2563EB",
    marginTop: 5,
  },

  cardDescription: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },

  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 18,
  },

  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  month: {
    width: 35,
    fontSize: 13,
    color: "#64748B",
  },

  barContainer: {
    flex: 1,
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  barValue: {
    width: 30,
    textAlign: "right",
    fontSize: 12,
    color: "#475569",
  },

  warningCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  warningTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9A3412",
    marginBottom: 12,
  },

  warningItem: {
    fontSize: 14,
    lineHeight: 22,
    color: "#7C2D12",
    marginBottom: 8,
  },
});

