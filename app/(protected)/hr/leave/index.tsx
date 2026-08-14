import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useRouter,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import HrLeaveRequestCard from "../../../../components/Leave/HrLeaveRequestCard";
import LeaveStatisticCard from "../../../../components/Leave/LeaveStatisticCard";

import hrLeaveService, {
  HrLeaveRequest,
  LeaveStatistics,
} from "../../../../services/api/hrLeaveService";


const COLORS = {
  bg: "#F4F7FC",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37,99,235,0.1)",
};


export default function HrLeaveScreen() {

  const router = useRouter();

  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);

  const [leaveRequests,setLeaveRequests] =
    useState<HrLeaveRequest[]>([]);

  const [statistics,setStatistics] =
    useState<LeaveStatistics>({
      pending:0,
      approved:0,
      rejected:0,
      cancelled:0,
      total:0,
    });



  const loadLeaveRequests = async()=>{

    try{

      const [
        requests,
        stats
      ] = await Promise.all([
        hrLeaveService.getAllLeaveRequests(),
        hrLeaveService.getStatistics(),
      ]);


      setLeaveRequests(requests);
      setStatistics(stats);


    }catch(error){

      console.error(
        "Failed loading HR leaves:",
        error
      );

    }finally{

      setLoading(false);
      setRefreshing(false);

    }

  };



  useFocusEffect(
    useCallback(()=>{

      loadLeaveRequests();

    },[])
  );



  const onRefresh = ()=>{

    setRefreshing(true);
    loadLeaveRequests();

  };



  const header = (

    <View style={styles.headerBlock}>


      <View style={styles.hero}>

        <View style={styles.heroIcon}>

          <MaterialCommunityIcons
            name="calendar-check-outline"
            size={28}
            color={COLORS.primary}
          />

        </View>


        <View style={styles.heroText}>

          <Text style={styles.title}>
            Leave Management
          </Text>

          <Text style={styles.subtitle}>
            Review employee leave requests,
            approvals and history.
          </Text>

        </View>


      </View>




      <View style={styles.statisticsGrid}>


        <LeaveStatisticCard
          title="Pending"
          value={statistics.pending}
          color="#F59E0B"
        />


        <LeaveStatisticCard
          title="Approved"
          value={statistics.approved}
          color="#16A34A"
        />


        <LeaveStatisticCard
          title="Rejected"
          value={statistics.rejected}
          color="#DC2626"
        />


        <LeaveStatisticCard
          title="Cancelled"
          value={statistics.cancelled}
          color="#64748B"
        />


      </View>




      <View style={styles.totalCard}>


        <MaterialCommunityIcons
          name="chart-box-outline"
          size={24}
          color={COLORS.primary}
        />


        <View>

          <Text style={styles.totalLabel}>
            Total Leave Requests
          </Text>


          <Text style={styles.totalValue}>
            {statistics.total}
          </Text>

        </View>


      </View>



      {
        leaveRequests.length > 0 &&
        <Text style={styles.sectionTitle}>
          Recent Requests
        </Text>
      }



    </View>

  );




  if(loading){

    return (

      <SafeAreaView style={styles.center}
        edges={["top"]}
      >

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

      </SafeAreaView>

    );

  }



  return (

    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >

      <FlatList

        data={leaveRequests}


        keyExtractor={(item)=>
          item.leave_request_uuid
        }


        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={onRefresh}

            tintColor={COLORS.primary}

          />

        }


        contentContainerStyle={
          styles.list
        }


        ListHeaderComponent={
          header
        }



        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <MaterialCommunityIcons
              name="calendar-remove-outline"
              size={42}
              color={COLORS.primary}
            />

            <Text style={styles.emptyTitle}>
              No leave requests
            </Text>


            <Text style={styles.emptyText}>
              Employee leave requests will
              appear here.
            </Text>


          </View>

        }



        renderItem={({item})=>(


          <HrLeaveRequestCard

            leave={item}


            onPress={()=>
              router.push({

                pathname:
                "/hr/leave/[leave_request_uuid]",


                params:{

                  leave_request_uuid:
                  item.leave_request_uuid

                }

              })

            }


          />


        )}


        showsVerticalScrollIndicator={false}

      />


    </SafeAreaView>

  );

}




const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:COLORS.bg,
},


list:{
  paddingHorizontal:16,
  paddingTop:16,
  paddingBottom:32,
},


center:{
 flex:1,
 justifyContent:"center",
 alignItems:"center",
 backgroundColor:COLORS.bg,
},


headerBlock:{
 marginBottom:10,
},


hero:{
 flexDirection:"row",
 alignItems:"flex-start",
 gap:14,
 marginBottom:20,
},


heroIcon:{
 width:54,
 height:54,
 borderRadius:18,
 backgroundColor:COLORS.primarySoft,
 justifyContent:"center",
 alignItems:"center",
},


heroText:{
 flex:1,
},


title:{
 fontSize:24,
 fontWeight:"800",
 color:COLORS.ink,
 marginBottom:6,
},


subtitle:{
 fontSize:14,
 lineHeight:20,
 color:COLORS.muted,
},



statisticsGrid:{
 flexDirection:"row",
 flexWrap:"wrap",
 gap:12,
 marginBottom:18,
},



totalCard:{
 backgroundColor:COLORS.card,
 borderRadius:18,
 borderWidth:1,
 borderColor:COLORS.border,
 padding:16,
 flexDirection:"row",
 alignItems:"center",
 gap:14,
 marginBottom:20,
},


totalLabel:{
 color:COLORS.muted,
 fontSize:13,
},


totalValue:{
 fontSize:26,
 fontWeight:"800",
 color:COLORS.ink,
},



sectionTitle:{
 fontSize:14,
 fontWeight:"800",
 color:COLORS.muted,
 textTransform:"uppercase",
 letterSpacing:0.6,
 marginBottom:12,
},



emptyContainer:{
 alignItems:"center",
 marginTop:30,
},


emptyTitle:{
 fontSize:18,
 fontWeight:"700",
 marginTop:12,
 color:COLORS.ink,
},


emptyText:{
 marginTop:8,
 color:COLORS.muted,
 textAlign:"center",
},


});