/**
 * Styles for `FindLeadsCompanyDetailModal.js` sheet content.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const modalRootStyle = {
  margin: 0,
  justifyContent: "flex-end",
};

export const detailStyles = StyleSheet.create({
  sheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: { elevation: 24 },
    }),
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleText: {
    fontFamily: theme.font.dinBold,
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
    paddingRight: 8,
  },
  closeBtn: { padding: 8, marginTop: -4 },
  typePill: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF4FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  typePillText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  addressText: {
    fontFamily: theme.font.dinLight,
    fontSize: 14,
    color: theme.colors.primary,
    lineHeight: 20,
    marginBottom: 12,
  },
  contactsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  contactsIcon: { marginRight: 8 },
  contactsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  contactsCount: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  contactCountSpinner: { marginLeft: 4 },
  contactsChevronSpacer: { flex: 1 },
  contactsPanel: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
    overflow: "hidden",
  },
  contactsFlatListFlex: {
    flex: 1,
    width: "100%",
  },
  flatListContent: {
    paddingBottom: 16,
  },
  contactsLoadingWrap: {
    paddingVertical: 20,
    alignItems: "center",
  },
  contactsLoadingText: {
    fontSize: 13,
    color: theme.colors.ttFont,
    marginTop: 8,
  },
  contactsMessageWrap: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  contactsMessageText: {
    fontSize: 13,
    color: theme.colors.ttFont,
    textAlign: "center",
  },
  listFooterLoading: {
    paddingVertical: 12,
    alignItems: "center",
  },
  listFooterLoadingText: {
    fontSize: 12,
    color: theme.colors.ttFont,
    marginTop: 6,
  },
  listFooterEnd: {
    paddingVertical: 12,
    alignItems: "center",
  },
  listFooterEndText: {
    fontSize: 12,
    color: theme.colors.ttFont,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
  },
  contactIndexCol: {
    width: 28,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  contactIndexText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.ttFont,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  contactBody: { flex: 1 },
  contactName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  contactMeta: {
    fontSize: 12,
    color: theme.colors.ttFont,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginVertical: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnPrimary: {
    backgroundColor: theme.colors.primary,
    marginRight: 6,
  },
  actionBtnPrimaryDisabled: {
    backgroundColor: "#E0E0E0",
    marginRight: 6,
  },
  actionBtnSecondary: {
    backgroundColor: theme.colors.ttBlue,
    marginLeft: 6,
  },
  actionBtnSecondaryDisabled: {
    backgroundColor: "#E0E0E0",
    marginLeft: 6,
  },
  actionIcon: { marginRight: 6 },
  actionBtnLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.white,
    textAlign: "left",
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  hoursIcon: { marginRight: 6 },
  hoursLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  hoursMuted: {
    fontSize: 14,
    color: theme.colors.ttFont,
  },
  hoursSection: { marginTop: 6 },
  hoursHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  hoursHeaderIcon: { marginRight: 6 },
  hoursTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  hoursLineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  hoursDay: {
    width: 40,
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.ttFont,
  },
  hoursTime: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  hoursTimeClosed: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.ttRed,
  },
  footerSlot: { marginTop: 16 },
  addToListBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  addToListBtnText: {
    fontSize: 16,
    lineHeight: 21,
    color: theme.colors.white,
    textAlign: "left",
  },
  removeFromListBtn: {
    backgroundColor: "#FFF0F0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.ttRed,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  removeFromListBtnText: {
    fontSize: 16,
    lineHeight: 21,
    color: theme.colors.ttRed,
    textAlign: "left",
  },
  btnIcon: { marginRight: 6 },
});
