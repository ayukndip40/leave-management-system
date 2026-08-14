import { Searchbar } from "react-native-paper";

interface EmployeeSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function EmployeeSearch({
  value,
  onChangeText,
}: EmployeeSearchProps) {
  return (
    <Searchbar
      placeholder="Search employees..."
      value={value}
      onChangeText={onChangeText}
      style={{
        marginBottom: 16,
      }}
    />
  );
}