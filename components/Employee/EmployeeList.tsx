import { FlatList } from "react-native";

import EmployeeCard from "./EmployeeCard";
import { User } from "../../types/user";

interface EmployeeListProps {
  employees: User[];
  onEmployeePress: (employee: User) => void;
}

export default function EmployeeList({
  employees,
  onEmployeePress,
}: EmployeeListProps) {
  return (
    <FlatList
      data={employees}
      keyExtractor={(item) => item.user_uuid}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <EmployeeCard
          firstName={item.first_name}
          lastName={item.last_name}
          employeeNumber={item.employee_number}
          position={item.position_name}
          department={item.department_name}
          status={item.status}
          onPress={() => onEmployeePress(item)}
        />
      )}
    />
  );
}