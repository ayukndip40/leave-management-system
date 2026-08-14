import AppDialog from "./AppDialog";
import { Text } from "react-native-paper";

interface ConfirmDialogProps {
  visible: boolean;

  title: string;

  message: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;

  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AppDialog
      visible={visible}
      title={title}
      confirmText={loading ? "Please wait..." : confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      dismissable={!loading}
    >
      <Text variant="bodyMedium">
        {message}
      </Text>
    </AppDialog>
  );
}