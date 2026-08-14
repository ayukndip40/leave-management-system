import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";

import Screen from "../../../../components/Layout/Screen";
import PageHeader from "../../../../components/Layout/PageHeader";
import SectionTitle from "../../../../components/Dashboard/SectionTitle";
import AppButton from "../../../../components/Button/AppButton";
import LeaveTypeSearch from "../../../../components/LeaveType/LeaveTypeSearch";
import LeaveTypeList from "../../../../components/LeaveType/LeaveTypeList";

import { getLeaveTypes } from "../../../../services/api/leaveTypeService";

import { LeaveType } from "../../../../types/leaveType";

const COLORS = {
  primary: "#2563EB",
};

export default function LeaveTypesScreen() {
  const [search, setSearch] = useState("");

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchLeaveTypes = async () => {
    try {
      const response = await getLeaveTypes();

      console.log("Leave Types:", response.data);

      setLeaveTypes(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const filteredLeaveTypes = useMemo(() => {
    if (!search.trim()) {
      return leaveTypes;
    }

    return leaveTypes.filter((leaveType) =>
      leaveType.leave_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [leaveTypes, search]);

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

  return (
    <Screen>
      <PageHeader />

      <SectionTitle title="Leave Types" />

      <View style={{ marginTop: 16, gap: 12 }}>
        <LeaveTypeSearch value={search} onChangeText={setSearch} />

        <AppButton
          title="Add Leave Type"
          icon="plus"
          onPress={() => router.push("/(protected)/admin/leave-types/create")}
        />
      </View>

      <View style={{ marginTop: 20, flex: 1 }}>
        <LeaveTypeList
          leaveTypes={filteredLeaveTypes}
          onLeaveTypePress={(leaveType) =>
            router.push(
              `/(protected)/admin/leave-types/${leaveType.leave_type_uuid}`
            )
          }
        />
      </View>
    </Screen>
  );
}