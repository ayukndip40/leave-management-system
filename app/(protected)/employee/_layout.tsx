import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { UserRole } from "../../../types/role";

export default function EmployeeLayout() {
  const { user } = useAuth();

  if (user?.role !== UserRole.EMPLOYEE) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="leave/create"
        options={{
          presentation: "modal",
          title: "Apply for Leave",
        }}
      />

      <Stack.Screen
        name="leave/[leave_request_uuid]"
        options={{
          title: "Leave Details",
        }}
      />
    </Stack>
  );
}