import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppInput from "../Input/AppInput";
import AppButton from "../Button/AppButton";
import AppSelect from "../Select/AppSelect";
import AppDatePicker from "../DatePicker/AppDatePicker";

import {
  getDepartments,
  Department,
} from "../../services/api/departmentService";

import {
  getPositions,
  Position,
} from "../../services/api/positionService";

import { CreateUserRequest } from "../../types/user";


interface EmployeeFormProps {
  initialValues?: Partial<CreateUserRequest>;

  loading?: boolean;

  submitText: string;

  onSubmit: (
    data: CreateUserRequest
  ) => void;
}


const COLORS = {
  bg: "#F4F7FC",
  card: "#FFFFFF",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  primary: "#2563EB",
};


export default function EmployeeForm({
  initialValues,
  loading = false,
  submitText,
  onSubmit,
}: EmployeeFormProps) {


const [form, setForm] =
useState<CreateUserRequest>({
  first_name:
    initialValues?.first_name ?? "",

  last_name:
    initialValues?.last_name ?? "",

  email:
    initialValues?.email ?? "",

  phone:
    initialValues?.phone ?? "",

  role:
    initialValues?.role ?? "employee",

  department_id:
    initialValues?.department_id ?? 0,

  position_id:
    initialValues?.position_id ?? 0,

  gender:
    initialValues?.gender ?? "Male",

  employment_type:
    initialValues?.employment_type ?? "Permanent",

  employment_date:
    initialValues?.employment_date ?? "",

  date_of_birth:
    initialValues?.date_of_birth ?? "",
});


const [departments,setDepartments] =
useState<Department[]>([]);


const [positions,setPositions] =
useState<Position[]>([]);


const [errors,setErrors] =
useState<Record<string,string>>({});



const updateField = (
 field:keyof CreateUserRequest,
 value:string|number
)=>{

setForm(previous=>({
 ...previous,
 [field]:value
}));

setErrors(previous=>({
 ...previous,
 [field]:""
}));

};



const validateForm = ()=>{

const validationErrors:
Record<string,string> = {};


if(!form.first_name.trim())
validationErrors.first_name =
"First name is required";


if(!form.last_name.trim())
validationErrors.last_name =
"Last name is required";


if(!form.email.trim())
validationErrors.email =
"Email is required";


if(!form.phone.trim())
validationErrors.phone =
"Phone number is required";


if(form.department_id===0)
validationErrors.department_id =
"Select department";


if(form.position_id===0)
validationErrors.position_id =
"Select position";


if(!form.date_of_birth)
validationErrors.date_of_birth =
"Date of birth required";


if(!form.employment_date)
validationErrors.employment_date =
"Employment date required";


setErrors(validationErrors);


return Object.keys(validationErrors).length===0;

};



const handleSubmit=()=>{

if(!validateForm())
return;


onSubmit(form);

};



const loadData=async()=>{

try{

const [
departmentResponse,
positionResponse
]=await Promise.all([
 getDepartments(),
 getPositions()
]);


setDepartments(
 departmentResponse.data
);


setPositions(
 positionResponse.data
);


}catch(error){

console.log(error);

}

};



useEffect(()=>{
loadData();
},[]);



return (

<ScrollView
showsVerticalScrollIndicator={false}
contentContainerStyle={styles.container}
>


<View style={styles.card}>


<Text style={styles.sectionTitle}>
Personal Information
</Text>


<AppInput
label="First Name"
value={form.first_name}
error={errors.first_name}
onChangeText={(text)=>
updateField(
"first_name",
text
)}
/>


<AppInput
label="Last Name"
value={form.last_name}
error={errors.last_name}
onChangeText={(text)=>
updateField(
"last_name",
text
)}
/>


<AppInput
label="Email"
keyboardType="email-address"
autoCapitalize="none"
value={form.email}
error={errors.email}
onChangeText={(text)=>
updateField(
"email",
text
)}
/>


<AppInput
label="Phone Number"
keyboardType="phone-pad"
value={form.phone}
error={errors.phone}
onChangeText={(text)=>
updateField(
"phone",
text
)}
/>


<AppSelect
label="Gender"
value={form.gender}
items={[
{
label:"Male",
value:"Male"
},
{
label:"Female",
value:"Female"
},
{
label:"Other",
value:"Other"
},
]}
onChange={(value)=>
updateField(
"gender",
value as string
)}
/>



<AppDatePicker
label="Date of Birth"
value={form.date_of_birth}
error={errors.date_of_birth}
maximumDate={new Date()}
onChange={(value)=>
updateField(
"date_of_birth",
value
)}
/>


</View>




<View style={styles.card}>


<Text style={styles.sectionTitle}>
Employment Information
</Text>



<AppSelect
label="Department"
value={form.department_id}
error={errors.department_id}
items={
departments.map(item=>({
label:item.department_name,
value:item.id
}))
}
onChange={(value)=>
updateField(
"department_id",
Number(value)
)}
/>




<AppSelect
label="Position"
value={form.position_id}
error={errors.position_id}
items={
positions.map(item=>({
label:item.position_name,
value:item.id
}))
}
onChange={(value)=>
updateField(
"position_id",
Number(value)
)}
/>



<AppSelect
label="Role"
value={form.role}
items={[
{
label:"Employee",
value:"employee"
},
{
label:"HR",
value:"hr"
},
{
label:"Admin",
value:"admin"
}
]}
onChange={(value)=>
updateField(
"role",
value as string
)}
/>



<AppSelect
label="Employment Type"
value={form.employment_type}
items={[
{
label:"Permanent",
value:"Permanent"
},
{
label:"Contract",
value:"Contract"
},
{
label:"Temporary",
value:"Temporary"
},
{
label:"Intern",
value:"Intern"
}
]}
onChange={(value)=>
updateField(
"employment_type",
value as string
)}
/>



<AppDatePicker
label="Employment Date"
value={form.employment_date}
error={errors.employment_date}
onChange={(value)=>
updateField(
"employment_date",
value
)}
/>



</View>



<AppButton
title={submitText}
loading={loading}
onPress={handleSubmit}
/>


</ScrollView>

);

}



const styles = StyleSheet.create({

container:{
padding:16,
paddingBottom:40,
backgroundColor:COLORS.bg,
},


card:{
backgroundColor:COLORS.card,
borderRadius:20,
padding:16,
marginBottom:16,
borderWidth:1,
borderColor:COLORS.border,
},


sectionTitle:{
fontSize:17,
fontWeight:"800",
color:COLORS.ink,
marginBottom:18,
},


});