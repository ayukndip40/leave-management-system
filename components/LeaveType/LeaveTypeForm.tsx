import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppInput from "../Input/AppInput";
import AppButton from "../Button/AppButton";

import { CreateLeaveTypeData } from "../../types/leaveType";

const COLORS = {
  ink: "#050505",
  muted: "#65676B",
  border: "#E4E6EB",
  card: "#FFFFFF",
  bg: "#F0F2F5",
  primary: "#1877F2",
};

const PRESET_COLORS = [
  "#1877F2",
  "#059669",
  "#DC2626",
  "#D97706",
  "#7C3AED",
  "#0E7490",
];

interface LeaveTypeFormProps {
  form: CreateLeaveTypeData;
  errors: Record<string, string>;
  loading: boolean;
  submitText: string;

  updateField: (field: keyof CreateLeaveTypeData, value: any) => void;

  onSubmit: () => void;
}

function isValidHexColor(value: string): boolean {
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value.trim());
}

function GroupLabel({ children }: { children: string }) {
  return <Text style={styles.groupLabel}>{children}</Text>;
}

function Group({ children }: { children: React.ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

function PolicyRow({
  icon,
  title,
  description,
  value,
  onValueChange,
  isLast,
}: {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  description: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <MaterialCommunityIcons name={icon} size={20} color={COLORS.muted} />
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} color={COLORS.primary} />
    </View>
  );
}

export default function LeaveTypeForm({
  form,
  errors,
  loading,
  submitText,
  updateField,
  onSubmit,
}: LeaveTypeFormProps) {
  const previewColor = isValidHexColor(form.color) ? form.color.trim() : "#94A3B8";

  return (
    <View style={styles.root}>
      <GroupLabel>Basic details</GroupLabel>
      <Group>
        <View style={styles.fieldRow}>
          <AppInput
            label="Leave name"
            value={form.leave_name}
            error={!!errors.leave_name}
            errorMessage={errors.leave_name}
            onChangeText={(text) => updateField("leave_name", text)}
          />
        </View>

        <View style={styles.rowDivider} />

        <View style={styles.fieldRow}>
          <AppInput
            label="Description"
            value={form.description}
            multiline
            numberOfLines={4}
            error={!!errors.description}
            errorMessage={errors.description}
            onChangeText={(text) => updateField("description", text)}
          />
        </View>

        <View style={styles.rowDivider} />

        <View style={styles.fieldRow}>
          <AppInput
            label="Maximum days"
            value={form.maximum_days.toString()}
            keyboardType="numeric"
            error={!!errors.maximum_days}
            errorMessage={errors.maximum_days}
            onChangeText={(text) => updateField("maximum_days", Number(text) || 0)}
          />
        </View>
      </Group>

      <GroupLabel>Policy</GroupLabel>
      <Group>
        <PolicyRow
          icon="cash-check"
          title="Paid leave"
          description="Employees receive salary during this leave."
          value={form.paid_leave}
          onValueChange={(value) => updateField("paid_leave", value)}
        />
        <PolicyRow
          icon="paperclip"
          title="Requires supporting document"
          description="Employees must upload proof when applying."
          value={form.requires_document}
          onValueChange={(value) => updateField("requires_document", value)}
          isLast
        />
      </Group>

      <GroupLabel>Appearance</GroupLabel>
      <Group>
        <View style={styles.colorPreviewRow}>
          <View style={[styles.colorSwatch, { backgroundColor: previewColor }]} />
          <View style={styles.colorPreviewMeta}>
            <Text style={styles.colorPreviewLabel}>Badge color</Text>
            <Text style={styles.colorPreviewHex}>
              {form.color.trim() || "Enter a hex color"}
            </Text>
          </View>
        </View>

        <View style={styles.rowDivider} />

        <View style={styles.presetRow}>
          {PRESET_COLORS.map((hex) => {
            const selected = form.color.trim().toLowerCase() === hex.toLowerCase();
            return (
              <Pressable
                key={hex}
                onPress={() => updateField("color", hex)}
                accessibilityRole="button"
                accessibilityLabel={`Select color ${hex}`}
                style={[
                  styles.presetDot,
                  { backgroundColor: hex },
                  selected && styles.presetDotSelected,
                ]}
              />
            );
          })}
        </View>

        <View style={styles.rowDivider} />

        <View style={styles.fieldRow}>
          <AppInput
            label="Color (hex)"
            value={form.color}
            error={!!errors.color}
            errorMessage={errors.color}
            onChangeText={(text) => updateField("color", text)}
          />
        </View>
      </Group>

      <AppButton title={submitText} loading={loading} onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: 8,
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

  fieldRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  rowDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  rowCopy: {
    flex: 1,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.ink,
  },

  rowDescription: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 1,
  },

  colorPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },

  colorPreviewMeta: {
    flex: 1,
  },

  colorPreviewLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },

  colorPreviewHex: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.ink,
    marginTop: 1,
  },

  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  presetDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },

  presetDotSelected: {
    borderColor: COLORS.ink,
  },
});