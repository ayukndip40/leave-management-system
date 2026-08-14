import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Button, HelperText, Text } from "react-native-paper";

interface AppDatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;

  error?: string;
  disabled?: boolean;
}

export default function AppDatePicker({
  label,
  value,
  onChange,
  error,
  disabled = false,
}: AppDatePickerProps) {
  const [show, setShow] = useState(false);

  const selectedDate = value
    ? new Date(value)
    : new Date();

  const handleChange = (
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (date) {
      const formatted = date.toISOString().split("T")[0];
      onChange(formatted);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        variant="labelLarge"
        style={styles.label}
      >
        {label}
      </Text>

      <Button
        mode="outlined"
        onPress={() => setShow(true)}
        disabled={disabled}
        style={styles.button}
        contentStyle={styles.content}
      >
        {value || "Select Date"}
      </Button>

      {show && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}

      <HelperText
        type="error"
        visible={!!error}
      >
        {error}
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 6,
  },

  button: {
    borderRadius: 8,
  },

  content: {
    height: 50,
    justifyContent: "flex-start",
  },
});