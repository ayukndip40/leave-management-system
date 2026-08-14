import { ReactNode } from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ViewStyle,
} from "react-native";

const COLORS = {
  bg: "#F4F7FC",
};

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});