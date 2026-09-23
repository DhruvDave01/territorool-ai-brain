/**
 * Screen layout & typography for Cong Contact (`index.js`).
 * Theme tokens stay in `congContact.styles.js` (congC, congChrome).
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { congC, congChrome } from "./congContact.styles";

export const congScreenStyles = StyleSheet.create({
  curvedInner: {
    flex: 1,
    backgroundColor: congChrome.surface,
  },
  listShell: {
    backgroundColor: theme.colors.white,
    flex: 1,
    marginTop: 4,
    marginHorizontal: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    paddingHorizontal: 16,
    overflow: "visible",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    gap: 8,
  },
  statsColPrimary: {
    
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  statsLabel: {
    fontSize: 13,
    color: congChrome.muted,
    fontFamily: theme.font.dinLight,
  },
  /** Outer row for count + “ found”; children set sizes. */
  statsValue: {
    color: theme.colors.primary,
    fontFamily: theme.font.dinBold,
    marginTop: 1,
  },
  statsValueCount: {
    fontSize: 23,
    lineHeight: lineHeightFor(23),
    ...androidTextFix,
  },
  /** Two points smaller than `statsValueCount`. */
  statsValueFound: {
    fontSize: 20,
    lineHeight: lineHeightFor(20),
    ...androidTextFix,
  },
  statsColActions: {
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  filterInputsRow: {
    justifyContent: "center",
    alignItems: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
    gap: 6,
    zIndex: 20,
    ...Platform.select({
      android: { elevation: 20 },
      ios: {},
    }),
  },
  filterInput: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: congChrome.border,
    borderRadius: congChrome.radius,
    color: congC.textPrimary,
    fontFamily: theme.font.dinLight,
    fontSize: 16,
    textAlignVertical: "center",
    backgroundColor: theme.colors.white,
    height: 42,
  },
  filterInputName: {
    width: "29%",
    minWidth: 96,
    flexGrow: 1,
  },
  filterInputPosition: {
    width: "29%",
    minWidth: 96,
    flexGrow: 1,
  },
  filterInputCity: {
    width: "39%",
    minWidth: 120,
    flexGrow: 1.2,
  },
  filterActionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    marginTop: 6,
    gap: 6,
    zIndex: 0,
  },
  /** Contacts line under Search / Reset / All Done (single row, one type style). */
  statsCountBelow: {
    marginTop: 8,
    marginBottom: 2,
    width: "100%",
    alignItems: "center",
  },
  statsCountRowText: {
    fontSize: Platform.OS === "ios" ? 17 : 15,
    lineHeight: Platform.OS === "ios" ? 22 : 20,
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
    textAlign: "center",
    maxWidth: "100%",
  },
  listWrap: { marginBottom: 8, marginTop: 4 },
  listContent: { paddingBottom: 8 },
  listSpinnerWrap: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  contactCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: congChrome.radius,
    marginVertical: 4,
    padding: 10,
    marginHorizontal: 0,
    backgroundColor: theme.colors.white,
    ...congChrome.cardShadow,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  /** Vertically centered row (secondary DB contact cards). */
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
    marginBottom: 4,
    lineHeight: lineHeightFor(19),
    ...androidTextFix,
  },
  contactPosition: {
    textAlign: "left",
    fontFamily: theme.font.dinLight,
    marginBottom: 2,
    fontSize: 14,
    color: congChrome.muted,
  },
  contactLocation: {
    textAlign: "left",
    fontFamily: theme.font.dinLight,
    fontSize: 14,
    color: congChrome.subtle,
  },
  contactTrailingWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: 8,
    paddingTop: 2,
  },
  contactTrailingWrapCentered: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: 8,
    gap: 10,
  },
  contactIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIconSpacing: { marginHorizontal: 3 },
  purchesCol: {
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    minWidth: 80,
  },
  /** Icon-only action column (download / open) on secondary DB contacts. */
  purchesColCompact: {
    width: 40,
    minWidth: 40,
    marginLeft: 2,
  },
  expandedTopRule: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: congC.contactCardBorderIdle,
    marginTop: 10,
    paddingTop: 10,
  },
  contactDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  contactDetailIconWrap: {
    width: 28,
    alignItems: "center",
    marginRight: 8,
    paddingTop: 1,
  },
  contactDetailText: {
    fontSize: 14,
    fontFamily: theme.font.dinLight,
    color: congC.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  footerOuter: {
    marginBottom: 0,
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  footerSecondaryBtn: {
    maxWidth: 440,
    alignSelf: "center",
    borderRadius: congChrome.radius,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footerBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerBtnIcon: { marginRight: 8 },
  footerBtnTitle: {
    color: theme.colors.white,
    flexShrink: 1,
    textAlign: "center",
  },
});
