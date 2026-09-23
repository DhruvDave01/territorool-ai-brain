import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

const t = theme.colors;

export const RT_SURFACE = t.ccSurface;
export const RT_BORDER = t.border;
export const RT_RADIUS = theme.radius.md;

export const companyViewChromeStyles = StyleSheet.create({
  screenFlex: {
    flex: 1,
    backgroundColor: RT_SURFACE,
  },
  safeTop: {
    backgroundColor: "transparent",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 12,
    minHeight: 56,
  },
  roundIconBtn: {
    width: 44,
    height: 44,
    borderRadius: RT_RADIUS,
    backgroundColor: t.onPrimaryGlass,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperShell: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.onPrimaryGlassMid,
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: t.onPrimaryGlassBorder,
    paddingHorizontal: 4,
    height: 44,
    minWidth: 140,
  },
  stepperCenter: {
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperCountText: {
    color: t.white,
    fontSize: 15,
    fontFamily: theme.font.dinBold,
    textAlign: "center",
  },
  bodyScroll: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    overflow: "hidden",
  },
  bodyPlain: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  tooltipCard: {
    backgroundColor: t.white,
    padding: 14,
    borderRadius: RT_RADIUS,
    maxWidth: 260,
    borderWidth: 1,
    borderColor: RT_BORDER,
  },
  tooltipTitle: {
    color: t.primary,
    fontSize: 16,
    fontFamily: theme.font.dinBold,
    textAlign: "center",
  },
});

export function companyViewStepperArrowPress(pressed) {
  return {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    opacity: pressed ? 0.7 : 1,
  };
}

export function companyViewFooterChrome() {
  return {
    backgroundColor: RT_SURFACE,
    borderTopWidth: 1,
    borderTopColor: RT_BORDER,
  };
}
