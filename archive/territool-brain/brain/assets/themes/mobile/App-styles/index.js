/**
 * Barrel for TypeScript style modules and design tokens.
 * All color hex values live in `./theme` — `App/config` re-exports `COLOR_*` from there.
 */
export { theme } from "./theme";
export {
  androidTextFix,
  lineHeightFor,
  makeTypography,
  multilineTextFix,
  platformSize,
  textStyle,
} from "./platformText";
export { activeRouteMapZoomControls, commonStyles, paddingBottomInset } from "./commonStyles";
