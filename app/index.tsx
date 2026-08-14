import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/role";

export default function Index() {
  const { user, isLoading } = useAuth();

  // Wait while restoring the session
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Not logged in
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Employee
  if (user.role === UserRole.EMPLOYEE) {
    return <Redirect href="/(protected)/employee/(tabs)" />;
  }

  // HR
  if (user.role === UserRole.HR) {
    return <Redirect href="/(protected)/hr/(tabs)" />;
  }

  // Admin
  if (user.role === UserRole.ADMIN) {
    return <Redirect href="/(protected)/admin/(tabs)" />;
  }

  // Unknown role
  return <Redirect href="/(auth)/login" />;
}