import { Dimensions, Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;
const lh = (size) => lineHeightFor(size, 1.2);
const t = theme.colors;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export const PROGRESS_SHEET_FOOTER_OFFSET = s(70);
export const PROGRESS_SHEET_MAX_HEIGHT = Math.round(SCREEN_H * 0.46);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 30,
  },
  stack: {
    width: SCREEN_W,
  },
  card: {
    width: SCREEN_W,
    backgroundColor: t.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(17, 24, 39, 0.08)",
    paddingBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: t.black,
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
      },
      android: { elevation: 16 },
    }),
  },
  handleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
    paddingHorizontal: 4,
    paddingBottom: 0,
  },
  handleCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  handleHit: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  title: {
    fontSize: isAndroid ? s(15) : 15,
    fontFamily: theme.font.dinBold,
    color: t.textPrimary,
    ...(isAndroid ? { lineHeight: lh(15), ...androidTextFix } : { lineHeight: 20 }),
  },
  sub: {
    marginTop: 2,
    fontSize: isAndroid ? s(12) : 12,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : { lineHeight: 16 }),
  },
  progressTrack: {
    marginTop: 10,
    marginHorizontal: 16,
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
  list: {
    maxHeight: PROGRESS_SHEET_MAX_HEIGHT - 120,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.border,
  },
  leading: {
    width: 28,
    alignItems: "center",
    marginRight: 10,
  },
  body: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  name: {
    fontSize: isAndroid ? s(15) : 15,
    fontFamily: theme.font.dinBold,
    color: t.textPrimary,
    ...(isAndroid ? { lineHeight: lh(15), ...androidTextFix } : { lineHeight: 20 }),
  },
  nameEmpty: {
    color: t.textSecondary,
  },
  meta: {
    marginTop: 2,
    fontSize: isAndroid ? s(12) : 12,
    fontFamily: theme.font.dinLight,
    color: t.textSecondary,
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : { lineHeight: 16 }),
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
  },
  refund: {
    fontSize: isAndroid ? s(12) : 12,
    fontFamily: theme.font.dinBold,
    color: t.ttGreen,
    ...(isAndroid ? { lineHeight: lh(12), ...androidTextFix } : {}),
  },
  icon: {
    marginLeft: 6,
  },
});

export default styles;
