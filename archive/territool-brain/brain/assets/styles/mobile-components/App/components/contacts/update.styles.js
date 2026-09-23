/**
 * Styles for `App/components/contacts/update.js`.
 */
import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, multilineTextFix } from "../../styles/platformText";

export const CONTACT_FORM_UI = {
  surface: "#F1F5F9",
  card: "#FFFFFF",
  slate: "#0f172a",
  muted: "#64748b",
  placeholder: "#94A3B8",
  border: "#E2E8F0",
  listBg: "#F8FAFC",
};

const screenStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: CONTACT_FORM_UI.surface,
  },
  sheet: {
    backgroundColor: CONTACT_FORM_UI.card,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    flexGrow: 1,
    paddingBottom: 40,
    overflow: "hidden",
  },
  statusStrip: {
    minHeight: 52,
    flexDirection: "row",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
  },
  statusStripLeft: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000022",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  statusStripRight: {
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000022",
  },
  statusStripLabel: {
    fontFamily: theme.font.dinBold,
    fontSize: 18,
    color: theme.colors.white,
    textAlign: "center",
  },
  statusStripHint: {
    fontSize: 20,
    color: theme.colors.white,
    fontWeight: "600",
  },
  formPadding: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  formIntro: {
    fontFamily: theme.font.dinLight,
    fontSize: 14,
    color: CONTACT_FORM_UI.muted,
    lineHeight: 20,
    marginBottom: 16,
  },
  fieldBlock: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 15,
    fontFamily: theme.font.dinBold,
    fontWeight: "700",
    color: CONTACT_FORM_UI.slate,
    marginBottom: 8,
  },
  inputShell: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: CONTACT_FORM_UI.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  inputShellMultiline: {
    minHeight: 100,
    paddingVertical: 12,
    alignItems: "stretch",
  },
  fieldInput: {
    fontSize: 17,
    fontFamily: theme.font.dinLight,
    color: CONTACT_FORM_UI.slate,
    paddingVertical: 10,
    margin: 0,
    ...androidTextFix,
  },
  fieldInputMultiline: {
    minHeight: 88,
    ...multilineTextFix,
  },
  companyAutocompleteContainer: {
    borderWidth: 1,
    borderColor: CONTACT_FORM_UI.border,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    overflow: "visible",
    zIndex: 50,
  },
  saveWrap: {
    marginTop: 28,
    marginBottom: 16,
    alignItems: "center",
  },
  saveBtn: {
    minHeight: 52,
    width: "100%",
    maxWidth: 360,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  saveBtnLabel: {
    ...theme.typography.buttonLabel,
    fontSize: 18,
    lineHeight: 23,
    color: theme.colors.white,
  },
  dropdownRow: {
    backgroundColor: CONTACT_FORM_UI.listBg,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CONTACT_FORM_UI.border,
  },
  dropdownRowLabel: {
    fontSize: 16,
    fontFamily: theme.font.dinLight,
    color: CONTACT_FORM_UI.slate,
    flex: 1,
  },
});

export default screenStyles;
