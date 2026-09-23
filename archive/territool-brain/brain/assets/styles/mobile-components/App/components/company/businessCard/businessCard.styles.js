/**
 * Scan Business Card — iOS legacy px unchanged; Android ~15% tighter spacing.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const c = theme.colors;
const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const businessCardVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const businessCardHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = businessCardVertical;
const ah = businessCardHorizontal;
const lhCompact = (fontSize) => Math.round(fontSize * 1.12);

export const BUSINESS_CARD_ROW_ICON = isAndroid ? 18 : 20;
export const BUSINESS_CARD_INTRO_ICON = isAndroid ? 22 : 26;
export const BUSINESS_CARD_INTRO_ICON_BOX = isAndroid ? av(48) : 48;
export const BUSINESS_CARD_ACTION_ICON = isAndroid ? 20 : 22;
export const BUSINESS_CARD_COPY_ICON = isAndroid ? 16 : 18;
export const BUSINESS_CARD_CITY_CHEVRON = isAndroid ? 20 : 22;
export const BUSINESS_CARD_ACTION_BTN_MIN_H = isAndroid ? 46 : 54;
export const BUSINESS_CARD_CLEAR_BTN_MIN_H = isAndroid ? 38 : 44;
export const BUSINESS_CARD_SAVE_BTN_MIN_H = isAndroid ? 46 : 52;
export const BUSINESS_CARD_SAVE_BTN_FONT = isAndroid ? 18 : 20;
export const BUSINESS_CARD_CITY_INPUT_H = isAndroid ? 42 : 48;
export const BUSINESS_CARD_CITY_FONT = isAndroid ? 15 : 16;
export const BUSINESS_CARD_EXTRACTED_INPUT_MIN_H = isAndroid ? 40 : 46;
export const BUSINESS_CARD_EXTRACTED_MULTILINE_MIN_H = isAndroid ? 78 : 92;
export const BUSINESS_CARD_PREVIEW_H = isAndroid ? av(208) : 208;

export const businessCardCityAutocompleteStyle = {
  fontFamily: theme.font.dinLight,
  height: BUSINESS_CARD_CITY_INPUT_H,
  paddingHorizontal: isAndroid ? ah(6) : 6,
  fontSize: BUSINESS_CARD_CITY_FONT,
  ...(isAndroid
    ? { lineHeight: lhCompact(BUSINESS_CARD_CITY_FONT), ...androidTextFix }
    : {}),
};

export const businessCardCityInputContainerStyle = {
  height: BUSINESS_CARD_CITY_INPUT_H,
  width: "100%",
  fontFamily: theme.font.dinLight,
  borderBottomWidth: 0,
  borderWidth: 0,
  backgroundColor: "transparent",
  marginBottom: 0,
};

export const businessCardCityResultTextStyle = {
  paddingVertical: isAndroid ? av(12) : 12,
  paddingHorizontal: isAndroid ? ah(12) : 12,
  fontSize: BUSINESS_CARD_CITY_FONT,
  color: c.black,
  fontFamily: theme.font.dinLight,
  ...(isAndroid
    ? { lineHeight: lhCompact(BUSINESS_CARD_CITY_FONT), ...androidTextFix }
    : {}),
};

const businessCardStyles = StyleSheet.create({
  keyboardAvoid: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    overflow: "visible",
    paddingHorizontal: isAndroid ? ah(20) : 20,
    paddingTop: isAndroid ? av(16) : 16,
    paddingBottom: isAndroid ? av(32) : 32,
  },
  introCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: isAndroid ? av(12) : 12,
    padding: isAndroid ? av(16) : 16,
    marginBottom: isAndroid ? av(16) : 16,
    backgroundColor: c.primaryMutedBg,
    borderRadius: isAndroid ? ah(16) : 16,
    borderWidth: 1,
    borderColor: c.borderSubtle,
    ...Platform.select({
      ios: {
        shadowColor: c.shadowBlack,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      default: {},
    }),
  },
  introIconWrap: {
    width: BUSINESS_CARD_INTRO_ICON_BOX,
    height: BUSINESS_CARD_INTRO_ICON_BOX,
    borderRadius: isAndroid ? ah(12) : 12,
    backgroundColor: c.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.border,
  },
  introTextCol: {
    flex: 1,
    minWidth: 0,
  },
  introTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: 18,
    lineHeight: isAndroid ? lhCompact(18) : lineHeightFor(18),
    color: c.textPrimary,
    ...androidTextFix,
  },
  introSubtitle: {
    marginTop: isAndroid ? av(6) : 6,
    fontFamily: theme.font.dinLight,
    fontSize: 14,
    lineHeight: isAndroid ? lhCompact(14) : lineHeightFor(14),
    color: c.textSecondary,
    ...androidTextFix,
  },
  panel: {
    backgroundColor: c.white,
    borderRadius: isAndroid ? ah(16) : 16,
    borderWidth: 1,
    borderColor: c.border,
    padding: isAndroid ? av(16) : 16,
    marginBottom: isAndroid ? av(16) : 16,
  },
  panelLabel: {
    fontFamily: theme.font.dinBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: c.textMuted,
    marginBottom: isAndroid ? av(12) : 12,
    ...androidTextFix,
  },
  previewPanel: {
    paddingBottom: isAndroid ? av(12) : 12,
  },
  previewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: isAndroid ? av(12) : 12,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: isAndroid ? av(8) : 8,
    paddingVertical: isAndroid ? av(6) : 6,
    paddingHorizontal: isAndroid ? ah(12) : 12,
    backgroundColor: c.primaryMutedBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: c.borderSubtle,
  },
  statusPillText: {
    fontFamily: theme.font.dinBold,
    fontSize: 12,
    color: c.primary,
    ...androidTextFix,
  },
  previewFrame: {
    borderRadius: isAndroid ? ah(12) : 12,
    borderWidth: 1,
    borderColor: c.dividerLight,
    backgroundColor: c.surfaceInput,
    overflow: "hidden",
  },
  actionsRow: {
    flexDirection: "row",
    gap: isAndroid ? av(12) : 12,
    marginBottom: 0,
  },
  actionBtn: {
    minHeight: BUSINESS_CARD_ACTION_BTN_MIN_H,
    borderRadius: isAndroid ? ah(12) : 12,
  },
  btnInner: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isAndroid ? av(8) : 8,
  },
  preview: {
    width: "100%",
    height: BUSINESS_CARD_PREVIEW_H,
    backgroundColor: c.surfaceInput,
  },
  clearBtn: {
    marginTop: isAndroid ? av(12) : 12,
    minHeight: BUSINESS_CARD_CLEAR_BTN_MIN_H,
  },
  extractedSection: {
    marginTop: 0,
  },
  detailsPanel: {
    marginBottom: isAndroid ? av(20) : 20,
    overflow: "visible",
  },
  sectionHeading: {
    fontFamily: theme.font.dinBold,
    fontSize: 18,
    lineHeight: isAndroid ? lhCompact(18) : lineHeightFor(18),
    color: c.textPrimary,
    ...androidTextFix,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: isAndroid ? av(12) : 12,
    marginBottom: isAndroid ? av(8) : 8,
  },
  sectionTitleShrink: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
  },
  copyChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isAndroid ? av(6) : 6,
    paddingVertical: isAndroid ? av(8) : 8,
    paddingHorizontal: isAndroid ? ah(12) : 12,
    borderRadius: isAndroid ? ah(10) : 10,
    backgroundColor: c.primaryMutedBgStrong,
    borderWidth: 1,
    borderColor: c.borderSubtle,
  },
  copyChipPressed: {
    opacity: 0.85,
    backgroundColor: c.primaryMutedBg,
  },
  copyChipDisabled: {
    opacity: 0.45,
  },
  copyChipLabel: {
    fontFamily: theme.font.dinBold,
    fontSize: 14,
    lineHeight: isAndroid ? lhCompact(14) : 18,
    color: c.primary,
    marginTop: isAndroid ? av(4) : 4,
    ...androidTextFix,
  },
  copyChipLabelDisabled: {
    color: c.disabled,
  },
  extractedHint: {
    fontFamily: theme.font.dinLight,
    fontSize: 14,
    lineHeight: isAndroid ? lhCompact(14) : 19,
    color: c.textSecondary,
    marginBottom: isAndroid ? av(12) : 12,
    marginTop: isAndroid ? -av(6) : -6,
    ...androidTextFix,
  },
  detailsLoaderCard: {
    marginTop: isAndroid ? av(6) : 6,
    backgroundColor: c.primaryMutedBg,
    borderRadius: isAndroid ? ah(12) : 12,
    paddingVertical: isAndroid ? av(24) : 24,
    paddingHorizontal: isAndroid ? ah(16) : 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: isAndroid ? av(148) : 148,
    borderWidth: 1,
    borderColor: c.borderSubtle,
  },
  detailsLoaderLabel: {
    marginTop: isAndroid ? av(12) : 12,
    fontFamily: theme.font.dinBold,
    fontSize: 16,
    color: c.textPrimary,
    textAlign: "center",
    ...androidTextFix,
  },
  detailsLoaderSub: {
    marginTop: isAndroid ? av(8) : 8,
    fontFamily: theme.font.dinLight,
    fontSize: 13,
    lineHeight: isAndroid ? lhCompact(13) : 18,
    color: c.ccSubtle,
    textAlign: "center",
    ...androidTextFix,
  },
  fieldsCard: {
    marginTop: isAndroid ? av(6) : 6,
    borderRadius: isAndroid ? ah(12) : 12,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
    overflow: "visible",
    position: "relative",
    zIndex: 0,
  },
  fieldsSubsectionTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: c.textMuted,
    paddingHorizontal: isAndroid ? ah(12) : 12,
    paddingTop: isAndroid ? av(8) : 8,
    paddingBottom: isAndroid ? av(6) : 6,
    backgroundColor: c.surfaceInput,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.dividerHairline,
    ...androidTextFix,
  },
  fieldsSubsectionTitleSpaced: {
    paddingTop: isAndroid ? av(12) : 12,
    marginTop: isAndroid ? av(6) : 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.dividerHairline,
  },
  cityFieldStack: {
    position: "relative",
    zIndex: 200000,
    overflow: "visible",
    ...Platform.select({
      android: { elevation: 28 },
      default: {},
    }),
  },
  fieldsBelowCity: {
    zIndex: 0,
    overflow: "visible",
    ...Platform.select({
      android: { elevation: 0 },
      default: {},
    }),
  },
  extractedRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: isAndroid ? av(12) : 12,
    paddingHorizontal: isAndroid ? ah(12) : 12,
    gap: isAndroid ? av(12) : 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.dividerHairline,
    backgroundColor: c.surfaceInput,
  },
  extractedRowLast: {
    borderBottomWidth: 0,
  },
  extractedLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: isAndroid ? av(8) : 8,
    marginBottom: isAndroid ? av(6) : 6,
  },
  extractedLabelRowIcon: {
    marginTop: 0,
  },
  extractedRowBody: {
    flex: 1,
    minWidth: 0,
  },
  extractedLabel: {
    flex: 1,
    minWidth: 0,
    fontFamily: theme.font.dinBold,
    fontSize: 11,
    lineHeight: isAndroid ? lhCompact(11) : 14,
    color: c.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    ...androidTextFix,
  },
  extractedInput: {
    fontFamily: theme.font.dinLight,
    fontSize: isAndroid ? 15 : 16,
    lineHeight: isAndroid ? lhCompact(15) : 22,
    color: c.textPrimary,
    paddingTop: isAndroid ? av(4) : 4,
    paddingBottom: isAndroid ? av(12) : 12,
    paddingHorizontal: isAndroid ? ah(12) : 12,
    minHeight: BUSINESS_CARD_EXTRACTED_INPUT_MIN_H,
    borderRadius: isAndroid ? ah(10) : 10,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
    ...androidTextFix,
  },
  extractedInputMultiline: {
    minHeight: BUSINESS_CARD_EXTRACTED_MULTILINE_MIN_H,
    textAlignVertical: "top",
  },
  addCompanyLoaderOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: isAndroid ? av(16) : 16,
  },
  addCompanyLoaderCard: {
    backgroundColor: c.white,
    borderRadius: isAndroid ? ah(12) : 12,
    paddingVertical: isAndroid ? av(20) : 20,
    paddingHorizontal: isAndroid ? ah(20) : 20,
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  addCompanyLoaderTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: 17,
    color: c.textPrimary,
    marginTop: isAndroid ? av(12) : 12,
    textAlign: "center",
    ...androidTextFix,
  },
  addCompanyLoaderSub: {
    fontFamily: theme.font.dinLight,
    fontSize: 14,
    lineHeight: isAndroid ? lhCompact(14) : 20,
    color: c.textSecondary,
    marginTop: isAndroid ? av(8) : 8,
    textAlign: "center",
    ...androidTextFix,
  },
  addCompanyFooter: {
    marginTop: isAndroid ? av(16) : 16,
    paddingTop: isAndroid ? av(16) : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.dividerHairline,
  },
  addCompanyFooterHint: {
    fontFamily: theme.font.dinLight,
    fontSize: 12,
    lineHeight: isAndroid ? lhCompact(12) : 17,
    color: c.textSecondary,
    marginBottom: isAndroid ? av(12) : 12,
    ...androidTextFix,
  },
});

export default businessCardStyles;
