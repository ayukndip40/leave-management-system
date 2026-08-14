import { View, StyleSheet } from "react-native";

import Screen from "../../../components/Layout/Screen";
import PageHeader from "../../../components/Layout/PageHeader";
import StatsCard from "../../../components/Dashboard/StatsCard";

export default function AdminHome() {
  return (
    <Screen>
      <PageHeader />

      <View style={styles.row}>
        <StatsCard
          title="Employees"
          value={125}
          icon="account-group"
        />

        <StatsCard
          title="Departments"
          value={8}
          icon="office-building"
        />
      </View>

      <View style={styles.row}>
        <StatsCard
          title="Leave Types"
          value={6}
          icon="calendar"
        />

        <StatsCard
          title="HR Users"
          value={4}
          icon="account-tie"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 8,
  },
});