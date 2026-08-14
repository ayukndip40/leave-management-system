import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";

interface EmployeeCardProps {
  firstName: string;
  lastName: string;
  employeeNumber: string;
  position: string;
  department: string;
  status: string;
  onPress: () => void;
}


const COLORS = {
  card: "#FFFFFF",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  primary: "#2563EB",
  primarySoft: "rgba(37,99,235,0.1)",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  warning: "#B45309",
  warningSoft: "#FEF3C7",
};



export default function EmployeeCard({
  firstName,
  lastName,
  employeeNumber,
  position,
  department,
  status,
  onPress,
}: EmployeeCardProps) {


  const isActive = status === "active";


  return (

    <Pressable
      onPress={onPress}
      style={styles.card}
    >


      <View style={styles.header}>


        <View style={styles.avatar}>

          <MaterialCommunityIcons
            name="account-outline"
            size={28}
            color={COLORS.primary}
          />

        </View>



        <View style={styles.employeeInfo}>


          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>


          <Text style={styles.employeeNumber}>
            {employeeNumber}
          </Text>


        </View>



        <View
          style={[
            styles.statusBadge,
            isActive
              ? styles.activeBadge
              : styles.inactiveBadge
          ]}
        >

          <Text
            style={[
              styles.statusText,
              isActive
                ? styles.activeText
                : styles.inactiveText
            ]}
          >
            {status}
          </Text>


        </View>


      </View>





      <View style={styles.divider} />




      <View style={styles.row}>


        <MaterialCommunityIcons
          name="briefcase-outline"
          size={18}
          color={COLORS.muted}
        />


        <Text style={styles.detail}>
          {position}
        </Text>


      </View>





      <View style={styles.row}>


        <MaterialCommunityIcons
          name="office-building-outline"
          size={18}
          color={COLORS.muted}
        />


        <Text style={styles.detail}>
          {department}
        </Text>


      </View>



    </Pressable>

  );

}




const styles = StyleSheet.create({

  card: {

    backgroundColor: COLORS.card,

    borderRadius: 20,

    padding:16,

    marginBottom:14,

    borderWidth:1,

    borderColor:COLORS.border,


  },


  header:{

    flexDirection:"row",

    alignItems:"center",

  },


  avatar:{

    width:52,

    height:52,

    borderRadius:16,

    backgroundColor:COLORS.primarySoft,

    justifyContent:"center",

    alignItems:"center",

    marginRight:12,

  },


  employeeInfo:{

    flex:1,

  },


  name:{

    fontSize:17,

    fontWeight:"800",

    color:COLORS.ink,

  },


  employeeNumber:{

    marginTop:4,

    fontSize:13,

    color:COLORS.muted,

    fontWeight:"600",

  },


  statusBadge:{

    paddingHorizontal:10,

    paddingVertical:5,

    borderRadius:20,

  },


  activeBadge:{

    backgroundColor:COLORS.successSoft,

  },


  inactiveBadge:{

    backgroundColor:COLORS.warningSoft,

  },


  statusText:{

    fontSize:12,

    fontWeight:"700",

    textTransform:"capitalize",

  },


  activeText:{

    color:COLORS.success,

  },


  inactiveText:{

    color:COLORS.warning,

  },


  divider:{

    height:1,

    backgroundColor:COLORS.border,

    marginVertical:14,

  },


  row:{

    flexDirection:"row",

    alignItems:"center",

    marginBottom:8,

  },


  detail:{

    marginLeft:10,

    fontSize:14,

    color:COLORS.muted,

    fontWeight:"600",

  },


});