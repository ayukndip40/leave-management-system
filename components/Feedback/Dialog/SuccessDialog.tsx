import React from "react";
import { StyleSheet } from "react-native";
import {
  Text,
  Button,
  Divider,
} from "react-native-paper";
import * as Clipboard from "expo-clipboard";

import AppDialog from "./AppDialog";

interface SuccessItem {
  label: string;
  value: string;
  copyable?: boolean;
}

interface SuccessDialogProps {
  visible: boolean;

  title: string;

  message?: string;

  items?: SuccessItem[];

  confirmText?: string;

  onConfirm: () => void;
}

export default function SuccessDialog({
  visible,
  title,
  message,
  items = [],
  confirmText = "Done",
  onConfirm,
}: SuccessDialogProps) {
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <AppDialog
      visible={visible}
      title={title}
      confirmText={confirmText}
      onConfirm={onConfirm}
      dismissable={false}
    >
      {message && (
        <Text style={styles.message}>
          {message}
        </Text>
      )}

      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <Text
            variant="labelLarge"
            style={styles.label}
          >
            {item.label}
          </Text>

          <Text
            variant="bodyLarge"
            style={styles.value}
          >
            {item.value}
          </Text>

          {item.copyable && (
            <Button
              mode="text"
              icon="content-copy"
              onPress={() =>
                copyToClipboard(item.value)
              }
            >
              Copy
            </Button>
          )}

          {index < items.length - 1 && (
            <Divider style={styles.divider} />
          )}
        </React.Fragment>
      ))}
    </AppDialog>
  );
}

const styles = StyleSheet.create({
  message: {
    marginBottom: 16,
    textAlign: "center",
  },

  label: {
    marginTop: 12,
    color: "#666",
  },

  value: {
    marginTop: 4,
    fontWeight: "bold",
  },

  divider: {
    marginTop: 16,
  },
});