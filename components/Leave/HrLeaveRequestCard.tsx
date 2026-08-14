import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { formatDateRange } from "../../utils/date";
import { HrLeaveRequest } from "../../services/api/hrLeaveService";

interface Props {
  leave: HrLeaveRequest;
  onPress: () => void;
}

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
};


const getStatusStyle = (
  status: HrLeaveRequest["status"]
) => {

  switch (status) {

    case "Approved":
      return {
        backgroundColor: "#DCFCE7",
        color: "#15803D",
      };

    case "Rejected":
      return {
        backgroundColor: "#FEE2E2",
        color: "#DC2626",
      };

    case "Cancelled":
      return {
        backgroundColor: "#E5E7EB",
        color: "#475569",
      };

    default:
      return {
        backgroundColor: "#FEF3C7",
        color: "#B45309",
      };

  }

};


export default function HrLeaveRequestCard({
  leave,
  onPress,
}: Props) {

  const statusStyle = getStatusStyle(
    leave.status
  );


  return (

    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >

      {/* Header */}

      <View style={styles.header}>

        <View style={styles.employeeSection}>

          <View style={styles.avatar}>

            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color={COLORS.primary}
            />

          </View>


          <View>

            <Text style={styles.employeeName}>
              {leave.employee_name}
            </Text>

            <Text style={styles.employeeNumber}>
              {leave.employee_number}
            </Text>

          </View>

        </View>


        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                statusStyle.backgroundColor,
            },
          ]}
        >

          <Text
            style={[
              styles.statusText,
              {
                color:
                  statusStyle.color,
              },
            ]}
          >
            {leave.status}
          </Text>

        </View>


      </View>


      {/* Body */}

      <View style={styles.divider}/>


      <View style={styles.body}>


        <View style={styles.row}>

          <MaterialCommunityIcons
            name="calendar-outline"
            size={18}
            color={COLORS.muted}
          />

          <Text style={styles.value}>
            {leave.leave_name}
          </Text>

        </View>



        <View style={styles.row}>

          <MaterialCommunityIcons
            name="clock-outline"
            size={18}
            color={COLORS.muted}
          />

          <Text style={styles.value}>
            {formatDateRange(
              leave.start_date,
              leave.end_date
            )}
          </Text>

        </View>



        <View style={styles.daysBox}>

          <Text style={styles.daysText}>
            {leave.total_days} day(s)
          </Text>

        </View>


      </View>


    </Pressable>

  );

}



const styles = StyleSheet.create({

  card: {

    backgroundColor: COLORS.card,

    borderRadius: 20,

    padding: 16,

    marginBottom: 14,

    borderWidth: 1,

    borderColor: COLORS.border,

  },


  pressed: {

    opacity: 0.85,

  },


  header: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

  },


  employeeSection: {

    flexDirection: "row",

    alignItems: "center",

    gap: 12,

  },


  avatar: {

    width: 46,

    height: 46,

    borderRadius: 16,

    backgroundColor: COLORS.primarySoft,

    justifyContent: "center",

    alignItems: "center",

  },


  employeeName: {

    fontSize: 16,

    fontWeight: "800",

    color: COLORS.ink,

  },


  employeeNumber: {

    fontSize: 13,

    color: COLORS.muted,

    marginTop: 3,

  },


  statusBadge: {

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 20,

  },


  statusText: {

    fontSize: 12,

    fontWeight: "700",

  },


  divider: {

    height: 1,

    backgroundColor: COLORS.border,

    marginVertical: 14,

  },


  body: {

    gap: 10,

  },


  row: {

    flexDirection: "row",

    alignItems: "center",

    gap: 8,

  },


  value: {

    fontSize: 14,

    color: COLORS.ink,

    fontWeight: "600",

  },


  daysBox: {

    alignSelf: "flex-start",

    backgroundColor: COLORS.primarySoft,

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 12,

    marginTop: 4,

  },


  daysText: {

    color: COLORS.primary,

    fontSize: 13,

    fontWeight: "700",

  },


});