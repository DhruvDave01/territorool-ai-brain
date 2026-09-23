import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

/** Find Leads map search row tokens (see findLeads/index.js FL_*) */
const FL_SURFACE_PAGE = "#F3F4F6";
const FL_SURFACE_CARD = "#FFFFFF";
const FL_BORDER = "#E5E7EB";
const FL_RADIUS_SM = 12;
const FL_SHADOW_IOS = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
};
const FL_SHADOW_CARD =
  Platform.OS === "ios"
    ? FL_SHADOW_IOS
    : { elevation: 4, shadowColor: "#000" };

/** Curved map frame (findLeads/index.js Map View) */
const FL_BORDER_STRONG = "#D1D5DB";
const FL_RADIUS = 14;
const FL_MAP_FRAME_SHADOW =
  Platform.OS === "ios"
    ? {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }
    : { elevation: 2 };

const headerPressableBase = {
  padding: theme.spacing.sm,
  borderRadius: 20,
};

export function headerBackPressableStyle(pressed) {
  return {
    ...headerPressableBase,
    opacity: pressed ? 0.7 : 1,
    backgroundColor: pressed ? theme.colors.pressWhiteOverlay : "transparent",
  };
}

export function headerFilterPressableStyle(pressed) {
  return {
    ...headerPressableBase,
    opacity: pressed ? 0.7 : 1,
    backgroundColor: pressed ? theme.colors.pressWhiteOverlay : "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };
}

/** Modal header icon (e.g. close): matches prior 8 / 20 hit area */
export function modalHeaderIconPressableStyle(pressed) {
  return {
    padding: theme.spacing.sm,
    borderRadius: 20,
    opacity: pressed ? 0.7 : 1,
    backgroundColor: pressed ? theme.colors.pressDarkOverlay : "transparent",
  };
}

export const activeRouteMapStyles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  tooltipContentFull: {
    height: "100%",
  },
  searchSection: {
    backgroundColor: FL_SURFACE_PAGE,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingLeft: 12,
    paddingRight: 8,
    backgroundColor: FL_SURFACE_CARD,
    borderRadius: FL_RADIUS_SM,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    ...FL_SHADOW_CARD,
  },
  searchIconBtn: {
    width: 36,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    fontFamily: theme.font.dinLight,
    color: theme.colors.black,
    paddingVertical: 0,
    paddingHorizontal: 8,
    minHeight: 24,
    borderRadius: FL_RADIUS_SM,
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: "center",
      },
      default: {},
    }),
  },
  mapSection: {
    flex: 1,
    backgroundColor: FL_SURFACE_PAGE,
    minHeight: 0,
  },
  mapAreaPadding: {
    flex: 1,
    minHeight: 0,
    backgroundColor: FL_SURFACE_PAGE,
    // paddingTop: 6,
    // paddingHorizontal: 16,
    // paddingBottom: 30,
  },
  mapCurveFrame: {
    flex: 1,
    minHeight: 0,
    borderRadius: FL_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: FL_BORDER_STRONG,
    backgroundColor: FL_BORDER,
    ...FL_MAP_FRAME_SHADOW,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: theme.spacing.xxl,
    backgroundColor: theme.colors.white,
  },
  emptyStateText: {
    fontFamily: theme.font.dinLight,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  loadingBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    backgroundColor: theme.colors.white,
  },
  loadingCaption: {
    marginTop: theme.spacing.lg,
    fontSize: 16,
    fontFamily: theme.font.dinLight,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  mapRow: {
    flex: 1,
    flexDirection: "row",
    minHeight: 0,
    
  },
  mapCol: {
    flex: 1,
    minHeight: 0,
  },
  mapColWithOverlay: {
    flex: 1,
    minHeight: 0,
    position: "relative",
  },
  polylineLoaderOverlay: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 12,
  },
  polylineLoaderPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(17, 24, 39, 0.82)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  polylineLoaderText: {
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: theme.font.dinLight,
    color: theme.colors.white,
  },
  mapClusterSize: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
});

/** Light map — brand blue route line */
export const ROUTE_MAP_LINE = theme.colors.primary;
export const ROUTE_MAP_LINE_CASING = theme.colors.lightGray;
export const ROUTE_MAP_MARKER_BORDER = theme.colors.lightGray;
export const ROUTE_MAP_MARKER_TEXT = theme.colors.black;
export const ROUTE_MAP_FLAG_BORDER = theme.colors.danger;
export const ROUTE_MAP_LINE_WIDTH = 3.5;

/** Polyline colors for system light vs dark map (Apple/Google follow device appearance). */
export function getRouteMapPolylineColors(isDarkMode) {
  if (isDarkMode) {
    return {
      line: theme.colors.white,
      casing: "rgba(15, 23, 42, 0.75)",
      lineWidth: ROUTE_MAP_LINE_WIDTH,
      casingWidth: 4.5,
    };
  }
  return {
    line: ROUTE_MAP_LINE,
    casing: ROUTE_MAP_LINE_CASING,
    lineWidth: ROUTE_MAP_LINE_WIDTH,
    casingWidth: 4,
  };
}

export function routeWaypointMarkerWrap() {
  return {
    alignItems: "center",
    justifyContent: "center",
  };
}

export function routeWaypointMarkerBubble() {
  return {
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: ROUTE_MAP_MARKER_BORDER,
    borderRadius: 6,
    minWidth: 26,
    minHeight: 26,
    paddingHorizontal: 5,
    paddingVertical: 3,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
      default: {},
    }),
  };
}

export const routeWaypointMarkerText = {
  color: ROUTE_MAP_MARKER_TEXT,
  fontWeight: "600",
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  ...Platform.select({
    android: { includeFontPadding: false, textAlignVertical: "center" },
    default: {},
  }),
};

export const routeEndFlagWrap = {
  marginTop: 2,
};

export function markerPinContainer(markerColor) {
  return {
    backgroundColor: markerColor,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 5,
    minWidth: 22,
    minHeight: 22,
    justifyContent: "center",
    alignItems: "center",
  };
}

export const markerPinTextBlackBold = {
  color: "black",
  fontWeight: "bold",
  fontSize: 13,
  lineHeight: 16,
  textAlign: "center",
  ...Platform.select({
    android: { includeFontPadding: false, textAlignVertical: "center" },
    default: {},
  }),
};

export const markerPinTextWhiteBold = {
  color: "white",
  fontWeight: "bold",
  fontSize: 13,
  lineHeight: 16,
  textAlign: "center",
  ...Platform.select({
    android: { includeFontPadding: false, textAlignVertical: "center" },
    default: {},
  }),
};

export function mapClusterAndroidMargins(dWidth) {
  const m = Math.round(dWidth * 0.02);
  return {
    marginHorizontal: m,
    marginVertical: m,
  };
}

export const activeRouteDetailModalStyles = StyleSheet.create({
  modalRoot: {
    margin: 20,
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.font.dinBold,
    color: theme.colors.black,
  },
  companyTitle: {
    fontSize: 17,
    fontFamily: theme.font.dinBold,
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  companyAddress: {
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  primaryCta: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryCtaText: {
    ...theme.typography.buttonLabel,
    fontSize: 16,
    lineHeight: 21,
    color: theme.colors.white,
  },
});
