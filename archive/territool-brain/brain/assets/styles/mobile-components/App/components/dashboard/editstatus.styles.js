/**
 * Compact, scaled Settings (`editstatus`) layout — iOS baseline with tighter Android vertical rhythm.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../styles/platformText";
import { scaledSize } from "../../utils/commonFunctions";

const s = scaledSize;
const isAndroid = Platform.OS === "android";

/** Vertical spacing — Android metrics read taller; shrink ~15% to match iOS density. */
export const settingsVertical = (size) =>
  s(isAndroid ? Math.round(size * 0.85) : size);

/** Line height for Settings copy — tighter on Android. */
export const settingsLineHeight = (fontSize) =>
  lineHeightFor(fontSize, isAndroid ? 1.12 : 1.2);

const sv = settingsVertical;
const lh = settingsLineHeight;

const settingsSurfaceCard = {
  alignSelf: "stretch",
  width: "100%",
  backgroundColor: "#F8FAFC",
  borderRadius: s(14),
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.06)",
  paddingHorizontal: s(12),
  paddingVertical: sv(8),
  overflow: "hidden",
  ...theme.shadows.sm,
};

export const editStatusStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: sv(16),
  },
  profileCard: {
    backgroundColor: theme.colors.white,
    marginHorizontal: s(16),
    marginTop: sv(8),
    borderRadius: s(14),
    paddingVertical: sv(10),
    paddingHorizontal: s(14),
    flexDirection: "column",
    ...theme.shadows.sm,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: sv(6),
  },
  profileAvatar: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: theme.colors.primary + "18",
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(10),
  },
  profileName: {
    fontSize: s(18),
    lineHeight: lh(18),
    fontWeight: "600",
    fontFamily: theme.font.dinBold,
    color: "#111827",
    ...androidTextFix,
  },
  profileEmailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: sv(2),
  },
  profileEmailText: {
    fontSize: s(13),
    lineHeight: lh(13),
    fontWeight: "500",
    color: "#6B7280",
    fontFamily: theme.font.dinLight,
    ...androidTextFix,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: sv(6),
  },
  dividerHidden: {
    height: 0,
    marginVertical: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: sv(4),
  },
  infoRowLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoRowIcon: {
    marginRight: s(10),
  },
  infoRowLabel: {
    fontSize: s(14),
    lineHeight: lh(14),
    fontFamily: theme.font.dinBold,
    color: "#374151",
    ...androidTextFix,
  },
  infoRowValue: {
    fontSize: s(16),
    lineHeight: lh(16),
    fontWeight: "600",
    fontFamily: theme.font.dinLight,
    ...androidTextFix,
  },
  subscriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: sv(6),
  },
  subscriptionMainCol: {
    flex: 1,
    minWidth: 0,
    marginRight: s(10),
  },
  renewalMuted: {
    fontSize: s(12),
    lineHeight: lh(12),
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    marginTop: sv(2),
    marginLeft: s(30),
    ...androidTextFix,
  },
  subscriptionBadge: {
    paddingHorizontal: s(8),
    paddingVertical: sv(3),
    borderRadius: s(8),
  },
  subscriptionBadgeText: {
    fontSize: s(12),
    lineHeight: lh(12),
    fontWeight: "600",
    fontFamily: theme.font.dinLight,
    ...androidTextFix,
  },
  secondaryCardWrap: {
    marginHorizontal: s(16),
    marginTop: sv(10),
    marginBottom: sv(10),
  },
  secondaryCard: settingsSurfaceCard,
  secondaryCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  secondaryCardTextCol: {
    flex: 1,
    minWidth: 0,
    marginRight: s(8),
  },
  sectionTitle: {
    fontSize: s(16),
    lineHeight: lh(16),
    fontWeight: "600",
    color: theme.colors.black,
    fontFamily: theme.font.dinBold,
    ...androidTextFix,
  },
  sectionSubtitle: {
    marginTop: sv(2),
    fontSize: s(12),
    lineHeight: lh(12),
    fontFamily: theme.font.dinLight,
    color: "#6B7280",
    ...androidTextFix,
  },
  tagsSectionWrap: {
    marginHorizontal: s(16),
    marginBottom: sv(10),
    marginTop: 0,
  },
  tagsCard: {
    ...settingsSurfaceCard,
    paddingTop: sv(8),
    paddingBottom: sv(8),
  },
  tagsCardExpanded: {
    paddingTop: sv(12),
    paddingBottom: sv(10),
  },
  tagsEditorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: sv(6),
    paddingVertical: sv(2),
  },
  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginTop: sv(8),
  },
  tagTile: {
    minWidth: "48%",
    width: "48%",
    marginHorizontal: "1%",
    backgroundColor: "#FFFFFF",
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    ...theme.shadows.sm,
  },
  tagTileInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#F3F5F9",
    borderRadius: s(10),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    paddingLeft: s(4),
    paddingRight: s(4),
    paddingVertical: sv(2),
    minHeight: s(isAndroid ? 36 : 40),
  },
  tagColorBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    marginTop: sv(1),
  },
  tagColorSwatch: {
    width: s(30),
    height: s(30),
    borderRadius: s(15),
    borderWidth: 2,
    borderColor: "#FFFFFF",
    ...theme.shadows.sm,
  },
  tagInput: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    marginLeft: s(4),
    fontSize: s(15),
    fontFamily: theme.font.dinLight,
    lineHeight: lh(15),
    minHeight: s(isAndroid ? 36 : 40),
    maxHeight: sv(88),
    paddingTop: sv(isAndroid ? 6 : 8),
    paddingBottom: sv(isAndroid ? 6 : 8),
    paddingHorizontal: s(4),
    color: theme.colors.black,
  },
  updateTagsWrap: {
    marginTop: sv(10),
    width: "100%",
    paddingHorizontal: s(2),
  },
  updateTagsBtn: {
    paddingVertical: sv(8),
    borderRadius: s(12),
    ...theme.shadows.sm,
  },
  versionWrap: {
    margin: sv(12),
    paddingHorizontal: s(12),
    alignItems: "center",
  },
});

export const editStatusScaled = {
  tagRowGap: sv(8),
  actionBtnMinHeight: s(isAndroid ? 40 : 44),
  actionBtnPaddingVertical: sv(isAndroid ? 8 : 10),
  compactBtnMinHeight: s(isAndroid ? 30 : 32),
  compactBtnPaddingVertical: sv(isAndroid ? 6 : 8),
  iconPerson: s(20),
  iconRow: s(18),
  iconMail: s(13),
};
