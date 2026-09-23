/**
 * Basic Route detail (`index.js`) — iOS legacy px unchanged; Android compact.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;
const t = theme.colors;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const basicRouteVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const basicRouteHorizontal = (iosPx) => (isAndroid ? s(iosPx) : iosPx);
const av = basicRouteVertical;
const ah = basicRouteHorizontal;
const lhA = (fontSize) => lineHeightFor(fontSize, 1.12);

/** Company list row — route stop card + leg divider. */
export const BASIC_ROUTE_COMPANY_ROW = {
  wrap: {
    marginHorizontal: ah(8),
    marginVertical: av(4),
  },
  wrapFirstItem: {
    paddingTop: av(6),
  },
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#FFF",
    borderRadius: ah(12),
    paddingVertical: av(14),
    paddingLeft: ah(14),
    paddingRight: ah(10),
    minHeight: isAndroid ? s(75) : 88,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  orderCol: {
    width: ah(32),
    marginRight: ah(12),
    justifyContent: "center",
    alignItems: "center",
  },
  orderBadge: {
    width: ah(28),
    height: ah(28),
    borderRadius: ah(14),
    justifyContent: "center",
    alignItems: "center",
  },
  orderText: {
    fontSize: isAndroid ? s(15) : 15,
    fontFamily: theme.font.dinBold,
    ...(isAndroid ? { lineHeight: lhA(15), ...androidTextFix } : {}),
  },
  body: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    paddingRight: ah(6),
  },
  title: {
    fontSize: isAndroid ? s(17) : 17,
    fontFamily: theme.font.dinBold,
    marginBottom: av(4),
    ...(isAndroid ? { lineHeight: lhA(17), ...androidTextFix } : {}),
  },
  address: {
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinLight,
    marginBottom: av(4),
    lineHeight: isAndroid ? lhA(14) : 20,
    ...(isAndroid ? androidTextFix : {}),
  },
  meta: {
    fontSize: isAndroid ? s(12) : 12,
    fontFamily: theme.font.dinLight,
    marginTop: av(2),
    ...(isAndroid ? { lineHeight: lhA(12), ...androidTextFix } : {}),
  },
  chevronCol: {
    width: ah(24),
    justifyContent: "center",
    alignItems: "center",
  },
  chevronIcon: {
    fontSize: isAndroid ? s(22) : 22,
  },
  statusBar: {
    width: ah(6),
    marginLeft: ah(4),
    borderRadius: ah(3),
    alignSelf: "stretch",
    minHeight: isAndroid ? s(41) : 48,
  },
  legWrap: {
    paddingVertical: av(10),
    paddingHorizontal: ah(16),
    marginTop: av(2),
    marginBottom: av(2),
  },
  legInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: ah(8),
    paddingVertical: av(8),
    paddingHorizontal: ah(12),
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  legDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
    marginHorizontal: ah(10),
  },
  legIcon: {
    fontSize: isAndroid ? s(14) : 14,
    color: "#9CA3AF",
    marginRight: ah(6),
  },
  legText: {
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    ...(isAndroid ? { lineHeight: lhA(13), ...androidTextFix } : {}),
  },
  legTextSpaced: {
    marginRight: ah(12),
  },
};

const TOOLBAR_ACCENT = "#2563EB";
const TOOLBAR_PLACEHOLDER = "#98A2B3";
const TOOLBAR_PILL_HEIGHT = 40;
const TOOLBAR_ICON_BTN = 40;
const TOOLBAR_PILL_PAD_H = 14;
const TOOLBAR_HIT_SLOP = { top: 2, bottom: 2, left: 2, right: 2 };

/** Gradient toolbar — filter, search, Find Contacts, map / overflow. */
export const BASIC_ROUTE_TOOLBAR = {
  ACCENT: TOOLBAR_ACCENT,
  PLACEHOLDER: TOOLBAR_PLACEHOLDER,
  HIT_SLOP: TOOLBAR_HIT_SLOP,
  shell: {
    backgroundColor: "transparent",
    minHeight: isAndroid ? s(48) : 56,
    paddingTop: av(8),
    paddingBottom: 8,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  filterCol: {
    width: ah(44),
    justifyContent: "center",
    alignItems: "center",
  },
  filterHit: {
    padding: ah(8),
    borderRadius: ah(20),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterIcon: {
    width: ah(35),
    fontSize: isAndroid ? s(35) : 35,
    color: theme.colors.white,
  },
  searchField: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: ah(8),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: ah(12),
    paddingHorizontal: ah(12),
    minHeight: isAndroid ? s(38) : 44,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: av(10),
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? s(16) : 16,
    ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : {}),
  },
  searchClearHit: {
    padding: ah(6),
    borderRadius: ah(16),
  },
  equalPill: {
    flex: 1,
    minWidth: 0,
    height: TOOLBAR_PILL_HEIGHT,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    paddingHorizontal: TOOLBAR_PILL_PAD_H,
    flexDirection: "row",
    alignItems: "center",
  },
  searchPillLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    fontFamily: theme.font.dinLight,
    color: TOOLBAR_PLACEHOLDER,
    ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : { lineHeight: 20 }),
  },
  findContactsLabel: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 16,
    fontFamily: theme.font.dinBold,
    fontWeight: "700",
    color: TOOLBAR_ACCENT,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lhA(16), ...androidTextFix } : { lineHeight: 20 }),
  },
  magnifierIcon: {
    marginRight: 8,
    fontSize: 16,
    color: TOOLBAR_PLACEHOLDER,
  },
  findContactsIcon: {
    marginRight: 8,
  },
  iconSquareBtn: {
    width: TOOLBAR_ICON_BTN,
    height: TOOLBAR_ICON_BTN,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  overflowBtn: {
    width: TOOLBAR_ICON_BTN,
    height: TOOLBAR_ICON_BTN,
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
    height: TOOLBAR_PILL_HEIGHT,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    paddingHorizontal: TOOLBAR_PILL_PAD_H,
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
  headerIconHit: {
    padding: ah(8),
    borderRadius: ah(20),
    justifyContent: "center",
    alignItems: "center",
  },
  headerShareIcon: {
    width: ah(30),
    fontSize: isAndroid ? s(30) : 30,
    color: theme.colors.white,
  },
  headerEditIcon: {
    top: av(2),
    fontSize: isAndroid ? s(22) : 22,
    height: isAndroid ? s(26) : 28,
    color: theme.colors.white,
  },
  headerActionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
};

export const BASIC_ROUTE_LIST = {
  contentPadH: ah(4),
  footerLoader: {
    paddingVertical: av(20),
  },
  emptyWrap: {
    paddingVertical: av(48),
    paddingHorizontal: ah(24),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  emptyText: {
    height: isAndroid ? s(36) : 40,
    fontFamily: theme.font.dinLight,
    textAlign: "center",
    ...(isAndroid ? { fontSize: s(14), lineHeight: lhA(14), ...androidTextFix } : {}),
  },
};

const customStyles = StyleSheet.create({
  processingBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: av(12),
    paddingHorizontal: ah(16),
    borderBottomWidth: 1,
    borderBottomColor: t.amber,
  },
  processingText: {
    marginLeft: ah(10),
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinLight,
    color: theme.colors.white,
    fontWeight: "500",
    ...(isAndroid ? { lineHeight: lhA(14), ...androidTextFix } : {}),
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
    fontSize: isAndroid ? s(13) : 13,
    lineHeight: isAndroid ? lhA(13) : 18,
    fontFamily: theme.font.dinLight,
    color: "#374151",
    ...(isAndroid ? androidTextFix : {}),
  },
  toolbarMapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginLeft: ah(6),
    paddingVertical: av(8),
    paddingHorizontal: ah(12),
    minHeight: isAndroid ? s(38) : 44,
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
  mapActionButtonDisabled: {
    opacity: 0.5,
  },
  mapActionIcon: {
    marginRight: ah(6),
  },
  mapActionLabel: {
    ...theme.typography.buttonLabelCompact,
    color: theme.colors.primary,
    ...(isAndroid ? { fontSize: s(14), lineHeight: lhA(14), ...androidTextFix } : {}),
  },
});

export default customStyles;
