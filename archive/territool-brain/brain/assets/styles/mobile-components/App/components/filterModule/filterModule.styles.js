/**
 * Filter modal — iOS legacy px unchanged; Android ~15% tighter spacing.
 */
import { Dimensions, Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../styles/platformText";
import { scaledSize } from "../../utils/commonFunctions";
import stylesCommon from "../../styles/common";

const isAndroid = Platform.OS === "android";
const s = scaledSize;

/** Android-only vertical compact (~15%); iOS passes through unchanged. */
export const filterVertical = (iosPx) =>
  isAndroid ? s(Math.round(iosPx * 0.85)) : iosPx;
/** Android-only horizontal scale; iOS unchanged. */
export const filterHorizontal = (iosPx) =>
  isAndroid ? s(iosPx) : iosPx;

const av = filterVertical;
const ah = filterHorizontal;
const lhA = (fontSize) => lineHeightFor(fontSize, 1.12);

export const RT_SURFACE = "#F6F7FB";
export const RT_CARD_BG = "#FFFFFF";
export const RT_BORDER = "#E5E7EB";
export const RT_RADIUS = isAndroid ? ah(12) : 12;

export const RT_CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
});

export const FILTER_CONTROL_HEIGHT = isAndroid ? 42 : 48;
export const FILTER_FIELD_BOTTOM = isAndroid ? av(20) : 24;
export const FILTER_LABEL_BOTTOM = isAndroid ? av(6) : 8;
export const FILTER_CONTROL_PAD_H = isAndroid ? ah(14) : 16;
export const FILTER_CLOSE_ICON = isAndroid ? 24 : 28;
export const FILTER_DROPDOWN_CHEVRON = isAndroid ? 18 : 20;
export const FILTER_CHECKBOX_SIZE = isAndroid ? 18 : 20;
export const FILTER_PICKER_FONT = isAndroid ? 15 : 16;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
export const MODAL_CARD_HEIGHT = isAndroid
  ? Math.min(SCREEN_HEIGHT * 0.9, s(680))
  : Math.min(SCREEN_HEIGHT * 0.92, 720);

const INPUT_BG = RT_CARD_BG;

const unifiedControl = {
  height: FILTER_CONTROL_HEIGHT,
  backgroundColor: INPUT_BG,
  borderWidth: 1,
  borderColor: RT_BORDER,
  borderRadius: RT_RADIUS,
  paddingHorizontal: FILTER_CONTROL_PAD_H,
};

const unifiedControlText = {
  fontFamily: theme.font.dinLight,
  color: "#111827",
  ...(isAndroid
    ? { fontSize: 15, lineHeight: lhA(15), ...androidTextFix }
    : { fontSize: 16 }),
};

export const filterPickerTextStyle = {
  fontSize: FILTER_PICKER_FONT,
  fontFamily: theme.font.dinLight,
  color: "#111827",
  ...(isAndroid ? { lineHeight: lhA(FILTER_PICKER_FONT), ...androidTextFix } : {}),
};

export const filterPickerPlaceholderStyle = {
  fontSize: FILTER_PICKER_FONT,
  fontFamily: theme.font.dinLight,
  color: "#6B7280",
  ...(isAndroid ? { lineHeight: lhA(FILTER_PICKER_FONT), ...androidTextFix } : {}),
};

const filterModuleStyles = StyleSheet.create({
  ...stylesCommon,
  modalRoot: {
    justifyContent: "center",
    margin: isAndroid ? ah(16) : 20,
  },
  modalContainer: {
    alignItems: "stretch",
  },
  modalContent: {
    backgroundColor: RT_CARD_BG,
    borderRadius: (isAndroid ? ah(12) : 12) + 4,
    borderWidth: 1,
    borderColor: RT_BORDER,
    paddingHorizontal: isAndroid ? ah(20) : 24,
    paddingTop: isAndroid ? av(12) : 16,
    paddingBottom: isAndroid ? av(12) : 16,
    height: MODAL_CARD_HEIGHT,
    alignSelf: "stretch",
    position: "relative",
    overflow: "hidden",
  },
  filterApplyingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
    borderRadius: (isAndroid ? ah(12) : 12) + 4,
  },
  filterApplyingOverlayText: {
    marginTop: av(14),
    fontFamily: theme.font.dinLight,
    color: "#374151",
    textAlign: "center",
    paddingHorizontal: ah(24),
    ...(isAndroid
      ? { fontSize: 15, lineHeight: lhA(15), ...androidTextFix }
      : { fontSize: 16 }),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: av(8),
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: RT_BORDER,
    marginBottom: isAndroid ? av(8) : 12,
  },
  header: {
    fontFamily: theme.font.dinBold,
    color: "#111827",
    flex: 1,
    ...(isAndroid
      ? { fontSize: 18, lineHeight: lhA(18), ...androidTextFix }
      : { fontSize: 20 }),
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: av(4),
    marginBottom: "3%",
  },
  scrollWrap: {
    flex: 1,
    position: "relative",
    minHeight: isAndroid ? s(100) : 120,
  },
  scrollView: {
    flex: 1,
  },
  scrollHintOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: isAndroid ? av(48) : 56,
    justifyContent: "flex-end",
  },
  scrollHintFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: av(30),
  },
  scrollHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: av(4),
    gap: av(6),
  },
  scrollHintText: {
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    ...(isAndroid
      ? { fontSize: 12, lineHeight: lhA(12), ...androidTextFix }
      : { fontSize: 13 }),
  },
  scrollContent: {
    paddingBottom: av(24),
    paddingTop: av(4),
  },
  fieldBlock: {
    marginBottom: FILTER_FIELD_BOTTOM,
  },
  label: {
    fontFamily: theme.font.dinBold,
    color: "#374151",
    marginBottom: FILTER_LABEL_BOTTOM,
    ...(isAndroid
      ? { fontSize: 12, lineHeight: lhA(12), ...androidTextFix }
      : { fontSize: 13 }),
  },
  input: {
    ...unifiedControl,
    paddingVertical: 0,
    ...unifiedControlText,
    ...(Platform.OS === "android" ? { textAlignVertical: "center" } : {}),
  },
  dropdown: {
    ...unifiedControl,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 0,
    paddingRight: FILTER_CONTROL_PAD_H - 2,
  },
  dropdownRow: {
    height: FILTER_CONTROL_HEIGHT,
    paddingHorizontal: FILTER_CONTROL_PAD_H,
    justifyContent: "center",
  },
  dropdownButtonInner: {
    flex: 1,
    flexDirection: "row",
    minWidth: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    textAlign: "left",
    ...unifiedControlText,
    lineHeight: isAndroid ? lhA(15) : 20,
    paddingVertical: 0,
  },
  dropdownPlaceholder: {
    color: "#9CA3AF",
  },
  dropdownIconRight: {
    marginLeft: ah(8),
  },
  dropdownRowText: {
    textAlign: "left",
    color: "#374151",
    fontFamily: theme.font.dinLight,
    ...(isAndroid
      ? { fontSize: 15, lineHeight: lhA(15), ...androidTextFix }
      : { fontSize: 16 }),
  },
  autocompleteInput: {
    ...unifiedControl,
    paddingVertical: 0,
    ...unifiedControlText,
  },
  autocompleteList: {
    borderColor: RT_BORDER,
    borderWidth: 1,
    borderRadius: RT_RADIUS,
    backgroundColor: RT_CARD_BG,
    maxHeight: isAndroid ? s(160) : 180,
    marginTop: av(4),
    ...Platform.select({ android: { elevation: 4 }, ios: {} }),
  },
  autocompleteItem: {
    borderBottomWidth: 1,
    borderBottomColor: RT_BORDER,
    paddingVertical: av(12),
    paddingHorizontal: ah(16),
  },
  autocompleteItemText: {
    color: "#374151",
    fontFamily: theme.font.dinLight,
    ...(isAndroid
      ? { fontSize: 15, lineHeight: lhA(15), ...androidTextFix }
      : { fontSize: 16 }),
  },
  switchContainer: {
    flexDirection: "row",
    height: FILTER_CONTROL_HEIGHT,
    borderRadius: isAndroid ? ah(10) : 10,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  switchButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  activeSwitchButton: {
    backgroundColor: theme.colors.primary,
  },
  switchText: {
    color: "#6B7280",
    fontFamily: theme.font.dinLight,
    ...(isAndroid
      ? { fontSize: 14, lineHeight: lhA(14), ...androidTextFix }
      : { fontSize: 15 }),
  },
  activeSwitchText: {
    color: theme.colors.white,
    fontFamily: theme.font.dinLight,
    ...(isAndroid
      ? { fontSize: 14, lineHeight: lhA(14), ...androidTextFix }
      : { fontSize: 15 }),
  },
  leftRounded: {
    borderTopLeftRadius: isAndroid ? ah(10) : 10,
    borderBottomLeftRadius: isAndroid ? ah(10) : 10,
  },
  rightRounded: {
    borderTopRightRadius: isAndroid ? ah(10) : 10,
    borderBottomRightRadius: isAndroid ? ah(10) : 10,
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: av(2),
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isAndroid ? av(8) : 10,
    paddingHorizontal: isAndroid ? ah(10) : 12,
    marginRight: isAndroid ? ah(8) : 10,
    marginBottom: isAndroid ? av(6) : 8,
    backgroundColor: RT_CARD_BG,
    borderRadius: isAndroid ? ah(8) : 8,
    borderWidth: 1,
    borderColor: RT_BORDER,
  },
  squareCheckbox: {
    width: FILTER_CHECKBOX_SIZE,
    height: FILTER_CHECKBOX_SIZE,
  },
  checkboxText: {
    color: "#374151",
    marginLeft: isAndroid ? ah(8) : 10,
    fontFamily: theme.font.dinLight,
    ...(isAndroid
      ? { fontSize: 14, lineHeight: lhA(14), ...androidTextFix }
      : { fontSize: 15 }),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: isAndroid ? av(12) : 16,
    paddingBottom: 0,
    gap: isAndroid ? ah(10) : 12,
    borderTopWidth: 1,
    borderTopColor: RT_BORDER,
    marginTop: av(8),
  },
  button: {
    flex: 1,
    height: isAndroid ? 46 : 52,
    borderRadius: RT_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...theme.typography.buttonLabel,
    color: theme.colors.white,
  },
  buttonTextSecondary: {
    color: theme.colors.primary,
    ...(isAndroid ? { fontSize: 15, lineHeight: lhA(15) } : { fontSize: 16, lineHeight: 21 }),
  },
});

export default filterModuleStyles;
