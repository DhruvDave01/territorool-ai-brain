/**
 * Cognism / Apollo company contact screen — UI tokens only (no inline hex in index).
 * Colors come from App/styles/theme.js (single source of truth).
 */
import { Platform } from "react-native";
import { theme } from "../../../styles/theme";

const t = theme.colors;

/** Quick access to theme colors in this screen. */
export const congC = t;

/** Map overlay fill (if used). */
export const congMapFillColor = t.mapFillRedSemi;

export const congChrome = {
  surface: t.ccSurface,
  border: t.border,
  radius: theme.radius.md,
  muted: t.ccMuted,
  subtle: t.ccSubtle,
  cardShadow: Platform.select({
    ios: {
      shadowColor: t.shadowBlack,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
  }),
};
