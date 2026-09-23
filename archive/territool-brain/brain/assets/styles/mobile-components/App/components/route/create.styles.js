/**
 * Create Route screen — scaled layout with tighter Android vertical rhythm.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../styles/platformText";
import { scaledSize } from "../../utils/commonFunctions";

const s = scaledSize;
const isAndroid = Platform.OS === "android";

/** iOS-only: shave 2px off layout spacing (font sizes unchanged). */
const iosT = (size) => Math.max(0, size - 2);

/** Vertical spacing — Android compact; iOS legacy minus 2px. */
export const routeCreateVertical = (size) =>
  isAndroid ? s(Math.round(size * 0.85)) : iosT(size);

/** Line height — Android compact; iOS uses explicit legacy values in listing styles. */
export const routeCreateLineHeight = (fontSize, iosLineHeight) =>
  isAndroid
    ? lineHeightFor(fontSize, 1.12)
    : iosLineHeight != null
      ? iosT(iosLineHeight)
      : Math.round(fontSize * 1.2);

const sv = routeCreateVertical;
const lh = (fontSize, iosLineHeight) =>
  routeCreateLineHeight(fontSize, iosLineHeight);

/** Horizontal / structural — scaled on Android, fixed px on iOS (listing stays compact). */
const px = (size) => (isAndroid ? s(size) : size);

export const RT_SURFACE = "#F6F7FB";
export const RT_CARD_BG = "#FFFFFF";
export const RT_BORDER = "#E5E7EB";
export const RT_RADIUS = px(12);
export const RT_CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  android: { elevation: 2 },
});

/** Matches AI Find Leads selected company row. */
export const RT_COMPANY_ROW_SELECTED = {
  borderColor: theme.colors.primary,
  backgroundColor: "rgba(18, 74, 198, 0.05)",
  ...Platform.select({
    android: { elevation: 0 },
    default: {},
  }),
};

export const createRouteScaled = {
  searchIcon: px(20),
  clearIcon: px(22),
  findLeadsIcon: px(22),
  checkbox: Platform.select({
    android: { height: s(40), width: s(40) },
    default: { height: 22, width: 22 },
  }),
};

/** Company list row — All + Selected tabs (iOS: original fixed metrics from create.js). */
export const CREATE_ROUTE_COMPANY_ROW = {
  wrap: {
    marginHorizontal: px(16),
    marginVertical: sv(4),
  },
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: RT_CARD_BG,
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: RT_BORDER,
    paddingVertical: sv(14),
    paddingLeft: px(14),
    paddingRight: px(10),
    minHeight: isAndroid ? s(76) : iosT(88),
    ...RT_CARD_SHADOW,
  },
  checkCol: {
    width: px(44),
    marginRight: px(10),
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    paddingRight: px(8),
  },
  title: {
    fontSize: px(17),
    fontFamily: theme.font.dinBold,
    color: "#111827",
    marginBottom: sv(4),
    ...(isAndroid
      ? { lineHeight: lh(17), ...androidTextFix }
      : {}),
  },
  address: {
    fontSize: px(14),
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    lineHeight: lh(14, 20),
    marginBottom: sv(2),
    ...(isAndroid ? androidTextFix : {}),
  },
  meta: {
    fontSize: px(12),
    fontFamily: theme.font.dinLight,
    color: "#9CA3AF",
    marginBottom: sv(2),
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : {}),
  },
  metaLast: {
    fontSize: px(12),
    fontFamily: theme.font.dinLight,
    color: "#9CA3AF",
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : {}),
  },
  statusBar: {
    width: px(6),
    marginLeft: px(4),
    borderRadius: px(3),
    alignSelf: "stretch",
    minHeight: isAndroid ? s(42) : iosT(48),
  },
};

/** Search company field */
export const CREATE_ROUTE_SEARCH = {
  wrap: {
    backgroundColor: RT_CARD_BG,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: px(16),
    paddingTop: sv(12),
    paddingBottom: sv(12),
    borderBottomWidth: 1,
    borderBottomColor: RT_BORDER,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    height: isAndroid ? s(40) : iosT(46),
    backgroundColor: "#F3F4F6",
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: RT_BORDER,
    paddingHorizontal: px(12),
  },
  searchIcon: {
    marginRight: px(10),
  },
  input: {
    flex: 1,
    fontFamily: theme.font.dinLight,
    fontSize: px(15),
    color: "#111827",
    paddingVertical: 0,
    minHeight: 0,
    ...(isAndroid ? { lineHeight: lh(15), ...androidTextFix } : {}),
  },
  clearHit: {
    padding: px(6),
  },
};

/** All / Selected / Find Leads / Map toolbar */
export const CREATE_ROUTE_TOOLBAR = {
  row: {
    borderColor: RT_BORDER,
    backgroundColor: RT_CARD_BG,
    minHeight: isAndroid ? s(56) : iosT(64),
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: px(12),
    paddingVertical: sv(10),
    gap: px(6),
  },
  col: {
    flex: 1,
    minWidth: 0,
    alignItems: "stretch",
    paddingHorizontal: px(2),
  },
  segmentBtn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: px(8),
    height: isAndroid ? s(40) : iosT(44),
    width: "100%",
    paddingHorizontal: px(6),
  },
  segmentBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentBtnInactive: {
    backgroundColor: "#E5E7EB",
  },
  segmentLabel: {
    fontSize: px(15),
    ...(isAndroid ? { lineHeight: lh(15), ...androidTextFix } : {}),
  },
  findLeadsDropdown: {
    backgroundColor: theme.colors.ttBlue,
    borderRadius: px(8),
    height: isAndroid ? s(40) : iosT(44),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: px(6),
  },
  findLeadsLabel: {
    fontSize: px(15),
    color: "#ffffff",
    marginHorizontal: 0,
    ...(isAndroid ? { lineHeight: lh(15), ...androidTextFix } : {}),
  },
  mapBtn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: px(8),
    height: isAndroid ? s(40) : iosT(44),
    width: "100%",
    paddingHorizontal: px(6),
  },
  mapBtnEnabled: {
    backgroundColor: theme.colors.ttYellow,
    opacity: 1,
  },
  mapBtnDisabled: {
    backgroundColor: "#E5E7EB",
    opacity: 0.7,
  },
  mapLabel: {
    fontSize: px(15),
    color: theme.colors.white,
    ...(isAndroid ? { lineHeight: lh(15), ...androidTextFix } : {}),
  },
};

/** Sticky footer — Select all / Create route */
export const CREATE_ROUTE_FOOTER = {
  container: {
    backgroundColor: RT_CARD_BG,
    borderTopWidth: 1,
    borderTopColor: RT_BORDER,
    paddingHorizontal: px(16),
    paddingVertical: sv(12),
    paddingBottom: sv(24),
  },
  row: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectCol: {
    flex: 1,
    marginRight: px(8),
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: RT_RADIUS,
  },
  nextCol: {
    flex: 1,
    marginLeft: px(8),
  },
  actionBtn: {
    height: isAndroid ? s(42) : iosT(48),
    borderRadius: RT_RADIUS,
    justifyContent: "center",
    alignItems: "center",
  },
  selectAllBtn: {
    backgroundColor: "#E5E7EB",
  },
  unselectAllBtn: {
    backgroundColor: "#F3F4F6",
  },
  createBtn: {
    backgroundColor: theme.colors.primary,
  },
  actionLabel: {
    fontSize: px(16),
    lineHeight: isAndroid ? lh(16) : iosT(21),
    color: theme.colors.primary,
    ...(isAndroid ? androidTextFix : {}),
  },
  createLabel: {
    color: theme.colors.white,
  },
  loadingWrap: {
    height: isAndroid ? s(42) : iosT(48),
    justifyContent: "center",
    alignItems: "center",
  },
  loadingHint: {
    fontSize: px(12),
    color: "#6B7280",
    fontFamily: theme.font.dinLight,
    marginTop: sv(4),
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : {}),
  },
};

/** Skeleton / empty / blank states */
export const CREATE_ROUTE_LIST_STATES = {
  skeletonWrap: {
    flex: 1,
    backgroundColor: RT_SURFACE,
  },
  skeletonHeader: {
    paddingVertical: sv(16),
    paddingHorizontal: px(16),
    alignItems: "center",
  },
  skeletonHeaderText: {
    fontSize: px(14),
    color: "#6B7280",
    fontFamily: theme.font.dinLight,
    ...(isAndroid ? { lineHeight: lh(14), ...androidTextFix } : {}),
  },
  skeletonRow: {
    marginHorizontal: px(16),
    marginVertical: sv(4),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: px(14),
    paddingVertical: sv(14),
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: RT_BORDER,
    backgroundColor: RT_CARD_BG,
    minHeight: isAndroid ? s(76) : iosT(88),
  },
  blankCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: RT_CARD_BG,
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: RT_BORDER,
    paddingVertical: sv(24),
    paddingHorizontal: px(16),
    minHeight: isAndroid ? s(76) : iosT(88),
    ...RT_CARD_SHADOW,
  },
  blankText: {
    fontSize: px(15),
    lineHeight: lh(15, 22),
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    textAlign: "center",
    ...(isAndroid ? androidTextFix : {}),
  },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: px(16),
    paddingVertical: sv(24),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: px(17),
    fontFamily: theme.font.dinBold,
    color: "#111827",
    textAlign: "center",
    marginBottom: sv(8),
    ...(isAndroid ? { lineHeight: lh(17), ...androidTextFix } : {}),
  },
  emptyBody: {
    fontSize: px(14),
    lineHeight: lh(14, 20),
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: sv(20),
    ...(isAndroid ? androidTextFix : {}),
  },
  findLeadsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.ttBlue,
    paddingVertical: sv(isAndroid ? 10 : 14),
    paddingHorizontal: px(24),
    borderRadius: RT_RADIUS,
    minHeight: isAndroid ? s(42) : iosT(48),
  },
  findLeadsBtnText: {
    fontSize: px(16),
    fontFamily: theme.font.dinBold,
    color: theme.colors.white,
    ...(isAndroid ? { lineHeight: lh(16), ...androidTextFix } : {}),
  },
  findLeadsIcon: {
    marginRight: px(8),
  },
  listFooter: {
    paddingVertical: sv(20),
    alignItems: "center",
    justifyContent: "center",
  },
  listFooterText: {
    fontSize: px(13),
    color: "#6B7280",
    fontFamily: theme.font.dinLight,
    marginTop: sv(8),
    ...(isAndroid ? { lineHeight: lh(13), ...androidTextFix } : {}),
  },
  listSurface: {
    flex: 1,
    minHeight: 0,
    backgroundColor: RT_SURFACE,
  },
};

/** FlatList content padding — extra bottom space so list footers clear sticky action bar. */
export const CREATE_ROUTE_LIST_CONTENT_PAD = {
  paddingBottom: isAndroid ? sv(32) : 32,
  paddingTop: isAndroid ? sv(8) : 8,
};

/** FlatList row stride — wrap margins + card minHeight (iOS −2px). */
export const CREATE_ROUTE_LIST_ITEM_HEIGHT = isAndroid ? 96 : 94;

/** List footer — Add Company / More from All (Selected tab). */
export const CREATE_ROUTE_LIST_FOOTER = {
  wrap: {
    paddingHorizontal: px(16),
    paddingTop: sv(16),
    paddingBottom: sv(8),
    alignItems: "center",
  },
  moreFromAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: RT_CARD_BG,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    paddingVertical: sv(12),
    paddingHorizontal: px(20),
    borderRadius: RT_RADIUS,
    minHeight: isAndroid ? s(42) : iosT(48),
    width: "100%",
    maxWidth: px(320),
    marginBottom: sv(12),
  },
  moreFromAllText: {
    fontSize: px(16),
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
    ...(isAndroid ? { lineHeight: lh(16), ...androidTextFix } : {}),
  },
  moreFromAllIcon: {
    marginRight: px(8),
  },
  addCompanyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.ttBlue,
    paddingVertical: sv(14),
    paddingHorizontal: px(24),
    borderRadius: RT_RADIUS,
    minHeight: isAndroid ? s(42) : iosT(50),
    width: "100%",
    maxWidth: px(320),
  },
  addCompanyText: {
    fontSize: px(16),
    fontFamily: theme.font.dinBold,
    color: theme.colors.white,
    ...(isAndroid ? { lineHeight: lh(16), ...androidTextFix } : {}),
  },
  addCompanyIcon: {
    marginRight: px(8),
  },
};

export const stylesCreateRoute = StyleSheet.create({
  companyFilterApplyingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(246, 247, 251, 0.88)",
  },
});
