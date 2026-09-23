/**
 * Styles and modal layout tokens for `App/components/contacts/view.js`.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, lineHeightFor, multilineTextFix } from "../../styles/platformText";
import { scaledSize as scaleSize } from "../../utils/commonFunctions";

const CONTACT_NOTES_MODAL_SURFACE = "#F6F7FB";
export const CONTACT_NOTES_MODAL_CARD_BG = "#FFFFFF";
export const CONTACT_NOTES_MODAL_BORDER = "#E5E7EB";
export const CONTACT_NOTES_MODAL_RADIUS = 12;
/** Placeholder / secondary text in contact notes & add-to-route modals */
export const CONTACT_NOTES_MODAL_MUTED = "#9CA3AF";
const CONTACT_NOTES_MODAL_SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 4 },
});

export const contactNotesModalLabel = {
  fontSize: 13,
  fontFamily: theme.font.dinLight,
  fontWeight: "600",
  color: "#6B7280",
  marginBottom: 6,
  letterSpacing: 0.35,
  textTransform: "uppercase",
};

export const contactNotesModalOuter = {
  width: "100%",
  maxWidth: 440,
  borderRadius: CONTACT_NOTES_MODAL_RADIUS,
  overflow: "hidden",
  backgroundColor: CONTACT_NOTES_MODAL_CARD_BG,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: CONTACT_NOTES_MODAL_BORDER,
  ...CONTACT_NOTES_MODAL_SHADOW,
};

export const contactNotesModalBody = {
  backgroundColor: CONTACT_NOTES_MODAL_SURFACE,
  paddingHorizontal: 16,
  paddingTop: 14,
  paddingBottom: 20,
};

export const contactNotesModalMultiline = {
  minHeight: 96,
  maxHeight: 152,
  borderWidth: 1,
  borderColor: CONTACT_NOTES_MODAL_BORDER,
  borderRadius: CONTACT_NOTES_MODAL_RADIUS,
  paddingHorizontal: 12,
  paddingVertical: 12,
  fontSize: 16,
  fontFamily: theme.font.dinLight,
  color: "#111827",
  backgroundColor: CONTACT_NOTES_MODAL_CARD_BG,
  lineHeight: lineHeightFor(16),
  ...multilineTextFix,
};

export const contactNotesModalPrimaryBtn = {
  flex: 1,
  minHeight: 48,
  borderRadius: CONTACT_NOTES_MODAL_RADIUS,
  backgroundColor: theme.colors.primary,
  alignItems: "center",
  justifyContent: "center",
};

export const contactNotesModalSecondaryBtn = {
  flex: 1,
  minHeight: 48,
  borderRadius: CONTACT_NOTES_MODAL_RADIUS,
  borderWidth: 2,
  borderColor: theme.colors.primary,
  backgroundColor: theme.colors.white,
  alignItems: "center",
  justifyContent: "center",
};

export const ADD_TO_ROUTE_ROW_MIN = 108;
export const ADD_TO_MODAL_HEADER = 138;

export const VIEW_SURFACE = theme.colors.ccSurface;
export const VIEW_BORDER = theme.colors.border;
export const VIEW_SLATE = theme.colors.textPrimary;
export const VIEW_MUTED = theme.colors.textSecondary;

const CONTACT_AVATAR_SIZE_BASE = 88;
const CONTACT_AVATAR_RING_BASE = 4;
const CONTACT_AVATAR_OUTER_BASE =
  CONTACT_AVATAR_SIZE_BASE + CONTACT_AVATAR_RING_BASE * 2;
const CONTACT_AVATAR_SIZE = scaleSize(CONTACT_AVATAR_SIZE_BASE);
const CONTACT_AVATAR_RING = scaleSize(CONTACT_AVATAR_RING_BASE);
const CONTACT_AVATAR_OUTER = CONTACT_AVATAR_SIZE + CONTACT_AVATAR_RING * 2;

const actionChipShadow = Platform.select({
  ios: {
    shadowColor: theme.colors.shadowBlack,
    shadowOffset: { width: 0, height: scaleSize(2) },
    shadowOpacity: 0.08,
    shadowRadius: scaleSize(6),
  },
  android: { elevation: 2 },
});

const viewScreenStyles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.colors.primary,
  },
  overlapBody: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "visible",
  },
  overlapHeader: {
    position: "relative",
    zIndex: 2,
    marginBottom: scaleSize(24),
  },
  avatarOverlap: {
    position: "absolute",
    left: 0,
    right: 0,
    // bottom: -(CONTACT_AVATAR_OUTER / 2),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  avatarRing: {
    padding: CONTACT_AVATAR_RING,
    borderRadius: CONTACT_AVATAR_OUTER / 2,
    backgroundColor: theme.colors.white,
    ...actionChipShadow,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    height: CONTACT_AVATAR_SIZE,
    width: CONTACT_AVATAR_SIZE,
    borderRadius: CONTACT_AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    marginTop: scaleSize(10),
    fontSize: scaleSize(28),
    lineHeight: scaleSize(30),
    color: theme.colors.white,
    fontFamily: theme.font.dinBold,
    textAlign: "center",
    // ...Platform.select({
    //   android: { includeFontPadding: false, textAlignVertical: "center" },
    //   ios: { marginTop: scaleSize(1) },
    // }),
  },
  heroPanel: {
    backgroundColor: theme.colors.white,
    paddingTop: scaleSize(CONTACT_AVATAR_OUTER_BASE / 4),
    paddingBottom: scaleSize(4),
  },
  heroTextCol: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: scaleSize(18),
  },
  nameText: {
    fontSize: scaleSize(22),
    fontFamily: theme.font.dinBold,
    color: theme.colors.textPrimary,
    lineHeight: scaleSize(28),
    textAlign: "center",
    ...androidTextFix,
  },
  metaPrimary: {
    fontSize: scaleSize(14),
    fontFamily: theme.font.dinLight,
    color: theme.colors.textSecondary,
    marginTop: scaleSize(6),
    textAlign: "center",
  },
  metaSecondary: {
    fontSize: scaleSize(13),
    fontFamily: theme.font.dinLight,
    color: theme.colors.textSecondary,
    marginTop: scaleSize(2),
    textAlign: "center",
  },
  metaTertiary: {
    fontSize: scaleSize(12),
    fontFamily: theme.font.dinLight,
    color: theme.colors.disabled,
    marginTop: scaleSize(2),
    textAlign: "center",
  },
  statusPill: {
    marginTop: scaleSize(8),
    paddingVertical: scaleSize(5),
    paddingHorizontal: scaleSize(12),
    borderRadius: scaleSize(999),
    maxWidth: "100%",
    alignSelf: "center",
  },
  statusPillUnclassified: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  statusPillText: {
    fontSize: scaleSize(12),
    fontFamily: theme.font.dinBold,
    color: theme.colors.white,
  },
  statusPillTextUnclassified: {
    color: theme.colors.textSecondary,
  },
  statusMuted: {
    fontSize: scaleSize(13),
    fontFamily: theme.font.dinLight,
    color: theme.colors.textSecondary,
    marginTop: scaleSize(8),
    textAlign: "center",
  },
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.ccSurface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scaleSize(28),
  },
  actionsWrap: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingHorizontal: scaleSize(16),
    paddingTop: scaleSize(10),
    paddingBottom: scaleSize(8),
    gap: scaleSize(8),
    backgroundColor: theme.colors.white,
  },
  actionChip: {
    flex: 1,
    minWidth: 0,
    minHeight: scaleSize(58),
    borderRadius: scaleSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    paddingVertical: scaleSize(6),
    paddingHorizontal: scaleSize(4),
    justifyContent: "center",
    alignItems: "center",
    ...actionChipShadow,
  },
  actionChipDisabled: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
  },
  actionLabel: {
    fontSize: scaleSize(11),
    fontFamily: theme.font.dinBold,
    marginTop: scaleSize(4),
    textAlign: "center",
  },
  notesSection: {
    paddingHorizontal: scaleSize(16),
    paddingTop: scaleSize(8),
    marginBottom: scaleSize(24),
  },
  notesSectionTitle: {
    fontSize: scaleSize(18),
    fontFamily: theme.font.dinBold,
    color: theme.colors.textPrimary,
    marginBottom: scaleSize(12),
    letterSpacing: scaleSize(0.2),
  },
  notesCard: {
    backgroundColor: theme.colors.white,
    borderRadius: scaleSize(12),
    padding: scaleSize(16),
    minHeight: scaleSize(140),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  footerBar: {
    backgroundColor: theme.colors.ccSurface,
  },
  deleteModalCard: {
    backgroundColor: theme.colors.ttWhite,
    padding: 20,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: VIEW_BORDER,
    ...CONTACT_NOTES_MODAL_SHADOW,
  },
  deleteModalTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  deleteModalBody: {
    fontSize: 15,
    fontFamily: theme.font.dinLight,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 4,
  },
  notesPreviewWrap: {
    minHeight: scaleSize(60),
    justifyContent: "center",
    paddingVertical: scaleSize(4),
  },
  notesPreviewText: {
    fontSize: scaleSize(15),
    fontFamily: theme.font.dinLight,
    lineHeight: scaleSize(22),
    color: theme.colors.textSecondary,
  },
  addNotesBtn: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(14),
    borderRadius: scaleSize(10),
    marginTop: scaleSize(12),
  },
  addNotesBtnText: {
    color: theme.colors.primary,
    marginLeft: scaleSize(6),
    textAlign: "left",
  },
  noteDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CONTACT_NOTES_MODAL_BORDER,
  },
  noteDetailTitle: {
    fontFamily: theme.font.dinBold,
    fontSize: 20,
    color: "#111827",
  },
  noteDetailActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
    paddingTop: 4,
  },
  noteDetailBtnPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    minWidth: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  noteDetailBtnGhost: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: VIEW_BORDER,
    backgroundColor: theme.colors.white,
    minWidth: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  noteDetailBtnDanger: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    minWidth: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  noteDetailBtnTextLight: {
    ...theme.typography.buttonLabel,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.white,
  },
  noteDetailBtnTextDark: {
    ...theme.typography.buttonLabel,
    fontSize: 15,
    lineHeight: 20,
    color: "#374151",
  },
  noteDetailBtnTextDanger: {
    ...theme.typography.buttonLabel,
    fontSize: 15,
    lineHeight: 20,
    color: "#DC2626",
  },
});

export default viewScreenStyles;
