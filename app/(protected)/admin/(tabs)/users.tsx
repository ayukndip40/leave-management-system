import { Redirect } from "expo-router";

export default function UsersTab() {
  return (
    <Redirect
      href="/(protected)/admin/employees"
    />
  );
}