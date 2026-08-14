import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import Screen from "../../../../../components/Layout/Screen";

export default function EditEmployeeScreen() {
  const { id } = useLocalSearchParams();

  const [employeeNumber, setEmployeeNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    // Replace this with your API call
    setEmployeeNumber("EMP001");
    setFirstName("Ayuk");
    setLastName("Ndip Elvis");
    setEmail("ayuk@example.com");
    setPhone("654951794");
    setPosition("Software Engineer");
  }, [id]);

  const handleUpdateEmployee = async () => {
    console.log({
      id,
      employeeNumber,
      firstName,
      lastName,
      email,
      phone,
      position,
    });

    router.back();
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text
          variant="headlineMedium"
          style={styles.title}
        >
          Edit Employee
        </Text>

        <TextInput
          label="Employee Number"
          mode="outlined"
          value={employeeNumber}
          onChangeText={setEmployeeNumber}
          style={styles.input}
        />

        <TextInput
          label="First Name"
          mode="outlined"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />

        <TextInput
          label="Last Name"
          mode="outlined"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          label="Phone"
          mode="outlined"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />

        <TextInput
          label="Position"
          mode="outlined"
          value={position}
          onChangeText={setPosition}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleUpdateEmployee}
        >
          Update Employee
        </Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },

  title: {
    marginBottom: 20,
    fontWeight: "bold",
  },

  input: {
    marginBottom: 16,
  },
});