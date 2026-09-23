/**
 * Single source of truth for design tokens. Import `theme` from here or use
 * `COLOR_*` re-exports from `App/config` for legacy JS modules.
 */

import { Platform } from "react-native";
import { fonts as appFonts } from "./fonts";
import { scaledSize } from "../utils/commonFunctions";
import { makeTypography } from "./platformText";

/** Brand gradient stops — used by headers, subscribe paywall (`LinearGradient`), etc. */
const brandLinearGradient = [
  "#124ac6",
  "#164fca",
  "#1b54cf",
  "#2059d3",
  "#255ed7",
  "#2963db",
  "#124ac6",
];

export const theme = {
  colors: {
    // Brand (maps to legacy COLOR_* in config)
    primary: "#124ac6",
    secondary: "#4A90E4",
    primaryDark: "#00A99D",
    ttTab: "#3E918B",
    danger: "#E94A5D",
    info: "#4A90E4",
    lightGreen: "#40B793",
    moreLightGreen: "#1DCF00",
    darkRed: "#C16C69",
    gray: "#9B9B9B",
    lightGray: "#B5B5B5",
    moreLightGray: "#F2F2F2",
    darkGray: "#565656",
    white: "#FFFFFF",
    black: "#000000",
    ttGray: "#808080",
    blue: "#4a90e2",
    orange: "#CC6600",
    ttRed: "#CF5B51",
    ttGreen: "#12AA9D",
    ttYellow: "#FFB800",
    ttWhite: "#F6F6F6",
    ttBlue: "#44AADA",
    ttFont: "#707070",
    ttBtnGray: "#BCBCBC",

    linearGradient: brandLinearGradient,

    /** Subscribe / paywall (`App/components/register/subscribe.js`) — must be an array for LinearGradient */
    subscribeLinearGradient: brandLinearGradient,

    // Typography & surfaces
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    textMuted: "#374151",
    textStrong: "#333333",
    textIconMuted: "#666666",
    textGray575: "#575757",
    textBlackPure: "#000000",

    // Borders & dividers
    border: "#E5E7EB",
    borderStrong: "#E2E4E9",
    borderLight: "#dddddd",
    borderSubtle: "#E8EAED",
    borderTopHairline: "#E8E8ED",
    borderFaint: "rgba(0,0,0,0.04)",
    dividerHairline: "rgba(0,0,0,0.07)",
    dividerLight: "#EEF0F3",

    surfaceMuted: "#F3F4F6",
    surfaceInput: "#FAFBFC",
    surfaceSheet: "#EEF1F6",
    ccSurface: "#F6F7FB",
    segmentInactive: "#E5E7EB",

    disabled: "#9CA3AF",
    overlayDark: "rgba(0,0,0,0.35)",
    pressWhiteOverlay: "rgba(255, 255, 255, 0.1)",
    pressDarkOverlay: "rgba(0, 0, 0, 0.05)",
    rippleWhite: "rgba(255,255,255,0.2)",
    rippleDark: "rgba(0, 0, 0, 0.1)",
    clusterRed: "#ff0000",

    // Component-specific
    boldActive: "#12A090",
    nearBlack: "#1a1a1a",
    switchInactive: "#e0e0e0",
    success: "#4CAF50",
    glassWhite: "rgba(255,255,255,0.92)",
    glassBorderLight: "rgba(255,255,255,0.35)",
    primaryMutedBg: "rgba(18, 74, 198, 0.06)",
    primaryMutedBgStrong: "rgba(18, 74, 198, 0.08)",
    selectedGreenTint: "#e8f5e9",
    footerBorderTop: "rgba(0,0,0,0.06)",
    footerSeparator: "rgba(0,0,0,0.08)",
    shadowBlack: "#000000",

    mapFillRedSemi: "rgba(255,0,0,0.5)",
    contactCardBorderIdle: "#F3F4F6",
    iconMuted: "#D1D5DB",
    emailAccent: "#E4685C",
    linkedInBlue: "#0A66C2",
    warningOrange: "#FF8B28",
    ttGreenMutedBg: "rgba(10, 169, 157, 0.15)",

    ccMuted: "#6B7280",
    ccSubtle: "#9CA3AF",

    /** Publish / share route sheet (slate palette) */
    publishBg: "#F1F5F9",
    publishSlate: "#0f172a",
    publishMuted: "#64748b",
    publishBorderSlate: "#E2E8F0",
    publishSuccessBg: "#DCFCE7",
    publishSuccessIcon: "#15803d",
    publishErrorBg: "#FEE2E2",
    publishErrorIcon: "#DC2626",
    publishErrorText: "#B91C1C",
    publishDangerSurface: "#FEF2F2",
    publishAvatarFallback: "#94A3B8",
    publishBorderMuted: "#CBD5E1",
    publishTextSlate: "#475569",

    /** Misc UI */
    textAlmostBlack: "#111111",
    footerIconRail: "#eeeeee",

    /** Overlays on primary / gradient headers */
    onPrimaryGlass: "rgba(255, 255, 255, 0.12)",
    onPrimaryGlassMid: "rgba(255, 255, 255, 0.15)",
    onPrimaryGlassBorder: "rgba(255, 255, 255, 0.25)",
  },
  spacing: {
    xxs: scaledSize(4),
    xs: scaledSize(6),
    sm: scaledSize(8),
    md: scaledSize(12),
    lg: scaledSize(16),
    xl: scaledSize(20),
    xxl: scaledSize(24),
  },
  radius: {
    xxs: scaledSize(4),
    xs: scaledSize(8),
    sm: scaledSize(10),
    md: scaledSize(12),
    lg: scaledSize(16),
    xl: scaledSize(20),
    xxl: scaledSize(24),
  },
  /** Linked TTFs under `App/assets/fonts` (see `react-native.config.js`, `npm run link:assets`). */
  fonts: appFonts,
  /** `dinLight` = body/secondary (DIN Condensed Regular); `dinBold` = headings/emphasis (DIN Condensed Bold). */
  font: {
    dinLight: appFonts.dinCondensedRegular,
    dinBold: appFonts.dinCondensedBold,
  },
  /**
   * Unified typography — iOS baseline sizes on both platforms.
   * Spread into Text styles; Android metric fixes applied via makeTypography.
   */
  typography: {
    display: makeTypography({
      fontSize: 24,
      fontFamily: appFonts.dinCondensedBold,
      lineHeight: 30,
    }),
    title: makeTypography({
      fontSize: 22,
      fontFamily: appFonts.dinCondensedBold,
      lineHeight: 28,
    }),
    heading: makeTypography({
      fontSize: 20,
      fontFamily: appFonts.dinCondensedBold,
      lineHeight: 25,
    }),
    subheading: makeTypography({
      fontSize: 17,
      fontFamily: appFonts.dinCondensedBold,
      lineHeight: 21,
    }),
    body: makeTypography({
      fontSize: 16,
      fontFamily: appFonts.dinCondensedRegular,
      lineHeight: 20,
    }),
    bodyBold: makeTypography({
      fontSize: 16,
      fontFamily: appFonts.dinCondensedBold,
      lineHeight: 20,
    }),
    caption: makeTypography({
      fontSize: 14,
      fontFamily: appFonts.dinCondensedRegular,
      lineHeight: 18,
    }),
    captionBold: makeTypography({
      fontSize: 14,
      fontFamily: appFonts.dinCondensedBold,
      lineHeight: 18,
    }),
    micro: makeTypography({
      fontSize: 12,
      fontFamily: appFonts.dinCondensedRegular,
      lineHeight: 15,
    }),
    microBold: makeTypography({
      fontSize: 12,
      fontFamily: appFonts.dinCondensedBold,
      lineHeight: 15,
    }),
    /** Standard action labels (CTAs, tabs, modal buttons). */
    buttonLabel: {
      ...makeTypography({
        fontSize: 17,
        fontFamily: appFonts.dinCondensedBold,
        lineHeight: 19,
        marginTop: 4,
      }),
      textAlign: "center",
    },
    /** Row chips / small actions (e.g. “N contacts”). */
    buttonLabelCompact: {
      ...makeTypography({
        fontSize: 14,
        fontFamily: appFonts.dinCondensedBold,
        lineHeight: 16,
        marginTop: 4,
      }),
      textAlign: "center",
    },
  },
  shadows: {
    sm: Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
      default: {},
    }),
    md: Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
      default: {},
    }),
    lg: Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  layout: {
    minTouchTarget: scaledSize(44),
  },
  hitSlop: {
    top: scaledSize(12),
    bottom: scaledSize(12),
    left: scaledSize(12),
    right: scaledSize(12),
  },

};
export const TEXT_SIZES = {
  EXTRA_SMALL: scaledSize(10),
  SMALL: scaledSize(12),
  MEDIUM: scaledSize(14),
  DEFAULT: scaledSize(16),
  LARGE: scaledSize(18),
  EXTRA_LARGE: scaledSize(20),
  HUGE: scaledSize(22),
  JUMBO: scaledSize(24),
  COLOSSAL: scaledSize(26),
};