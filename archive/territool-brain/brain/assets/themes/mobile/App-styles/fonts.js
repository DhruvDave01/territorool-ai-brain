/**
 * Linked from App/assets/fonts via react-native.config.js + `npx react-native-asset`.
 *
 * Android: fontFamily matches the .ttf filename without extension (hyphens kept).
 * iOS: fontFamily must match the font’s PostScript name inside the file (often no
 * hyphens). If a weight looks wrong on iOS, open the .ttf in Font Book → Get Info
 * and set the ios value to the exact “PostScript name”.
 */
import { Platform } from "react-native";

export const fonts = {
  dinCondensedBold: Platform.select({
    ios: "DINCondensed-Bold",
    android: "DIN-Condensed-Bold",
    default: "DIN-Condensed-Bold",
  }),
  /** Regular file’s PostScript name in the TTF is `DIN-Regular` (see strings/font inspector). */
  dinCondensedRegular: Platform.select({
    ios: "DIN-Regular",
    android: "DIN-Condensed-Regular",
    default: "DIN-Condensed-Regular",
  }),
};
