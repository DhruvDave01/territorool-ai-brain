import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;
const lh = (size) => lineHeightFor(size, 1.2);
const t = theme.colors;

const reviewStyles = StyleSheet.create({
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
  listCard: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "rgba(18, 74, 198, 0.35)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  groupHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 6,
  },
  groupHeadFirst: {
    marginTop: 8,
  },
  groupTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinBold,
    color: t.primary,
    ...(isAndroid ? { lineHeight: lh(14), ...androidTextFix } : {}),
  },
  addMore: {
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinBold,
    color: t.primary,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: t.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowBody: {
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
  role: {
    marginTop: 1,
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
  },
  rowRight: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  kind: {
    fontSize: isAndroid ? s(12) : 12,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
  },
  price: {
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinBold,
    color: t.primary,
    marginTop: 2,
  },
  unlockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: t.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  totals: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: t.border,
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  totalGrand: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: t.border,
  },
  totalLabel: {
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
  },
  totalValue: {
    fontSize: isAndroid ? s(14) : 14,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
  },
  totalStrong: {
    fontFamily: theme.font.dinBold,
    color: t.textPrimary,
    fontSize: isAndroid ? s(16) : 16,
  },
  disclaimer: {
    marginTop: 8,
    fontSize: isAndroid ? s(12) : 12,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    textAlign: "center",
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : { lineHeight: 16 }),
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
  backBtn: {
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
  backLabel: {
    color: t.primary,
    fontFamily: theme.font.dinBold,
    fontSize: isAndroid ? s(15) : 15,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(15), ...androidTextFix } : {}),
  },
  confirmBtn: {
    flex: 1.6,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: t.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: t.surfaceMuted,
  },
  confirmLabel: {
    color: t.white,
    fontFamily: theme.font.dinBold,
    fontSize: isAndroid ? s(14) : 14,
    marginTop: 4,
    ...(isAndroid ? { lineHeight: lh(14), ...androidTextFix } : {}),
  },
  confirmLabelDisabled: {
    color: t.textSecondary,
    marginTop: 4,
  },
});

export default reviewStyles;
