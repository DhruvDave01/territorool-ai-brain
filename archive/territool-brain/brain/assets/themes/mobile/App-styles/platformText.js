import { Platform } from "react-native";
import { scaledSize } from "../utils/commonFunctions";

/** Scale layout/font tokens from a 393×852 baseline (iOS + Android). */
export const platformSize = (size) => scaledSize(size);

/** Line height from base font size — prevents Android clipping. */
export const lineHeightFor = (fontSize, ratio = 1.25) =>
  Math.round(scaledSize(fontSize) * ratio);

/** Android-only text metric corrections (not size reductions). */
export const androidTextFix = Platform.select({
  android: {
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  default: {},
});

/** Merge base text styles with Android metric fixes. */
export const textStyle = (base) => ({
  ...base,
  ...androidTextFix,
});

/** Multiline inputs / text areas — top alignment on Android. */
export const multilineTextFix = Platform.select({
  android: {
    includeFontPadding: false,
    textAlignVertical: "top",
  },
  default: {},
});

/** Build a unified typography token scaled for the current screen. */
export const makeTypography = ({
  fontSize,
  fontFamily,
  lineHeight,
  letterSpacing,
  marginTop,
}) => {
  const fs = scaledSize(fontSize);
  return {
    fontSize: fs,
    fontFamily,
    lineHeight:
      lineHeight != null ? scaledSize(lineHeight) : Math.round(fs * 1.25),
    ...(letterSpacing != null ? { letterSpacing: scaledSize(letterSpacing) } : {}),
    ...(marginTop != null ? { marginTop: scaledSize(marginTop) } : {}),
    ...androidTextFix,
  };
};
