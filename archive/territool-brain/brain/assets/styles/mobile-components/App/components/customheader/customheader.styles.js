import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix } from "../../styles/platformText";

/** Toolbar row below safe-area inset — title-only screens. */
export const CUSTOM_HEADER_TOOLBAR_HEIGHT = 56;
/** Toolbar row when a subtitle is shown (e.g. route title + "List"). */
export const CUSTOM_HEADER_TOOLBAR_HEIGHT_SUB = 72;
/** Side slots — keeps title visually centered; wide enough for share + edit actions. */
export const CUSTOM_HEADER_SIDE_WIDTH = 80;
/** Standard glyph size for back, add, filter, and other toolbar icons. */
export const CUSTOM_HEADER_ICON_SIZE = 26;
/** @deprecated Use CUSTOM_HEADER_ICON_SIZE */
export const CUSTOM_HEADER_BACK_ICON = CUSTOM_HEADER_ICON_SIZE;
/** Minimum touch target for header actions (matches platform guidance). */
export const CUSTOM_HEADER_ICON_HIT = 44;

export function customHeaderToolbarHeight(hasSubText) {
  return hasSubText
    ? CUSTOM_HEADER_TOOLBAR_HEIGHT_SUB
    : CUSTOM_HEADER_TOOLBAR_HEIGHT;
}

export const customHeaderStyles = StyleSheet.create({
  gradient: {
    width: "100%",
  },
  /** Safe-area padding only — do not set minHeight here (it fights with paddingTop). */
  barShell: {
    paddingBottom: 10,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  sideSlot: {
    width: CUSTOM_HEADER_SIDE_WIDTH,
    justifyContent: "center",
    zIndex: 2,
  },
  sideSlotLeft: {
    alignItems: "flex-start",
  },
  sideSlotRight: {
    alignItems: "flex-end",
  },
  sideActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  titleSlot: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  iconButton: {
    overflow: "visible",
  },
  iconButtonInner: {
    width: CUSTOM_HEADER_ICON_SIZE,
    height: CUSTOM_HEADER_ICON_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  rightRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  creditCol: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  metaStrip: {
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.22)",
  },
  metaStripRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  metaStripText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: theme.font.dinLight,
    color: "rgba(255, 255, 255, 0.92)",
    ...androidTextFix,
  },
  metaStripTextStrong: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: theme.font.dinBold,
    color: theme.colors.white,
    ...androidTextFix,
  },
});

export function customHeaderBarPaddingTop(topInset) {
  return { paddingTop: topInset };
}

export function customHeaderToolbarRowStyle(hasSubText) {
  const h = customHeaderToolbarHeight(hasSubText);
  return {
    minHeight: h,
    height: h,
  };
}

export function customHeaderSideSlotStyle(hasSubText) {
  return {
    height: customHeaderToolbarHeight(hasSubText),
    justifyContent: "center",
  };
}

export function customHeaderIconPressStyle(pressed) {
  return {
    width: CUSTOM_HEADER_ICON_HIT,
    height: CUSTOM_HEADER_ICON_HIT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: CUSTOM_HEADER_ICON_HIT / 2,
    opacity: pressed ? 0.6 : 1,
    backgroundColor: pressed ? theme.colors.pressWhiteOverlay : "transparent",
  };
}

/** @deprecated Use customHeaderIconPressStyle */
export function customHeaderBackPressStyle(pressed) {
  return customHeaderIconPressStyle(pressed);
}

export function customHeaderTitleStyle(title, subText) {
  const long = title.length > 20;
  const fontSize = long ? 24 : 28;
  const lineHeight = long ? 30 : 34;
  return {
    color: theme.colors.white,
    textAlign: "center",
    width: "100%",
    fontFamily: theme.font.dinBold,
    fontSize,
    lineHeight,
    marginTop: 0,
    marginBottom: subText ? 2 : 0,
    ...androidTextFix,
  };
}

export function customHeaderSubTextStyle() {
  return {
    color: theme.colors.white,
    textAlign: "center",
    width: "100%",
    fontFamily: theme.font.dinBold,
    fontSize: 18,
    lineHeight: 22,
    marginTop: 0,
    ...androidTextFix,
  };
}

export function customHeaderCreditPressStyle(pressed) {
  return {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.spacing.sm,
    opacity: pressed ? 0.7 : 1,
    backgroundColor: pressed ? theme.colors.pressWhiteOverlay : "transparent",
  };
}

export function customHeaderCreditCountStyle(isOverLimit) {
  return {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: theme.font.dinBold,
    color: isOverLimit ? "red" : theme.colors.white,
    textAlign: "center",
    ...androidTextFix,
  };
}

export function customHeaderCreditLabelStyle(isOverLimit) {
  return {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: theme.font.dinLight,
    color: isOverLimit ? "red" : theme.colors.white,
    textAlign: "center",
    ...androidTextFix,
  };
}

/** @deprecated Use side-slot layout; kept for any external imports. */
export function customHeaderBodyJustify(_subText) {
  return {};
}
