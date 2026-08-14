import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import EmployeeForm from "../../../../components/Employee/EmployeeForm";

import SuccessDialog from "../../../../components/Feedback/Dialog/SuccessDialog";
import ErrorDialog from "../../../../components/Feedback/Dialog/ErrorDialog";

import {
  createUser,
} from "../../../../services/api/userService";

import {
  CreateUserRequest,
} from "../../../../types/user";


const COLORS = {
  bg: "#F4F7FC",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
};


export default function CreateEmployeeScreen() {

  const [loading, setLoading] = useState(false);

  const [successVisible, setSuccessVisible] =
    useState(false);

  const [errorVisible, setErrorVisible] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [credentials, setCredentials] = useState({
    employee_number: "",
    temporary_password: "",
  });


  const handleCreate = async (
    data: CreateUserRequest
  ) => {

    try {

      setLoading(true);

      const response =
        await createUser(data);


      setCredentials({

        employee_number:
          response.employee_number,

        temporary_password:
          response.temporary_password,

      });


      setSuccessVisible(true);


    } catch (error: any) {


      setErrorMessage(
        error?.response?.data?.message ||
        "Unable to create employee."
      );


      setErrorVisible(true);


    } finally {

      setLoading(false);

    }

  };


  return (

    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >


        {/* Hero Header */}

        <View style={styles.hero}>

          <View style={styles.heroIcon}>

            <MaterialCommunityIcons
              name="account-plus-outline"
              size={28}
              color={COLORS.primary}
            />

          </View>


          <View style={styles.heroText}>

            <Text style={styles.title}>
              Create Employee
            </Text>


            <Text style={styles.subtitle}>
              Add a new employee profile and
              generate login credentials.
            </Text>

          </View>

        </View>



        {/* Form Card */}

        <View style={styles.formCard}>


          <Text style={styles.sectionTitle}>
            Employee Information
          </Text>


          <Text style={styles.sectionSubtitle}>
            Fill in the details below to create
            an employee account.
          </Text>



          <EmployeeForm

            submitText="Create Employee"

            loading={loading}

            onSubmit={handleCreate}

          />


        </View>


      </ScrollView>



      <SuccessDialog

        visible={successVisible}

        title="Employee Created Successfully"

        items={[

          {
            label:"Employee Number",
            value:
              credentials.employee_number,
            copyable:true,
          },


          {
            label:"Temporary Password",
            value:
              credentials.temporary_password,
            copyable:true,
          },

        ]}


        onConfirm={() => {

          setSuccessVisible(false);

          router.back();

        }}

      />



      <ErrorDialog

        visible={errorVisible}

        title="Create Employee Failed"

        message={errorMessage}

        onDismiss={() =>
          setErrorVisible(false)
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


  content:{
    padding:16,
    paddingBottom:40,
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


  formCard:{
    backgroundColor:COLORS.card,
    borderRadius:20,
    padding:16,
    borderWidth:1,
    borderColor:COLORS.border,
  },


  sectionTitle:{
    fontSize:17,
    fontWeight:"700",
    color:COLORS.ink,
    marginBottom:6,
  },


  sectionSubtitle:{
    fontSize:13,
    lineHeight:18,
    color:COLORS.muted,
    marginBottom:18,
  },


});