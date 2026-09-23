import { Dimensions, Platform, StyleSheet } from "react-native";
import { androidTextFix, lineHeightFor } from "../../styles/platformText";
import { TEXT_SIZES, theme } from "../../styles/theme";
import { scaledSize } from "../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const customCompanyVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const customCompanyHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = customCompanyVertical;
const ah = customCompanyHorizontal;
const fs = (iosPx) => (isAndroid ? s(iosPx) : iosPx);
const lhA = (fontSize) => lineHeightFor(fontSize, 1.12);
/** Fixed line height for contacts / activity lists — same visual density on both platforms. */
const lhCompact = (fontSize) => Math.round(fontSize * 1.12);
const listTextAndroid = isAndroid ? androidTextFix : {};

/** Find Contacts footer cue layout — Android compact for spotlight hole math. */
export const FIND_CONTACTS_LAYOUT = {
  footerRowPad: av(8),
  footerRowGap: av(10),
  buttonHeight: isAndroid ? s(44) : 52,
  buttonMarginV: av(10),
  holePad: av(6),
};

/** More Info modal — aligned with AI Find Leads contact sheet (local tokens) */
export const MORE_INFO_SURFACE = "#F6F7FB";
export const MORE_INFO_CARD_BG = "#FFFFFF";
export const MORE_INFO_BORDER = "#E5E7EB";
export const MORE_INFO_RADIUS = 12;
export const MORE_INFO_MUTED = "#9CA3AF";
export const MORE_INFO_DISABLED_BG = "#E5E7EB";
export const MORE_INFO_CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 4 },
});

/** Visit rows — same accent family as notes/primary (was maroon for contrast only). */
export const ACTIVITY_VISIT_ACCENT = theme.colors.primary;
export const moreInfoLabelStyle = {
  fontSize: isAndroid ? fs(11) : 11,
  fontFamily: theme.font.dinBold,
  color: "#94A3B8",
  marginBottom: 2,
  letterSpacing: 0.45,
  textTransform: "uppercase",
  ...(isAndroid ? { lineHeight: lhA(11), ...androidTextFix } : {}),
};
export const moreInfoValueStyle = {
  fontSize: isAndroid ? fs(15) : 15,
  fontFamily: theme.font.dinLight,
  color: "#111827",
  lineHeight: isAndroid ? lhA(15) : 20,
  ...(isAndroid ? androidTextFix : {}),
};

/** react-native-map-link map chooser — bottom sheet, TerriTool typography */
const MAP_CHOOSER_POPUP_MAX_H = Math.round(
  Dimensions.get("window").height * 0.62
);
export const mapChooserPopupStyle = {
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
    backgroundColor: "rgba(15, 23, 42, 0.48)",
  },
  modalView: {
    margin: 0,
    marginHorizontal: 0,
    width: "100%",
    maxWidth: "100%",
    maxHeight: MAP_CHOOSER_POPUP_MAX_H,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: MORE_INFO_CARD_BG,
    alignItems: "stretch",
    alignSelf: "stretch",
    ...theme.shadows.lg,
  },
  titleText: {
    fontFamily: theme.font.dinBold,
    fontSize: 19,
    lineHeight: 24,
    color: "#111827",
    textAlign: "center",
  },
  subtitleText: {
    fontFamily: theme.font.dinLight,
    fontSize: 14,
    lineHeight: 20,
    color: MORE_INFO_MUTED,
    textAlign: "center",
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: MORE_INFO_SURFACE,
    borderRadius: MORE_INFO_RADIUS,
    marginVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
  },
  itemText: {
    fontFamily: theme.font.dinLight,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 14,
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },
  separatorStyle: {
    height: 0,
    flex: 0,
    backgroundColor: "transparent",
  },
  cancelButtonContainer: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: MORE_INFO_RADIUS,
    backgroundColor: MORE_INFO_CARD_BG,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  cancelButtonText: {
    fontFamily: theme.font.dinBold,
    fontSize: 16,
    color: theme.colors.primary,
  },
  activityIndicatorContainer: {
    height: 72,
    marginVertical: 12,
  },
};

/** Notes modals — same shell as “Add to” / center sheets */
export const NOTES_MODAL_OUTER = {
  wrap: {
    width: "100%",
    maxWidth: 440,
    borderRadius: MORE_INFO_RADIUS,
    overflow: "hidden",
    backgroundColor: MORE_INFO_CARD_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    ...MORE_INFO_CARD_SHADOW,
  },
};
export const notesModalBody = {
  backgroundColor: MORE_INFO_SURFACE,
  paddingHorizontal: ah(16),
  paddingTop: av(14),
  paddingBottom: av(20),
};
export const notesModalBodyPadding24 = {
  ...notesModalBody,
  paddingBottom: av(24),
};
export const notesModalMultiline = {
  minHeight: isAndroid ? s(82) : 96,
  maxHeight: isAndroid ? s(129) : 152,
  borderWidth: 1,
  borderColor: MORE_INFO_BORDER,
  borderRadius: MORE_INFO_RADIUS,
  paddingHorizontal: ah(12),
  paddingVertical: av(12),
  fontSize: isAndroid ? fs(16) : 16,
  fontFamily: theme.font.dinLight,
  color: "#111827",
  backgroundColor: MORE_INFO_CARD_BG,
  textAlignVertical: "top",
  ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : {}),
};
export const notesModalMultilineFullWidth = {
  ...notesModalMultiline,
  width: "100%",
};
export const notesModalDropdownBtn = (selected) => ({
  height: isAndroid ? s(41) : 48,
  width: "100%",
  borderRadius: MORE_INFO_RADIUS,
  borderWidth: selected ? 2 : 1,
  borderColor: selected ? theme.colors.primary : MORE_INFO_BORDER,
  backgroundColor: MORE_INFO_CARD_BG,
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: ah(12),
});
export const notesModalPrimaryBtn = {
  flex: 1,
  minHeight: isAndroid ? s(44) : 52,
  borderRadius: MORE_INFO_RADIUS,
  backgroundColor: theme.colors.primary,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: ah(8),
};
export const notesModalPrimaryBtnFullWidth = {
  ...notesModalPrimaryBtn,
  width: "100%",
  flex: 0,
  flexGrow: 0,
  flexShrink: 0,
  marginBottom: av(12),
};
export const notesModalSecondaryBtn = {
  flex: 1,
  minHeight: isAndroid ? s(44) : 52,
  borderRadius: MORE_INFO_RADIUS,
  borderWidth: 2,
  borderColor: theme.colors.primary,
  backgroundColor: theme.colors.white,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: ah(8),
};
export const notesModalDangerOutlineBtn = {
  flex: 1,
  minHeight: isAndroid ? s(44) : 52,
  borderRadius: MORE_INFO_RADIUS,
  borderWidth: 1,
  borderColor: "#FECACA",
  backgroundColor: MORE_INFO_CARD_BG,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: ah(8),
};

/** Add Activity modal — uppercase labels + bordered fields */
export const activityModalFormLabel = {
  fontSize: isAndroid ? fs(11) : 11,
  fontFamily: theme.font.dinBold,
  color: "#94A3B8",
  letterSpacing: 0.7,
  marginBottom: av(6),
  textTransform: "uppercase",
  ...(isAndroid ? { lineHeight: lhA(11), ...androidTextFix } : {}),
};
export const activityModalTextInput = {
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: MORE_INFO_BORDER,
  borderRadius: ah(10),
  paddingHorizontal: ah(12),
  paddingVertical: av(12),
  fontSize: isAndroid ? fs(16) : 16,
  fontFamily: theme.font.dinLight,
  color: "#111827",
  backgroundColor: MORE_INFO_CARD_BG,
  ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : {}),
};

/** Max height for activity/notes list scroll (3 cards × row height). */
export const CUSTOM_COMPANY_CONTACT_ROW_HEIGHT = isAndroid ? 62 : 72;
export const CUSTOM_COMPANY_CONTACT_ACTION_ICON = isAndroid ? 20 : 22;
export const CUSTOM_COMPANY_FOOTER_ICON = isAndroid ? 18 : 20;
export const NOTES_TAB_SCROLL_MAX_HEIGHT = isAndroid ? 3 * 108 : 3 * 126;

export function notesTabScrollContentPadding(noteCount) {
  return { paddingBottom: noteCount > 3 ? (isAndroid ? av(28) : 28) : (isAndroid ? av(8) : 8) };
}

export function contactsScrollContentPadding(_hasMore) {
  return { paddingBottom: isAndroid ? av(4) : 4 };
}

export function contactsListClipWrap(maxH) {
  return { maxHeight: maxH, overflow: "hidden" };
}

export function contactsListMaxHeightStyle(maxH) {
  return { maxHeight: maxH };
}

export function statusPickerSwatch(color) {
  return {
    backgroundColor: color,
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 10,
  };
}

export function heroStatusDotStyle(backgroundColor) {
  return {
    backgroundColor: backgroundColor || "#E5E7EB",
    height: isAndroid ? s(28) : 32,
    width: isAndroid ? s(28) : 32,
    borderRadius: isAndroid ? s(14) : 16,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  };
}

export function dropdownButtonTextStyle(isTagSelected) {
  return {
    color: isTagSelected ? theme.colors.primary : "#374151",
    fontSize: 16,
    textAlign: "left",
    fontFamily: theme.font.dinLight,
    flex: 1,
    marginLeft: 0,
    marginRight: 8,
    marginBottom: 2,
  };
}

export const dropdownRowTextStyle = {
  color: "#111827",
  textAlign: "left",
  fontSize: 15,
  fontFamily: theme.font.dinLight,
};

export function websiteModalWrapMinHeight(windowHeight) {
  return {
    width: "100%",
    minHeight: Math.min(520, windowHeight * 0.46),
  };
}

export const MORE_INFO_HEADER_HEIGHT = 86;

export function moreInfoModalRootStyle() {
  const h = Dimensions.get("window").height;
  const maxH = Math.round(h * 0.86);
  return {
    width: "100%",
    maxWidth: 440,
    height: maxH,
    maxHeight: maxH,
    flexDirection: "column",
    borderRadius: MORE_INFO_RADIUS,
    overflow: "hidden",
    backgroundColor: MORE_INFO_SURFACE,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    ...MORE_INFO_CARD_SHADOW,
  };
}

/** Scroll body fills space below the fixed header (requires parent `height`). */
export function moreInfoBodyScrollMaxStyle() {
  return {
    flex: 1,
    minHeight: 0,
  };
}

export function websiteUrlInputExtra(valid) {
  return {
    width: "100%",
    marginBottom: 14,
    marginTop: 6,
    textTransform: "lowercase",
    borderColor: valid ? MORE_INFO_BORDER : "#EF4444",
  };
}

export function notesSavePrimaryBackground(disabled) {
  return {
    backgroundColor: disabled ? MORE_INFO_DISABLED_BG : theme.colors.primary,
  };
}

export function routeListRowOpacityStyle(isAdding) {
  return { opacity: isAdding ? 0.7 : 1 };
}

export function openCloseDayRowStyle(index) {
  return {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderTopWidth: index > 0 ? StyleSheet.hairlineWidth : 0,
    borderTopColor: "#EEF0F3",
  };
}

export function moreInfoLinkCtaLabel(enabled) {
  return {
    marginLeft: 4,
    flexShrink: 1,
    fontFamily: theme.font.dinCondensedBold,
    fontSize: 12,
    lineHeight: 14,
    textAlign: "center",
    color: enabled ? theme.colors.white : MORE_INFO_MUTED,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  };
}

export const moreInfoLabelMarginBottom10 = {
  ...moreInfoLabelStyle,
  marginBottom: 6,
};

export const moreInfoValueMarginBottom14 = {
  ...moreInfoValueStyle,
  marginBottom: 14,
};

export const moreInfoValueMarginBottom8 = {
  ...moreInfoValueStyle,
  marginBottom: 8,
};

export const modalCloseHitSlop = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
};

export const copyWebsiteHitSlop = {
  top: 12,
  bottom: 12,
  left: 12,
  right: 12,
};

/** Matches `styles.fontS12` + `styles.textAlC` for action bar captions. */
const actionBarCaptionBase = {
  fontSize: 12,
  textAlign: "center",
  /** Lets labels ellipsize inside equal-width quick-action tiles */
  minWidth: 0,
  width: "100%",
  flexShrink: 1,
};

/** Extracted styles for customcompany screen */
export const cc = StyleSheet.create({
  padH5: { paddingHorizontal: isAndroid ? ah(4) : 5 },
  p4: { padding: av(4) },
  p6: { padding: av(6) },
  p8: { padding: av(8) },
  flex1Min: { flex: 1, minWidth: 0 },
  flex1MinCenter: { flex: 1, minWidth: 0, justifyContent: "center" },
  flex1Ml12Min: { flex: 1, marginLeft: ah(12), minWidth: 0 },
  flex1MinMv10: { flex: 1, minWidth: 0, marginVertical: av(10) },
  relative: { position: "relative" },
  textRed: { color: "red" },
  locIconMargin: {
    marginTop: isAndroid ? 1 : 3,
    marginRight: isAndroid ? ah(4) : 6,
  },
  mr8: { marginRight: 8 },
  mt14: { marginTop: av(14) },
  rowAlignCenter: { flexDirection: "row", alignItems: "center" },
  flexShrink0Mr10: { flexShrink: 0, marginRight: 10 },
  minHeight0: { minHeight: 0 },
  flex4: { flex: 4 },
  flex1: { flex: 1 },
  flex1WidthFull: { flex: 1, width: "100%" },
  flex1Pr10: { flex: 1, paddingRight: 10 },
  flex01: { flex: 0.1 },
  flex09: { flex: 0.9 },
  row: { flexDirection: "row" },
  rowAlignStartPl2: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 2,
  },
  /** Hero address row — tighter on Android so long addresses fit on fewer lines. */
  heroAddressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: isAndroid ? 0 : 2,
    marginBottom: isAndroid ? av(6) : 0,
  },
  activityTabsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: MORE_INFO_BORDER,
    marginHorizontal: isAndroid ? ah(4) : 4,
    marginBottom: isAndroid ? av(10) : 12,
  },
  activityTabCol: {
    flex: 1,
    position: "relative",
  },
  activityTabPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isAndroid ? av(10) : 12,
  },
  activityTabLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isAndroid ? av(5) : 6,
  },
  activityTabLabel: {
    fontSize: isAndroid ? 14 : 15,
    fontFamily: theme.typography.buttonLabel,
    color: "#6B7280",
    fontWeight: "600",
    lineHeight: isAndroid ? lhCompact(14) : 20,
    ...listTextAndroid,
  },
  activityTabLabelActive: {
    color: theme.colors.primary,
  },
  activityTabBadge: {
    minWidth: isAndroid ? ah(20) : 22,
    height: isAndroid ? ah(20) : 22,
    paddingHorizontal: isAndroid ? ah(5) : 6,
    borderRadius: isAndroid ? ah(10) : 11,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  activityTabBadgeActive: {
    backgroundColor: "rgba(18, 74, 198, 0.15)",
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  activityTabBadgeText: {
    fontSize: isAndroid ? 13 : 14,
    fontFamily: theme.typography.buttonLabel,
    color: "#6B7280",
    fontWeight: "600",
    ...(isAndroid ? { lineHeight: lhCompact(13), ...listTextAndroid } : {}),
  },
  activityTabBadgeTextActive: {
    color: theme.colors.primary,
  },
  activityTabUnderline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  /** Bordered frame around the activity / visit list. */
  activityListBorderWrap: {
    borderWidth: 1,
    borderColor: MORE_INFO_BORDER,
    borderRadius: isAndroid ? ah(10) : 12,
    overflow: "hidden",
    backgroundColor: MORE_INFO_CARD_BG,
    paddingHorizontal: isAndroid ? ah(8) : 10,
    paddingTop: isAndroid ? av(8) : 10,
    paddingBottom: isAndroid ? av(6) : 8,
  },
  activityListScroll: {
    backgroundColor: MORE_INFO_CARD_BG,
  },
  activityCard: {
    backgroundColor: MORE_INFO_CARD_BG,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: isAndroid ? ah(8) : 10,
    paddingVertical: isAndroid ? av(10) : 14,
    paddingHorizontal: isAndroid ? ah(10) : 14,
    marginBottom: isAndroid ? av(8) : 10,
  },
  /** Mark-visited rows — align with primary note cards (color-only tweak vs notes). */
  activityVisitCard: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: MORE_INFO_CARD_BG,
  },
  activityVisitCardDateText: {
    color: "#111827",
  },
  activityVisitPill: {
    backgroundColor: "rgba(18, 74, 198, 0.12)",
    borderColor: theme.colors.primary,
  },
  activityVisitPillText: {
    color: theme.colors.primary,
  },
  activityVisitBodyText: {
    color: "#111827",
  },
  activityCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityCardDateText: {
    fontSize: isAndroid ? 14 : 15,
    fontFamily: theme.font.dinBold,
    color: "#111827",
    flex: 1,
    marginRight: isAndroid ? ah(6) : 8,
    lineHeight: isAndroid ? lhCompact(14) : 20,
    ...listTextAndroid,
  },
  activityTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: isAndroid ? av(6) : 8,
    alignSelf: "flex-start",
  },
  activityTypeLabel: {
    fontSize: isAndroid ? 11 : 12,
    fontFamily: theme.typography.buttonLabelCompact,
    color: "#6B7280",
    marginRight: isAndroid ? ah(6) : 8,
    lineHeight: isAndroid ? lhCompact(11) : 16,
    ...listTextAndroid,
  },
  activityTypeLabelVisit: {
    fontSize: isAndroid ? 11 : 12,
    fontFamily: theme.typography.buttonLabelCompact,
    color: "#6B7280",
    marginRight: isAndroid ? ah(6) : 8,
    lineHeight: isAndroid ? lhCompact(11) : 16,
    ...listTextAndroid,
  },
  activityTypePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderColor: theme.colors.primary,
    borderWidth: 0.5,
    backgroundColor: "rgba(18, 74, 198, 0.12)",
  },
  activityTypePillText: {
    fontSize: isAndroid ? 11 : 12,
    fontFamily: theme.typography.buttonLabel,
    color: theme.colors.primary,
    fontWeight: "500",
    lineHeight: isAndroid ? lhCompact(11) : 16,
    ...listTextAndroid,
  },
  activityCardBodyText: {
    marginTop: isAndroid ? av(3) : 4,
    fontSize: isAndroid ? 14 : 15,
    fontFamily: theme.font.dinLight,
    color: "#111827",
    lineHeight: isAndroid ? lhCompact(14) : 22,
    ...listTextAndroid,
  },
  activityDateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityDateTimeRowText: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.font.dinLight,
    color: "#111827",
    marginRight: 8,
  },
  activityTimeRowText: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.font.dinLight,
    color: "#111827",
    marginRight: 8,
    marginBottom: 4,
  },
  activityDateTimeRowTextMuted: {
    color: "#9CA3AF",
  },
  activityDateTimeRowDisabled: {
    opacity: 0.55,
  },
  activityAddSubModalTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  /** Stacking layer inside Add Activity `react-native-modal` (second RN-Modal stays behind). */
  activityAddModalLayer: {
    flex: 1,
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  activityAddOverlayRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  activityAddOverlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  activityAddOverlayForeground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  activityAddOverlayCard: {
    width: "100%",
    maxWidth: 440,
    borderRadius: MORE_INFO_RADIUS,
    overflow: "hidden",
    backgroundColor: MORE_INFO_CARD_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    ...MORE_INFO_CARD_SHADOW,
  },
  noteListRow: {
    backgroundColor: MORE_INFO_CARD_BG,
    marginBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: MORE_INFO_BORDER,
    paddingVertical: av(14),
    paddingHorizontal: ah(16),
  },
  noteDateCol: {
    width: ah(112),
    marginRight: ah(14),
    justifyContent: "center",
  },
  noteDateBold: {
    fontSize: isAndroid ? fs(13) : 13,
    fontFamily: theme.font.dinBold,
    color: "#374151",
    ...(isAndroid ? { lineHeight: lhA(13), ...androidTextFix } : {}),
  },
  noteMetaType: {
    fontSize: isAndroid ? fs(12) : 12,
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    marginTop: av(8),
    ...(isAndroid ? { lineHeight: lhA(12), ...androidTextFix } : {}),
  },
  noteBodyText: {
    fontSize: isAndroid ? fs(15) : 15,
    fontFamily: theme.font.dinLight,
    color: "#111827",
    lineHeight: isAndroid ? lhA(15) : 22,
    ...(isAndroid ? androidTextFix : {}),
  },
  noteVisitedMeta: {
    fontSize: isAndroid ? fs(15) : 15,
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    lineHeight: isAndroid ? lhA(15) : 22,
    ...(isAndroid ? androidTextFix : {}),
  },
  visitHeaderCard: {
    backgroundColor: MORE_INFO_CARD_BG,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: MORE_INFO_BORDER,
    paddingVertical: av(12),
    paddingHorizontal: ah(16),
  },

  contactListRow: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: isAndroid ? av(10) : 14,
    paddingHorizontal: isAndroid ? ah(10) : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  contactListRowSelected: {
    backgroundColor: "rgba(18, 74, 198, 0.05)",
  },
  contactReportCheckboxWrap: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: isAndroid ? s(44) : 44,
    minHeight: isAndroid ? s(44) : 44,
    paddingRight: isAndroid ? ah(6) : 8,
    flexShrink: 0,
  },
  contactReportCheckboxDisabled: {
    opacity: 0.55,
  },
  contactReportCheckboxPressed: {
    opacity: 0.75,
  },
  contactReportCheckboxSpacer: {
    width: isAndroid ? ah(28) : 30,
    flexShrink: 0,
  },
  contactListRowLeft: {
    flex: 1,
    paddingLeft: isAndroid ? ah(4) : 5,
    paddingRight: isAndroid ? ah(4) : 5,
    minWidth: 0,
  },
  contactNameText: {
    fontSize: isAndroid ? 17 : 20,
    lineHeight: isAndroid ? lhCompact(17) : 24,
    fontWeight: "bold",
    fontFamily: theme.font.dinBold,
    ...listTextAndroid,
  },
  contactPositionText: {
    fontSize: isAndroid ? 13 : 14,
    color: "#555",
    marginTop: isAndroid ? av(2) : 3,
    fontFamily: theme.font.dinLight,
    lineHeight: isAndroid ? lhCompact(13) : 18,
    ...listTextAndroid,
  },
  contactCityText: {
    fontSize: isAndroid ? 11 : 12,
    color: "#888",
    fontFamily: theme.font.dinLight,
    lineHeight: isAndroid ? lhCompact(11) : 16,
    ...listTextAndroid,
  },
  contactActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: isAndroid ? ah(4) : 5,
    flexShrink: 0,
  },

  notesLoadingWrap: {
    minHeight: isAndroid ? av(102) : 120,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: isAndroid ? av(20) : 24,
    paddingHorizontal: isAndroid ? ah(16) : 16,
  },
  notesLoadingLabel: {
    marginLeft: 12,
    fontSize: 15,
    color: "#6B7280",
    fontFamily: theme.font.dinLight,
    lineHeight: isAndroid ? lhCompact(15) : 20,
    ...listTextAndroid,
  },
  notesEmptyWrap: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: isAndroid ? av(26) : 32,
    paddingHorizontal: isAndroid ? ah(24) : 24,
  },
  notesEmptyTitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: theme.font.dinLight,
    lineHeight: isAndroid ? lhCompact(16) : 22,
    ...listTextAndroid,
  },
  notesEmptyHint: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#9CA3AF",
    fontFamily: theme.font.dinLight,
    lineHeight: isAndroid ? lhCompact(14) : 20,
    ...listTextAndroid,
  },
  notesScrollMax: { maxHeight: NOTES_TAB_SCROLL_MAX_HEIGHT },
  listScrollFade: {
    height: isAndroid ? av(28) : 28,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  listScrollFadeText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: theme.font.dinBold,
  },
  tabFooterActionsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: isAndroid ? ah(8) : 8,
    gap: isAndroid ? av(8) : 10,
    marginTop: isAndroid ? av(10) : 12,
  },
  tabFooterActionsRowNoTop: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: isAndroid ? ah(8) : 8,
    gap: isAndroid ? av(8) : 10,
  },
  footerPrimaryCta52: {
    flex: 1,
    minWidth: 0,
    height: isAndroid ? 44 : 52,
    marginVertical: isAndroid ? av(8) : 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: isAndroid ? ah(10) : 12,
    paddingHorizontal: isAndroid ? ah(8) : 8,
  },
  footerPrimaryCta52DisabledNet: {
    backgroundColor: "#d9d9d9",
    opacity: 0.7,
  },
  footerPrimaryCta52DisabledVisit: {
    backgroundColor: "#d9d9d9",
    opacity: 0.85,
  },
  footerFindContactCta: {
    width: "100%",
    height: isAndroid ? 44 : 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: isAndroid ? ah(10) : 12,
    paddingHorizontal: isAndroid ? ah(8) : 8,
  },
  footerFindContactCtaDisabled: {
    backgroundColor: "#d9d9d9",
    opacity: 0.85,
  },
  footerCtaLabel: {
    ...theme.typography.buttonLabel,
    color: theme.colors.white,
    fontSize: isAndroid ? 15 : 16,
    lineHeight: isAndroid ? lhCompact(15) : 21,
    textAlign: "left",
    ...listTextAndroid,
  },
  footerCtaLabelLoaderGap: {
    marginLeft: 8,
  },
  mapChooserHeaderWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: MORE_INFO_BORDER,
    paddingBottom: 14,
    marginBottom: 8,
  },
  sheetGrabberWrap: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
  },
  sheetGrabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  mapChooserHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    marginBottom: 14,
  },

  contactsLoadingWrap: {
    minHeight: isAndroid ? av(68) : 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: isAndroid ? av(16) : 20,
    paddingHorizontal: isAndroid ? ah(16) : 16,
  },
  contactsLoadingText: {
    marginLeft: isAndroid ? ah(10) : 12,
    fontSize: isAndroid ? 15 : 16,
    color: theme.colors.primary,
    fontFamily: theme.font.dinBold,
    lineHeight: isAndroid ? lhCompact(15) : 22,
    ...listTextAndroid,
  },
  contactsEmptyWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: isAndroid ? av(16) : 20,
    paddingVertical: isAndroid ? av(20) : 24,
    paddingHorizontal: isAndroid ? ah(24) : 24,
  },
  contactsEmptyTitle: {
    fontSize: isAndroid ? 19 : 22,
    marginHorizontal: isAndroid ? ah(12) : 15,
    textAlign: "center",
    fontWeight: "600",
    color: "#c3c3c3",
    fontFamily: theme.font.dinBold,
    lineHeight: isAndroid ? lhCompact(19) : 28,
    ...listTextAndroid,
  },
  contactsMigrationTitle: {
    fontSize: isAndroid ? 17 : 18,
    marginHorizontal: isAndroid ? ah(12) : 15,
    textAlign: "center",
    fontWeight: "600",
    color: theme.colors.primary,
    fontFamily: theme.font.dinBold,
    lineHeight: isAndroid ? lhCompact(17) : 24,
    ...listTextAndroid,
  },
  contactsMigrationBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: isAndroid ? av(8) : 8,
    marginBottom: isAndroid ? av(4) : 4,
    paddingVertical: isAndroid ? av(10) : 10,
    paddingHorizontal: isAndroid ? ah(12) : 12,
    minHeight: isAndroid ? av(44) : 44,
    borderRadius: 10,
    backgroundColor: "rgba(18, 74, 198, 0.08)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(18, 74, 198, 0.22)",
  },
  contactsMigrationBannerText: {
    flex: 1,
    flexShrink: 1,
    fontSize: isAndroid ? 13 : 14,
    color: theme.colors.primary,
    fontFamily: theme.font.dinBold,
    lineHeight: isAndroid ? Math.round(13 * 1.35) : 20,
    ...listTextAndroid,
  },
  contactsEmptyHint: {
    marginTop: isAndroid ? av(8) : 10,
    fontSize: isAndroid ? 14 : 15,
    textAlign: "center",
    color: "#999",
    lineHeight: isAndroid ? lhCompact(14) : 22,
    ...listTextAndroid,
  },

  statusPickerRow: {
    backgroundColor: theme.colors.surfaceMuted,
    flexDirection: "row",
    alignItems: "center",
    padding: av(10),
    justifyContent: "space-between",
  },
  statusPickerLabel: {
    fontSize: isAndroid ? fs(16) : 16,
    fontFamily: theme.font.dinBold,
    ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : {}),
  },

  screenRoundedWhite: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: ah(20),
    borderTopRightRadius: ah(20),
    overflow: "hidden",
  },
  mainScrollContent: { flexGrow: 1, paddingBottom: av(24) },
  heroCard: {
    paddingHorizontal: ah(16),
    paddingTop: isAndroid ? av(10) : 14,
    paddingBottom: isAndroid ? av(10) : 14,
    marginHorizontal: ah(16),
    marginTop: av(12),
    marginBottom: av(8),
    backgroundColor: "#F9FAFB",
    borderRadius: ah(16),
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  heroRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isAndroid ? av(6) : 10,
  },
  heroCompanyTitle: {
    flex: 1,
    minWidth: 0,
    marginRight: ah(10),
    fontSize: isAndroid ? fs(20) : 20,
    fontFamily: theme.font.dinBold,
    color: theme.colors.black,
    textAlign: "left",
    lineHeight: isAndroid ? lhA(20) : 24,
    ...androidTextFix,
  },
  heroEditPencilBtn: {
    width: ah(40),
    height: ah(40),
    borderRadius: ah(20),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  heroAddressText: {
    flex: 1,
    minWidth: 0,
    fontSize: isAndroid ? 13 : 14,
    lineHeight: isAndroid ? lhA(13) : 20,
    fontFamily: theme.font.dinLight,
    color: "#374151",
    textAlign: "left",
    ...(isAndroid ? androidTextFix : {}),
  },
  statusDropdownStyle: {
    backgroundColor: "#FFF",
    borderColor: "#E5E7EB",
    borderRadius: ah(10),
    minHeight: isAndroid ? s(38) : 44,
  },
  statusDropdownContainer: {
    borderColor: "#E5E7EB",
    borderRadius: ah(10),
  },
  quickActionsWrap: {
    flexDirection: "row",
    flexWrap: "nowrap",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginTop: isAndroid ? av(6) : 8,
    gap: ah(4),
  },
  quickActionBtn: {
    flex: 1,
    minWidth: 0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: isAndroid ? s(44) : 52,
    paddingHorizontal: ah(4),
    borderRadius: ah(12),
  },
  quickActionBtnPrimary: {
    backgroundColor: theme.colors.primary,
  },
  quickActionBtnMuted: {
    backgroundColor: theme.colors.lightGray,
  },
  actionBarCaption: {
    ...actionBarCaptionBase,
    color: "#FFF",
    fontFamily: theme.font.dinLight,
  },
  actionBarCaptionWhite: {
    ...actionBarCaptionBase,
    color: theme.colors.white,
    fontFamily: theme.font.dinLight,
  },
  actionBarCaptionMuted: {
    ...actionBarCaptionBase,
    color: theme.colors.surfaceMuted,
    fontFamily: theme.font.dinLight,
  },

  loadingTile: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.colors.white,
    height: isAndroid ? s(44) : 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: ah(12),
  },

  sectionHeaderWrap: {
    marginTop: isAndroid ? av(20) : 24,
    marginBottom: isAndroid ? av(6) : 8,
    paddingHorizontal: isAndroid ? ah(16) : 16,
  },
  sectionHeaderWrapNotes: {
    marginTop: isAndroid ? av(16) : 20,
    marginBottom: isAndroid ? av(22) : 28,
    paddingHorizontal: isAndroid ? ah(16) : 16,
  },
  sectionHeaderTitle: {
    fontSize: isAndroid ? 16 : 18,
    lineHeight: isAndroid ? lhCompact(16) : lineHeightFor(18),
    color: theme.colors.black,
    fontFamily: theme.font.dinBold,
    fontWeight: "bold",
    flex: 1,
    minWidth: 0,
    marginRight: ah(10),
    ...listTextAndroid,
  },
  sectionHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: isAndroid ? av(14) : 16,
    gap: ah(8),
  },
  sectionHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    gap: ah(8),
  },
  sectionReportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: isAndroid ? s(28) : 30,
    paddingHorizontal: isAndroid ? ah(8) : 9,
    paddingVertical: isAndroid ? av(4) : 5,
    borderRadius: isAndroid ? ah(8) : 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
  },
  sectionReportBtnConfirm: {
    borderColor: theme.colors.success,
    backgroundColor: "rgba(76, 175, 80, 0.06)",
  },
  sectionReportBtnIcon: {
    marginRight: ah(4),
  },
  sectionReportBtnLabel: {
    ...theme.typography.buttonLabel,
    fontSize: TEXT_SIZES.EXTRA_SMALL,
    lineHeight: isAndroid ? lhA(12) : 15,
    marginTop: scaledSize(1),
    color: "#4B5563",
    ...listTextAndroid,
  },
  sectionReportBtnLabelConfirm: {
    color: theme.colors.success,
  },
  sectionReportHelpBtn: {
    width: isAndroid ? s(28) : 30,
    height: isAndroid ? s(28) : 30,
    borderRadius: isAndroid ? s(14) : 15,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: isAndroid ? ah(10) : 12,
    padding: isAndroid ? av(10) : 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  visitedModalCard: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: MORE_INFO_CARD_BG,
    borderRadius: MORE_INFO_RADIUS,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    ...MORE_INFO_CARD_SHADOW,
  },
  visitedModalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: MORE_INFO_BORDER,
    backgroundColor: MORE_INFO_CARD_BG,
  },
  visitedModalTitleBlock: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
    paddingRight: 4,
  },
  visitedModalList: {
    maxHeight: Math.round(Dimensions.get("window").height * 0.44),
    backgroundColor: MORE_INFO_SURFACE,
  },
  visitedModalListContent: {
    paddingBottom: 16,
    paddingTop: 4,
  },
  visitedModalListContentEmpty: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MORE_INFO_SURFACE,
  },
  visitedModalCount: {
    fontSize: 12,
    fontFamily: theme.font.dinBold,
    color: MORE_INFO_MUTED,
    letterSpacing: 0.35,
    textTransform: "uppercase",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: MORE_INFO_SURFACE,
  },
  visitedListRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: MORE_INFO_CARD_BG,
  },
  visitedRowLeading: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  visitedRowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(18, 74, 198, 0.35)",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  visitedRowTextBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  visitedRowDatePrimary: {
    fontSize: 15,
    fontFamily: theme.font.dinBold,
    color: "#111827",
    letterSpacing: -0.2,
  },
  visitedRowDateSecondary: {
    fontSize: 13,
    fontFamily: theme.font.dinLight,
    color: "#64748B",
    marginTop: 3,
  },
  visitedRowRemove: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  visitedRowSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: MORE_INFO_BORDER,
    marginLeft: 44,
    marginRight: 16,
  },
  visitedEmptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  visitedEmptyTitle: {
    fontSize: 17,
    fontFamily: theme.font.dinBold,
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  visitedEmptySubtitle: {
    fontSize: 15,
    fontFamily: theme.font.dinLight,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },

  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: MORE_INFO_BORDER,
    backgroundColor: MORE_INFO_CARD_BG,
  },
  modalIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitleText: {
    fontSize: 20,
    lineHeight: lineHeightFor(20),
    fontFamily: theme.font.dinBold,
    color: "#111827",
    ...androidTextFix,
  },
  modalSubtitleText: {
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    marginTop: 2,
  },
  sheetMutedBody: {
    backgroundColor: MORE_INFO_SURFACE,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  addToOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MORE_INFO_CARD_BG,
    borderRadius: MORE_INFO_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  addToOptionRowLast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MORE_INFO_CARD_BG,
    borderRadius: MORE_INFO_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  addToIconMap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(18, 74, 198, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  addToIconList: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  addToRowTitle: {
    fontSize: 17,
    fontFamily: theme.font.dinBold,
    color: "#111827",
  },
  addToRowSubtitle: {
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    marginTop: 2,
  },
  addToCancelBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: MORE_INFO_RADIUS,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  addToCancelText: {
    fontSize: 16,
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
  },

  /** Create / add to route & list modals (AI Find Leads form layout). */
  /**
   * react-native-modal `style` — must use flex:1 + center alignment so the sheet
   * sits in the middle of the screen (not stuck to the top).
   */
  addToRouteListModalContainer: {
    flex: 1,
    width: "100%",
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  /**
   * Inner wrapper — react-native-modal + avoidKeyboard/slide animations can leave
   * the first child hugging the top; this flex box recenters the card vertically.
   */
  addToRouteListModalInner: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  /** ScrollView fills inner; content is vertically centered when shorter than viewport. */
  addToRouteListModalScroll: {
    flex: 1,
    width: "100%",
  },
  addToRouteListModalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
  },
  addToFormModalRoot: {
    backgroundColor: MORE_INFO_CARD_BG,
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  addToFormHeader: {
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: "center",
  },
  addToFormHeroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(18, 74, 198, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  addToFormTitle: {
    fontSize: 22,
    fontFamily: theme.font.dinBold,
    color: "#111827",
    textAlign: "center",
  },
  addToFormSubtitle: {
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  addToFormBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  addToFormRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addToFormClearTouch: {
    width: 44,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  addToFormFlexInput: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  addToFormDropdownCol: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  addToFormErrorText: {
    color: "#ff0000",
    fontWeight: "600",
    textAlign: "left",
    marginTop: 6,
    fontFamily: theme.font.dinLight,
    fontSize: 13,
  },
  addToFormFooterRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  addToFormCancelBtn: {
    flex: 1,
    minHeight: isAndroid ? s(44) : 52,
    paddingVertical: av(12),
    borderRadius: ah(12),
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addToFormCancelBtnLabel: {
    ...theme.typography.buttonLabel,
    color: theme.colors.primary,
  },
  addToFormUpdateBtn: {
    flex: 1,
    minHeight: isAndroid ? s(44) : 52,
    paddingVertical: av(12),
    borderRadius: ah(12),
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addToFormUpdateBtnLabel: {
    ...theme.typography.buttonLabel,
    color: theme.colors.white,
  },
  routeModalLabelSpacer: {
    marginTop: 20,
  },
  inputErrorBorder: {
    borderColor: "#ff0000",
  },

  sheetIntroText: {
    fontSize: 15,
    fontFamily: theme.font.dinLight,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 14,
  },

  filterModalTitle: {
    fontFamily: theme.font.dinBold,
  },
  filterModalHeaderRow: {
    flexDirection: "row",
    height: 60,
  },
  filterModalCloseColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
    flex: 1,
    marginRight: 5,
  },
  routeFilterEmptyWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  routeFilterEmptyText: {
    fontSize: 20,
    marginHorizontal: 15,
    textAlign: "center",
    fontWeight: "600",
    color: "#c3c3c3",
    fontFamily: theme.font.dinBold,
  },
  addNewRouteBar: {
    justifyContent: "space-around",
    marginVertical: 5,
    alignItems: "center",
    height: 50,
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
  },
  addNewRouteBarText: {
    lineHeight: 42,
    fontFamily: theme.font.dinBold,
    ...androidTextFix,
  },
  addNewListBarText: {
    lineHeight: 42,
    fontFamily: theme.font.dinBold,
    ...androidTextFix,
  },

  websiteHintRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: MORE_INFO_CARD_BG,
    borderRadius: MORE_INFO_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
  },
  websiteHintUrlText: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: "#111827",
  },
  searchSecondaryBtnLabel: {
    fontSize: 16,
    fontFamily: theme.font.dinBold,
    color: theme.colors.white,
  },
  websiteFooterRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    alignItems: "stretch",
    flexShrink: 0,
  },
  websiteCancelLabel: {
    fontSize: 16,
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
  },

  moreInfoHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: MORE_INFO_HEADER_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: MORE_INFO_BORDER,
    backgroundColor: MORE_INFO_CARD_BG,
  },
  moreInfoGrabberWrap: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 2,
    backgroundColor: MORE_INFO_CARD_BG,
  },
  moreInfoGrabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  moreInfoEditBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(18, 74, 198, 0.06)",
    marginRight: 4,
  },
  moreInfoEditLabel: {
    ...theme.typography.buttonLabelCompact,
    color: theme.colors.primary,
  },
  moreInfoScrollContent: {
    paddingTop: 10,
    paddingBottom: 12,
    flexGrow: 0,
    backgroundColor: MORE_INFO_SURFACE,
  },
  moreInfoSectionTitle: {
    fontSize: 11,
    fontFamily: theme.font.dinBold,
    color: "#94A3B8",
    letterSpacing: 0.45,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  moreInfoCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: MORE_INFO_CARD_BG,
    borderRadius: MORE_INFO_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  moreInfoCardRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEF0F3",
  },
  moreInfoCardValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreInfoCardValueText: {
    flex: 1,
    ...moreInfoValueStyle,
  },
  moreInfoCardRowLast: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  moreInfoActionsCard: {
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: MORE_INFO_CARD_BG,
    borderRadius: MORE_INFO_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  moreInfoLinksRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 6,
  },
  moreInfoLinksRowSecond: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "stretch",
    gap: 6,
  },
  moreInfoLinkBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 36,
    borderRadius: 10,
    paddingHorizontal: 4,
    minWidth: 0,
  },
  moreInfoLinkBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  moreInfoLinkBtnInactive: {
    backgroundColor: MORE_INFO_DISABLED_BG,
  },
  openCloseCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: MORE_INFO_CARD_BG,
    borderRadius: MORE_INFO_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  openCloseCardList: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: MORE_INFO_CARD_BG,
    borderRadius: MORE_INFO_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: MORE_INFO_BORDER,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  openCloseTimeRow: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  openCloseDayLabel: {
    minWidth: 52,
    fontFamily: theme.font.dinBold,
    color: theme.colors.ttFont,
  },
  openCloseDayLabelClosed: {
    fontWeight: "bold",
    color: "red",
  },
  openCloseTimeText: {
    color: theme.colors.ttFont,
    fontFamily: theme.font.dinLight,
  },
  openCloseTimeDash: {
    color: theme.colors.ttFont,
    fontFamily: theme.font.dinLight,
    marginHorizontal: 5,
  },
  openCloseClosedText: {
    fontWeight: "bold",
    color: "red",
    fontFamily: theme.font.dinBold,
  },

  notesFormError: {
    fontSize: 14,
    color: "#DC2626",
    fontFamily: theme.font.dinLight,
    marginTop: 10,
  },
  notesFormActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    alignItems: "stretch",
  },
  notesFormActionsRowWrap: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    flexWrap: "wrap",
  },
  modalCtaLabel16: {
    ...theme.typography.buttonLabel,
    fontSize: 16,
    lineHeight: 21,
    color: theme.colors.white,
  },
  modalSecondaryCta16: {
    ...theme.typography.buttonLabel,
    fontSize: 16,
    lineHeight: 21,
    color: theme.colors.primary,
  },
  modalDangerCta16: {
    ...theme.typography.buttonLabel,
    fontSize: 16,
    lineHeight: 21,
    color: "#DC2626",
  },
  noteDetailScroll: { maxHeight: 280 },

  bottomInsetFiller: { height: 15, marginBottom: 0 },

  routeListRow: {
    height: 50,
    margin: 0,
    padding: 0,
    borderColor: "#B5B5B5",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  routeListNumberCol: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1.5,
  },
  routeListTitleCol: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 9,
  },
  routeListTitleText: {
    paddingTop: 10,
    fontFamily: theme.font.dinLight,
  },
  routeListIndexText: {
    fontFamily: theme.font.dinBold,
  },
});
