import { FlatList } from "react-native";

import { LeaveType } from "../../types/leaveType";
import LeaveTypeCard from "./LeaveTypeCard";

interface LeaveTypeListProps {
  leaveTypes: LeaveType[];
  onLeaveTypePress: (leaveType: LeaveType) => void;
}

export default function LeaveTypeList({
  leaveTypes,
  onLeaveTypePress,
}: LeaveTypeListProps) {
  return (
    <FlatList
      data={leaveTypes}
      keyExtractor={(item) => item.leave_type_uuid}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <LeaveTypeCard
          leaveName={item.leave_name}
          description={item.description}
          maximumDays={item.maximum_days}
          paidLeave={item.paid_leave}
          requiresDocument={item.requires_document}
          color={item.color}
          status={item.status}
          onPress={() => onLeaveTypePress(item)}
        />
      )}
    />
  );
}