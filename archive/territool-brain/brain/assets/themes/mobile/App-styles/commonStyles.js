/**
 * Reusable StyleSheet fragments. Compose with arrays: style={[commonStyles.flex1, custom.foo]}
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "./theme";

export const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flex1MinHeight0: {
    flex: 1,
    minHeight: 0,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexRowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  /** flex:1 + centered (placeholder / empty states) */
  flex1Center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRowStretch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  footerTabCell: {
    flex: 1,
  },
  transparent: {
    backgroundColor: "transparent",
  },
  gradientFullWidth: {
    width: "100%",
  },
  stretch: {
    alignSelf: "stretch",
  },
  widthFull: {
    width: "100%",
  },
  hairlineTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.footerSeparator,
  },
  mapZoomBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowBlack,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: { elevation: 3 },
    }),
  },
  mapZoomBtnSpacing: {
    marginBottom: theme.spacing.sm,
  },
});

/** Active route map: absolute zoom control stack */
export function paddingBottomInset(bottom) {
  return { paddingBottom: bottom };
}

export const activeRouteMapZoomControls = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: Platform.OS === "android" ? 20 : 12,
    bottom: Platform.OS === "android" ? 88 : 72,
    flexDirection: "column",
    alignItems: "center",
  },
});
