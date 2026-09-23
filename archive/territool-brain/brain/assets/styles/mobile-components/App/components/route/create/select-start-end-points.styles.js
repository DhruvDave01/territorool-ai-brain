/**
 * Styles for `select-start-end-points.js` — iOS legacy px unchanged; Android compact.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
const av = (iosPx) => (isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx);
/** Android-only horizontal scale; iOS unchanged. */
const ah = (iosPx) => (isAndroid ? s(iosPx) : iosPx);
const lhA = (fontSize) => lineHeightFor(fontSize, 1.12);

export const SELECT_START_END_UI = {
  start: "#15803d",
  startSoft: "#DCFCE7",
  end: "#b91c1c",
  endSoft: "#FEE2E2",
  mapPinStart: theme.colors.lightGreen,
  mapPinEnd: theme.colors.danger,
  muted: "#64748b",
  border: "#E2E8F0",
  cardBg: "#F8FAFC",
  slate: "#0f172a",
};

const UI = SELECT_START_END_UI;

/** Autocomplete TextInput — iOS height 40 unchanged. */
export const SELECT_START_END_AUTOCOMPLETE_INPUT = {
  borderWidth: 0,
  borderBottomWidth: 0,
  width: "100%",
  backgroundColor: "transparent",
  fontFamily: theme.font.dinLight,
  paddingVertical: 0,
  paddingHorizontal: 0,
  ...(isAndroid
    ? {
        height: s(36),
        fontSize: s(15),
        lineHeight: lhA(15),
        ...androidTextFix,
      }
    : { height: 40 }),
};

/** Footer shell — docked at bottom; safe-area inset via Footer safeAreaBottom only. */
export const SELECT_START_END_FOOTER_SAFE = {
  backgroundColor: "#fff",
  width: "100%",
  alignSelf: "stretch",
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: UI.border,
  paddingHorizontal: isAndroid ? ah(16) : 16,
  paddingTop: isAndroid ? av(10) : 10,
  paddingBottom: isAndroid ? av(12) : 12,
};

/** Scroll bottom spacer above footer */
export const SELECT_START_END_SCROLL_SPACER = {
  height: isAndroid ? av(100) : 100,
};

const screenStyles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContentContainer: {
    paddingHorizontal: isAndroid ? ah(16) : 16,
    paddingTop: av(6),
    paddingBottom: av(12),
  },
  screenShell: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.colors.white,
  },
  intro: {
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? s(14) : 14,
    color: UI.muted,
    lineHeight: isAndroid ? lhA(14) : 20,
    marginTop: av(4),
    marginBottom: av(8),
    ...(isAndroid ? androidTextFix : {}),
  },
  smartClusterCard: {
    marginTop: av(14),
    padding: av(14),
    borderRadius: isAndroid ? ah(16) : 16,
    backgroundColor: UI.cardBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: UI.border,
  },
  smartClusterText: {
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? s(15) : 15,
    lineHeight: isAndroid ? lhA(15) : 22,
    color: UI.slate,
    textAlign: "center",
    ...(isAndroid ? androidTextFix : {}),
  },
  card: {
    marginTop: av(10),
    paddingVertical: av(10),
    paddingHorizontal: ah(12),
    borderRadius: isAndroid ? ah(14) : 14,
    backgroundColor: UI.cardBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: UI.border,
  },
  cardStart: { zIndex: 20 },
  cardEnd: { zIndex: 10, marginTop: av(8) },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: av(8),
  },
  pinHeaderWrap: {
    width: isAndroid ? ah(30) : 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: ah(10),
    alignSelf: "center",
  },
  cardTitleCol: {
    flex: 1,
    justifyContent: "center",
    minHeight: isAndroid ? s(28) : 30,
  },
  cardTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: isAndroid ? s(17) : 17,
    fontWeight: "700",
    color: UI.slate,
    textAlignVertical: "center",
    ...(isAndroid
      ? { lineHeight: lhA(17), includeFontPadding: false }
      : {}),
  },
  cardTitleStart: {
    color: UI.mapPinStart,
  },
  cardTitleEnd: {
    color: UI.mapPinEnd,
  },
  mapLegendRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: av(8),
    paddingHorizontal: ah(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: UI.border,
    backgroundColor: "#fff",
  },
  mapLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: ah(18),
    marginBottom: av(2),
  },
  mapLegendLabel: {
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? s(13) : 13,
    marginLeft: ah(6),
    color: UI.muted,
    ...(isAndroid ? { lineHeight: lhA(13), ...androidTextFix } : {}),
  },
  mapLegendLabelStart: {
    color: UI.mapPinStart,
    fontFamily: theme.font.dinBold,
    fontWeight: "700",
  },
  mapLegendLabelEnd: {
    color: UI.mapPinEnd,
    fontFamily: theme.font.dinBold,
    fontWeight: "700",
  },
  fieldShell: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: isAndroid ? s(38) : 42,
    backgroundColor: "#fff",
    borderRadius: isAndroid ? ah(12) : 12,
    borderWidth: 1,
    borderColor: "#E2E4E9",
    overflow: "visible",
  },
  fieldInputRow: {
    flexDirection: "row",
    flex: 1,
    minWidth: 0,
    minHeight: isAndroid ? s(38) : 42,
    alignItems: "center",
    paddingLeft: ah(10),
    paddingRight: ah(4),
  },
  autocompleteWrap: { flex: 1, minWidth: 0, justifyContent: "center" },
  chevronBtn: {
    width: isAndroid ? s(38) : 42,
    minHeight: isAndroid ? s(38) : 42,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: "#E2E4E9",
    backgroundColor: "#FAFAFA",
  },
  listBase: {
    maxHeight: isAndroid ? s(200) : 220,
    backgroundColor: "#fff",
    borderRadius: isAndroid ? ah(12) : 12,
    borderWidth: 1,
    borderColor: "#E2E4E9",
    marginTop: av(6),
    left: 0,
    right: 0,
    width: "100%",
    alignSelf: "stretch",
  },
  autoItemRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: isAndroid ? s(40) : 44,
    paddingVertical: av(10),
    paddingHorizontal: ah(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F1F5F9",
  },
  autoItemText: {
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? s(15) : 15,
    color: UI.slate,
    flex: 1,
    ...(isAndroid ? { lineHeight: lhA(15), ...androidTextFix } : {}),
  },
  mapSection: {
    marginTop: av(12),
    borderRadius: isAndroid ? ah(14) : 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: UI.border,
    backgroundColor: "#E2E8F0",
    zIndex: 0,
  },
  mapViewport: {
    position: "relative",
    width: "100%",
  },
  mapInner: {
    height: isAndroid ? s(280) : 300,
    width: "100%",
  },
  mapLoadingPlaceholder: {
    height: isAndroid ? s(280) : 300,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  mapZoomStack: {
    position: "absolute",
    right: ah(10),
    top: ah(10),
    flexDirection: "column",
  },
  mapZoomBtn: {
    width: isAndroid ? s(38) : 40,
    height: isAndroid ? s(38) : 40,
    borderRadius: isAndroid ? ah(10) : 10,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: av(8),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
      },
      android: { elevation: 3 },
    }),
  },
  mapZoomBtnText: {
    fontSize: isAndroid ? s(24) : 24,
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
    lineHeight: isAndroid ? lhA(24) : 28,
    textAlign: "center",
    ...(isAndroid ? { includeFontPadding: false } : {}),
  },
  footerBtnOutline: {
    flex: 1,
    height: isAndroid ? s(42) : 50,
    marginRight: ah(8),
    borderRadius: isAndroid ? ah(14) : 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  footerBtnOutlineText: {
    ...theme.typography.buttonLabel,
    color: "#334155",
    ...(isAndroid ? { fontSize: s(15), lineHeight: lhA(15), ...androidTextFix } : {}),
  },
  footerBtnPrimary: {
    flex: 1,
    height: isAndroid ? s(42) : 50,
    borderRadius: isAndroid ? ah(14) : 14,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  footerBtnPrimaryText: {
    ...theme.typography.buttonLabel,
    color: "#fff",
    ...(isAndroid ? { fontSize: s(15), lineHeight: lhA(15), ...androidTextFix } : {}),
  },
  waypointModalRoot: {
    justifyContent: "center",
    margin: isAndroid ? ah(24) : 24,
  },
  waypointModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: isAndroid ? ah(20) : 20,
    width: "100%",
    maxWidth: isAndroid ? s(400) : 400,
    alignSelf: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: { elevation: 8 },
    }),
  },
  waypointModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: av(16),
    paddingHorizontal: ah(20),
    paddingBottom: av(12),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  waypointModalTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: isAndroid ? s(20) : 20,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    paddingRight: ah(8),
    ...(isAndroid ? { lineHeight: lhA(20), ...androidTextFix } : {}),
  },
  waypointModalBody: {
    paddingHorizontal: ah(24),
    paddingTop: av(14),
    paddingBottom: av(24),
  },
  waypointModalPlaceName: {
    fontFamily: theme.font.dinBold,
    fontSize: isAndroid ? s(17) : 17,
    color: "#111827",
    marginBottom: av(6),
    ...(isAndroid ? { lineHeight: lhA(17), ...androidTextFix } : {}),
  },
  waypointModalAddress: {
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? s(14) : 14,
    color: "#6B7280",
    lineHeight: isAndroid ? lhA(14) : 20,
    marginBottom: av(20),
    ...(isAndroid ? androidTextFix : {}),
  },
  waypointModalActions: {
    width: "100%",
  },
  waypointModalActionSpacing: {
    marginBottom: av(10),
  },
  waypointModalBtnPrimaryFilled: {
    minHeight: isAndroid ? s(42) : 50,
    width: "100%",
    borderRadius: isAndroid ? ah(12) : 12,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: av(12),
    paddingHorizontal: ah(16),
  },
  waypointModalBtnPrimaryOutline: {
    minHeight: isAndroid ? s(42) : 50,
    width: "100%",
    borderRadius: isAndroid ? ah(12) : 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: av(12),
    paddingHorizontal: ah(16),
  },
  waypointModalBtnTextPrimaryFilled: {
    ...theme.typography.buttonLabel,
    fontSize: isAndroid ? s(16) : 16,
    lineHeight: isAndroid ? lhA(16) : 21,
    color: theme.colors.white,
    ...(isAndroid ? androidTextFix : {}),
  },
  waypointModalBtnTextPrimaryOutline: {
    ...theme.typography.buttonLabel,
    fontSize: isAndroid ? s(16) : 16,
    lineHeight: isAndroid ? lhA(16) : 21,
    color: theme.colors.primary,
    ...(isAndroid ? androidTextFix : {}),
  },
  waypointModalBtnStart: {
    minHeight: isAndroid ? s(42) : 50,
    width: "100%",
    borderRadius: isAndroid ? ah(12) : 12,
    backgroundColor: UI.mapPinStart,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: av(12),
    paddingHorizontal: ah(16),
  },
  waypointModalBtnEnd: {
    minHeight: isAndroid ? s(42) : 50,
    width: "100%",
    borderRadius: isAndroid ? ah(12) : 12,
    backgroundColor: UI.mapPinEnd,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: av(12),
    paddingHorizontal: ah(16),
  },
  waypointModalBtnTextOnPin: {
    ...theme.typography.buttonLabel,
    fontSize: isAndroid ? s(16) : 16,
    lineHeight: isAndroid ? lhA(16) : 21,
    color: "#FFFFFF",
    fontWeight: "600",
    ...(isAndroid ? androidTextFix : {}),
  },
  createRouteInlineWrap: {
    marginTop: av(8),
    marginBottom: 0,
    width: "100%",
  },
  createRouteInlineBtn: {
    height: isAndroid ? s(44) : 52,
    borderRadius: isAndroid ? ah(14) : 14,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  createRouteInlineLabel: {
    ...theme.typography.buttonLabel,
    fontSize: isAndroid ? s(18) : 18,
    lineHeight: isAndroid ? lhA(18) : 23,
    color: "#fff",
    ...(isAndroid ? androidTextFix : {}),
  },
  createRouteInlineHint: {
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? s(13) : 13,
    color: UI.muted,
    textAlign: "center",
    marginTop: av(4),
    marginBottom: 0,
    lineHeight: isAndroid ? lhA(13) : 18,
    paddingHorizontal: isAndroid ? ah(16) : 16,
    fontStyle: "italic",
    ...(isAndroid ? androidTextFix : {}),
  },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: isAndroid ? ah(16) : 16,
    paddingVertical: av(28),
    paddingHorizontal: ah(24),
    alignItems: "center",
    borderWidth: 1,
    borderColor: UI.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
});

export default screenStyles;
