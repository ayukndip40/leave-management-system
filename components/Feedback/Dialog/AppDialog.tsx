import React from "react";
import {
  Portal,
  Dialog,
  Button,
} from "react-native-paper";

interface AppDialogProps {
  visible: boolean;

  title: string;

  children: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel?: () => void;

  dismissable?: boolean;
}

export default function AppDialog({
  visible,
  title,
  children,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
  dismissable = true,
}: AppDialogProps) {
  return (
    <Portal>
      <Dialog
        visible={visible}
        dismissable={dismissable}
        onDismiss={() => {
          if (dismissable) {
            onCancel?.();
          }
        }}
      >
        <Dialog.Title>{title}</Dialog.Title>

        <Dialog.Content>
          {children}
        </Dialog.Content>

        <Dialog.Actions>
          {cancelText && (
            <Button onPress={onCancel}>
              {cancelText}
            </Button>
          )}

          <Button onPress={onConfirm}>
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}