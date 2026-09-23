/**
 * Territool approved design tokens: MOBILE values (pt).
 * Source of truth: brain/context/design-system.md (approved 2026-09-15). Keep this file identical to it.
 *
 * Use:
 *   - Reference for mobile specs and mockups in the brain.
 *   - The first mobile task that needs tokens copies this file to repos/mobile/App/styles/tokens.js (D-DS1 additive).
 *     Wrap spacing with scaledSize() where the app scales sizes; keep theme.js values unchanged.
 * Object paths mirror the canonical token names in design-system.md (color.brand.primary → tokens.color.brand.primary).
 * The "Mobile key" column there abbreviates paths with "…". Confirm this nesting when the file first enters the repo.
 * Fonts: DIN only (D-DS3). Names match App/styles/fonts.js; files are in brain/assets/fonts/mobile.
 */
export const tokens = {
  color: {
    brand: {
      primary: "#124AC6",
      primaryPressed: "#0E3DA6",
      primarySubtle: "#F0F4FF",
      primaryMuted: "#E0E7FF",
      onPrimarySelected: "#4A90E4", // labels >= 17pt bold only
    },
    accent: {
      teal: "#00A99D", // fills and icons only, never text
      tealStrong: "#0F766E",
    },
    danger: "#E94A5D", // destructive confirm fills; labels >= 17pt bold
    dangerText: "#B91C1C",
    dangerSubtle: "#FEE2E2",
    success: "#15803D",
    successSubtle: "#DCFCE7",
    warning: "#F59E0B", // dark text only
    warningSubtle: "#FEF3C7",
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      strongMuted: "#374151",
      disabled: "#9CA3AF",
      onPrimary: "#FFFFFF",
    },
    surface: {
      page: "#F6F7FB",
      card: "#FFFFFF",
      muted: "#F3F4F6",
      input: "#FAFBFC",
    },
    border: {
      default: "#E5E7EB",
      input: "#E2E4E9",
    },
    overlay: {
      scrim: "rgba(17,24,39,0.45)",
    },
    gradient: {
      // exact stops of the app's brand gradient (theme.js:12-20)
      header: ["#124AC6", "#164FCA", "#1B54CF", "#2059D3", "#255ED7", "#2963DB", "#124AC6"],
    },
  },

  fontFamily: {
    // Same values as App/styles/fonts.js (Platform.select there).
    bold: { ios: "DINCondensed-Bold", android: "DIN-Condensed-Bold" },
    regular: { ios: "DIN-Regular", android: "DIN-Condensed-Regular" },
  },

  // size / lineHeight in pt
  type: {
    display: { family: "bold", size: 24, lineHeight: 30 },
    title: { family: "bold", size: 22, lineHeight: 28 },
    heading: { family: "bold", size: 20, lineHeight: 25 },
    subheading: { family: "bold", size: 17, lineHeight: 21 },
    body: { family: "regular", size: 16, lineHeight: 20 },
    bodyStrong: { family: "bold", size: 16, lineHeight: 20 },
    caption: { family: "regular", size: 14, lineHeight: 18 },
    eyebrow: { family: "bold", size: 12, lineHeight: 15, uppercase: true, letterSpacing: 0.5 },
    button: { family: "bold", size: 17, lineHeight: 19 },
    micro: { family: "regular", size: 12, lineHeight: 15 },
  },

  // 4-pt grid; apply scaledSize() in the app
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 },

  radius: { sm: 8, md: 12, lg: 16, sheet: 25, pill: 999 },

  elevation: {
    1: { ios: { shadowColor: "#000000", shadowOffset: { width: 0, height: 1 }, shadowRadius: 1.5, shadowOpacity: 0.06 }, android: 1 },
    2: { ios: { shadowColor: "#000000", shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, shadowOpacity: 0.08 }, android: 4 },
    3: { ios: { shadowColor: "#000000", shadowOffset: { width: 0, height: 12 }, shadowRadius: 20, shadowOpacity: 0.12 }, android: 8 },
  },

  size: { touchMin: 44, controlHeight: 48 },
};

export default tokens;
