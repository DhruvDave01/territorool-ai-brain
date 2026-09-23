/**
 * Screen-level StyleSheets for AI Find Leads (`aiFindLeads.js`).
 * Shared tokens / list cards remain in `aiFindLeads.styles.js`.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { scaledSize } from "../../utils/commonFunctions";
import { findLeadsLineHeight, findLeadsVertical } from "./aiFindLeads.styles";

const s = scaledSize;
const sv = findLeadsVertical;
const lh = findLeadsLineHeight;

export const aiSearchLoaderStyles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: sv(10),
    paddingVertical: sv(16),
    paddingHorizontal: s(16),
    backgroundColor: theme.colors.white,
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: sv(16),
  },
  titleBlock: { flex: 1, minWidth: 0 },
  territoryLine: {
    marginTop: sv(6),
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    fontSize: s(14),
    lineHeight: lh(14),
  },
  progressTrack: {
    height: s(10),
    width: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: s(5),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: s(5),
  },
  pctRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: sv(8),
    marginBottom: sv(14),
  },
  pctText: {
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    fontSize: s(14),
    lineHeight: lh(14),
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: sv(16),
  },
  dotsInner: { flexDirection: "row", marginRight: s(8) },
  dot: {
    width: s(9),
    height: s(9),
    borderRadius: s(4),
    marginRight: s(5),
    backgroundColor: theme.colors.primary,
  },
  dotLast: { marginRight: 0 },
  progressDetailText: {
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
    fontSize: s(18),
    lineHeight: lh(18),
    textAlign: "center",
    paddingHorizontal: s(8),
  },
  divider: {
    height: Platform.OS === "android" ? 1 : StyleSheet.hairlineWidth,
    minHeight: 1,
    alignSelf: "stretch",
    backgroundColor: "#E5E7EB",
    marginBottom: sv(12),
  },
  sourcesCaption: {
    fontFamily: theme.font.dinLight,
    color: "#9CA3AF",
    fontSize: s(12),
    lineHeight: lh(12),
    marginBottom: sv(10),
    textAlign: "center",
  },
  sourcesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: s(2),
  },
  sourceCol: {
    flex: 1,
    maxWidth: s(56),
    alignItems: "center",
  },
  sourceLogoWrap: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "visible",
  },
  sourceThumb: { width: s(26), height: s(26) },
  sourceCheckBadge: {
    position: "absolute",
    right: s(-4),
    bottom: s(-3),
    width: s(18),
    height: s(18),
    borderRadius: s(9),
    backgroundColor: "#DCFCE7",
    borderWidth: 2,
    borderColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  mapLeadsRow: {
    marginTop: sv(6),
    marginBottom: sv(6),
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: sv(10),
    paddingHorizontal: s(12),
    backgroundColor: "#F3F4F6",
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: s(8),
  },
  mapLeadsTextCol: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    justifyContent: "center",
  },
});

export function aiSearchLoaderIconCircleStyle(completionHold, isConnectingPhase) {
  return {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: completionHold
      ? "#DCFCE7"
      : isConnectingPhase
        ? "#F0F9FF"
        : "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(12),
  };
}

export function aiSearchLoaderTitleTextStyle(completionHold, isConnectingPhase) {
  const baseSize = isConnectingPhase ? 16 : 17;
  return {
    fontFamily:
      completionHold || !isConnectingPhase
        ? theme.font.dinBold
        : theme.font.dinLight,
    color: isConnectingPhase ? "#6B7280" : "#111827",
    fontSize: s(baseSize),
    lineHeight: lh(baseSize),
  };
}
