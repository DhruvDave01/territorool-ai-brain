import { Dimensions, Platform, StyleSheet } from "react-native";
import { COLOR_PRIMARY } from "../../../config/index.js";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";
import { congC, congChrome } from "../congContact/congContact.styles";

const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const bizContactVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const bizContactHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = bizContactVertical;
const ah = bizContactHorizontal;
/** iOS baseline line height (no screen scale) — keeps Android density aligned with iOS. */
const lhIos = (fontSize, ratio = 1.25) => Math.round(fontSize * ratio);
const lhCompact = (fontSize) => Math.round(fontSize * 1.12);

/** Toolbar / filter button min height — iOS legacy 48; Android fixed compact px. */
export const BIZ_CONTACT_ACTION_MIN_H = isAndroid ? 42 : 48;
export const BIZ_CONTACT_ROW_ACTION_MIN_H = isAndroid ? 32 : 36;

const { height: windowHeight } = Dimensions.get("window");
const tc = theme.colors;

/** Shared list chrome for biz companies + biz contacts screens */
export const LIST_SURFACE = tc.ccSurface;
export const LIST_CARD_BG = tc.white;
export const LIST_BORDER = tc.border;
export const LIST_RADIUS = theme.radius.md;
export const LIST_MUTED = tc.ccMuted;
export const PENDING_ACCENT = tc.warningOrange;

const LIST_CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: tc.shadowBlack,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  android: { elevation: 2 },
});

export const bizContactScreensStyles = StyleSheet.create({
  containerPrimaryBg: {
    backgroundColor: COLOR_PRIMARY,
  },
  sheet: {
    flex: 1,
    backgroundColor: LIST_SURFACE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  listContentPad: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 12,
    paddingBottom: theme.spacing.lg,
  },
  listContentPadContacts: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  emptyWrap: {
    flex: 1,
    minHeight: windowHeight * 0.35,
    paddingHorizontal: theme.spacing.xxl,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIconMargin: {
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    textAlign: "center",
    fontSize: 18,
    color: LIST_MUTED,
    fontFamily: theme.font.dinBold,
  },
  emptySubtitle: {
    textAlign: "center",
    fontSize: 15,
    color: tc.disabled,
    marginTop: theme.spacing.sm,
    fontFamily: theme.font.dinLight,
  },
  inlineLoaderPad: {
    paddingVertical: theme.spacing.xxl,
    alignItems: "center",
  },
  headerSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    backgroundColor: LIST_SURFACE,
  },
  headerCard: {
    backgroundColor: tc.primaryMutedBg,
    borderRadius: LIST_RADIUS,
    borderWidth: 1,
    borderColor: COLOR_PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  headerCompanyTitle: {
    fontSize: 20,
    color: COLOR_PRIMARY,
    textAlign: "center",
    fontFamily: theme.font.dinBold,
    lineHeight: lineHeightFor(20),
    ...androidTextFix,
  },
  headerCompanyAddress: {
    fontSize: 15,
    color: LIST_MUTED,
    marginTop: theme.spacing.xs + 2,
    textAlign: "center",
    fontFamily: theme.font.dinLight,
    lineHeight: 20,
  },
  listCount: {
    fontSize: 17,
    color: LIST_MUTED,
    marginBottom: theme.spacing.md,
    fontFamily: theme.font.dinBold,
    lineHeight: lineHeightFor(17),
    ...androidTextFix,
  },
  listCountFlex: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    color: LIST_MUTED,
    fontFamily: theme.font.dinBold,
    lineHeight: lineHeightFor(17),
    ...androidTextFix,
  },
  flex1: {
    flex: 1,
  },
  flatListGrow: {
    flexGrow: 1,
    paddingBottom: theme.spacing.sm,
  },
  flatListGrowContacts: {
    flexGrow: 1,
    paddingBottom: theme.spacing.lg,
  },
  centerSpinnerWrap: {
    justifyContent: "center",
  },
  /** Company row (bizCompanies) */
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIST_CARD_BG,
    borderRadius: LIST_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: LIST_BORDER,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    ...LIST_CARD_SHADOW,
  },
  companyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: tc.primaryMutedBgStrong,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  companyTextCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  companyName: {
    fontSize: 18,
    fontFamily: theme.font.dinBold,
    color: theme.colors.textPrimary,
    lineHeight: lineHeightFor(18),
    ...androidTextFix,
  },
  companyAddress: {
    marginTop: theme.spacing.xxs,
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: LIST_MUTED,
  },
  rowTrailing: {
    marginLeft: theme.spacing.sm,
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTrailingWide: {
    marginLeft: theme.spacing.sm,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  contactsToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    gap: 10,
  },
  allDoneButton: {
    borderWidth: 1,
    borderColor: COLOR_PRIMARY,
    backgroundColor: tc.primaryMutedBg,
    borderRadius: LIST_RADIUS,
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  allDoneIcon: {
    marginRight: theme.spacing.xs,
  },
  allDoneText: {
    ...theme.typography.buttonLabel,
    fontSize: 16,
    lineHeight: 21,
    color: COLOR_PRIMARY,
  },
  tooltipContentFull: {
    height: "100%",
  },
});

export function bizContactRowShell(borderColor) {
  return {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIST_CARD_BG,
    borderRadius: LIST_RADIUS,
    borderWidth: 1,
    borderColor,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    ...(LIST_CARD_SHADOW),
  };
}

export function bizContactAvatarWrap(bgTint) {
  return {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: bgTint,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  };
}

export const bizContactNameTextStyle = {
  fontSize: 18,
  fontFamily: theme.font.dinBold,
  color: theme.colors.textPrimary,
  lineHeight: lineHeightFor(18),
  ...androidTextFix,
};

export const bizContactMetaTextStyle = {
  marginTop: theme.spacing.xxs,
  fontSize: 14,
  fontFamily: theme.font.dinLight,
  color: LIST_MUTED,
};

export const bizContactRowBody = {
  flex: 1,
  minWidth: 0,
  justifyContent: "center",
};

/** Find Contacts list (`bizContact/index.js`) — iOS legacy px; Android compact. */
export const bizContactIndexStyles = StyleSheet.create({
  curvedInner: {
    flex: 1,
    backgroundColor: congChrome.surface,
  },
  listShell: {
    backgroundColor: theme.colors.white,
    flex: 1,
    marginTop: isAndroid ? av(4) : 4,
    marginHorizontal: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    paddingHorizontal: ah(16),
    overflow: "visible",
  },
  headerWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: congChrome.border,
    justifyContent: "center",
    alignItems: "stretch",
    marginHorizontal: 0,
    paddingBottom: isAndroid ? av(8) : 16,
  },
  headerCompanyTitle: {
    marginTop: isAndroid ? av(2) : 4,
    fontSize: 22,
    fontWeight: "bold",
    color: congC.textPrimary,
    paddingHorizontal: isAndroid ? ah(4) : 4,
    paddingVertical: isAndroid ? 0 : 2,
    textAlign: "center",
    fontFamily: theme.font.dinBold,
    lineHeight: isAndroid ? lhIos(22) : lineHeightFor(22),
    ...(isAndroid ? androidTextFix : {}),
  },
  headerCompanyAddress: {
    textAlign: "center",
    fontSize: 13,
    color: congChrome.muted,
    fontFamily: theme.font.dinLight,
    marginTop: isAndroid ? av(2) : 4,
    marginBottom: isAndroid ? av(4) : 12,
    paddingHorizontal: isAndroid ? ah(8) : 8,
    lineHeight: isAndroid ? lhCompact(13) : 20,
    ...(isAndroid ? androidTextFix : {}),
  },
  headerAddressSpacer: {
    height: isAndroid ? 4 : 8,
  },
  emptyInner: {
    flex: 1,
    paddingHorizontal: ah(24),
    paddingVertical: av(32),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: av(12),
  },
  emptyTitle: {
    textAlign: "center",
    fontSize: 18,
    color: congChrome.muted,
    fontFamily: theme.font.dinBold,
    ...(isAndroid ? { lineHeight: lhCompact(18), ...androidTextFix } : {}),
  },
  emptySubtitle: {
    textAlign: "center",
    fontSize: 15,
    color: congChrome.subtle,
    fontFamily: theme.font.dinLight,
    marginTop: isAndroid ? av(6) : 8,
    lineHeight: isAndroid ? lhCompact(15) : 22,
    ...(isAndroid ? androidTextFix : {}),
  },
  filterInputsRow: {
    justifyContent: "center",
    alignItems: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: av(2),
    gap: av(6),
    zIndex: 20,
    ...Platform.select({
      android: { elevation: 20 },
      ios: {},
    }),
  },
  filterInput: {
    paddingHorizontal: isAndroid ? ah(8) : 10,
    paddingVertical: isAndroid ? av(6) : 10,
    borderWidth: 1,
    borderColor: congChrome.border,
    borderRadius: congChrome.radius,
    color: congC.textPrimary,
    fontFamily: theme.font.dinLight,
    fontSize: 16,
    textAlignVertical: "center",
    backgroundColor: theme.colors.white,
    height: isAndroid ? 36 : 42,
    ...(isAndroid ? { lineHeight: lhCompact(16), ...androidTextFix } : {}),
  },
  filterInputName: {
    width: "29%",
    minWidth: isAndroid ? 84 : 96,
    flexGrow: 1,
  },
  filterInputPosition: {
    width: "29%",
    minWidth: isAndroid ? 84 : 96,
    flexGrow: 1,
  },
  filterInputCity: {
    width: "39%",
    minWidth: isAndroid ? 102 : 120,
    flexGrow: 1.2,
  },
  filterActionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    marginTop: av(6),
    gap: av(6),
    zIndex: 0,
  },
  allDoneBtn: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: congChrome.radius,
    paddingVertical: av(10),
    paddingHorizontal: ah(14),
    minWidth: 0,
  },
  allDoneBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  allDoneBtnIcon: {
    marginRight: ah(4),
  },
  statsCountBelow: {
    marginTop: isAndroid ? av(4) : 8,
    marginBottom: isAndroid ? av(10) : 2,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: isAndroid ? ah(6) : 8,
  },
  statsCountRowText: {
    flexShrink: 1,
    fontSize: isAndroid ? 15 : 17,
    lineHeight: isAndroid ? lhCompact(15) : lhIos(17),
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
    textAlign: "left",
    ...(isAndroid ? androidTextFix : {}),
  },
  statsCountSpacer: {
    flexShrink: 1,
  },
  refreshContactsBtn: {
    flexShrink: 0,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: congChrome.radius,
    paddingVertical: isAndroid ? av(4) : 6,
    paddingHorizontal: isAndroid ? ah(8) : 10,
  },
  refreshContactsBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshContactsBtnIcon: {
    marginRight: ah(6),
  },
  listWrap: {
    marginBottom: isAndroid ? av(4) : 8,
    marginTop: isAndroid ? av(6) : 4,
  },
  listContent: { paddingBottom: isAndroid ? av(4) : 8 },
  contactCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: congChrome.radius,
    marginVertical: isAndroid ? 2 : 4,
    paddingVertical: isAndroid ? av(8) : 10,
    paddingHorizontal: isAndroid ? ah(8) : 10,
    marginHorizontal: 0,
    backgroundColor: theme.colors.white,
    ...congChrome.cardShadow,
  },
  contactRowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactTextCol: {
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  contactName: {
    textAlign: "left",
    fontSize: 19,
    fontFamily: theme.font.dinBold,
    color: congC.textPrimary,
    marginBottom: isAndroid ? av(2) : 4,
    lineHeight: isAndroid ? lhIos(19) : lineHeightFor(19),
    ...(isAndroid ? androidTextFix : {}),
  },
  contactPosition: {
    textAlign: "left",
    fontFamily: theme.font.dinLight,
    marginBottom: isAndroid ? av(1) : 2,
    fontSize: 14,
    color: congChrome.muted,
    lineHeight: isAndroid ? lhCompact(14) : undefined,
    ...(isAndroid ? androidTextFix : {}),
  },
  contactLocation: {
    textAlign: "left",
    fontFamily: theme.font.dinLight,
    fontSize: 14,
    color: congChrome.subtle,
    lineHeight: isAndroid ? lhCompact(14) : undefined,
    ...(isAndroid ? androidTextFix : {}),
  },
  contactTrailingWrapCentered: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: isAndroid ? ah(6) : 8,
    gap: isAndroid ? av(6) : 10,
  },
  contactIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIconSpacing: { marginHorizontal: ah(3) },
  purchesCol: {
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    minWidth: isAndroid ? 72 : 80,
  },
  rowAddBtn: {
    borderWidth: 1,
    borderRadius: congChrome.radius,
    paddingVertical: isAndroid ? av(4) : 6,
    paddingHorizontal: isAndroid ? ah(8) : 10,
  },
  rowAddBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowAddBtnIcon: {
    marginRight: ah(6),
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#22C55E",
    borderRadius: congChrome.radius,
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    paddingVertical: isAndroid ? av(4) : 6,
    paddingHorizontal: isAndroid ? ah(8) : 10,
    minHeight: BIZ_CONTACT_ROW_ACTION_MIN_H,
    minWidth: isAndroid ? 88 : 100,
  },
  savedBadgeIcon: {
    marginRight: ah(6),
  },
  expandedTopRule: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: congC.contactCardBorderIdle,
    marginTop: av(10),
    paddingTop: av(10),
  },
  contactDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: av(8),
  },
  contactDetailIconWrap: {
    width: ah(28),
    alignItems: "center",
    marginRight: ah(8),
    paddingTop: av(1),
  },
  contactDetailText: {
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: congC.textPrimary,
    flex: 1,
    lineHeight: isAndroid ? lhCompact(14) : 20,
    ...(isAndroid ? androidTextFix : {}),
  },
});
