import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  getUsers,
} from "../../../../services/api/userService";

import {
  User,
} from "../../../../types/user";

import EmployeeSearch from "../../../../components/Employee/EmployeeSearch";
import EmployeeList from "../../../../components/Employee/EmployeeList";
import AppButton from "../../../../components/Button/AppButton";

import {
  useSnackbar,
} from "../../../../contexts/SnackbarContext";


const COLORS = {

  bg: "#F4F7FC",

  ink: "#0F172A",

  muted: "#64748B",

  border: "#E2E8F0",

  card: "#FFFFFF",

  primary: "#2563EB",

  primarySoft:
    "rgba(37, 99, 235, 0.1)",

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
        accent &&
        styles.statCardAccent,
      ]}
    >

      <Text
        style={[
          styles.statValue,
          accent &&
          styles.statValueAccent,
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



export default function EmployeesScreen() {


  const router = useRouter();

  const {
    showSnackbar,
  } = useSnackbar();



  const [
    employees,
    setEmployees,
  ] = useState<User[]>([]);



  const [
    search,
    setSearch,
  ] = useState("");



  const [
    loading,
    setLoading,
  ] = useState(true);



  const [
    refreshing,
    setRefreshing,
  ] = useState(false);



  const fetchEmployees = async () => {

    try {

      const response =
        await getUsers();


      setEmployees(
        response.data
      );


    } catch(error){

      console.log(error);

      showSnackbar(
        "Failed to load employees",
        "error"
      );

    }
    finally{

      setLoading(false);

      setRefreshing(false);

    }

  };



  useFocusEffect(

    useCallback(() => {

      fetchEmployees();

    }, [])

  );



  const onRefresh = () => {

    setRefreshing(true);

    fetchEmployees();

  };



  const filteredEmployees =
    useMemo(() => {

      const keyword =
        search.toLowerCase();


      return employees.filter(
        (employee)=>


          employee.first_name
          ?.toLowerCase()
          .includes(keyword)

          ||

          employee.last_name
          ?.toLowerCase()
          .includes(keyword)

          ||

          employee.employee_number
          ?.toLowerCase()
          .includes(keyword)

          ||

          employee.email
          ?.toLowerCase()
          .includes(keyword)

      );


    },[
      employees,
      search
    ]);




  const activeEmployees =
    employees.filter(
      e => e.status === "active"
    ).length;



  const inactiveEmployees =
    employees.length -
    activeEmployees;



  const header = (

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

            Manage employee profiles,
            departments and positions.

          </Text>


        </View>


      </View>





      <View style={styles.statsRow}>


        <SummaryStat

          label="Total"

          value={
            employees.length
          }

        />


        <SummaryStat

          label="Active"

          value={
            activeEmployees
          }

          accent

        />


        <SummaryStat

          label="Inactive"

          value={
            inactiveEmployees
          }

        />


      </View>





      <View style={styles.ctaCard}>


        <View>

          <Text style={styles.ctaTitle}>

            Add new employee

          </Text>


          <Text style={styles.ctaSubtitle}>

            Create employee accounts
            and assign roles.

          </Text>


        </View>



        <AppButton

          title="Add Employee"

          icon="plus"

          onPress={() =>
            router.push(
              "/(protected)/admin/employees/create"
            )
          }

        />


      </View>





      <EmployeeSearch

        value={search}

        onChangeText={setSearch}

      />





      {
        filteredEmployees.length > 0
        &&
        <Text style={styles.sectionLabel}>

          Employee List

        </Text>
      }



    </View>

  );





  if(loading){

    return (

      <SafeAreaView
        style={styles.center}
        edges={[
          "top"
        ]}
      >

        <Text>
          Loading employees...
        </Text>

      </SafeAreaView>

    );

  }





  return (

    <SafeAreaView

      style={styles.container}

      edges={[
        "top"
      ]}

    >


      <FlatList

        data={
          filteredEmployees
        }


        keyExtractor={
          item =>
            item.user_uuid
        }



        ListHeaderComponent={
          header
        }



        renderItem={({item})=>(


          <EmployeeList

            employees={[
              item
            ]}

            onEmployeePress={
              (employee)=>

                router.push(

                  `/(protected)/admin/employees/${employee.user_uuid}`

                )

            }

          />


        )}



        refreshControl={

          <RefreshControl

            refreshing={
              refreshing
            }

            onRefresh={
              onRefresh
            }

            tintColor={
              COLORS.primary
            }

          />

        }



        ListEmptyComponent={


          <View style={styles.emptyContainer}>


            <View style={styles.emptyIconWrap}>

              <MaterialCommunityIcons

                name="account-off-outline"

                size={40}

                color={
                  COLORS.primary
                }

              />


            </View>



            <Text style={styles.emptyTitle}>

              No employees found

            </Text>



            <Text style={styles.emptyText}>

              Employees you create will
              appear here.

            </Text>


          </View>


        }



        contentContainerStyle={
          styles.list
        }



        showsVerticalScrollIndicator={
          false
        }


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
  paddingBottom:32,
},


headerBlock:{
  marginBottom:10,
},


center:{
  flex:1,
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:COLORS.bg,
},


hero:{
  flexDirection:"row",
  alignItems:"center",
  gap:14,
  marginBottom:18,
},


heroIcon:{
  width:52,
  height:52,
  borderRadius:16,
  backgroundColor:
    COLORS.primarySoft,
  alignItems:"center",
  justifyContent:"center",
},


heroText:{
  flex:1,
},


title:{
  fontSize:24,
  fontWeight:"800",
  color:COLORS.ink,
},


subtitle:{
  marginTop:5,
  fontSize:14,
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
},


statValue:{
  fontSize:22,
  fontWeight:"800",
  color:COLORS.ink,
},


statValueAccent:{
  color:"#059669",
},


statLabel:{
  marginTop:4,
  fontSize:12,
  color:COLORS.muted,
},


ctaCard:{
  backgroundColor:COLORS.card,
  borderRadius:20,
  padding:16,
  marginBottom:16,
  borderWidth:1,
  borderColor:COLORS.border,
  gap:12,
},


ctaTitle:{
  fontSize:16,
  fontWeight:"700",
  color:COLORS.ink,
},


ctaSubtitle:{
  marginTop:4,
  fontSize:13,
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
  alignItems:"center",
  marginTop:30,
},


emptyIconWrap:{
  width:72,
  height:72,
  borderRadius:22,
  backgroundColor:
    COLORS.primarySoft,
  justifyContent:"center",
  alignItems:"center",
},


emptyTitle:{
  marginTop:16,
  fontSize:18,
  fontWeight:"700",
  color:COLORS.ink,
},


emptyText:{
  marginTop:8,
  color:COLORS.muted,
  textAlign:"center",
},


});