import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

const surface = theme.colors.ccSurface;

export const waypointDetailStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  body: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    overflow: "hidden",
  },
});
