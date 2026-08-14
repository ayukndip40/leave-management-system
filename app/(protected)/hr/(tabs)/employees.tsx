import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import Button from "../../../../components/Button/AppButton";
import EmployeeCard from "../../../../components/Employee/EmployeeCard";

import employeeService, {
  Employee,
} from "../../../../services/api/employeeService";


const COLORS = {
  bg: "#F4F7FC",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
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
    <View
      style={[
        styles.statCard,
        accent && styles.statCardAccent,
      ]}
    >

      <Text
        style={[
          styles.statValue,
          accent && styles.statValueAccent,
        ]}
      >
        {value}
      </Text>


      <Text style={styles.statLabel}>
        {label}
      </Text>

    </View>
  );
}



export default function HrEmployeesScreen() {

  const router = useRouter();


  const [
    employees,
    setEmployees
  ] = useState<Employee[]>([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    refreshing,
    setRefreshing
  ] = useState(false);



  const loadEmployees = async () => {

    try {

      const data =
        await employeeService.getEmployees();

      setEmployees(data);


    } catch(error){

      console.error(
        "Failed to load employees:",
        error
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };



  useFocusEffect(
    useCallback(()=>{

      loadEmployees();

    },[])
  );



  const onRefresh = ()=>{

    setRefreshing(true);

    loadEmployees();

  };



  const stats = useMemo(()=>{


    const active =
      employees.filter(
        item=>item.status==="active"
      ).length;


    const inactive =
      employees.filter(
        item=>item.status!=="active"
      ).length;


    return {

      total: employees.length,

      active,

      inactive

    };


  },[employees]);




  const listHeader = (

    <View style={styles.headerBlock}>


      <View style={styles.hero}>


        <View style={styles.heroIcon}>

          <MaterialCommunityIcons

            name="account-group-outline"

            size={28}

            color={COLORS.primary}

          />

        </View>



        <View style={styles.heroText}>


          <Text style={styles.title}>

            Employees

          </Text>


          <Text style={styles.subtitle}>

            Manage employee records, departments,
            and employment information.

          </Text>


        </View>


      </View>





      <View style={styles.statsRow}>


        <SummaryStat

          label="Total"

          value={stats.total}

        />



        <SummaryStat

          label="Active"

          value={stats.active}

          accent

        />



        <SummaryStat

          label="Inactive"

          value={stats.inactive}

        />


      </View>






      <View style={styles.ctaCard}>


        <View style={styles.ctaCopy}>


          <Text style={styles.ctaTitle}>

            Add new employee

          </Text>



          <Text style={styles.ctaSubtitle}>

            Create employee profiles and assign
            departments and positions.

          </Text>


        </View>



        <Button

          title="Add Employee"

          icon="plus"

          onPress={()=>
            router.push(
              "/hr/employees/create"
            )
          }

        />


      </View>




      {
        employees.length > 0 &&
        <Text style={styles.sectionLabel}>

          Employee list

        </Text>
      }



    </View>

  );




  if(loading){

    return (

      <SafeAreaView
        style={styles.center}
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

        data={employees}


        keyExtractor={
          item=>item.user_uuid
        }



        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={onRefresh}

            tintColor={COLORS.primary}

            colors={[
              COLORS.primary
            ]}

          />

        }



        contentContainerStyle={
          styles.content
        }



        ListHeaderComponent={
          listHeader
        }



        showsVerticalScrollIndicator={false}




        ListEmptyComponent={

          <View style={styles.emptyContainer}>


            <View style={styles.emptyIconWrap}>


              <MaterialCommunityIcons

                name="account-off-outline"

                size={40}

                color={COLORS.primary}

              />


            </View>



            <Text style={styles.emptyTitle}>

              No employees found

            </Text>



            <Text style={styles.emptyText}>

              Employee records will appear here
              once they are created.

            </Text>



          </View>

        }




        renderItem={({item})=>(


          <EmployeeCard

            firstName={item.first_name}

            lastName={item.last_name}

            employeeNumber={
              item.employee_number
            }

            position={
              item.position_name
            }

            department={
              item.department_name
            }

            status={
              item.status
            }

            onPress={()=>{

            }}

          />


        )}


      />


    </SafeAreaView>

  );

}




const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:COLORS.bg,
},


content:{
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
  marginBottom:4,
},


hero:{
  flexDirection:"row",
  alignItems:"flex-start",
  gap:14,
  marginBottom:18,
},


heroIcon:{
  width:52,
  height:52,
  borderRadius:16,
  backgroundColor:COLORS.primarySoft,
  justifyContent:"center",
  alignItems:"center",
},


heroText:{
  flex:1,
  paddingTop:2,
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



statsRow:{
  flexDirection:"row",
  gap:10,
  marginBottom:16,
},


statCard:{
  flex:1,
  backgroundColor:COLORS.card,
  borderRadius:16,
  paddingVertical:14,
  alignItems:"center",
  borderWidth:1,
  borderColor:COLORS.border,
},


statCardAccent:{
  backgroundColor:"#ECFDF5",
  borderColor:"#A7F3D0",
},


statValue:{
  fontSize:22,
  fontWeight:"800",
  color:COLORS.ink,
},


statValueAccent:{
  color:"#047857",
},


statLabel:{
  fontSize:12,
  fontWeight:"600",
  color:COLORS.muted,
},


ctaCard:{
  backgroundColor:COLORS.card,
  borderRadius:20,
  padding:16,
  marginBottom:20,
  borderWidth:1,
  borderColor:COLORS.border,
  gap:12,
},


ctaCopy:{
  gap:4,
},


ctaTitle:{
  fontSize:16,
  fontWeight:"700",
  color:COLORS.ink,
},


ctaSubtitle:{
  fontSize:13,
  lineHeight:18,
  color:COLORS.muted,
},


sectionLabel:{
  fontSize:13,
  fontWeight:"700",
  color:COLORS.muted,
  textTransform:"uppercase",
  letterSpacing:0.6,
  marginBottom:12,
},


emptyContainer:{
  marginTop:24,
  alignItems:"center",
  paddingHorizontal:12,
},


emptyIconWrap:{
  width:72,
  height:72,
  borderRadius:22,
  backgroundColor:COLORS.primarySoft,
  justifyContent:"center",
  alignItems:"center",
  marginBottom:16,
},


emptyTitle:{
  fontSize:18,
  fontWeight:"700",
  color:COLORS.ink,
  marginBottom:8,
},


emptyText:{
  fontSize:14,
  lineHeight:21,
  color:COLORS.muted,
  textAlign:"center",
  maxWidth:300,
},


});