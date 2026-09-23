/**
 * Shared “Settings” body: primary fills under the header; curved ccSurface sheet below.
 */
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const SCREEN_BODY_TOP_RADIUS = 25;

export const screenCurvedBodyStyles = StyleSheet.create({
  primaryBleed: {
    flex: 1,
    // minHeight: 0,
    backgroundColor: theme.colors.primary,
  },
  curvedBody: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.colors.ccSurface,
    overflow: "hidden",
    borderTopLeftRadius: SCREEN_BODY_TOP_RADIUS,
    borderTopRightRadius: SCREEN_BODY_TOP_RADIUS,
  },
});
