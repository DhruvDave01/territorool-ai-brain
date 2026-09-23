/**
 * Address Book (`company/list.js`) — iOS legacy px unchanged; Android ~15% tighter.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../styles/platformText";
import { scaledSize } from "../../utils/commonFunctions";
import {
  SCREEN_BODY_TOP_RADIUS,
} from "../../styles/screenCurvedBody";

const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const companyListVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const companyListHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = companyListVertical;
const ah = companyListHorizontal;
const lhCompact = (fontSize) => Math.round(fontSize * 1.12);

export const COMPANY_LIST_CHEVRON_SIZE = isAndroid ? 20 : 22;
export const COMPANY_LIST_CALL_ICON_SIZE = isAndroid ? 20 : 22;
export const COMPANY_LIST_SEARCH_MIN_H = isAndroid ? 42 : 48;
export const COMPANY_LIST_FILTER_BTN_W = isAndroid ? 40 : 44;
export const COMPANY_LIST_FILTER_BTN_H = COMPANY_LIST_SEARCH_MIN_H;
export const COMPANY_LIST_SEARCH_GLYPH = isAndroid ? 16 : 17;
export const COMPANY_LIST_SCROLL_HINT_SIZE = isAndroid ? 24 : 28;

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  android: { elevation: 2 },
});

const SHEET_SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  android: { elevation: 3 },
});

export const companyListStyles = StyleSheet.create({
  tabBarWrap: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: ah(10),
    paddingTop: av(6),
    paddingBottom: av(8),
    marginBottom: av(12),
    alignItems: "center",
  },
  tabSegment: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 12,
    padding: av(4),
  },
  tabButton: {
    flex: 1,
    paddingVertical: av(12),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.secondary,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      default: { elevation: 2 },
    }),
  },
  tabButtonInactive: {
    backgroundColor: "transparent",
  },
  tabPane: {
    flex: 1,
    minHeight: 0,
    position: "relative",
  },
  sheetBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: av(-12),
    bottom: 0,
    backgroundColor: theme.colors.ccSurface,
    borderTopLeftRadius: SCREEN_BODY_TOP_RADIUS,
    borderTopRightRadius: SCREEN_BODY_TOP_RADIUS,
    overflow: "hidden",
    ...SHEET_SHADOW,
  },
  sheetInner: {
    flex: 1,
    minHeight: 0,
  },
  searchHeader: {
    flexShrink: 0,
    paddingHorizontal: ah(16),
    paddingVertical: av(14),
    backgroundColor: theme.colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8EAED",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchFieldCol: {
    flex: 1,
    minWidth: 0,
    marginRight: ah(10),
  },
  searchBar: {
    flex: 0,
    flexGrow: 0,
    alignSelf: "stretch",
    width: "100%",
    backgroundColor: "#FAFBFC",
    borderColor: "#E2E4E9",
    minHeight: COMPANY_LIST_SEARCH_MIN_H,
  },
  searchInput: {
    flex: 1,
    marginLeft: ah(4),
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? 15 : 16,
    minWidth: 0,
    paddingVertical: av(12),
    color: "#111827",
    ...(isAndroid ? { lineHeight: lhCompact(15), ...androidTextFix } : {}),
  },
  clearSearchBtn: {
    padding: av(6),
  },
  filterBtn: {
    width: COMPANY_LIST_FILTER_BTN_W,
    height: COMPANY_LIST_FILTER_BTN_H,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E4E9",
    backgroundColor: "#FAFBFC",
  },
  deleteBtn: {
    width: COMPANY_LIST_FILTER_BTN_W,
    height: COMPANY_LIST_FILTER_BTN_H,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: ah(8),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E4E9",
    backgroundColor: "#FAFBFC",
  },
  deleteBtnActive: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  filterIcon: {
    fontSize: isAndroid ? 24 : 26,
    color: "#111827",
  },
  deleteIcon: {
    fontSize: isAndroid ? 22 : 24,
    color: "#111827",
  },
  deleteIconActive: {
    color: "#DC2626",
  },
  checkCol: {
    width: isAndroid ? ah(44) : 48,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteRowPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  deleteCheckBox: {
    height: isAndroid ? s(22) : s(20),
    width: isAndroid ? s(22) : s(20),
  },
  deleteModalLoadingWrap: {
    alignItems: "center",
    paddingVertical: av(8),
  },
  deleteModalLoadingText: {
    marginTop: av(10),
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? 15 : 16,
    color: "#374151",
    textAlign: "center",
    ...(isAndroid ? { lineHeight: lhCompact(15), ...androidTextFix } : {}),
  },
  listSurface: {
    flex: 1,
    minHeight: 0,
    backgroundColor: "#EEF1F6",
    position: "relative",
  },
  listFlex: {
    flex: 1,
  },
  listContent: {
    paddingTop: av(12),
    paddingBottom: av(24),
  },
  listContentGrow: {
    flexGrow: 1,
  },
  listFooter: {
    paddingVertical: av(20),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8EAED",
  },
  scrollHintWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: av(10),
    alignItems: "center",
  },
  rowWrap: {
    marginBottom: 0,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: ah(16),
    marginBottom: av(10),
    minHeight: isAndroid ? s(76) : 88,
    paddingVertical: av(10),
    paddingLeft: ah(4),
    paddingRight: 0,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: 12,
    ...CARD_SHADOW,
  },
  cardCompanyPad: {
    paddingLeft: ah(14),
  },
  cardSelectedPad: {
    paddingLeft: ah(4),
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    paddingRight: ah(4),
  },
  cardBodyPressable: {
    opacity: 1,
  },
  rowTitle: {
    fontFamily: theme.font.dinBold,
    color: "#111827",
    ...(isAndroid
      ? { fontSize: 16, lineHeight: lhCompact(16), ...androidTextFix }
      : {}),
  },
  rowMeta: {
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    marginTop: av(4),
    ...(isAndroid
      ? { fontSize: 14, lineHeight: lhCompact(14), ...androidTextFix }
      : {}),
  },
  rowMetaTight: {
    marginTop: av(2),
  },
  rowMetaDark: {
    color: "#374151",
  },
  selectedTitle: {
    fontFamily: theme.font.dinBold,
    color: "#111827",
    ...(isAndroid
      ? { fontSize: 18, lineHeight: lhCompact(18), ...androidTextFix }
      : {}),
  },
  selectedMeta: {
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    marginTop: av(4),
    ...(isAndroid
      ? { fontSize: 14, lineHeight: lhCompact(14), ...androidTextFix }
      : {}),
  },
  selectedMetaSmall: {
    fontFamily: theme.font.dinLight,
    color: "#374151",
    marginTop: av(2),
    ...(isAndroid
      ? { fontSize: 13, lineHeight: lhCompact(13), ...androidTextFix }
      : {}),
  },
  callCol: {
    width: isAndroid ? ah(36) : 40,
    justifyContent: "center",
  },
  callBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: av(8),
  },
  chevronCol: {
    justifyContent: "center",
    alignItems: "center",
  },
  statusBar: {
    width: isAndroid ? ah(5) : 6,
    alignSelf: "stretch",
    minHeight: isAndroid ? s(56) : 64,
    marginLeft: ah(4),
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  removeBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: av(8),
    borderRadius: 20,
  },
  emptyWrap: {
    paddingVertical: av(48),
    paddingHorizontal: ah(24),
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: av(12),
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    textAlign: "center",
    ...(isAndroid ? { lineHeight: lhCompact(17), ...androidTextFix } : {}),
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: av(6),
    ...(isAndroid ? { lineHeight: lhCompact(14), ...androidTextFix } : {}),
  },
});

/** iOS-only line heights matching legacy `fontS*` tokens — do not alter iOS appearance. */
export const companyListIosText = {
  title: { lineHeight: lineHeightFor(17) },
  meta15: { lineHeight: lineHeightFor(15) },
  selected20: { lineHeight: lineHeightFor(20) },
  meta14: { lineHeight: lineHeightFor(14) },
};
