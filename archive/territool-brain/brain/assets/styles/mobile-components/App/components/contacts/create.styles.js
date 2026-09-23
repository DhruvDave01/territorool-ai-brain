/**
 * Add Contact form — iOS legacy px unchanged; Android ~15% tighter spacing.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, lineHeightFor, multilineTextFix } from "../../styles/platformText";
import { scaledSize } from "../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const contactCreateVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const contactCreateHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = contactCreateVertical;
const ah = contactCreateHorizontal;
const lhCompact = (fontSize) => Math.round(fontSize * 1.12);

export const CONTACT_CREATE_INPUT_MIN_H = isAndroid ? 44 : 52;
export const CONTACT_CREATE_STATUS_MIN_H = isAndroid ? 48 : 56;
export const CONTACT_CREATE_BTN_MIN_H = isAndroid ? 46 : 52;
export const CONTACT_CREATE_BTN_FONT = isAndroid ? 17 : 18;
export const CONTACT_CREATE_STATUS_ICON = isAndroid ? 20 : 22;
export const CONTACT_CREATE_DROPDOWN_ROW_H = isAndroid ? 42 : 48;

export const CONTACT_FORM_UI = {
  surface: "#F1F5F9",
  card: "#FFFFFF",
  slate: "#111827",
  muted: "#64748b",
  placeholder: "#94A3B8",
  border: "#E2E4E9",
  listBg: "#FFFFFF",
};

const screenStyles = StyleSheet.create({
  scrollArea: {
    flex: 1,
    flexDirection: "column",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: theme.colors.surfaceSheet,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: isAndroid ? av(12) : 16,
  },
  formSheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -1,
    flexGrow: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderFaint,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: { elevation: 2 },
    }),
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isAndroid ? av(12) : 16,
    paddingHorizontal: ah(16),
    minHeight: CONTACT_CREATE_STATUS_MIN_H,
    position: "relative",
  },
  statusTitleWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: isAndroid ? ah(40) : 44,
  },
  statusTitle: {
    fontWeight: "700",
    fontFamily: theme.font.dinBold,
    textAlign: "center",
    fontSize: 21,
    ...(isAndroid
      ? { fontSize: 19, lineHeight: lhCompact(19), ...androidTextFix }
      : androidTextFix),
  },
  statusTitleUnclassified: {
    color: "#1F2937",
    fontSize: 19,
    lineHeight: isAndroid ? lhCompact(19) : lineHeightFor(19),
    ...androidTextFix,
  },
  statusEdit: {
    position: "absolute",
    right: isAndroid ? ah(8) : 10,
    top: 0,
    bottom: 0,
    width: isAndroid ? ah(40) : 44,
    justifyContent: "center",
    alignItems: "center",
  },
  statusPicker: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.borderStrong,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: ah(20),
    marginTop: av(4),
  },
  statusPickerList: {
    borderColor: theme.colors.borderStrong,
    borderRadius: 12,
    marginHorizontal: ah(20),
  },
  statusPickerRow: {
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isAndroid ? av(10) : 14,
    paddingHorizontal: ah(14),
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle,
  },
  statusPickerRowLabel: {
    fontSize: isAndroid ? 15 : 16,
    fontFamily: theme.font.dinLight,
    color: theme.colors.textPrimary,
    flex: 1,
    ...(isAndroid ? { lineHeight: lhCompact(15), ...androidTextFix } : {}),
  },
  statusPickerSwatch: {
    width: isAndroid ? ah(20) : 22,
    height: isAndroid ? ah(20) : 22,
    borderRadius: 6,
    marginLeft: ah(12),
  },
  formPadding: {
    paddingHorizontal: ah(20),
    paddingTop: isAndroid ? av(18) : 22,
    paddingBottom: isAndroid ? av(22) : 28,
  },
  fieldGroup: {
    marginBottom: isAndroid ? av(16) : 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: theme.font.dinLight,
    fontWeight: "600",
    marginBottom: isAndroid ? av(6) : 8,
    color: theme.colors.textSecondary,
    letterSpacing: 0.35,
    textTransform: "uppercase",
    alignSelf: "stretch",
    ...(isAndroid ? { lineHeight: lhCompact(13), ...androidTextFix } : {}),
  },
  inputRow: {
    flexDirection: "row",
    minHeight: CONTACT_CREATE_INPUT_MIN_H,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: theme.colors.white,
    paddingHorizontal: ah(14),
  },
  inputShellMultiline: {
    minHeight: isAndroid ? s(88) : 100,
    paddingVertical: av(12),
    alignItems: "stretch",
  },
  fieldInput: {
    fontSize: isAndroid ? 16 : 17,
    fontFamily: theme.font.dinLight,
    paddingVertical: isAndroid ? av(10) : 14,
    paddingRight: ah(4),
    flex: 1,
    minWidth: 0,
    color: theme.colors.textPrimary,
    ...(isAndroid
      ? { lineHeight: lhCompact(16), ...androidTextFix }
      : androidTextFix),
  },
  fieldInputMultiline: {
    minHeight: isAndroid ? s(76) : 88,
    ...multilineTextFix,
  },
  companyAutocompleteWrapper: {
    overflow: "visible",
    zIndex: 50,
  },
  companyAutocompleteInputContainer: {
    alignSelf: "stretch",
    borderWidth: 0,
    backgroundColor: "transparent",
    minHeight: CONTACT_CREATE_INPUT_MIN_H,
    margin: 0,
    padding: 0,
  },
  autocompleteList: {
    maxHeight: isAndroid ? s(140) : 160,
    backgroundColor: CONTACT_FORM_UI.listBg,
    position: "absolute",
    borderColor: CONTACT_FORM_UI.border,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: av(4),
    width: "100%",
    zIndex: 60,
    elevation: 8,
  },
  autocompleteListContainer: {
    backgroundColor: "transparent",
    left: 0,
    position: "absolute",
    right: 0,
    top: CONTACT_CREATE_INPUT_MIN_H,
    maxHeight: isAndroid ? s(180) : 200,
    zIndex: 60,
  },
  autocompleteRow: {
    paddingVertical: isAndroid ? av(10) : 12,
    paddingHorizontal: ah(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CONTACT_FORM_UI.border,
  },
  autocompleteRowText: {
    fontSize: isAndroid ? 16 : 17,
    fontFamily: theme.font.dinBold,
    color: CONTACT_FORM_UI.slate,
    ...(isAndroid ? { lineHeight: lhCompact(16), ...androidTextFix } : {}),
  },
  autocompleteRowText01: {
    fontSize: isAndroid ? 12 : 13,
    fontFamily: theme.font.dinLight,
    color: CONTACT_FORM_UI.slate,
    ...(isAndroid ? { lineHeight: lhCompact(12), ...androidTextFix } : {}),
  },
  lifeStageButton: {
    height: CONTACT_CREATE_INPUT_MIN_H,
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: ah(14),
  },
  lifeStageButtonText: {
    textAlign: "left",
    fontFamily: theme.font.dinLight,
    flex: 1,
    marginRight: ah(8),
    fontSize: isAndroid ? 16 : 17,
    ...(isAndroid ? { lineHeight: lhCompact(16), ...androidTextFix } : {}),
  },
  lifeStageRow: {
    height: CONTACT_CREATE_DROPDOWN_ROW_H,
    paddingHorizontal: ah(14),
  },
  lifeStageRowText: {
    textAlign: "left",
    fontSize: isAndroid ? 15 : 16,
    fontFamily: theme.font.dinLight,
    ...(isAndroid ? { lineHeight: lhCompact(15), ...androidTextFix } : {}),
  },
  footer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    paddingTop: isAndroid ? av(18) : 24,
    paddingBottom: isAndroid ? av(28) : 36,
    marginTop: av(4),
    alignSelf: "stretch",
    width: "100%",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.borderSubtle,
  },
});

export default screenStyles;
