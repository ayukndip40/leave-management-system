import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { UserRole } from "../../../types/role";

export default function HrLayout() {
  const { user } = useAuth();

  if (user?.role !== UserRole.HR) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}