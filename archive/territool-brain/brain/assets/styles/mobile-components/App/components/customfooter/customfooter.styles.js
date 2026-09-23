import { Dimensions, Platform } from "react-native";
import { theme } from "../../styles/theme";

const t = theme.colors;

export const FOOTER_HIT_SLOP = {
  top: 12,
  bottom: 12,
  left: 12,
  right: 12,
};

/** Bottom inset for tab bar — safe-area first; Android 3-button nav fallback. */
export function resolveFooterBottomInset(insets) {
  if (insets.bottom > 0) {
    return insets.bottom;
  }
  if (Platform.OS !== "android") {
    return 0;
  }
  try {
    const screen = Dimensions.get("screen");
    const window = Dimensions.get("window");
    const statusTop = insets.top || 0;
    const gap = screen.height - window.height - statusTop;
    if (gap >= 24 && gap <= 96) {
      return gap;
    }
    const rawGap = screen.height - window.height;
    if (rawGap >= 48 && rawGap <= 120) {
      return Math.max(24, rawGap - statusTop);
    }
  } catch (_e) {
    // ignore
  }
  // ponytail: gap heuristic miss on some OEM builds — typical 3-button nav height
  return 48;
}

export const footerShellStyle = {
  width: "100%",
  backgroundColor: t.ccSurface,
};

export function footerTabInactive() {
  return { tintColor: t.gray };
}

export function footerTabActive() {
  return {
    backgroundColor: t.footerIconRail,
    tintColor: t.primary,
  };
}
