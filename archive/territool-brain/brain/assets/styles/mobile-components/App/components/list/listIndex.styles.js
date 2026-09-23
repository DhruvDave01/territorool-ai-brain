/**
 * Styles for `App/components/list/index.js` (Lists library screen).
 * iOS legacy px unchanged; Android ~15% tighter spacing on list chrome.
 */
import { Dimensions, Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix } from "../../styles/platformText";
import { scaledSize } from "../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const listIndexVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const listIndexHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = listIndexVertical;
const ah = listIndexHorizontal;
const lhCompact = (fontSize) => Math.round(fontSize * 1.12);

export const LIST_INDEX_SEARCH_MIN_H = isAndroid ? 42 : 48;
export const LIST_INDEX_SEARCH_GLYPH = isAndroid ? 16 : 17;
export const LIST_INDEX_ROW_MIN_H = isAndroid ? s(76) : 88;
export const LIST_INDEX_ROW_LAYOUT_H = isAndroid ? s(60) : 70;
export const LIST_INDEX_CHEVRON_SIZE = isAndroid ? 20 : 22;
export const LIST_INDEX_ROW_ACTION_ICON = isAndroid ? 20 : 22;
export const LIST_INDEX_CREATE_ICON = isAndroid ? 34 : 38;
export const LIST_INDEX_SCROLL_HINT_SIZE = isAndroid ? 24 : 28;
export const LIST_INDEX_ORDER_BADGE = isAndroid ? s(24) : 28;

export const LIST_FILTER_TITLE_ICON_BOX = isAndroid ? av(48) : 48;
export const LIST_FILTER_ACTION_ICON_CIRCLE = isAndroid ? av(50) : 50;
export const LIST_FILTER_ACTION_ICON_SIZE = isAndroid ? 22 : 24;
export const LIST_FILTER_EDIT_ICON_SIZE = isAndroid ? 20 : 22;
export const LIST_FILTER_TITLE_ICON = isAndroid ? 22 : 24;
export const LIST_FILTER_CHECK_ICON = isAndroid ? 22 : 26;
export const LIST_FILTER_CHEVRON = isAndroid ? 20 : 22;
export const LIST_FILTER_ACTION_TITLE = isAndroid ? 18 : 20;
export const LIST_FILTER_TITLE_MAIN = isAndroid ? 20 : 22;
export const LIST_FILTER_TITLE_LINE = isAndroid ? lhCompact(20) : 28;
export const LIST_FILTER_ROW_GAP = isAndroid ? ah(10) : 10;
export const LIST_FILTER_SEND_ICON_CIRCLE = isAndroid ? av(40) : 40;
export const LIST_FILTER_SEND_ICON = isAndroid ? 20 : 22;
export const LIST_FILTER_SEND_LABEL = isAndroid ? 20 : 22;
export const LIST_FILTER_GEN_SPINNER_MIN_H = isAndroid ? av(50) : 50;

export const RT_SURFACE_PAGE = theme.colors.ccSurface;
export const RT_CARD_BG = "#FFFFFF";
export const RT_BORDER = "#E5E7EB";
export const RT_RADIUS = 12;

export const listIndexCardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  android: { elevation: 2 },
});

const winH = () => Dimensions.get("window").height;

export function listIndexMaxHeight(fraction) {
  return { maxHeight: winH() * fraction };
}

export function listIndexShareEmailBorderStyle(
  valid,
  hasInvalidLength,
  { apiErrorMessage, successMessage, infoMessage } = {}
) {
  if (apiErrorMessage || hasInvalidLength) {
    return listIndexStyles.shareEmailBorderInvalid;
  }
  if (infoMessage) {
    return listIndexStyles.shareEmailBorderInfo;
  }
  if (successMessage || valid) {
    return listIndexStyles.shareEmailBorderValid;
  }
  return listIndexStyles.shareEmailBorderDefault;
}

export const SHARE_EMAIL_FEEDBACK_CLEAR = {
  shareEmailSuccessMessage: "",
  shareEmailApiErrorMessage: "",
  shareEmailInfoMessage: "",
  shareEmailPendingResend: false,
};

export function listIndexShareEmailErrorMessage(email) {
  if (!email?.length) return null;
  if (/^\S+@\S+\.\S+$/.test(email)) return null;
  return "Email address is not valid.";
}

export function listIndexFilterMapPress(pressed) {
  return {
    transform: [{ scale: pressed ? 0.96 : 1 }],
    opacity: pressed ? 0.8 : 1,
  };
}

export function listIndexFilterEditPress(pressed) {
  return {
    transform: [{ scale: pressed ? 0.96 : 1 }],
    opacity: pressed ? 0.8 : 1,
  };
}

export function listIndexFilterGenRoutePress(pressed, loading) {
  return {
    transform: [{ scale: pressed && !loading ? 0.96 : 1 }],
    opacity: loading ? 0.6 : pressed ? 0.8 : 1,
  };
}

export function listIndexFilterDeletePress(pressed) {
  return {
    transform: [{ scale: pressed ? 0.96 : 1 }],
    opacity: pressed ? 0.8 : 1,
  };
}

export function listIndexFilterSendListPress(pressed, sharedLoader) {
  return {
    opacity: sharedLoader ? 0.7 : pressed ? 0.85 : 1,
    transform: [{ scale: pressed && !sharedLoader ? 0.97 : 1 }],
  };
}

export function listIndexRowIconPress(pressed) {
  return {
    opacity: pressed ? 0.6 : 1,
    backgroundColor: pressed ? theme.colors.pressDarkOverlay : "transparent",
  };
}

export function listIndexShareCancelDynamic(isLoading) {
  return { opacity: isLoading ? 0.6 : 1 };
}

export function listIndexShareSendDynamic(valid, isLoading) {
  return { opacity: !valid || isLoading ? 0.8 : 1 };
}

export function listIndexCreateListPress(pressed) {
  return {
    borderColor: pressed ? theme.colors.primary : RT_BORDER,
    backgroundColor: pressed ? "rgba(18,160,144,0.08)" : RT_CARD_BG,
    // Android: translucent fill + elevation causes grey halo; override shadow last (see list/index showCreateRoute order).
    ...(Platform.OS === "android" && pressed ? { elevation: 0 } : {}),
  };
}

const listIndexStyles = StyleSheet.create({
  headerPlusIconIOS: {
    color: theme.colors.white,
    bottom: 5,
    top: 0,
  },
  headerPlusIconAndroid: {
    color: theme.colors.white,
    bottom: 0,
    top: 3,
  },
  headerRightBtn: { right: 10 },

  searchHeader: {
    flexShrink: 0,
    paddingHorizontal: ah(16),
    paddingVertical: av(14),
    backgroundColor: theme.colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8EAED",
  },
  searchBar: {
    flex: 0,
    flexGrow: 0,
    alignSelf: "stretch",
    width: "100%",
    backgroundColor: "#FAFBFC",
    borderColor: "#E2E4E9",
    minHeight: LIST_INDEX_SEARCH_MIN_H,
  },
  searchInput: {
    flex: 1,
    marginLeft: ah(4),
    fontFamily: theme.font.dinLight,
    minWidth: 0,
    paddingVertical: av(12),
    color: "#111827",
    ...(isAndroid
      ? { fontSize: 15, lineHeight: lhCompact(15), ...androidTextFix }
      : { fontSize: 16 }),
  },
  clearSearchBtn: {
    padding: av(6),
  },
  searchEmptyWrap: {
    paddingVertical: av(32),
    paddingHorizontal: ah(24),
    alignItems: "center",
  },
  searchEmptyText: {
    fontFamily: theme.font.dinLight,
    color: theme.colors.darkGray,
    textAlign: "center",
    ...(isAndroid
      ? { fontSize: 15, lineHeight: lhCompact(15), ...androidTextFix }
      : { fontSize: 16 }),
  },

  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: av(40),
    backgroundColor: RT_SURFACE_PAGE,
  },
  loadingCaption: {
    marginTop: av(14),
    fontFamily: theme.font.dinLight,
    color: theme.colors.darkGray,
    ...(isAndroid
      ? { fontSize: 14, lineHeight: lhCompact(14), ...androidTextFix }
      : { fontSize: 15 }),
  },
  listWrap: {
    flex: 1,
    backgroundColor: RT_SURFACE_PAGE,
    position: "relative",
  },
  flatList: { flex: 1, backgroundColor: RT_SURFACE_PAGE },
  flatListContent: {
    paddingTop: av(16),
    paddingBottom: av(24),
    paddingHorizontal: 0,
    flexGrow: 1,
  },
  scrollHintWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: av(10),
    alignItems: "center",
  },
  emptyOuter: {
    flex: 1,
    backgroundColor: RT_SURFACE_PAGE,
    paddingHorizontal: ah(16),
    paddingTop: av(24),
  },
  emptyLoadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: av(40),
    backgroundColor: RT_SURFACE_PAGE,
  },
  emptyCard: {
    backgroundColor: RT_CARD_BG,
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: RT_BORDER,
    paddingVertical: av(40),
    paddingHorizontal: ah(24),
    alignItems: "center",
  },
  emptyIcon: { marginBottom: av(16) },
  emptyBodyText: {
    fontFamily: theme.font.dinLight,
    color: theme.colors.darkGray,
    textAlign: "center",
    ...(isAndroid
      ? { fontSize: 15, lineHeight: lhCompact(15), ...androidTextFix }
      : { fontSize: 16, lineHeight: 24 }),
  },
  publishedRowWrap: { marginHorizontal: ah(16), marginVertical: av(4) },
  publishedCard: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: RT_CARD_BG,
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: RT_BORDER,
    paddingVertical: av(14),
    paddingLeft: ah(14),
    paddingRight: ah(10),
    minHeight: LIST_INDEX_ROW_MIN_H,
  },
  publishedCardNew: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    backgroundColor: "#F0F4FF",
  },
  orderCol: {
    width: isAndroid ? ah(28) : 32,
    marginRight: ah(12),
    justifyContent: "center",
    alignItems: "center",
  },
  orderBadge: {
    width: LIST_INDEX_ORDER_BADGE,
    height: LIST_INDEX_ORDER_BADGE,
    borderRadius: LIST_INDEX_ORDER_BADGE / 2,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  orderBadgeText: {
    fontFamily: theme.font.dinBold,
    color: "#374151",
    ...(isAndroid
      ? { fontSize: 14, lineHeight: lhCompact(14), ...androidTextFix }
      : { fontSize: 15 }),
  },
  publishedBody: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    paddingRight: ah(8),
  },
  publishedTitle: {
    fontFamily: theme.font.dinBold,
    color: "#111827",
    marginBottom: av(4),
    ...(isAndroid
      ? { fontSize: 16, lineHeight: lhCompact(16), ...androidTextFix }
      : { fontSize: 17 }),
  },
  publishedSubtitle: {
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    ...(isAndroid
      ? { fontSize: 13, lineHeight: lhCompact(13), ...androidTextFix }
      : { fontSize: 14, lineHeight: 20 }),
  },
  publishedActionsRow: { flexDirection: "row", alignItems: "center" },
  iconBtnCol: {
    width: isAndroid ? ah(36) : 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtnColWide: {
    width: isAndroid ? ah(36) : 40,
    minWidth: isAndroid ? ah(36) : 40,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  rowIconPressableBase: {
    padding: av(8),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  rowChevronPressableBase: {
    padding: av(6),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  createListPressableBase: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: av(22),
    paddingHorizontal: ah(24),
    marginHorizontal: ah(16),
    marginTop: av(8),
    marginBottom: av(24),
    borderRadius: RT_RADIUS,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  createListTitle: {
    color: theme.colors.primary,
    marginTop: av(10),
    fontFamily: theme.font.dinBold,
    ...(isAndroid
      ? { fontSize: 17, lineHeight: lhCompact(17), ...androidTextFix }
      : { fontSize: 18 }),
  },
  createListSubtitle: {
    fontFamily: theme.font.dinLight,
    color: theme.colors.darkGray,
    marginTop: av(4),
    textAlign: "center",
    paddingHorizontal: ah(8),
    ...(isAndroid
      ? { fontSize: 12, lineHeight: lhCompact(12), ...androidTextFix }
      : { fontSize: 13 }),
  },
  footerSurface: { backgroundColor: RT_SURFACE_PAGE },

  filterModal: { justifyContent: "flex-end", margin: 0 },
  filterSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: isAndroid ? ah(30) : 30,
    borderTopRightRadius: isAndroid ? ah(30) : 30,
    paddingTop: isAndroid ? av(20) : 20,
    paddingBottom: isAndroid ? av(40) : 40,
    paddingHorizontal: isAndroid ? ah(25) : 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  filterScrollContent: { flexGrow: 1 },
  filterDragHandle: {
    width: isAndroid ? ah(40) : 40,
    height: isAndroid ? av(4) : 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: isAndroid ? av(20) : 20,
  },
  filterGradientCard: {
    borderRadius: isAndroid ? ah(16) : 16,
    marginBottom: isAndroid ? av(20) : 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  filterGradientInner: {
    padding: isAndroid ? av(18) : 18,
  },
  filterEditLabel: {
    fontSize: 13,
    fontFamily: theme.font.dinBold,
    color: theme.colors.white,
    marginBottom: isAndroid ? av(10) : 10,
    opacity: 0.95,
    ...androidTextFix,
  },
  filterEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: isAndroid ? av(10) : 10,
  },
  filterNameInput: {
    flex: 1,
    minWidth: 0,
    fontSize: isAndroid ? 17 : 18,
    height: isAndroid ? av(52) : 52,
    paddingHorizontal: isAndroid ? ah(16) : 16,
    backgroundColor: RT_CARD_BG,
    borderRadius: RT_RADIUS,
    fontFamily: theme.font.dinBold,
    color: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    ...androidTextFix,
  },
  filterNameInputAndroid: { textAlignVertical: "center" },
  filterNameSaveBtn: {
    width: isAndroid ? av(52) : 52,
    height: isAndroid ? av(52) : 52,
    borderRadius: RT_RADIUS,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  filterTitleRow: { flexDirection: "row", alignItems: "center" },
  filterTitleIconWrap: {
    width: LIST_FILTER_TITLE_ICON_BOX,
    height: LIST_FILTER_TITLE_ICON_BOX,
    borderRadius: LIST_FILTER_TITLE_ICON_BOX / 2,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: isAndroid ? ah(14) : 14,
  },
  filterTitleTextCol: { flex: 1, minWidth: 0 },
  filterTitleHint: {
    fontSize: 12,
    fontFamily: theme.font.dinBold,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: isAndroid ? av(6) : 6,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    ...androidTextFix,
  },
  filterTitleMain: {
    fontSize: LIST_FILTER_TITLE_MAIN,
    lineHeight: LIST_FILTER_TITLE_LINE,
    fontFamily: theme.font.dinBold,
    color: theme.colors.white,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    ...androidTextFix,
  },
  filterTitleChevron: {
    marginLeft: isAndroid ? ah(8) : 8,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: isAndroid ? av(15) : 15,
  },
  filterMapCard: {
    flex: 1,
    backgroundColor: "#F0F7FF",
    borderRadius: isAndroid ? ah(16) : 16,
    padding: isAndroid ? av(18) : 18,
    marginRight: LIST_FILTER_ROW_GAP,
    borderWidth: 2,
    borderColor: theme.colors.ttBlue,
    shadowColor: theme.colors.ttBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  filterEditCard: {
    flex: 1,
    backgroundColor: "#00000010",
    borderRadius: isAndroid ? ah(16) : 16,
    padding: isAndroid ? av(18) : 18,
    borderWidth: 2,
    borderColor: theme.colors.black,
  },
  filterActionIconLg: {
    width: LIST_FILTER_ACTION_ICON_CIRCLE,
    height: LIST_FILTER_ACTION_ICON_CIRCLE,
    borderRadius: LIST_FILTER_ACTION_ICON_CIRCLE / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: isAndroid ? av(12) : 12,
    alignSelf: "flex-start",
  },
  filterMapIconBg: { backgroundColor: theme.colors.ttBlue },
  filterEditIconBg: { backgroundColor: theme.colors.ttBtnGray },
  iconMap24White: {
    fontSize: LIST_FILTER_ACTION_ICON_SIZE,
    color: theme.colors.white,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  iconEdit22White: {
    fontSize: LIST_FILTER_EDIT_ICON_SIZE,
    color: theme.colors.white,
    left: -1,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  filterMapTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: LIST_FILTER_ACTION_TITLE,
    color: theme.colors.ttBlue,
    marginBottom: isAndroid ? av(4) : 4,
    ...androidTextFix,
  },
  filterMapSub: {
    fontFamily: theme.font.dinLight,
    fontSize: 12,
    lineHeight: isAndroid ? lhCompact(12) : undefined,
    color: "#666",
    ...androidTextFix,
  },
  filterEditTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: LIST_FILTER_ACTION_TITLE,
    color: theme.colors.black,
    marginBottom: isAndroid ? av(4) : 4,
    ...androidTextFix,
  },
  filterEditSub: {
    fontFamily: theme.font.dinLight,
    fontSize: 12,
    lineHeight: isAndroid ? lhCompact(12) : undefined,
    color: "#333",
    ...androidTextFix,
  },
  filterGenCard: {
    flex: 1,
    backgroundColor: "#F0F9F7",
    borderRadius: isAndroid ? ah(16) : 16,
    padding: isAndroid ? av(18) : 18,
    marginRight: LIST_FILTER_ROW_GAP,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  filterGenSpinnerWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: LIST_FILTER_GEN_SPINNER_MIN_H,
  },
  filterGenIconBg: { backgroundColor: theme.colors.primary },
  filterGenTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: LIST_FILTER_ACTION_TITLE,
    color: theme.colors.primary,
    marginBottom: isAndroid ? av(4) : 4,
    ...androidTextFix,
  },
  filterDeleteCard: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    borderRadius: isAndroid ? ah(16) : 16,
    padding: isAndroid ? av(18) : 18,
    borderWidth: 2,
    borderColor: theme.colors.ttRed,
    shadowColor: theme.colors.ttRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  filterDeleteIconBg: { backgroundColor: theme.colors.ttRed },
  filterDeleteTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: LIST_FILTER_ACTION_TITLE,
    color: theme.colors.ttRed,
    marginBottom: isAndroid ? av(4) : 4,
    ...androidTextFix,
  },
  filterSendListBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: isAndroid ? ah(16) : 16,
    padding: isAndroid ? av(20) : 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  filterSendListIconWrap: {
    width: LIST_FILTER_SEND_ICON_CIRCLE,
    height: LIST_FILTER_SEND_ICON_CIRCLE,
    borderRadius: LIST_FILTER_SEND_ICON_CIRCLE / 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: isAndroid ? ah(12) : 12,
  },
  filterSendListIcon: {
    fontSize: LIST_FILTER_SEND_ICON,
    top: -2,
    right: -1,
    color: theme.colors.white,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  filterSendListLabel: {
    ...theme.typography.buttonLabel,
    fontSize: LIST_FILTER_SEND_LABEL,
    lineHeight: isAndroid ? lhCompact(LIST_FILTER_SEND_LABEL) : 28,
    color: theme.colors.white,
    ...androidTextFix,
  },

  shareModal: { justifyContent: "center", margin: 24 },
  shareModalCard: {
    backgroundColor: RT_CARD_BG,
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
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
  shareModalScrollContent: { flexGrow: 1 },
  shareModalHeader: {
    position: "relative",
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: "center",
  },
  shareModalCloseBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  shareModalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + "18",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  shareModalTitle: {
    fontSize: 22,
    fontFamily: "DINCondensed-Bold",
    color: "#111827",
    textAlign: "center",
  },
  shareModalDescription: {
    fontSize: 14,
    fontFamily: "DIN2014-Light",
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  shareModalBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  shareFieldLabel: {
    fontSize: 13,
    fontFamily: "DINCondensed-Bold",
    color: "#374151",
    marginBottom: 8,
  },
  shareEmailInputBase: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DIN2014-Light",
    color: "#111827",
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: "transparent",
  },
  shareEmailInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  shareEmailClearBtn: {
    paddingRight: 12,
    paddingLeft: 4,
    paddingVertical: 10,
  },
  shareEmailInputAndroid: { textAlignVertical: "center" },
  shareEmailBorderDefault: { borderColor: RT_BORDER },
  shareEmailBorderValid: { borderColor: "#10B981" },
  shareEmailBorderInvalid: { borderColor: "#EF4444" },
  shareEmailBorderInfo: { borderColor: theme.colors.primary },
  shareEmailError: {
    fontSize: 13,
    fontFamily: "DIN2014-Light",
    color: "#EF4444",
    marginTop: 6,
  },
  shareEmailSuccess: {
    fontSize: 13,
    fontFamily: "DIN2014-Light",
    color: "#10B981",
    marginTop: 6,
  },
  shareEmailInfo: {
    fontSize: 13,
    fontFamily: "DIN2014-Light",
    color: theme.colors.primary,
    marginTop: 6,
    lineHeight: 18,
  },
  shareEmailInfoHint: {
    fontSize: 12,
    fontFamily: "DIN2014-Light",
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 16,
  },
  shareActionsRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  shareCancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  shareCancelLabel: {
    ...theme.typography.buttonLabel,
    color: theme.colors.primary,
  },
  shareSendBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  shareSendingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  shareSpinner: { height: 22, marginRight: 8 },
  shareSendingLabel: {
    ...theme.typography.buttonLabel,
    fontSize: 16,
    lineHeight: 21,
    color: theme.colors.white,
  },
  shareSendLabel: {
    ...theme.typography.buttonLabel,
    color: theme.colors.white,
  },
  sharePastSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: RT_BORDER,
  },
  sharePastTitle: {
    fontSize: 13,
    fontFamily: "DINCondensed-Bold",
    color: "#374151",
    marginBottom: 12,
  },
  sharePastScroll: { maxHeight: 160 },
  sharePastRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sharePastRowLast: { borderBottomWidth: 0 },
  sharePastName: {
    fontSize: 15,
    color: "#374151",
    fontFamily: "DIN2014-Light",
    flex: 1,
  },
  sharePastEmail: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "DIN2014-Light",
    flex: 1,
  },
});

export default listIndexStyles;
