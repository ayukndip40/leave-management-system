import React from "react";
import { Snackbar } from "react-native-paper";

interface Props {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

export default function AppSnackbar({
  visible,
  message,
  onDismiss,
}: Props) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={3000}
      action={{
        label: "Close",
        onPress: onDismiss,
      }}
    >
      {message}
    </Snackbar>
  );
}