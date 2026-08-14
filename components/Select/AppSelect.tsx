import { useState } from "react";
import { StyleSheet } from "react-native";
import { Menu, Button, HelperText } from "react-native-paper";

export interface SelectItem {
  label: string;
  value: string | number;
}

interface AppSelectProps {
  label: string;
  value: string | number | null;
  items: SelectItem[];
  onChange: (value: string | number) => void;

  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export default function AppSelect({
  label,
  value,
  items,
  onChange,
  placeholder = "Select an option",
  error,
  disabled = false,
}: AppSelectProps) {
  const [visible, setVisible] = useState(false);

  const selectedItem = items.find(
    (item) => item.value === value
  );

  return (
    <>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            disabled={disabled}
            contentStyle={styles.buttonContent}
            style={styles.button}
          >
            {selectedItem?.label ?? placeholder}
          </Button>
        }
      >
        {items.map((item) => (
          <Menu.Item
            key={item.value.toString()}
            title={item.label}
            onPress={() => {
              onChange(item.value);
              setVisible(false);
            }}
          />
        ))}
      </Menu>

      <HelperText
        type="error"
        visible={!!error}
      >
        {error}
      </HelperText>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 6,
    justifyContent: "center",
  },

  buttonContent: {
    height: 50,
    justifyContent: "space-between",
  },
});