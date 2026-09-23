import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;
const lh = (size) => lineHeightFor(size, 1.2);
const t = theme.colors;

const peopleStyles = StyleSheet.create({
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  metaLeft: {
    flex: 1,
    minWidth: 0,
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    ...(isAndroid ? { lineHeight: lh(14), ...androidTextFix } : {}),
  },
  metaFound: {
    fontFamily: theme.font.dinBold,
    color: t.ttGreen,
  },
  metaSelected: {
    fontFamily: theme.font.dinBold,
    color: t.primary,
  },
  metaRight: {
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
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
  cardTicked: {
    backgroundColor: t.primaryMutedBg,
    borderColor: t.primary,
  },
  cardAdded: {
    backgroundColor: t.surfaceMuted,
    borderColor: t.border,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  name: {
    fontSize: isAndroid ? s(16) : 16,
    fontFamily: theme.font.dinBold,
    color: t.textPrimary,
    ...(isAndroid ? { lineHeight: lh(16), ...androidTextFix } : { lineHeight: 22 }),
  },
  nameMuted: {
    color: t.textSecondary,
  },
  role: {
    marginTop: 1,
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    ...(isAndroid ? { lineHeight: lh(13), ...androidTextFix } : {}),
  },
  trailing: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  unlockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  unlockIcon: {
    marginLeft: 6,
  },
  price: {
    fontSize: isAndroid ? s(12) : 12,
    fontFamily: theme.font.dinBold,
    color: t.primary,
    marginTop: 2,
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : {}),
  },
  showMore: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  showMoreLabel: {
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinBold,
    color: t.primary,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(14), ...androidTextFix } : {}),
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
  footerBtns: {
    flexDirection: "row",
    alignItems: "center",
  },
  backListBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: t.primary,
    backgroundColor: t.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  backListLabel: {
    color: t.primary,
    fontFamily: theme.font.dinBold,
    fontSize: isAndroid ? s(15) : 15,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(15), ...androidTextFix } : {}),
  },
  reviewBtn: {
    flex: 1.3,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: t.primary,
    borderWidth: 1.5,
    borderColor: t.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewBtnDisabled: {
    backgroundColor: t.surfaceMuted,
    borderColor: t.textSecondary,
  },
  reviewLabel: {
    color: t.white,
    fontFamily: theme.font.dinBold,
    fontSize: isAndroid ? s(15) : 15,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(15), ...androidTextFix } : {}),
  },
  reviewLabelDisabled: {
    color: t.textSecondary,
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
  },
});

export default peopleStyles;
