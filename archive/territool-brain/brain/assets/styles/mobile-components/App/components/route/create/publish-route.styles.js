import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix } from "../../../styles/platformText";

const t = theme.colors;

export const publishRouteStyles = StyleSheet.create({
  /** ScrollView content: `flexGrow` (not `flex: 1`) so tall cards scroll and bottom copy stays reachable. */
  screen: {
    flexGrow: 1,
    backgroundColor: t.publishBg,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: t.white,
    borderRadius: 20,
    paddingVertical: 36,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.publishBorderSlate,
    ...Platform.select({
      ios: {
        shadowColor: t.shadowBlack,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: { elevation: 6 },
    }),
  },
  kicker: {
    fontSize: 11,
    fontFamily: theme.font.dinBold,
    letterSpacing: 1.2,
    color: t.publishMuted,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },
  iconRingMuted: {
    backgroundColor: t.primary + "18",
  },
  iconRingSuccess: {
    backgroundColor: t.publishSuccessBg,
  },
  iconRingError: {
    backgroundColor: t.publishErrorBg,
  },
  spinner36: {
    height: 36,
  },
  iconSuccessCheck: {
    fontSize: 40,
    color: t.publishSuccessIcon,
  },
  iconErrorClose: {
    fontSize: 44,
    color: t.publishErrorIcon,
  },
  title: {
    fontSize: 26,
    fontFamily: theme.font.dinBold,
    color: t.publishSlate,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 8,
    ...androidTextFix,
  },
  titleError: {
    color: t.publishErrorIcon,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: theme.font.dinLight,
    color: t.publishMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 4,
    marginTop: 4,
    marginBottom: 4,
  },
  errorActionsCol: {
    width: "100%",
    marginTop: 12,
  },
  errorBanner: {
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: t.publishDangerSurface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: t.publishErrorIcon,
  },
  errorBannerText: {
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: t.publishErrorText,
    lineHeight: 21,
  },
  btnPrimary: {
    width: "100%",
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: t.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 20,
  },
  btnPrimaryDisabled: {
    backgroundColor: t.publishAvatarFallback,
  },
  btnPrimaryLabel: {
    ...theme.typography.buttonLabel,
    fontSize: 18,
    lineHeight: 22,
    color: t.white,
    ...androidTextFix,
  },
  btnPrimaryLabelLarge: {
    fontSize: 19,
  },
  btnBackIcon: {
    fontSize: 20,
    color: t.white,
    marginRight: 8,
  },
  btnOutline: {
    width: "100%",
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: t.publishBorderMuted,
    backgroundColor: t.white,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 12,
  },
  btnOutlineLabel: {
    ...theme.typography.buttonLabel,
    color: t.publishTextSlate,
    ...androidTextFix,
  },
  preparingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  preparingSpinner: {
    marginRight: 10,
  },
  salesFunFactBelowButton: {
    width: "100%",
    marginTop: 14,
    marginBottom: 4,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: t.publishTextSlate,
    textAlign: "center",
    lineHeight: 21,
    fontStyle: "italic",
  },
  loaderBlock: {
    width: "100%",
  },
  actionsBlock: {
    width: "100%",
  },
});
