import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../../../components/Layout/Screen";
import Loading from "../../../../components/Loading/index";
import AppButton from "../../../../components/Button/AppButton";

import { User } from "../../../../types/user";
import { getUserByUuid } from "../../../../services/api/userService";

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primarySoft: "rgba(37, 99, 235, 0.1)",
  dangerSoft: "#FEF2F2",
  danger: "#DC2626",
};

function DetailRow({
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
    <View
      style={[styles.detailRow, !isLast && styles.detailRowBorder]}
    >
      <View style={styles.detailIcon}>
        <MaterialCommunityIcons name={icon} size={16} color={COLORS.primary} />
      </View>

      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function EmployeeDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [employee, setEmployee] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployee = async () => {
    try {
      setLoading(true);

      const response = await getUserByUuid(id as string);

      setEmployee(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  if (loading) {
    return <Loading message="Loading employee..." />;
  }

  if (!employee) {
    return (
      <Screen>
        <View style={styles.notFoundWrap}>
          <View style={styles.notFoundIcon}>
            <MaterialCommunityIcons
              name="account-alert-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.notFoundText}>Employee not found</Text>
        </View>
      </Screen>
    );
  }

  const initials = `${employee.first_name?.charAt(0) ?? ""}${
    employee.last_name?.charAt(0) ?? ""
  }`;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.name}>
            {employee.first_name} {employee.last_name}
          </Text>

          <Text style={styles.subtitle}>{employee.position_name}</Text>

          <View style={styles.employeeNumberPill}>
            <Text style={styles.employeeNumberText}>
              {employee.employee_number}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Personal Information</Text>

        <View style={styles.card}>
          <DetailRow icon="email-outline" label="Email" value={employee.email} />
          <DetailRow icon="phone-outline" label="Phone" value={employee.phone || "-"} />
          <DetailRow icon="gender-male-female" label="Gender" value={employee.gender || "-"} />
          <DetailRow icon="cake-variant-outline" label="Date of Birth" value={employee.date_of_birth || "-"} />
          <DetailRow icon="heart-outline" label="Marital Status" value={employee.marital_status || "-"} />
          <DetailRow icon="map-marker-outline" label="Address" value={employee.address || "-"} />
          <DetailRow icon="city-variant-outline" label="City" value={employee.city || "-"} />
          <DetailRow
            icon="account-alert-outline"
            label="Emergency Contact"
            value={employee.emergency_contact_name || "-"}
          />
          <DetailRow
            icon="phone-alert-outline"
            label="Emergency Phone"
            value={employee.emergency_contact_phone || "-"}
            isLast
          />
        </View>

        <Text style={styles.sectionLabel}>Employment Information</Text>

        <View style={styles.card}>
          <DetailRow icon="office-building-outline" label="Department" value={employee.department_name} />
          <DetailRow icon="briefcase-outline" label="Position" value={employee.position_name} />
          <DetailRow icon="file-document-outline" label="Employment Type" value={employee.employment_type} />
          <DetailRow icon="calendar-outline" label="Employment Date" value={employee.employment_date} />
          <DetailRow icon="shield-account-outline" label="Role" value={employee.role} />
          <DetailRow icon="checkbox-marked-circle-outline" label="Status" value={employee.status} isLast />
        </View>

        <View style={styles.actions}>
          <AppButton
            title="Edit Employee"
            icon="pencil"
            onPress={() =>
              router.push(
                `/(protected)/admin/employees/edit/${employee.user_uuid}`
              )
            }
          />

          <AppButton
            title="Reset Password"
            icon="lock-reset"
            mode="outlined"
            onPress={() => {
              console.log("Reset Password");
            }}
          />

          <AppButton
            title="Change Status"
            icon="account-off"
            mode="outlined"
            onPress={() => {
              console.log("Change Status");
            }}
          />

          <AppButton
            title="Delete Employee"
            icon="delete"
            mode="contained-tonal"
            onPress={() => {
              console.log("Delete Employee");
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  hero: {
    alignItems: "center",
    paddingVertical: 24,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  name: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.3,
    marginBottom: 4,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 10,
  },

  employeeNumberPill: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  employeeNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
    marginTop: 12,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },

  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  detailIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  detailText: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.ink,
  },

  actions: {
    marginTop: 16,
    gap: 4,
  },

  notFoundWrap: {
    alignItems: "center",
    paddingVertical: 60,
  },

  notFoundIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  notFoundText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.ink,
  },
});