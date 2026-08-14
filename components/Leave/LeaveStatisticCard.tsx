import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  value: number;
  color: string;
}

const COLORS = {
  bg: "#F4F7FC",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primarySoft: "rgba(37, 99, 235, 0.1)",
};

export default function LeaveStatisticCard({
  title,
  value,
  color,
}: Props) {
  return (
    <View style={styles.card}>

      <View
        style={[
          styles.icon,
          {
            backgroundColor: `${color}20`,
          },
        ]}
      >
        <View
          style={[
            styles.dot,
            {
              backgroundColor: color,
            },
          ]}
        />
      </View>


      <Text style={styles.value}>
        {value}
      </Text>


      <Text style={styles.title}>
        {title}
      </Text>

    </View>
  );
}


const styles = StyleSheet.create({

  card: {
    flex: 1,

    backgroundColor: COLORS.card,

    borderRadius: 18,

    paddingVertical: 18,

    alignItems: "center",

    borderWidth: 1,

    borderColor: COLORS.border,
  },


  icon: {
    width: 42,

    height: 42,

    borderRadius: 14,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 10,
  },


  dot: {
    width: 14,

    height: 14,

    borderRadius: 7,
  },


  value: {
    fontSize: 26,

    fontWeight: "800",

    color: COLORS.ink,
  },


  title: {
    marginTop: 6,

    fontSize: 13,

    fontWeight: "600",

    color: COLORS.muted,
  },

});