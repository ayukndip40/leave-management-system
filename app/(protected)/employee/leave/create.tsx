import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import Button from "../../../../components/Button/AppButton";

import AttachmentPicker, {
  SelectedFile,
} from "../../../../components/attachments/AttachmentPicker";

import leaveService from "../../../../services/api/leaveService";
import { getLeaveTypes } from "../../../../services/api/leaveTypeService";

const COLORS = {
  bg: "#F4F7FC",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
};

interface LeaveType {
  leave_type_uuid: string;
  leave_name: string;
  requires_document: boolean;
}

export default function CreateLeaveScreen() {
  const router = useRouter();

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  const [leaveTypeUuid, setLeaveTypeUuid] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [reason, setReason] = useState("");

  const [attachments, setAttachments] = useState<SelectedFile[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      const response = await getLeaveTypes();

      setLeaveTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async () => {
    if (!leaveTypeUuid) {
      return Alert.alert("Validation", "Select a leave type.");
    }

    if (!startDate || !endDate) {
      return Alert.alert("Validation", "Select leave dates.");
    }

    if (!reason.trim()) {
      return Alert.alert("Validation", "Reason is required.");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("leave_type_uuid", leaveTypeUuid);

      formData.append("start_date", startDate);

      formData.append("end_date", endDate);

      formData.append("reason", reason);

      attachments.forEach((file) => {
        formData.append("attachments", {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);
      });

      await leaveService.createLeaveRequest(formData);

      Alert.alert("Success", "Leave request submitted successfully.");

      router.back();
    } catch (error: any) {
      console.log(error.response?.data);

      Alert.alert(
        "Error",
        error?.response?.data?.message ?? "Unable to submit leave request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name="calendar-plus-outline"
              size={26}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.title}>Apply for leave</Text>
            <Text style={styles.subtitle}>
              Fill in the details below to submit a new request.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Leave type</Text>

          <View style={styles.leaveTypeList}>
            {leaveTypes.map((type) => {
              const selected = leaveTypeUuid === type.leave_type_uuid;

              return (
                <View
                  key={type.leave_type_uuid}
                  style={[
                    styles.leaveTypeRow,
                    selected && styles.leaveTypeRowSelected,
                  ]}
                >
                  <Text
                    onPress={() => setLeaveTypeUuid(type.leave_type_uuid)}
                    style={[
                      styles.leaveType,
                      selected && styles.leaveTypeSelected,
                    ]}
                  >
                    {type.leave_name}
                  </Text>

                  {selected ? (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={COLORS.primary}
                    />
                  ) : null}
                </View>
              );
            })}
          </View>

          <Text style={styles.label}>Start date</Text>

          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.muted}
            value={startDate}
            onChangeText={setStartDate}
            style={styles.input}
          />

          <Text style={styles.label}>End date</Text>

          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.muted}
            value={endDate}
            onChangeText={setEndDate}
            style={styles.input}
          />

          <Text style={styles.label}>Reason</Text>

          <TextInput
            multiline
            numberOfLines={5}
            placeholder="Briefly describe your reason for leave"
            placeholderTextColor={COLORS.muted}
            value={reason}
            onChangeText={setReason}
            style={[styles.input, styles.textArea]}
          />

          <Text style={styles.label}>Supporting documents</Text>

          <AttachmentPicker files={attachments} setFiles={setAttachments} />
        </View>

        <Button
          title={loading ? "Submitting..." : "Submit leave request"}
          disabled={loading}
          onPress={submit}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  hero: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 20,
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  heroText: {
    flex: 1,
    paddingTop: 2,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.3,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },

  leaveTypeList: {
    marginBottom: 8,
    gap: 8,
  },

  leaveTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  leaveTypeRowSelected: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },

  leaveType: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.ink,
  },

  leaveTypeSelected: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  label: {
    marginBottom: 8,
    marginTop: 16,
    fontWeight: "600",
    fontSize: 13,
    color: COLORS.muted,
  },

  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: COLORS.ink,
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  submitButton: {
    marginTop: 4,
  },
});