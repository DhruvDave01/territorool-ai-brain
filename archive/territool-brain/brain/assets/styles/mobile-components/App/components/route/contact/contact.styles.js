import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;
const lh = (size) => lineHeightFor(size, 1.2);
const t = theme.colors;

const contactStyles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  guide: {
    textAlign: "center",
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    ...(isAndroid ? { lineHeight: lh(13), ...androidTextFix } : { lineHeight: 18 }),
  },
  banner: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: t.primaryMutedBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  bannerDone: {
    marginTop: 12,
    marginBottom: 12,
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerDoneCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: 8,
    marginTop: 4,
    ...(isAndroid
      ? { lineHeight: lh(14), ...androidTextFix }
      : { lineHeight: 18 }),
  },
  showSelectedBtn: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  showSelectedLabel: {
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinBold,
    color: t.primary,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(13), ...androidTextFix } : {}),
  },
  bannerLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  bannerCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  bannerTitle: {
    flex: 1,
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinBold,
    color: t.textPrimary,
    ...(isAndroid ? { lineHeight: lh(14), ...androidTextFix } : {}),
  },
  bannerSub: {
    marginTop: 2,
    fontSize: isAndroid ? s(12) : 12,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : {}),
  },
  progressTrack: {
    marginTop: 10,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(18, 74, 198, 0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: t.primary,
  },
  card: {
    backgroundColor: t.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  cardSelected: {
    backgroundColor: t.primaryMutedBg,
    borderColor: t.primary,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: t.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: theme.font.dinBold,
    color: t.textSecondary,
    marginTop: 4,
    textAlign: "center",
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : { lineHeight: 15 }),
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  companyName: {
    fontSize: isAndroid ? s(16) : 16,
    fontFamily: theme.font.dinBold,
    color: t.textPrimary,
    ...(isAndroid
      ? { lineHeight: lh(16), ...androidTextFix }
      : { lineHeight: 22 }),
  },
  place: {
    marginTop: 1,
    fontSize: isAndroid ? s(12) : 12,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : {}),
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusSpinner: {
    marginRight: 6,
    transform: [{ scale: 0.8 }],
  },
  statusText: {
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    ...(isAndroid ? { lineHeight: lh(13), ...androidTextFix } : {}),
  },
  statusAdded: {
    fontFamily: theme.font.dinBold,
    color: t.ttGreen,
  },
  statusNone: {
    color: t.textSecondary,
  },
  pillBtn: {
    minHeight: 36,
    minWidth: 72,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: t.primary,
    backgroundColor: t.white,
    paddingHorizontal: 16,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  pillBtnLabel: {
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinBold,
    color: t.primary,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(14), ...androidTextFix } : {}),
  },
  pillBtnFilled: {
    minHeight: 36,
    minWidth: 88,
    borderRadius: 12,
    backgroundColor: t.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  pillBtnFilledLabel: {
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinBold,
    color: t.white,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(13), ...androidTextFix } : {}),
  },
  statusSecondary: {
    color: t.textSecondary,
  },
  loadMoreWrap: {
    paddingVertical: 16,
  },
  footerBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: t.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.border,
  },
  basketMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  basketLeft: {
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinBold,
    color: t.textPrimary,
    ...(isAndroid ? { lineHeight: lh(14), ...androidTextFix } : {}),
  },
  basketRight: {
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
  },
  reviewBtnDisabled: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: t.surfaceMuted,
    borderWidth: 1.5,
    borderColor: t.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewBtnLabelDisabled: {
    color: t.textSecondary,
    fontFamily: theme.font.dinBold,
    fontSize: isAndroid ? s(16) : 16,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(16), ...androidTextFix } : {}),
  },
  reviewBtn: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: t.primary,
    borderWidth: 1.5,
    borderColor: t.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewBtnLabel: {
    color: t.white,
    fontFamily: theme.font.dinBold,
    fontSize: isAndroid ? s(16) : 16,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(16), ...androidTextFix } : {}),
  },
  emptyWrap: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    textAlign: "center",
    ...(isAndroid ? { lineHeight: lh(14), ...androidTextFix } : {}),
  },
});

export default contactStyles;
