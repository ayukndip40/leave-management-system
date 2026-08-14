import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Controller } from "react-hook-form";
import useLoginForm from "../../hooks/useLoginForm";
import { login } from "../../services/api/authService";
import { useSnackbar } from "../../contexts/SnackbarContext";
import AppInput from "../../components/Input/AppInput";
import { saveToken, getToken } from "../../utils/secureStore";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { UserRole } from "../../types/role";

const COLORS = {
  bg: "#F4F7FC",
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  ink: "#0F172A",
  muted: "#64748B",
  card: "#FFFFFF",
  border: "#E2E8F0",
  blobPrimary: "rgba(37, 99, 235, 0.12)",
  blobSecondary: "rgba(99, 102, 241, 0.1)",
};

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useLoginForm();

  const { showSnackbar } = useSnackbar();
  const { setUser } = useAuth();

  const onSubmit = async (data: {
    login: string;
    password: string;
  }) => {
    try {
      const response = await login(data);

      await saveToken(response.token);

      setUser(response.user);

      const token = await getToken();

      console.log("Saved Token:", token);

      console.log("about to show snackbar", response);
      showSnackbar("Login successful.");
      console.log("snackbar called");

      showSnackbar("Login successful.");

      console.log(response);

      switch (response.user.role) {
          case UserRole.ADMIN:
              router.replace("/(protected)/admin/(tabs)");
              break;

          case UserRole.HR:
              router.replace("/(protected)/hr/(tabs)");
              break;

          case UserRole.EMPLOYEE:
              router.replace("/(protected)/employee/(tabs)");
              break;

          default:
              router.replace("/(auth)/login");
      }

    } catch (error: any) {

      showSnackbar(
        error.response?.data?.message ??
        "Invalid employee number/email or password."
      );

      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <View style={styles.decorLayer} pointerEvents="none">
        <View style={[styles.blob, styles.blobTopRight]} />
        <View style={[styles.blob, styles.blobBottomLeft]} />
        <View style={styles.headerWash} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.logoShell}>
              <View style={styles.logoInner}>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={32}
                  color="#FFFFFF"
                />
              </View>
            </View>
            <Text style={styles.appName}>LeaveFlow</Text>
            <Text style={styles.heroTagline}>
              Sign in to manage time off, balances, and approvals in one place.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text variant="titleLarge" style={styles.formTitle}>
              Welcome back
            </Text>
            <Text variant="bodyMedium" style={styles.formSubtitle}>
              Use your employee number or work email to continue.
            </Text>

            <View style={styles.fieldGroup}>
              <Controller
                    control={control}
                    name="login"
                    rules={{
                        required: "Employee number or email is required",
                    }}
                    render={({ field: { onChange, value } }) => (
                        <AppInput
                        label="Employee Number or Email"
                        value={value}
                        onChangeText={onChange}
                        leftIcon="account"
                        error={!!errors.login}
                        errorMessage={errors.login?.message}
                        />
                    )}
                />
            </View>

            <View style={styles.fieldGroup}>
              <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: "Password is required",
                        minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <AppInput
                        label="Password"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={!showPassword}
                        leftIcon="lock"
                        rightIcon={showPassword ? "eye-off" : "eye"}
                        onRightIconPress={() =>
                            setShowPassword(!showPassword)
                        }
                        error={!!errors.password}
                        errorMessage={errors.password?.message}
                        />
                    )}
                />
            </View>

            <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isValid}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  buttonColor={COLORS.primary}
                  >
                  Sign in
              </Button>
          </View>

          <View style={styles.footer}>
            <MaterialCommunityIcons
              name="lifebuoy"
              size={16}
              color={COLORS.muted}
            />
            <Text style={styles.footerText}>
              Need help? Contact your HR administrator.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  flex: {
    flex: 1,
  },

  decorLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },

  headerWash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  blob: {
    position: "absolute",
    borderRadius: 999,
  },

  blobTopRight: {
    width: 220,
    height: 220,
    top: -60,
    right: -70,
    backgroundColor: COLORS.blobPrimary,
  },

  blobBottomLeft: {
    width: 180,
    height: 180,
    bottom: 120,
    left: -50,
    backgroundColor: COLORS.blobSecondary,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  hero: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoShell: {
    padding: 4,
    borderRadius: 22,
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    marginBottom: 16,
  },

  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },

  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  heroTagline: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
    maxWidth: 300,
    paddingHorizontal: 8,
  },

  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },

  formTitle: {
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 6,
  },

  formSubtitle: {
    color: COLORS.muted,
    marginBottom: 22,
    lineHeight: 20,
  },

  fieldGroup: {
    marginBottom: 4,
  },

  button: {
    marginTop: 8,
    borderRadius: 14,
  },

  buttonContent: {
    paddingVertical: 7,
    height: 52,
  },

  buttonLabel: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 12,
  },

  footerText: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
    flexShrink: 1,
  },
});
