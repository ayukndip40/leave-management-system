import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Button } from "react-native-paper";

const COLORS = {
  ink: "#0F172A",
  primary: "#1877F2",
  danger: "#DC2626",
};

interface AppButtonProps {
  title: string;
  onPress: () => void;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  variant?: "primary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export default function AppButton({
  title,
  onPress,
  mode = "contained",
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  style,
}: AppButtonProps) {
  const accent = variant === "danger" ? COLORS.danger : COLORS.primary;

  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      buttonColor={mode === "contained" ? accent : undefined}
      textColor={mode === "contained" ? "#FFFFFF" : accent}
      rippleColor="rgba(255,255,255,0.2)"
      contentStyle={styles.content}
      style={[styles.button, style]}
      labelStyle={styles.label}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    marginVertical: 6,
  },

  content: {
    height: 42,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
});