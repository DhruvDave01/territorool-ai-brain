/**
 * Layout / visual tokens for classic Find Leads (`index.js`).
 */
import { Platform, Dimensions } from "react-native";
import { theme } from "../../styles/theme";

const { width, height } = Dimensions.get("window");

export { width, height };

export const FL_SURFACE_PAGE = "#F3F4F6";
export const FL_SURFACE_CARD = "#FFFFFF";
export const FL_BORDER = "#E5E7EB";
export const FL_BORDER_STRONG = "#D1D5DB";
export const FL_RADIUS = 14;
export const FL_RADIUS_SM = 12;
export const FL_TAB_SEGMENT = "rgba(255,255,255,0.16)";
export const FL_SHADOW_IOS = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
};
export const FL_SHADOW_CARD =
  Platform.OS === "ios"
    ? FL_SHADOW_IOS
    : { elevation: 4, shadowColor: "#000" };

export const FL_DROPDOWN_TEXT = {
  fontFamily: theme.font.dinLight,
  fontSize: 16,
  color: theme.colors.textPrimary,
};

export const ROUTE_MODAL_CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  android: { elevation: 8 },
});

export const routeModalFormLabel = {
  fontSize: 13,
  fontFamily: theme.font.dinBold,
  color: "#374151",
  marginBottom: 8,
};

export const routeModalTextInput = {
  fontSize: 16,
  fontFamily: theme.font.dinLight,
  color: "#111827",
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: FL_BORDER,
  backgroundColor: "#F9FAFB",
  ...Platform.select({
    android: { textAlignVertical: "center" },
    ios: {},
  }),
};

export const routeModalDropdownButton = {
  height: 52,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: FL_BORDER,
  backgroundColor: "#F9FAFB",
  paddingHorizontal: 16,
  justifyContent: "center",
  alignItems: "center",
};

export const MODAL_CHAIN_MS = 400;
export const CITY_DROPDOWN_MAX_HEIGHT = 48 * 9;
export const MAP_MIN_HEIGHT = Math.max(220, Math.floor(height * 0.4));
export const MAP_ZOOM_MIN_LAT_DELTA = 0.0028;
export const MAP_ZOOM_MAX_LAT_DELTA = 22;
