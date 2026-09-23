/**
 * Styles for AI Find Leads (`aiFindLeads.js`). Scaled layout with tighter Android vertical rhythm.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, lineHeightFor, multilineTextFix } from "../../styles/platformText";
import { scaledSize } from "../../utils/commonFunctions";

const s = scaledSize;
const isAndroid = Platform.OS === "android";

/** iOS-only: shave 2px off layout spacing (font sizes unchanged). */
const iosT = (size) => Math.max(0, size - 2);

/** Vertical spacing — Android compact; iOS legacy minus 2px. */
export const findLeadsVertical = (size) =>
  isAndroid ? s(Math.round(size * 0.85)) : iosT(size);

/** Line height for Find Leads copy — tighter on Android. */
export const findLeadsLineHeight = (fontSize) =>
  lineHeightFor(fontSize, isAndroid ? 1.12 : 1.2);

const sv = findLeadsVertical;
const lh = findLeadsLineHeight;

export const MODAL_CHAIN_MS = 400;

/** Shared input / autocomplete row height (city, ZIP). */
export const FIND_LEADS_FIELD_HEIGHT = s(isAndroid ? 42 : 48);

export const CITY_DROPDOWN_MAX_HEIGHT = FIND_LEADS_FIELD_HEIGHT * 6;

export const RT_SURFACE_PAGE = "#F6F7FB";
export const RT_CARD_BG = "#FFFFFF";
export const RT_BORDER = "#E5E7EB";
export const RT_RADIUS = s(12);
export const RT_CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  android: { elevation: 2 },
});

export const AI_TAB_SEGMENT = "rgba(255,255,255,0.16)";
export const AI_TAB_RADIUS_SM = s(12);

export const ROUTE_MODAL_CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  android: { elevation: 8 },
});

const AI_LEADS_SUMMARY_TEXT_BASE = {
  fontSize: s(16),
  lineHeight: lh(16),
  fontFamily: theme.font.dinBold,
  ...androidTextFix,
};

/** Sticky footer Total / Selected card — one type scale; color differentiates label vs values. */
export const AI_LEADS_FOOTER_SUMMARY = {
  section: {
    paddingHorizontal: s(16),
    paddingTop: sv(10),
    paddingBottom: sv(6),
    backgroundColor: RT_SURFACE_PAGE,
  },
  card: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: sv(10),
    paddingHorizontal: s(14),
    backgroundColor: RT_CARD_BG,
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: RT_BORDER,
    ...RT_CARD_SHADOW,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
  },
  selectedRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  textLabel: {
    ...AI_LEADS_SUMMARY_TEXT_BASE,
    color: theme.colors.textSecondary,
  },
  textLabelSpaced: {
    marginRight: s(6),
  },
  textTotal: {
    ...AI_LEADS_SUMMARY_TEXT_BASE,
    color: theme.colors.textMuted,
  },
  textSelectedValue: {
    ...AI_LEADS_SUMMARY_TEXT_BASE,
    color: theme.colors.primary,
  },
  spinnerWrap: {
    height: sv(22),
    justifyContent: "center",
    alignItems: "center",
    minWidth: s(24),
  },
};

export const routeModalFormLabel = {
  fontSize: s(13),
  lineHeight: lh(13),
  fontFamily: theme.font.dinBold,
  color: "#374151",
  marginBottom: sv(8),
  ...androidTextFix,
};

export const routeModalTextInput = {
  fontSize: s(16),
  lineHeight: lh(16),
  fontFamily: theme.font.dinLight,
  color: "#111827",
  paddingVertical: sv(14),
  paddingHorizontal: s(16),
  borderRadius: s(12),
  borderWidth: 1,
  borderColor: RT_BORDER,
  backgroundColor: "#F9FAFB",
  ...androidTextFix,
};

export const routeModalDropdownButton = {
  height: s(isAndroid ? 46 : 52),
  borderRadius: s(12),
  borderWidth: 1,
  borderColor: RT_BORDER,
  backgroundColor: "#F9FAFB",
  paddingHorizontal: s(16),
  justifyContent: "center",
  alignItems: "center",
};

/** Top tab bar — Search Leads / Selected Leads */
export const AI_FIND_LEADS_TABS = {
  bar: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: s(10),
    paddingTop: sv(6),
    paddingBottom: sv(8),
    alignItems: "center",
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: AI_TAB_SEGMENT,
    borderRadius: AI_TAB_RADIUS_SM,
    padding: s(4),
  },
  tab: {
    flex: 1,
    paddingVertical: sv(12),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: s(10),
  },
  tabActiveShadow: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    default: { elevation: 2 },
  }),
};

/** Search form list header (`_renderAIFindLeadsListHeader`). */
export const AI_FIND_LEADS_FORM = {
  headerWrap: {
    backgroundColor: RT_SURFACE_PAGE,
    paddingHorizontal: s(12),
    paddingTop: sv(8),
  },
  introBlock: {
    marginBottom: sv(10),
  },
  introTitle: {
    color: "#111827",
    fontFamily: theme.font.dinBold,
    fontSize: s(20),
    lineHeight: lh(20),
    ...androidTextFix,
  },
  introSubtitle: {
    marginTop: sv(4),
    fontFamily: theme.font.dinLight,
    fontSize: s(13),
    color: "#6B7280",
    lineHeight: lh(13),
    ...androidTextFix,
  },
  stepLabel: {
    marginTop: sv(2),
    marginBottom: sv(6),
    color: "#111827",
    fontFamily: theme.font.dinBold,
    fontSize: s(15),
    lineHeight: lh(15),
    ...androidTextFix,
  },
  stepLabelElevated: {
    zIndex: 0,
    elevation: 0,
  },
  cityAutocompleteInput: {
    fontFamily: theme.font.dinLight,
    height: FIND_LEADS_FIELD_HEIGHT,
    paddingVertical: sv(12),
    paddingHorizontal: s(6),
    fontSize: s(16),
    lineHeight: lh(16),
    ...androidTextFix,
  },
  idealWrap: {
    zIndex: 0,
    elevation: 0,
    minHeight: s(isAndroid ? 80 : 96),
    width: "100%",
    marginBottom: sv(10),
    position: "relative",
  },
  idealInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontFamily: theme.font.dinLight,
    borderRadius: s(12),
    paddingHorizontal: s(12),
    paddingTop: sv(12),
    paddingBottom: sv(12),
    minHeight: s(isAndroid ? 80 : 96),
    textAlignVertical: "top",
    backgroundColor: theme.colors.white,
    fontSize: s(16),
    lineHeight: lh(16),
    color: theme.colors.black,
    ...multilineTextFix,
  },
  idealPlaceholder: {
    position: "absolute",
    left: s(12),
    right: s(12),
    top: sv(12),
  },
  idealPlaceholderText: {
    fontFamily: theme.font.dinLight,
    fontSize: s(16),
    lineHeight: lh(16),
    color: theme.colors.darkGray,
    ...androidTextFix,
  },
  actionRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 0,
    marginBottom: sv(8),
  },
  actionBtn: {
    flex: 1,
    minHeight: s(isAndroid ? 42 : 48),
    paddingVertical: sv(isAndroid ? 8 : 12),
    borderRadius: s(12),
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnClear: {
    backgroundColor: theme.colors.danger,
    marginRight: s(6),
  },
  actionBtnSearch: {
    backgroundColor: theme.colors.primary,
    marginLeft: s(6),
  },
  prospectsCard: {
    marginTop: sv(6),
    minHeight: s(isAndroid ? 56 : 64),
    backgroundColor: "#EFF6FF",
    borderRadius: s(10),
    padding: sv(12),
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  prospectsTitle: {
    marginBottom: sv(8),
    color: "#111827",
    fontFamily: theme.font.dinBold,
    fontSize: s(16),
    lineHeight: lh(16),
    ...androidTextFix,
  },
  prospectRow: {
    flexDirection: "row",
    marginVertical: sv(5),
    alignItems: "flex-start",
  },
  prospectBullet: {
    marginTop: sv(6),
    marginRight: s(4),
  },
  prospectText: {
    marginStart: s(10),
    flex: 1,
    fontSize: s(14),
    lineHeight: lh(14),
    color: theme.colors.black,
    ...androidTextFix,
  },
  cityAutocompleteInputContainer: {
    height: FIND_LEADS_FIELD_HEIGHT,
    width: "100%",
    fontFamily: theme.font.dinLight,
    borderBottomWidth: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    marginBottom: 0,
  },
  cityAutocompleteResultText: {
    paddingVertical: sv(12),
    paddingHorizontal: s(12),
    fontSize: s(16),
    lineHeight: lh(16),
    color: theme.colors.black,
    fontFamily: theme.font.dinLight,
    ...androidTextFix,
  },
};

/** Sticky footer — Select all / Add leads */
export const AI_FIND_LEADS_FOOTER_ACTIONS = {
  wrap: {
    paddingHorizontal: s(16),
    paddingTop: sv(8),
    paddingBottom: sv(24),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    flex: 1,
    minHeight: s(isAndroid ? 42 : 48),
    paddingVertical: sv(isAndroid ? 8 : 12),
    borderRadius: RT_RADIUS,
    justifyContent: "center",
    alignItems: "center",
  },
  selectAllBtn: {
    backgroundColor: RT_CARD_BG,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    marginRight: s(8),
  },
  addLeadsBtn: {
    marginLeft: s(8),
  },
};

export const findLeadsScaled = {
  fieldHeight: FIND_LEADS_FIELD_HEIGHT,
  iconTerritory: s(16),
  iconChevron: s(22),
};

/** City / ZIP field stacks above “Ideal businesses” (z-index + elevation). */
export const AI_LEADS_CITY = {
  wrap: {
    width: "100%",
    marginBottom: sv(12),
    overflow: "visible",
    zIndex: 100001,
    ...Platform.select({
      android: { elevation: 20 },
      default: {},
    }),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: s(12),
    paddingLeft: s(8),
    paddingRight: s(2),
    paddingVertical: sv(4),
    backgroundColor: theme.colors.white,
    overflow: "visible",
  },
  autocompleteCol: {
    flex: 1,
    minWidth: 0,
    marginRight: s(4),
    overflow: "visible",
  },
  autocompleteRoot: {
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",
    minHeight: FIND_LEADS_FIELD_HEIGHT,
    overflow: "visible",
    ...Platform.select({
      android: { elevation: 8 },
      ios: { zIndex: 2 },
    }),
  },
  /** Android: include the overlay in layout so the nested list can receive pans. */
  androidDropdownSpace: {
    height: FIND_LEADS_FIELD_HEIGHT + CITY_DROPDOWN_MAX_HEIGHT,
  },
  rowWithDropdown: {
    alignItems: "flex-start",
  },
  listOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: FIND_LEADS_FIELD_HEIGHT,
    maxHeight: CITY_DROPDOWN_MAX_HEIGHT,
    backgroundColor: theme.colors.white,
    borderWidth: 0,
    borderRadius: s(10),
    zIndex: 100000,
    ...Platform.select({
      android: { overflow: "hidden", elevation: 24 },
      default: { overflow: "visible" },
    }),
  },
  chevronHit: { padding: s(8), marginTop: sv(4) },
  territoryLocateBtn: {
    width: s(46),
    height: s(46),
    borderRadius: s(10),
    marginTop: sv(4),
    marginRight: s(2),
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#124AC6",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  territoryLocateBtnDisabled: {
    opacity: 0.55,
  },
  segmentRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: sv(10),
    backgroundColor: "#EEF1F6",
    borderRadius: s(12),
    padding: s(4),
  },
  territoryLocationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: sv(8),
    marginTop: sv(-2),
    paddingVertical: sv(4),
    paddingHorizontal: s(10),
    borderRadius: 999,
    backgroundColor: "rgba(205, 209, 219, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(18, 74, 198, 0.22)",
  },
  territoryLocationIndicatorText: {
    marginLeft: s(6),
    fontSize: s(12),
    lineHeight: lh(12),
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
    ...androidTextFix,
  },
  territoryLocationBusyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: sv(6),
    marginBottom: sv(4),
    paddingHorizontal: s(2),
  },
  territoryLocationBusyText: {
    marginLeft: s(8),
    fontSize: s(13),
    lineHeight: lh(13),
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    flex: 1,
    ...androidTextFix,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: sv(12),
    borderRadius: s(10),
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBtnActive: {
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  segmentLabel: {
    ...theme.typography.buttonLabel,
    fontSize: s(15),
    lineHeight: lh(15),
    color: "#6B7280",
    ...androidTextFix,
  },
  segmentLabelActive: {
    color: theme.colors.primary,
  },
  zipInput: {
    flex: 1,
    fontFamily: theme.font.dinLight,
    minHeight: FIND_LEADS_FIELD_HEIGHT,
    paddingVertical: sv(12),
    paddingHorizontal: s(4),
    fontSize: s(16),
    lineHeight: lh(16),
    color: theme.colors.black,
    ...androidTextFix,
  },
};

export const COMPANY_ITEM_STYLES = {
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainer: {
    height: Platform.OS === "android" ? s(48) : s(20),
    width: Platform.OS === "android" ? s(48) : s(20),
  },
};

export const AI_LEADS_ROW = {
  wrap: { marginHorizontal: s(12), marginTop: sv(6), marginBottom: sv(6) },
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: RT_CARD_BG,
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: RT_BORDER,
    paddingVertical: sv(18),
    paddingLeft: s(4),
    paddingRight: s(14),
    minHeight: s(isAndroid ? 92 : 108),
    ...RT_CARD_SHADOW,
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    backgroundColor: "rgba(18, 74, 198, 0.04)",
    ...Platform.select({
      android: { elevation: 0 },
      default: {},
    }),
  },
  checkCol: {
    width: s(44),
    justifyContent: "center",
    alignItems: "center",
  },
  body: { flex: 1, minWidth: 0, justifyContent: "center" },
  name: {
    fontSize: s(17),
    lineHeight: lh(17),
    fontFamily: theme.font.dinBold,
    color: "#0F172A",
    letterSpacing: -0.2,
    ...androidTextFix,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: sv(6),
    gap: s(4),
  },
  addressIcon: {
    marginTop: sv(2),
  },
  address: {
    flex: 1,
    fontSize: s(13),
    lineHeight: lh(13),
    fontFamily: theme.font.dinLight,
    color: "#64748B",
    ...androidTextFix,
  },
  addressLink: {
    color: theme.colors.primary,
  },
  contactsPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: sv(14),
    paddingVertical: sv(8),
    paddingHorizontal: s(11),
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: RT_BORDER,
    backgroundColor: "#F8FAFC",
  },
  contactsPillLoading: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  contactsLabel: {
    fontSize: s(13),
    lineHeight: lh(13),
    fontFamily: theme.font.dinBold,
    color: "#334155",
    marginLeft: s(6),
    textAlign: "left",
    ...androidTextFix,
  },
  contactsFetchingLabel: {
    fontSize: s(13),
    lineHeight: lh(13),
    fontFamily: theme.font.dinBold,
    color: theme.colors.white,
    marginLeft: s(6),
    textAlign: "left",
    ...androidTextFix,
  },
};

export const SELECTED_AI_LEADS = {
  wrap: { marginHorizontal: s(12), marginTop: sv(4), marginBottom: sv(4) },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: RT_CARD_BG,
    borderRadius: RT_RADIUS,
    borderWidth: 1,
    borderColor: RT_BORDER,
    paddingVertical: sv(12),
    paddingLeft: s(4),
    paddingRight: s(14),
    ...RT_CARD_SHADOW,
  },
  checkCol: {
    width: s(44),
    justifyContent: "center",
    alignItems: "center",
  },
  body: { flex: 1, minWidth: 0, justifyContent: "center" },
  title: {
    fontSize: s(17),
    lineHeight: lh(17),
    fontFamily: theme.font.dinBold,
    color: "#0F172A",
    letterSpacing: -0.2,
    ...androidTextFix,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: sv(4),
    gap: s(4),
  },
  addressIcon: {
    marginTop: sv(2),
  },
  address: {
    flex: 1,
    fontSize: s(13),
    lineHeight: lh(13),
    fontFamily: theme.font.dinLight,
    color: "#64748B",
    marginTop: sv(4),
    ...androidTextFix,
  },
  addressLink: {
    color: theme.colors.primary,
  },
};

/** Tip under company header in AI Find Leads contacts preview modal. */
export const AI_CONTACTS_MODAL_TIP = {
  wrap: {
    paddingHorizontal: s(12),
    paddingTop: sv(10),
    paddingBottom: sv(10),
    backgroundColor: RT_CARD_BG,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RT_BORDER,
    flexShrink: 0,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: s(12),
    paddingVertical: sv(10),
    borderRadius: s(10),
    backgroundColor: theme.colors.primaryMutedBgStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(18, 74, 198, 0.18)",
  },
  icon: {
    marginRight: s(10),
    marginTop: sv(1),
  },
  text: {
    flex: 1,
    fontSize: s(13),
    lineHeight: lh(13),
    fontFamily: theme.font.dinLight,
    color: "#334155",
    ...androidTextFix,
  },
  textEmphasis: {
    fontFamily: theme.font.dinBold,
    color: theme.colors.primary,
  },
};

export const AI_CONTACT_ITEM = {
  row: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
    borderRadius: s(5),
    paddingVertical: sv(10),
    paddingHorizontal: s(12),
    marginHorizontal: s(10),
    marginVertical: sv(5),
  },
  leftCol: {
    flexDirection: "column",
    justifyContent: "center",
    marginRight: s(10),
  },
  name: {
    fontSize: s(20),
    lineHeight: lh(20),
    fontFamily: theme.font.dinBold,
    color: theme.colors.black,
    width: "100%",
    ...androidTextFix,
  },
  jobTitle: {
    fontSize: s(16),
    lineHeight: lh(16),
    fontFamily: theme.font.dinLight,
    color: theme.colors.black,
    width: "100%",
    marginTop: sv(2),
    ...androidTextFix,
  },
  rightCol: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
  },
  fetchBtn: {
    minHeight: s(isAndroid ? 30 : 34),
    paddingVertical: sv(6),
    paddingHorizontal: s(12),
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: s(6),
  },
  fetchBtnText: {
    ...theme.typography.buttonLabel,
    color: theme.colors.white,
    fontSize: s(16),
    lineHeight: lh(16),
  },
};
