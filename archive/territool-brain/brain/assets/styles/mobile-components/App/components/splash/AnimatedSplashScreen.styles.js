import { Platform, StyleSheet } from "react-native";

export const animatedSplashStyles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    paddingVertical: 0,
    ...Platform.select({
      android: { elevation: 32 },
    }),
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  lottieFullBleed: {
    position: "absolute",
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

/** Upward nudge for Lottie vs background; scales with window height (~−30 at ~812pt). */
export function splashLottieTopOffset(screenHeight) {
  // return -Math.round(screenHeight * (30 / 812));
  return 0;
}

export function splashLottieDimensions(screenW, screenH) {
  return {
    width: screenW,
    height: screenH,
  };
}

/** `splash_icon.json` root composition (w/h ≈ 1080) — fit to window, preserve aspect. */
export function splashLottieFitDimensions(screenW, screenH) {
  const assetW = 1080;
  const assetH = 1080;
  const w = Math.max(1, Number(screenW) || 1);
  const h = Math.max(1, Number(screenH) || 1);
  const scale = Math.min(w / assetW, h / assetH);
  return {
    width: assetW * scale,
    height: assetH * scale,
  };
}
