import React from "react";
import { StyleSheet } from "react-native";
import { TextInput, HelperText } from "react-native-paper";

const COLORS = {
  ink: "#050505",
  muted: "#65676B",
  bg: "#F0F2F5",
  danger: "#DC2626",
};

interface AppInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";

  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;

  error?: boolean;
  errorMessage?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function AppInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  leftIcon,
  rightIcon,
  onRightIconPress,
  error = false,
  errorMessage,
  multiline = false,
  numberOfLines,
}: AppInputProps) {
  return (
    <>
      <TextInput
        mode="flat"
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        error={error}
        autoCapitalize="none"
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[styles.input, multiline && styles.inputMultiline]}
        underlineStyle={styles.underline}
        contentStyle={styles.content}
        activeUnderlineColor="#1877F2"
        textColor={COLORS.ink}
        placeholderTextColor={COLORS.muted}
        left={leftIcon ? <TextInput.Icon icon={leftIcon} color={COLORS.muted} /> : undefined}
        right={
          rightIcon ? (
            <TextInput.Icon icon={rightIcon} color={COLORS.muted} onPress={onRightIconPress} />
          ) : undefined
        }
      />

      {errorMessage ? <HelperText type="error">{errorMessage}</HelperText> : null}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    marginBottom: 14,
  },

  inputMultiline: {
    minHeight: 100,
  },

  underline: {
    display: "none",
  },

  content: {
    paddingTop: 18,
  },
});