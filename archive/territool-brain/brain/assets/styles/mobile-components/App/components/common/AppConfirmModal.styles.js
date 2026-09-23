/**
 * Centered confirmation / action modal (used by `AppConfirmModal`).
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../styles/platformText";

const _themeColors = theme.colors;

const DASH = {
  pageBg: "#F6F7FB",
  card: "#FFFFFF",
  border: "#E5E7EB",
  muted: "#64748B",
};

const appConfirmModalStyles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    backgroundColor: DASH.card,
    paddingVertical: 22,
    paddingHorizontal: 20,
    position: "relative",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DASH.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: { elevation: 8 },
    }),
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontFamily: theme.font.dinBold,
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: lineHeightFor(22),
    ...androidTextFix,
  },
  /** Title + close share one row; title stays visually centered (spacer mirrors close width). */
  titleHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
    minHeight: 44,
  },
  titleHeaderSpacer: {
    width: 44,
    height: 44,
  },
  titleInRow: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  titleHeaderClose: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    fontSize: 15,
    fontFamily: theme.font.dinLight,
    color: DASH.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  /** Wrapper when `message` is a React node (string messages use `body` directly). */
  customMessageContainer: {
    marginBottom: 22,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnSecondary: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: _themeColors.primary,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondaryDisabled: {
    opacity: 0.45,
  },
  btnSecondaryText: {
    ...theme.typography.buttonLabel,
    fontSize: 16,
    lineHeight: 21,
    color: _themeColors.primary,
  },
  btnPrimary: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: _themeColors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryBrand: {
    backgroundColor: theme.colors.primary,
  },
  btnPrimaryFull: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
  },
  actionsColumn: {
    flexDirection: "column",
    width: "100%",
    alignSelf: "stretch",
  },
  btnStacked: {
    flex: 0,
    alignSelf: "stretch",
    width: "100%",
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10,
  },
  btnStackedLast: {
    marginBottom: 0,
  },
  btnPrimaryText: {
    ...theme.typography.buttonLabel,
    fontSize: 16,
    lineHeight: 21,
    color: theme.colors.white,
  },
});

export default appConfirmModalStyles;
