/**
 * Add Company form — iOS legacy px unchanged; Android ~15% tighter spacing.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor, multilineTextFix } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const c = theme.colors;
const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const createCompanyVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const createCompanyHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = createCompanyVertical;
const ah = createCompanyHorizontal;
const lhCompact = (fontSize) => Math.round(fontSize * 1.12);

export const CREATE_COMPANY_INPUT_MIN_H = isAndroid ? 44 : 52;
export const CREATE_COMPANY_STATUS_MIN_H = isAndroid ? 48 : 56;
export const CREATE_COMPANY_SEARCH_ROW_MIN_H = isAndroid ? 44 : 52;
export const CREATE_COMPANY_ICON = isAndroid ? 20 : 22;
export const CREATE_COMPANY_BTN_MIN_H = isAndroid ? 46 : 52;
export const CREATE_COMPANY_BTN_FONT = isAndroid ? 18 : 20;
export const CREATE_COMPANY_CONTACT_BTN_MIN_H = isAndroid ? 46 : 52;
export const CREATE_COMPANY_CONTACT_BTN_FONT = isAndroid ? 17 : 18;
export const CREATE_COMPANY_HEADER_SCAN = isAndroid ? 36 : 40;
export const CREATE_COMPANY_HEADER_SCAN_HIT = isAndroid ? 36 : 39;
export const CREATE_COMPANY_MODAL_MAX_H = isAndroid ? s(442) : 520;
export const CREATE_COMPANY_SCROLL_HINT_BOTTOM = isAndroid ? av(8) : 10;
export const CREATE_COMPANY_CHEVRON = isAndroid ? 18 : 20;

export const createCompanyPickerPlaceholderStyle = {
  fontSize: isAndroid ? 15 : 16,
  fontFamily: theme.font.dinLight,
  color: "#6B7280",
  ...(isAndroid ? { lineHeight: lhCompact(15), ...androidTextFix } : {}),
};

export const createCompanyPickerTextStyle = {
  fontSize: isAndroid ? 15 : 16,
  fontFamily: theme.font.dinLight,
  color: "#111827",
  ...(isAndroid ? { lineHeight: lhCompact(15), ...androidTextFix } : {}),
};

export const createCompanyStatusPickerRowLabel = {
  fontSize: isAndroid ? 15 : 16,
  fontFamily: theme.font.dinLight,
  color: "#111",
  ...(isAndroid ? { lineHeight: lhCompact(15), ...androidTextFix } : {}),
};

export const createCompanyStatusTitleUnclassified = {
  color: "#1F2937",
  fontSize: 19,
  lineHeight: isAndroid ? lhCompact(19) : lineHeightFor(19),
  ...androidTextFix,
};

export const createCompanyHeaderScanPress = {
  backgroundColor: "transparent",
  borderRadius: 5,
  height: CREATE_COMPANY_HEADER_SCAN_HIT,
  paddingHorizontal: isAndroid ? ah(6) : 8,
  justifyContent: "center",
  alignItems: "flex-end",
};

export const createCompanyHeaderScanImage = {
  width: CREATE_COMPANY_HEADER_SCAN,
  height: CREATE_COMPANY_HEADER_SCAN,
};

export const createCompanyScrollContent = {
  flexGrow: 1,
  paddingBottom: isAndroid ? av(12) : 16,
};

export const createCompanyScrollHintWrap = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: CREATE_COMPANY_SCROLL_HINT_BOTTOM,
  alignItems: "center",
};

export const createCompanyModalContainerPad = {
  paddingBottom: isAndroid ? av(8) : 12,
};

export const createCompanyContactModalAddWrap = {
  paddingTop: isAndroid ? av(16) : 20,
  paddingBottom: isAndroid ? av(6) : 8,
};

export const createCompanyContactFieldInput = {
  flex: 1,
  fontSize: isAndroid ? 16 : 17,
  fontFamily: theme.font.dinLight,
  color: "#111827",
  padding: 0,
  ...(isAndroid ? { lineHeight: lhCompact(16), ...androidTextFix } : androidTextFix),
};

export const createCompanyContactStatusWrap = {
  flexDirection: "row",
  marginTop: isAndroid ? av(3) : 4,
  marginBottom: isAndroid ? av(10) : 12,
  borderRadius: 12,
  overflow: "hidden",
};

export const createCompanyContactNotesWrap = {
  marginTop: isAndroid ? av(3) : 4,
  marginBottom: isAndroid ? av(3) : 4,
};

export const createCompanyContactCityWrap = {
  zIndex: 5000,
  position: "relative",
  marginBottom: isAndroid ? av(3) : 4,
  alignSelf: "stretch",
};

export const createCompanyFooterLoader = {
  paddingVertical: isAndroid ? av(16) : 20,
  borderTopWidth: 1,
  borderColor: "#CED0CE",
};

const ccStyles = StyleSheet.create({
  createCompanyScrollArea: {
    flex: 1,
    flexDirection: "column",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: c.surfaceSheet,
  },
  createCompanySearchRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: CREATE_COMPANY_SEARCH_ROW_MIN_H,
  },
  createCompanyFooter: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    paddingTop: isAndroid ? av(20) : 24,
    paddingBottom: isAndroid ? av(28) : 36,
    marginTop: isAndroid ? av(3) : 4,
    alignSelf: "stretch",
    width: "100%",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.borderSubtle,
  },
  createCompanyFormSheet: {
    backgroundColor: c.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -1,
    flexGrow: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.borderFaint,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: c.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: { elevation: 2 },
    }),
  },
  createCompanyFormPadding: {
    paddingHorizontal: isAndroid ? ah(18) : 20,
    paddingTop: isAndroid ? av(14) : 16,
    paddingBottom: isAndroid ? av(22) : 28,
  },
  createCompanyEntryTabBar: {
    paddingHorizontal: isAndroid ? ah(18) : 20,
    paddingTop: isAndroid ? av(14) : 16,
    paddingBottom: isAndroid ? av(4) : 6,
  },
  createCompanyEntryTabSegment: {
    flexDirection: "row",
    backgroundColor: "#E8EAED",
    borderRadius: 12,
    padding: isAndroid ? av(3) : 4,
  },
  createCompanyEntryTab: {
    flex: 1,
    paddingVertical: isAndroid ? av(10) : 11,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  createCompanyEntryTabActive: {
    backgroundColor: c.primary,
    ...Platform.select({
      ios: {
        shadowColor: c.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      default: { elevation: 2 },
    }),
  },
  createCompanyEntryTabLabel: {
    fontSize: isAndroid ? 15 : 16,
    fontFamily: theme.font.dinBold,
    ...(isAndroid ? { lineHeight: lhCompact(15), ...androidTextFix } : {}),
  },
  createCompanyFieldGroup: {
    marginBottom: isAndroid ? av(16) : 20,
  },
  createCompanyFieldGroupLast: {
    marginBottom: 0,
  },
  createCompanyDetailsAccordion: {
    marginBottom: isAndroid ? av(16) : 20,
    borderWidth: 1,
    borderColor: c.borderStrong,
    borderRadius: 12,
    backgroundColor: c.white,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  createCompanyDetailsSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: isAndroid ? av(48) : 52,
    paddingHorizontal: isAndroid ? ah(14) : 16,
    backgroundColor: c.white,
  },
  createCompanyDetailsSummaryExpanded: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.borderStrong,
  },
  createCompanyDetailsSummaryPressed: {
    backgroundColor: "rgba(18, 74, 198, 0.06)",
  },
  createCompanyDetailsSummaryText: {
    flex: 1,
    fontSize: isAndroid ? 16 : 17,
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
    ...(isAndroid ? { lineHeight: lhCompact(16), ...androidTextFix } : {}),
  },
  createCompanyDetailsPanel: {
    paddingHorizontal: isAndroid ? ah(14) : 16,
    paddingTop: isAndroid ? av(14) : 16,
    paddingBottom: isAndroid ? av(14) : 16,
  },
  createCompanySectionLabel: {
    fontSize: 13,
    fontFamily: theme.font.dinLight,
    fontWeight: "600",
    marginBottom: isAndroid ? av(6) : 8,
    color: c.textSecondary,
    letterSpacing: 0.35,
    textTransform: "uppercase",
    alignSelf: "stretch",
    ...(isAndroid ? { lineHeight: lhCompact(13), ...androidTextFix } : {}),
  },
  createCompanyInputRow: {
    flexDirection: "row",
    minHeight: CREATE_COMPANY_INPUT_MIN_H,
    borderWidth: 1,
    borderColor: c.borderStrong,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: c.white,
    paddingHorizontal: isAndroid ? ah(12) : 14,
  },
  createCompanyInput: {
    fontSize: isAndroid ? 16 : 17,
    fontFamily: theme.font.dinLight,
    paddingVertical: isAndroid ? av(10) : 14,
    paddingRight: ah(4),
    flex: 1,
    minWidth: 0,
    color: c.textPrimary,
    ...(isAndroid
      ? { lineHeight: lhCompact(16), ...androidTextFix }
      : androidTextFix),
  },
  createCompanyModalSheet: {
    backgroundColor: c.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "92%",
    overflow: "hidden",
  },
  createCompanyModalScroll: {
    flexGrow: 1,
    paddingHorizontal: isAndroid ? ah(3) : 4,
    paddingBottom: isAndroid ? av(16) : 20,
  },
  createCompanyModalTitle: {
    fontFamily: theme.font.dinBold,
    color: "#111827",
    fontSize: isAndroid ? 18 : 20,
    ...(isAndroid ? { lineHeight: lhCompact(18), ...androidTextFix } : {}),
  },
  createCompanyStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isAndroid ? av(12) : 16,
    paddingHorizontal: isAndroid ? ah(14) : 16,
    minHeight: CREATE_COMPANY_STATUS_MIN_H,
    position: "relative",
  },
  createCompanyStatusTitleWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: isAndroid ? ah(40) : 44,
  },
  createCompanyStatusTitle: {
    fontWeight: "700",
    fontFamily: theme.font.dinBold,
    color: c.white,
    fontSize: 21,
    textAlign: "center",
    ...(isAndroid
      ? { fontSize: 19, lineHeight: lhCompact(19), ...androidTextFix }
      : androidTextFix),
  },
  createCompanyLoadingStrip: {
    paddingVertical: isAndroid ? av(22) : 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.glassWhite,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.glassBorderLight,
  },
  createCompanyIconTap: {
    padding: isAndroid ? av(6) : 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: isAndroid ? ah(40) : 44,
    minHeight: isAndroid ? av(40) : 44,
    marginLeft: isAndroid ? ah(3) : 4,
    borderRadius: 10,
    backgroundColor: c.primaryMutedBg,
  },
  createCompanyModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: isAndroid ? av(12) : 16,
    paddingHorizontal: isAndroid ? ah(3) : 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.borderSubtle,
    marginBottom: isAndroid ? av(6) : 8,
  },
  createCompanyStatusEdit: {
    position: "absolute",
    right: isAndroid ? ah(8) : 10,
    top: 0,
    bottom: 0,
    width: isAndroid ? ah(40) : 44,
    justifyContent: "center",
    alignItems: "center",
  },
  createCompanyStatusPickerWrap: {
    zIndex: 100000,
    elevation: 24,
  },
  createCompanyStatusPicker: {
    backgroundColor: c.white,
    borderColor: c.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: CREATE_COMPANY_INPUT_MIN_H,
  },
  createCompanyStatusPickerList: {
    borderColor: c.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: isAndroid ? s(238) : 280,
    backgroundColor: c.white,
    ...Platform.select({
      ios: {
        shadowColor: c.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  createCompanyPickerSearchInput: {
    borderWidth: 1,
    borderColor: c.borderStrong,
    borderRadius: 12,
    minHeight: CREATE_COMPANY_INPUT_MIN_H,
    paddingHorizontal: isAndroid ? ah(12) : 14,
    fontSize: isAndroid ? 16 : 17,
    fontFamily: theme.font.dinLight,
    color: c.textPrimary,
    backgroundColor: c.white,
    paddingVertical: isAndroid ? av(10) : 14,
    ...(isAndroid
      ? { lineHeight: lhCompact(16), ...androidTextFix }
      : androidTextFix),
  },
  createCompanyPickerSearchContainer: {
    paddingHorizontal: isAndroid ? ah(10) : 12,
    paddingTop: isAndroid ? av(3) : 4,
    paddingBottom: isAndroid ? av(8) : 10,
  },
  createCompanyStatusPickerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: isAndroid ? av(10) : 12,
    paddingHorizontal: isAndroid ? ah(12) : 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.borderSubtle,
  },
  createCompanyDropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isAndroid ? av(10) : 14,
    paddingHorizontal: isAndroid ? ah(12) : 14,
    backgroundColor: c.white,
    minHeight: CREATE_COMPANY_INPUT_MIN_H,
  },
  createCompanyDropdownRowPressed: {
    backgroundColor: c.surfaceMuted,
  },
  createCompanyDropdownTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: isAndroid ? ah(6) : 8,
  },
  createCompanyDropdownTitle: {
    fontSize: isAndroid ? 16 : 17,
    fontFamily: theme.font.dinBold,
    color: c.textPrimary,
    ...(isAndroid ? { lineHeight: lhCompact(16), ...androidTextFix } : {}),
  },
  createCompanyDropdownSubtitle: {
    fontSize: isAndroid ? 13 : 14,
    fontFamily: theme.font.dinLight,
    color: c.textSecondary,
    marginTop: isAndroid ? av(3) : 4,
    lineHeight: isAndroid ? lhCompact(13) : 20,
    ...(isAndroid ? androidTextFix : {}),
  },
  createCompanyDropdownSingleLine: {
    fontSize: isAndroid ? 15 : 16,
    fontFamily: theme.font.dinLight,
    color: c.textPrimary,
    ...(isAndroid ? { lineHeight: lhCompact(15), ...androidTextFix } : {}),
  },
  companycontactFormInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.borderStrong,
    borderRadius: 12,
    paddingHorizontal: isAndroid ? ah(12) : 14,
    minHeight: isAndroid ? av(42) : 48,
    marginBottom: isAndroid ? av(10) : 12,
    backgroundColor: c.white,
  },
  companycontactFormInputMultiline: {
    alignItems: "flex-start",
    paddingVertical: isAndroid ? av(10) : 12,
    minHeight: isAndroid ? s(76) : 88,
  },
  companyStatusTickerContainer: {
    marginBottom: isAndroid ? av(6) : 8,
  },
  companyStatusTickerTextPicker: {},
  companyStatusTickerText: {
    fontSize: isAndroid ? 13 : 14,
    ...(isAndroid ? { lineHeight: lhCompact(13), ...androidTextFix } : {}),
  },
  manualNameRow: {
    paddingLeft: isAndroid ? ah(12) : 14,
    paddingRight: 0,
    overflow: "hidden",
  },
  manualNameInput: {
    paddingRight: isAndroid ? ah(6) : 8,
  },
  manualSearchTap: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    minWidth: isAndroid ? ah(44) : 48,
    marginLeft: isAndroid ? ah(3) : 4,
    marginRight: 0,
    paddingHorizontal: isAndroid ? ah(10) : 12,
    paddingVertical: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "rgba(18, 74, 198, 0.06)",
  },
  searchRow: {
    alignItems: "stretch",
  },
  iconTapInRow: {
    alignSelf: "stretch",
    justifyContent: "center",
    minHeight: undefined,
    marginLeft: isAndroid ? ah(5) : 6,
    borderRadius: 12,
  },
  inputUnified: {
    paddingVertical: isAndroid ? av(10) : 14,
    ...Platform.select({
      android: { textAlignVertical: "center", ...androidTextFix },
      default: {},
    }),
  },
  contactNotesInput: {
    flex: 1,
    fontSize: isAndroid ? 16 : 17,
    fontFamily: theme.font.dinLight,
    color: "#111827",
    padding: 0,
    minHeight: isAndroid ? s(76) : 88,
    textAlignVertical: "top",
    ...multilineTextFix,
  },
});

export default ccStyles;
