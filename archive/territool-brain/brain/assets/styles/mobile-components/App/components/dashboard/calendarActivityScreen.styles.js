/**
 * Styles for `App/components/dashboard/CalendarActivityScreen.js`.
 */
import { Platform, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";
import { SCREEN_BODY_TOP_RADIUS } from "../../styles/screenCurvedBody";
import { scaledSize } from "../../utils/commonFunctions";
import { DASH } from "./dashboard.styles";

export const CALENDAR_ARROW_SIZE = scaledSize(22);

export const agendaTheme = {
  backgroundColor: theme.colors.ccSurface,
  calendarBackground: theme.colors.white,
  textSectionTitleColor: "#6B7280",
  selectedDayBackgroundColor: theme.colors.primary,
  selectedDayTextColor: theme.colors.white,
  todayTextColor: "#111827",
  todayBackgroundColor: "transparent",
  dayTextColor: "#111827",
  textDisabledColor: "#D1D5DB",
  dotColor: theme.colors.primary,
  selectedDotColor: theme.colors.white,
  arrowColor: theme.colors.primary,
  monthTextColor: "#111827",
  textMonthFontFamily: theme.font.dinBold,
  textDayHeaderFontFamily: theme.font.dinLight,
  textDayFontFamily: theme.font.dinLight,
  agendaDayTextColor: theme.colors.primary,
  agendaDayNumColor: "#374151",
  agendaTodayColor: theme.colors.primary,
  todayDotColor: theme.colors.primary,
  expandableKnobColor: "#CBD5E1",
  reservationsBackgroundColor: theme.colors.ccSurface,
  weekVerticalMargin: 4,
  "stylesheet.calendar.header": {
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: scaledSize(8),
      paddingRight: scaledSize(8),
      marginTop: scaledSize(4),
      alignItems: "center",
      zIndex: 20,
      elevation: 20,
    },
    arrow: {
      padding: scaledSize(8),
      zIndex: 21,
      elevation: 21,
    },
    monthText: {
      fontSize: scaledSize(16),
      fontFamily: theme.font.dinBold,
      color: "#111827",
      marginVertical: scaledSize(4),
      marginHorizontal: scaledSize(6),
    },
    week: {
      marginTop: 4,
      marginBottom: 2,
      flexDirection: "row",
      justifyContent: "space-around",
    },
  },
  "stylesheet.calendar.main": {
    staticHeader: {
      zIndex: 15,
      elevation: 15,
    },
    container: {
      paddingLeft: scaledSize(4),
      paddingRight: scaledSize(4),
    },
    week: {
      marginVertical: 4,
      flexDirection: "row",
      justifyContent: "space-around",
    },
  },
  "stylesheet.agenda.list": {
    container: {
      flexDirection: "row",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: DASH.border,
      paddingBottom: scaledSize(10),
    },
  },
};

const calendarActivityStyles = StyleSheet.create({
  sheet: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.colors.ccSurface,
    borderTopLeftRadius: SCREEN_BODY_TOP_RADIUS,
    borderTopRightRadius: SCREEN_BODY_TOP_RADIUS,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -scaledSize(2) },
        shadowOpacity: 0.07,
        shadowRadius: scaledSize(6),
      },
      android: { elevation: 3 },
    }),
  },
  calendarHost: {
    flex: 1,
    minHeight: 0,
  },
  expandableCalendarWrap: {
    zIndex: 10,
    elevation: 10,
    backgroundColor: theme.colors.white,
  },
  daySectionHeader: {
    paddingHorizontal: scaledSize(16),
    paddingTop: scaledSize(12),
    paddingBottom: scaledSize(6),
    backgroundColor: theme.colors.ccSurface,
  },
  daySectionTitle: {
    fontSize: scaledSize(15),
    fontFamily: theme.font.dinBold,
    color: "#111827",
  },
  daySectionTitleToday: {
    color: theme.colors.primary,
  },
  daySectionHeaderToday: {
    backgroundColor: theme.colors.primaryMutedBg,
    borderLeftWidth: scaledSize(3),
    borderLeftColor: theme.colors.primary,
    marginLeft: scaledSize(13),
    paddingLeft: scaledSize(13),
    borderRadius: scaledSize(6),
  },
  monthEmptyList: {
    paddingHorizontal: scaledSize(16),
    paddingVertical: scaledSize(24),
    alignItems: "center",
  },
  monthEmptyText: {
    fontSize: scaledSize(14),
    fontFamily: theme.font.dinLight,
    color: DASH.muted,
    textAlign: "center",
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.overlayDark,
    zIndex: 2,
  },
  lottieLoader: {
    width: scaledSize(140),
    height: scaledSize(140),
  },
  loaderLabel: {
    marginTop: scaledSize(12),
    fontSize: scaledSize(15),
    fontFamily: theme.font.dinLight,
    color: DASH.pageBg,
    textAlign: "center",
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DASH.border,
    paddingTop: scaledSize(8),
    paddingBottom: scaledSize(4),
    backgroundColor: theme.colors.ccSurface,
  },
  dayColumn: {
    width: scaledSize(63),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  dayColumnSpacer: {
    width: scaledSize(63),
  },
  dayColumnNum: {
    fontSize: scaledSize(26),
    fontWeight: "200",
    fontFamily: theme.font.dinLight,
    color: "#374151",
  },
  dayColumnLabel: {
    fontSize: scaledSize(12),
    fontFamily: theme.font.dinLight,
    color: theme.colors.primary,
    marginTop: scaledSize(-5),
  },
  dayColumnToday: {
    color: theme.colors.primary,
  },
  dayRowContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  agendaItem: {
    backgroundColor: theme.colors.white,
    marginHorizontal: scaledSize(16),
    marginTop: scaledSize(4),
    marginBottom: 0,
    borderRadius: scaledSize(14),
    borderWidth: 1,
    borderColor: DASH.border,
    paddingVertical: scaledSize(12),
    paddingHorizontal: scaledSize(12),
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: scaledSize(1) },
        shadowOpacity: 0.06,
        shadowRadius: scaledSize(4),
      },
      android: { elevation: 2 },
    }),
  },
  agendaItemFirst: {
    marginTop: 0,
  },
  agendaItemToday: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    backgroundColor: theme.colors.primaryMutedBg,
  },
  agendaItemBody: {
    flex: 1,
    minWidth: 0,
    marginLeft: scaledSize(10),
  },
});

export default calendarActivityStyles;
