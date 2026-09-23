/**
 * Routes Library action sheet — iOS legacy px unchanged; Android ~15% tighter spacing.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../styles/platformText";
import { scaledSize } from "../../utils/commonFunctions";

const c = theme.colors;
const isAndroid = Platform.OS === "android";
const s = scaledSize;

export const routesLibraryVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
export const routesLibraryHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = routesLibraryVertical;
const ah = routesLibraryHorizontal;
const lhCompact = (fontSize) => Math.round(fontSize * 1.12);

export const ROUTES_ACTION_ICON_CIRCLE = isAndroid ? av(48) : 48;
export const ROUTES_SHARE_ICON_CIRCLE = isAndroid ? av(40) : 40;
export const ROUTES_ACTION_ICON_SIZE = isAndroid ? 22 : 24;
export const ROUTES_EDIT_ICON_SIZE = isAndroid ? 20 : 22;
export const ROUTES_SHARE_ICON_SIZE = isAndroid ? 20 : 22;
export const ROUTES_NAME_EDIT_ICON = isAndroid ? 22 : 24;
export const ROUTES_NAME_CHEVRON = isAndroid ? 20 : 22;
export const ROUTES_ACTION_TITLE_FONT = isAndroid ? 18 : 20;
export const ROUTES_SHARE_TITLE_FONT = isAndroid ? 20 : 22;
export const ROUTES_ROUTE_NAME_FONT = isAndroid ? 20 : 22;
export const ROUTES_ROUTE_NAME_LINE = isAndroid ? lhCompact(20) : 28;
export const ROUTES_ACTION_SUBTITLE_FONT = 12;
export const ROUTES_ACTION_ROW_GAP = isAndroid ? ah(10) : 10;

export const routesActionModalStyles = StyleSheet.create({
  sheet: {
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
  scrollContent: {
    flexGrow: 1,
  },
  dragHandle: {
    width: isAndroid ? ah(40) : 40,
    height: isAndroid ? av(4) : 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: isAndroid ? av(20) : 20,
  },
  routeNameGradient: {
    borderRadius: isAndroid ? ah(16) : 16,
    marginBottom: isAndroid ? av(20) : 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: c.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  routeNameInner: {
    padding: isAndroid ? av(18) : 18,
  },
  routeNameEditLabel: {
    fontSize: 13,
    fontFamily: theme.font.dinBold,
    color: c.white,
    marginBottom: isAndroid ? av(10) : 10,
    opacity: 0.95,
    ...androidTextFix,
  },
  routeNameEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: isAndroid ? av(10) : 10,
  },
  routeNameInput: {
    flex: 1,
    minWidth: 0,
    fontSize: isAndroid ? 17 : 18,
    height: isAndroid ? av(52) : 52,
    paddingHorizontal: isAndroid ? ah(16) : 16,
    backgroundColor: c.white,
    borderRadius: isAndroid ? ah(12) : 12,
    fontFamily: theme.font.dinBold,
    color: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    ...androidTextFix,
  },
  routeNameSaveBtn: {
    width: isAndroid ? av(52) : 52,
    height: isAndroid ? av(52) : 52,
    borderRadius: isAndroid ? ah(12) : 12,
    backgroundColor: c.white,
    justifyContent: "center",
    alignItems: "center",
  },
  routeNameDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeNameIconCircle: {
    width: ROUTES_ACTION_ICON_CIRCLE,
    height: ROUTES_ACTION_ICON_CIRCLE,
    borderRadius: ROUTES_ACTION_ICON_CIRCLE / 2,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: isAndroid ? ah(14) : 14,
  },
  routeNameLabelCol: {
    flex: 1,
    minWidth: 0,
  },
  routeNameLabel: {
    fontSize: 12,
    fontFamily: theme.font.dinBold,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: isAndroid ? av(6) : 6,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    ...androidTextFix,
  },
  routeNameValue: {
    fontSize: ROUTES_ROUTE_NAME_FONT,
    lineHeight: ROUTES_ROUTE_NAME_LINE,
    fontFamily: theme.font.dinBold,
    color: c.white,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    ...androidTextFix,
  },
  routeNameChevron: {
    marginLeft: isAndroid ? ah(8) : 8,
  },
  actionRow: {
    flexDirection: "row",
    marginBottom: isAndroid ? av(15) : 15,
  },
  actionCardBase: {
    flex: 1,
    borderRadius: isAndroid ? ah(16) : 16,
    padding: isAndroid ? av(18) : 18,
    borderWidth: 2,
    transform: [{ scale: 1 }],
  },
  actionCardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.8,
  },
  actionCardMap: {
    backgroundColor: "#F0F7FF",
    borderColor: c.ttBlue,
    shadowColor: c.ttBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCardMapRightGap: {
    marginRight: ROUTES_ACTION_ROW_GAP,
  },
  actionCardEdit: {
    backgroundColor: "#00000010",
    borderColor: c.black,
  },
  actionCardReroute: {
    backgroundColor: "#F0F9F7",
    borderColor: c.primary,
    marginRight: ROUTES_ACTION_ROW_GAP,
    shadowColor: c.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCardDelete: {
    backgroundColor: "#FFF5F5",
    borderColor: c.ttRed,
    shadowColor: c.ttRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconCircle: {
    width: ROUTES_ACTION_ICON_CIRCLE,
    height: ROUTES_ACTION_ICON_CIRCLE,
    borderRadius: ROUTES_ACTION_ICON_CIRCLE / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: isAndroid ? av(12) : 12,
    alignSelf: "flex-start",
  },
  actionIconCircleMap: {
    backgroundColor: c.ttBlue,
  },
  actionIconCircleEdit: {
    backgroundColor: c.ttBtnGray,
  },
  actionIconCircleReroute: {
    backgroundColor: c.primary,
  },
  actionIconCircleDelete: {
    backgroundColor: c.ttRed,
  },
  actionTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: ROUTES_ACTION_TITLE_FONT,
    marginBottom: isAndroid ? av(4) : 4,
    ...androidTextFix,
  },
  actionTitleMap: {
    color: c.ttBlue,
  },
  actionTitleEdit: {
    color: c.black,
  },
  actionTitleReroute: {
    color: c.primary,
  },
  actionTitleDelete: {
    color: c.ttRed,
  },
  actionSubtitle: {
    fontFamily: theme.font.dinLight,
    fontSize: ROUTES_ACTION_SUBTITLE_FONT,
    lineHeight: isAndroid ? lhCompact(12) : lineHeightFor(12),
    color: "#666",
    ...androidTextFix,
  },
  actionSubtitleEdit: {
    color: "#333",
  },
  shareBtn: {
    backgroundColor: c.primary,
    borderRadius: isAndroid ? ah(16) : 16,
    padding: isAndroid ? av(20) : 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: c.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  shareBtnLoading: {
    opacity: 0.7,
  },
  shareBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  shareIconCircle: {
    width: ROUTES_SHARE_ICON_CIRCLE,
    height: ROUTES_SHARE_ICON_CIRCLE,
    borderRadius: ROUTES_SHARE_ICON_CIRCLE / 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: isAndroid ? ah(12) : 12,
  },
  shareTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: ROUTES_SHARE_TITLE_FONT,
    color: c.white,
    ...androidTextFix,
  },
});

export default routesActionModalStyles;
