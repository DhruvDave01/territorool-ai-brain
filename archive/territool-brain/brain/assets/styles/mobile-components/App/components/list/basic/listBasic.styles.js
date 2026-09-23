/**
 * Styles for `App/components/list/basic/index.js` (list detail / companies screen).
 * iOS legacy px unchanged; Android ~15% tighter spacing.
 * Share List modal uses shared `../listIndex.styles.js`.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const listBasicVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const listBasicHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = listBasicVertical;
const ah = listBasicHorizontal;
const lhA = (fontSize) => lineHeightFor(fontSize, 1.12);

export const LIST_BASIC_MAP_ICON_SIZE = isAndroid ? 18 : 20;
export const LIST_BASIC_ROW_MIN_H = isAndroid ? s(76) : 88;
export const LIST_BASIC_SEARCH_MIN_H = isAndroid ? s(38) : 44;
export const LIST_BASIC_TOOLBAR_MIN_H = isAndroid ? s(48) : 56;
export const LIST_BASIC_MAP_BTN_MIN_H = isAndroid ? s(38) : 44;

export const listBasicCardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  android: { elevation: 2 },
});

export function listBasicHeaderIconPress(pressed) {
  return {
    opacity: pressed ? 0.7 : 1,
    backgroundColor: pressed
      ? "rgba(255, 255, 255, 0.1)"
      : "transparent",
  };
}

export function listBasicSearchClearPress(pressed) {
  return {
    opacity: pressed ? 0.7 : 1,
    backgroundColor: pressed ? "rgba(0, 0, 0, 0.05)" : "transparent",
  };
}

const listBasicStyles = StyleSheet.create({
  processingBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: av(12),
    paddingHorizontal: ah(16),
    borderBottomWidth: 1,
    borderBottomColor: "#FFC107",
  },
  processingText: {
    marginLeft: ah(10),
    fontFamily: theme.font.dinLight,
    color: theme.colors.white,
    fontWeight: "500",
    ...(isAndroid
      ? { fontSize: 13, lineHeight: lhA(13), ...androidTextFix }
      : { fontSize: 14 }),
  },

  gradientFullWidth: { width: "100%" },
  toolbarOuter: {
    backgroundColor: "transparent",
    minHeight: LIST_BASIC_TOOLBAR_MIN_H,
    paddingVertical: av(8),
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  toolbarFilterCol: {
    width: ah(44),
    justifyContent: "center",
    alignItems: "center",
  },
  toolbarFilterPressable: {
    padding: ah(8),
    borderRadius: ah(20),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  toolbarFilterIcon: {
    width: ah(35),
    fontSize: isAndroid ? s(32) : 35,
    color: theme.colors.white,
  },
  searchBarWrap: {
    flex: 1,
    minWidth: 0,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 999,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    fontFamily: theme.font.dinLight,
    fontSize: 16,
    color: theme.colors.textPrimary,
    ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : { lineHeight: 20 }),
  },
  searchClearHit: {
    padding: ah(6),
    borderRadius: ah(16),
  },
  magnifierIcon: {
    marginRight: 8,
    fontSize: 16,
    color: "#98A2B3",
  },
  equalPill: {
    flex: 1,
    minWidth: 0,
    height: 40,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  findContactsIcon: {
    marginRight: 8,
  },
  findContactsLabel: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 16,
    fontFamily: theme.font.dinBold,
    color: "#2563EB",
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : { lineHeight: 20 }),
  },
  iconSquareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  searchPillLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    fontFamily: theme.font.dinLight,
    color: "#98A2B3",
    ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : { lineHeight: 20 }),
  },
  overflowBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  expandedSearchField: {
    flex: 1,
    minWidth: 0,
    height: 40,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  expandedSearchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontFamily: theme.font.dinLight,
    fontSize: 16,
    color: theme.colors.textPrimary,
    ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : { lineHeight: 20 }),
  },
  clearCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EEF1F5",
    alignItems: "center",
    justifyContent: "center",
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.18)",
  },
  menuCard: {
    position: "absolute",
    width: 216,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EBF0",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuRowDivider: {
    borderTopWidth: 1,
    borderTopColor: "#EEF1F5",
  },
  menuRowLabel: {
    fontSize: 18,
    fontFamily: theme.font.dinBold,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lhA(18), ...androidTextFix } : { lineHeight: 22 }),
  },
  menuRowIcon: {
    marginRight: 12,
  },
  headerActionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerEditPressable: {
    padding: ah(8),
    borderRadius: ah(20),
    justifyContent: "center",
    alignItems: "center",
  },
  headerEditIcon: {
    top: av(2),
    fontSize: isAndroid ? s(20) : 22,
    height: isAndroid ? s(26) : 28,
    color: theme.colors.white,
  },
  toolbarMapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginLeft: ah(6),
    paddingVertical: av(8),
    paddingHorizontal: ah(12),
    minHeight: LIST_BASIC_MAP_BTN_MIN_H,
    borderRadius: ah(10),
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  mapActionIcon: {
    marginRight: ah(6),
  },
  mapActionLabel: {
    ...theme.typography.buttonLabelCompact,
    color: theme.colors.primary,
  },
  mapHintBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: ah(12),
    marginTop: av(8),
    marginBottom: av(4),
    paddingVertical: av(8),
    paddingHorizontal: ah(12),
    backgroundColor: "#EFF6FF",
    borderRadius: ah(8),
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  mapHintText: {
    flex: 1,
    marginLeft: ah(8),
    fontFamily: theme.font.dinLight,
    color: "#374151",
    ...(isAndroid
      ? { fontSize: 12, lineHeight: lhA(12), ...androidTextFix }
      : { fontSize: 13, lineHeight: 18 }),
  },

  mainColumn: { flex: 1, minHeight: 0 },
  flatList: { flex: 1 },
  flatListContent: { paddingBottom: av(24), paddingHorizontal: ah(4) },

  shareHeaderPressable: {
    padding: ah(8),
    borderRadius: ah(20),
    justifyContent: "center",
    alignItems: "center",
  },
  shareHeaderIcon: {
    width: ah(30),
    fontSize: isAndroid ? s(28) : 30,
    color: theme.colors.white,
  },

  companyRowWrap: {
    marginHorizontal: ah(8),
    marginVertical: av(4),
  },
  companyRowWrapFirstIOS: {
    paddingTop: 6,
  },
  companyCard: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#FFF",
    borderRadius: ah(12),
    paddingVertical: av(14),
    paddingLeft: ah(14),
    paddingRight: ah(10),
    minHeight: LIST_BASIC_ROW_MIN_H,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  companyCardBookmark: {
    backgroundColor: theme.colors.primary,
    borderColor: "rgba(255,255,255,0.2)",
  },
  companyBody: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    paddingRight: ah(6),
  },
  companyTitle: {
    fontFamily: "DINCondensed-Bold",
    marginBottom: av(4),
    ...(isAndroid
      ? { fontSize: 16, lineHeight: lhA(16), ...androidTextFix }
      : { fontSize: 17 }),
  },
  companyAddress: {
    fontFamily: "DIN2014-Light",
    marginBottom: av(4),
    ...(isAndroid
      ? { fontSize: 13, lineHeight: lhA(13), ...androidTextFix }
      : { fontSize: 14, lineHeight: 20 }),
  },
  companyMeta: {
    fontFamily: "DIN2014-Light",
    marginTop: av(2),
    ...(isAndroid
      ? { fontSize: 11, lineHeight: lhA(11), ...androidTextFix }
      : { fontSize: 12 }),
  },
  companyChevronCol: {
    width: ah(24),
    justifyContent: "center",
    alignItems: "center",
  },
  companyChevronIcon: {
    fontSize: isAndroid ? s(20) : 22,
  },
  companyStatusStripe: {
    width: ah(6),
    marginLeft: ah(4),
    borderRadius: ah(3),
    alignSelf: "stretch",
    minHeight: isAndroid ? s(41) : 48,
  },

  emptyOuter: {
    paddingVertical: av(48),
    paddingHorizontal: ah(24),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  emptyInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMessage: {
    fontFamily: "DIN2014-Light",
    textAlign: "center",
    ...(isAndroid ? { height: s(36) } : { height: 40 }),
  },

  listFooterLoader: {
    paddingVertical: av(20),
  },

  footerSurface: { backgroundColor: "#F6F7FB" },
});

export default listBasicStyles;
