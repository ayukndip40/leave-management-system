
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Screen from "../../../../components/Layout/Screen";
import PageHeader from "../../../../components/Layout/PageHeader";
import SectionTitle from "../../../../components/Dashboard/SectionTitle";

interface PublicHoliday {
  id: number;
  name: string;
  date: string;
  day: string;
  type: "National" | "Religious";
}

const holidays: PublicHoliday[] = [
  {
    id: 1,
    name: "New Year's Day",
    date: "01 January 2027",
    day: "Friday",
    type: "National",
  },
  {
    id: 2,
    name: "Youth Day",
    date: "11 February 2027",
    day: "Thursday",
    type: "National",
  },
  {
    id: 3,
    name: "Good Friday",
    date: "26 March 2027",
    day: "Friday",
    type: "Religious",
  },
  {
    id: 4,
    name: "Easter Monday",
    date: "29 March 2027",
    day: "Monday",
    type: "Religious",
  },
  {
    id: 5,
    name: "Labour Day",
    date: "01 May 2027",
    day: "Saturday",
    type: "National",
  },
  {
    id: 6,
    name: "National Day",
    date: "20 May 2027",
    day: "Thursday",
    type: "National",
  },
  {
    id: 7,
    name: "Ascension Day",
    date: "06 May 2027",
    day: "Thursday",
    type: "Religious",
  },
  {
    id: 8,
    name: "Assumption Day",
    date: "15 August 2027",
    day: "Sunday",
    type: "Religious",
  },
  {
    id: 9,
    name: "Christmas Day",
    date: "25 December 2027",
    day: "Saturday",
    type: "Religious",
  },
];

export default function AdminPublicHolidaysScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <PageHeader title="Public Holidays" />

        <Text style={styles.subtitle}>
          Cameroon public holidays
        </Text>

        <SectionTitle title="2027 Holidays" />

        <FlatList
          data={holidays}
          keyExtractor={(item) =>
            item.id.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.dateBox}>
                <Text style={styles.dateDay}>
                  {item.date.split(" ")[0]}
                </Text>

                <Text style={styles.dateMonth}>
                  {item.date.split(" ")[1]}
                </Text>
              </View>

              <View style={styles.details}>
                <Text style={styles.name}>
                  {item.name}
                </Text>

                <Text style={styles.date}>
                  {item.date} • {item.day}
                </Text>

                <View
                  style={[
                    styles.badge,
                    item.type === "National"
                      ? styles.nationalBadge
                      : styles.religiousBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      item.type === "National"
                        ? styles.nationalText
                        : styles.religiousText,
                    ]}
                  >
                    {item.type}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    marginTop: -8,
    marginBottom: 18,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  dateBox: {
    width: 58,
    height: 62,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  dateDay: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2563EB",
  },

  dateMonth: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
  },

  details: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  date: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 8,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },

  nationalBadge: {
    backgroundColor: "#ECFDF5",
  },

  religiousBadge: {
    backgroundColor: "#F5F3FF",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  nationalText: {
    color: "#047857",
  },

  religiousText: {
    color: "#6D28D9",
  },
});
