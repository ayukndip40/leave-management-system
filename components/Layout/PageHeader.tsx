import { View, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";

const COLORS = {
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  card: "#FFFFFF",
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primarySoft: "rgba(37, 99, 235, 0.1)",
  danger: "#EF4444",
};

export default function PageHeader() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  };

  const initials = `${user?.first_name?.charAt(0) ?? ""}${
    user?.last_name?.charAt(0) ?? ""
  }`;

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.avatarWrap}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarLabel}>{initials}</Text>
          </LinearGradient>
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>

          <Text style={styles.name} numberOfLines={1}>
            {user?.first_name} {user?.last_name}
          </Text>

          <View style={styles.rolePill}>
            <View style={styles.rolePillDot} />
            <Text style={styles.rolePillText}>{user?.role}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.bellWrap} activeOpacity={0.7}>
        <IconButton
          icon="bell-outline"
          size={22}
          iconColor={COLORS.primary}
          containerColor={COLORS.primarySoft}
          style={styles.bellButton}
          onPress={() => {}}
        />
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 24,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatarWrap: {
    position: "relative",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },

  avatarLabel: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  onlineDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#22C55E",
    borderWidth: 2.5,
    borderColor: COLORS.card,
  },

  textContainer: {
    marginLeft: 14,
    flex: 1,
  },

  greeting: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
    marginBottom: 2,
  },

  name: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.3,
    marginBottom: 7,
  },

  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primarySoft,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    gap: 5,
  },

  rolePillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  rolePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "capitalize",
  },

  bellWrap: {
    position: "relative",
  },

  bellButton: {
    margin: 0,
    borderRadius: 14,
  },

  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: COLORS.card,
  },
});