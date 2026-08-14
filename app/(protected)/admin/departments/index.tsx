import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import Screen from "../../../../components/Layout/Screen";
import PageHeader from "../../../../components/Layout/PageHeader";
import SectionTitle from "../../../../components/Dashboard/SectionTitle";

import api from "../../../../services/api/axios";

interface Department {
  id: number;
  department_name: string;
  department_code?: string;
}

export default function HrDepartmentsScreen() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDepartments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/departments");

      console.log(
        "HR DEPARTMENTS RESPONSE:",
        response.data
      );

      setDepartments(
        response.data.data || []
      );
    } catch (error) {
      console.error(
        "HR departments error:",
        error
      );

      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDepartments();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading departments...
        </Text>
      </View>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <PageHeader title="Departments" />

        <SectionTitle title="All Departments" />

        {departments.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No departments found
            </Text>

            <Text style={styles.emptyText}>
              There are currently no departments
              available.
            </Text>
          </View>
        ) : (
          <FlatList
            data={departments}
            keyExtractor={(item) =>
              item.id.toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.list
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.name}>
                  {item.department_name}
                </Text>

                {item.department_code && (
                  <Text style={styles.code}>
                    {item.department_code}
                  </Text>
                )}
              </View>
            )}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#64748B",
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  code: {
    marginTop: 5,
    fontSize: 13,
    color: "#64748B",
  },

  empty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    marginTop: 6,
    textAlign: "center",
    color: "#64748B",
  },
});
