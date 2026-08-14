import { View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  fill: "#F0F2F5",
};

interface LeaveTypeSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function LeaveTypeSearch({
  value,
  onChangeText,
}: LeaveTypeSearchProps) {
  return (
    <View style={styles.wrap}>
      <Searchbar
        placeholder="Search leave types"
        value={value}
        onChangeText={onChangeText}
        style={styles.searchbar}
        inputStyle={styles.input}
        placeholderTextColor={COLORS.muted}
        iconColor={COLORS.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
  },

  searchbar: {
    backgroundColor: COLORS.fill,
    borderRadius: 100,
    elevation: 0,
    shadowOpacity: 0,
    height: 40,
  },

  input: {
    fontSize: 15,
    color: COLORS.ink,
    minHeight: 0,
    paddingVertical: 0,
    alignSelf: "center",
  },
});