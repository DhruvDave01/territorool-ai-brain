import { Dimensions, Platform, StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";
import {
  scaledSize,
} from "../../../../utils/commonFunctions";

const { width: SCREEN_W } = Dimensions.get("window");

const s = scaledSize;

/** Matches `styles.dashboard_footer_container.height` — keeps sheets above tab bar. */
export const COACHING_SHEET_FOOTER_OFFSET = s(70);
export const COACHING_EXPANDED_FALLBACK_HEIGHT = s(268);
export const COACHING_BTN_HEIGHT = s(44);
export const COACHING_PEEK_BTN_HEIGHT = s(44);
export const COACHING_PEEK_HEIGHT = s(120);
export const QUALIFIER_SHEET_FOOTER_OFFSET = s(70);
export const QUALIFIER_SHEET_FALLBACK_HEIGHT = s(380);

const firstRouteCoachingStyles = StyleSheet.create({
  sheetModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheetStack: {
    width: SCREEN_W,
    zIndex: 20,
  },
  qualifierModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheetCardOuter: {
    width: SCREEN_W,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(17, 24, 39, 0.08)",
    marginTop: s(2),
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: s(-6) },
        shadowOpacity: 0.18,
        shadowRadius: s(20),
      },
      android: {
        elevation: 16,
      },
    }),
  },
  sheetCardInner: {
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
    overflow: "hidden",
    backgroundColor: theme.colors.white,
  },
  sheetCard: {
    width: SCREEN_W,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: s(-4) },
        shadowOpacity: 0.12,
        shadowRadius: s(16),
      },
      android: { elevation: 12 },
    }),
  },
  sheetExpanded: {
    paddingBottom: s(14),
  },
  sheetPeek: {
    paddingBottom: s(12),
  },
  qualifierSheet: {
    paddingBottom: s(16),
  },
  handleRow: {
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: s(8),
    // paddingBottom: s(4),
    position: "relative",
  },
  handleRowWithClose: {
    paddingTop: s(6),
    paddingBottom: s(2),
  },
  handleDragZone: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    minHeight: s(28),
    paddingVertical: s(6),
    paddingHorizontal: s(48),
  },
  dragHandle: {
    width: s(40),
    height: s(5),
    borderRadius: s(2),
    backgroundColor: "#D3D1C7",
  },
  sheetCloseBtn: {
    position: "absolute",
    right: s(16),
    top: s(6),
    padding: s(4),
  },
  sheetFooterWrap: {
    backgroundColor: theme.colors.ccSurface,
  },
  expandedContent: {
    paddingHorizontal: s(16),
    // paddingTop: s(2),
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primaryMutedBgStrong,
    borderRadius: s(20),
    paddingVertical: s(4),
    paddingHorizontal: s(8),
    marginBottom: s(10),
  },
  badgeIconWrap: {
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    backgroundColor: "rgba(18, 74, 198, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(8),
  },
  badgeText: {
    fontSize: s(11),
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
  },
  expandedHeadline: {
    fontSize: s(18),
    lineHeight: s(24),
    fontFamily: theme.font.dinBold,
    color: theme.colors.textPrimary,
    marginBottom: s(6),
  },
  expandedBody: {
    fontSize: s(11),
    lineHeight: s(17),
    fontFamily: theme.font.dinLight,
    color: theme.colors.textSecondary,
    marginBottom: s(14),
  },
  coachingBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    maxWidth: "100%",
  },
  coachingBtnIcon: {
    marginRight: s(8),
    flexShrink: 0,
  },
  coachingPrimaryBtnLabel: {
    fontSize: s(14),
    lineHeight: s(19),
  },
  coachingPrimaryBtn: {
    width: "100%",
    minHeight: COACHING_BTN_HEIGHT,
    borderRadius: s(12),
    marginBottom: s(10),
    paddingVertical: s(9),
    paddingHorizontal: s(14),
  },
  coachingOutlineBtn: {
    width: "100%",
    minHeight: COACHING_BTN_HEIGHT,
    borderRadius: s(12),
    borderWidth: s(2),
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    paddingVertical: s(9),
    paddingHorizontal: s(14),
  },
  coachingPeekPrimaryBtn: {
    width: "100%",
    height: COACHING_PEEK_BTN_HEIGHT,
    minHeight: COACHING_PEEK_BTN_HEIGHT,
    maxHeight: COACHING_PEEK_BTN_HEIGHT,
    borderRadius: s(12),
    paddingVertical: 0,
    paddingHorizontal: s(8),
    marginBottom: 0,
  },
  coachingPeekOutlineBtn: {
    width: "100%",
    height: COACHING_PEEK_BTN_HEIGHT,
    minHeight: COACHING_PEEK_BTN_HEIGHT,
    maxHeight: COACHING_PEEK_BTN_HEIGHT,
    borderRadius: s(12),
    borderWidth: s(2),
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    paddingVertical: 0,
    paddingHorizontal: s(8),
  },
  coachingPeekBtnLabel: {
    fontSize: s(12),
    lineHeight: s(16),
    marginTop: scaledSize(2),
    textAlign: "center",
  },
  peekContent: {
    paddingHorizontal: s(16),
    paddingTop: 0,
    paddingBottom: s(2),
  },
  peekPrompt: {
    fontSize: s(13),
    lineHeight: s(18),
    fontFamily: theme.font.dinBold,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: s(8),
  },
  peekActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(10),
  },
  peekActionPrimary: {
    flex: 0.58,
    minWidth: 0,
  },
  peekActionOutline: {
    flex: 0.42,
    minWidth: 0,
  },
  qualifierContent: {
    paddingHorizontal: s(20),
    paddingTop: s(4),
  },
  qualifierHeadline: {
    fontSize: s(20),
    lineHeight: s(26),
    fontFamily: theme.font.dinBold,
    color: theme.colors.textPrimary,
    marginBottom: s(4),
  },
  qualifierSubtext: {
    fontSize: s(13),
    lineHeight: s(19),
    fontFamily: theme.font.dinLight,
    color: theme.colors.textSecondary,
    marginBottom: s(14),
  },
  qualifierOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: s(12),
    paddingVertical: s(12),
    paddingHorizontal: s(12),
    marginBottom: s(10),
    backgroundColor: theme.colors.white,
  },
  qualifierOptionLast: {
    marginBottom: 0,
  },
  qualifierOptionDisabled: {
    opacity: 0.72,
    backgroundColor: theme.colors.surfaceMuted,
  },
  qualifierOptionIconDisabled: {
    opacity: 0.65,
  },
  qualifierTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: s(6),
  },
  qualifierComingSoonBadge: {
    backgroundColor: "#F3F4F6",
    borderRadius: s(10),
    paddingVertical: s(2),
    paddingHorizontal: s(8),
  },
  qualifierComingSoonText: {
    fontSize: s(10),
    lineHeight: s(14),
    fontFamily: theme.font.dinBold,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  qualifierOptionTitleDisabled: {
    color: theme.colors.textSecondary,
  },
  qualifierOptionSubtitleDisabled: {
    color: theme.colors.textSecondary,
  },
  qualifierOptionIconWrap: {
    width: s(40),
    height: s(40),
    borderRadius: s(10),
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(12),
  },
  qualifierOptionIconB2b: {
    backgroundColor: theme.colors.primaryMutedBgStrong,
  },
  qualifierOptionIconResidential: {
    backgroundColor: "#FEF3C7",
  },
  qualifierOptionIconMixed: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  qualifierOptionTextCol: {
    flex: 1,
    minWidth: 0,
  },
  qualifierOptionTitle: {
    fontSize: s(14),
    lineHeight: s(19),
    fontFamily: theme.font.dinBold,
    color: theme.colors.textPrimary,
  },
  qualifierOptionSubtitle: {
    fontSize: s(11),
    lineHeight: s(16),
    fontFamily: theme.font.dinLight,
    color: theme.colors.textSecondary,
    marginTop: s(2),
  },
  qualifierChevron: {
    marginLeft: s(8),
  },
});

export default firstRouteCoachingStyles;
