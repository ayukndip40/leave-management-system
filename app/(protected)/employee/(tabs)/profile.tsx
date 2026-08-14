import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppButton from "../../../../components/Button/AppButton";

import { useAuth } from "../../../../contexts/AuthContext";
import { useEffect, useState } from "react";

import { getCurrentUser } from "../../../../services/api/authService";

const COLORS = {
  ink: "#050505",
  muted: "#65676B",
  border: "#E4E6EB",
  card: "#FFFFFF",
  bg: "#F0F2F5",
  primary: "#1877F2",
};

interface User {
  first_name: string;
  last_name: string;
  employee_number: string;
  email: string;
  phone?: string;
  role: string;

  department_name?: string;
  position_name?: string;

  marital_status?: string;
  address?: string;
  city?: string;

  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getCurrentUser();

      console.log("CURRENT USER:", response);

      setUser(response.user);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <Text style={styles.emptyTitle}>Unable to load profile</Text>
      </SafeAreaView>
    );
  }

  const initials = `${user.first_name?.charAt(0) ?? ""}${
    user.last_name?.charAt(0) ?? ""
  }`;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.heroText}>
            <Text style={styles.name}>
              {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>
        </View>

        <Text style={styles.groupLabel}>Details</Text>

        <View style={styles.group}>
          <ProfileItem
            icon="badge-account-outline"
            label="Employee number"
            value={user.employee_number}
          />

          <ProfileItem icon="email-outline" label="Email" value={user.email} />

          <ProfileItem
            icon="phone-outline"
            label="Phone"
            value={user.phone || "Not provided"}
          />

          <ProfileItem
            icon="office-building-outline"
            label="Department"
            value={user.department_name || "Not assigned"}
          />

          <ProfileItem
            icon="briefcase-outline"
            label="Position"
            value={user.position_name || "Not assigned"}
          />

          <ProfileItem
            icon="heart-outline"
            label="Marital status"
            value={user.marital_status || "Not provided"}
          />

          <ProfileItem
            icon="map-marker-outline"
            label="Address"
            value={user.address || "Not provided"}
          />

          <ProfileItem
            icon="city-variant-outline"
            label="City"
            value={user.city || "Not provided"}
          />

          <ProfileItem
            icon="account-alert-outline"
            label="Emergency contact"
            value={user.emergency_contact_name || "Not provided"}
          />

          <ProfileItem
            icon="phone-alert-outline"
            label="Emergency phone"
            value={user.emergency_contact_phone || "Not provided"}
            isLast
          />
        </View>

        <View style={styles.editWrap}>
          <AppButton
            title="Complete / Edit Profile"
            icon="account-edit-outline"
            onPress={() =>
              router.push(
                "/(protected)/employee/profile/edit"
              )
            }
          />
        </View>

        <View style={styles.logoutWrap}>
          <AppButton title="Logout" icon="logout" variant="danger" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileItem({
  icon,
  label,
  value,
  isLast,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <MaterialCommunityIcons name={icon} size={20} color={COLORS.muted} />
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  heroText: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.ink,
  },

  role: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
    textTransform: "capitalize",
  },

  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 20,
    marginBottom: 6,
    marginLeft: 4,
  },

  group: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  rowCopy: {
    flex: 1,
  },

  rowLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },

  rowValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.ink,
    marginTop: 1,
  },

  logoutWrap: {
    marginTop: 24,
  },

  editWrap: {
    marginTop: 24,
  },

  emptyTitle: {
    fontSize: 15,
    color: COLORS.muted,
  },
});