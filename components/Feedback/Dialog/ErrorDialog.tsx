import { Text } from "react-native-paper";
import AppDialog from "./AppDialog";

interface ErrorDialogProps {
  visible: boolean;

  title?: string;

  message: string;

  buttonText?: string;

  onDismiss: () => void;
}

export default function ErrorDialog({
  visible,
  title = "Something went wrong",
  message,
  buttonText = "OK",
  onDismiss,
}: ErrorDialogProps) {
  return (
    <AppDialog
      visible={visible}
      title={title}
      confirmText={buttonText}
      onConfirm={onDismiss}
      dismissable
    >
      <Text variant="bodyMedium">
        {message}
      </Text>
    </AppDialog>
  );
}