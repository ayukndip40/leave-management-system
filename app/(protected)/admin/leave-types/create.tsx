import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../../../components/Layout/Screen";

import LeaveTypeForm from "../../../../components/LeaveType/LeaveTypeForm";
import SuccessDialog from "../../../../components/Feedback/Dialog/SuccessDialog";

import { createLeaveType } from "../../../../services/api/leaveTypeService";
import { CreateLeaveTypeData } from "../../../../types/leaveType";

const COLORS = {
  ink: "#050505",
  muted: "#65676B",
  border: "#E4E6EB",
  card: "#FFFFFF",
};

export default function CreateLeaveTypeScreen() {
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [successVisible, setSuccessVisible] = useState(false);

  const [form, setForm] = useState<CreateLeaveTypeData>({
    leave_name: "",
    description: "",
    maximum_days: 1,
    paid_leave: true,
    requires_document: false,
    color: "#1976D2",
  });

  const updateField = (field: keyof CreateLeaveTypeData, value: any) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.leave_name.trim()) {
      newErrors.leave_name = "Leave name is required.";
    }

    if (form.maximum_days < 1) {
      newErrors.maximum_days = "Maximum days must be at least 1.";
    }

    if (!form.color.trim()) {
      newErrors.color = "Color is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await createLeaveType(form);

      setSuccessVisible(true);
    } catch (error: any) {
      console.log(error);

      if (error.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};

        error.response.data.errors.forEach((item: any) => {
          backendErrors[item.path] = item.msg;
        });

        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.ink} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>Create Leave Type</Text>

        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LeaveTypeForm
            form={form}
            errors={errors}
            loading={loading}
            submitText="Create Leave Type"
            updateField={updateField}
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessDialog
        visible={successVisible}
        title="Leave Type Created"
        message="The leave type has been created successfully."
        onDismiss={() => {
          setSuccessVisible(false);

          router.replace("/(protected)/admin/leave-types");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },

  flex: {
    flex: 1,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.ink,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
});