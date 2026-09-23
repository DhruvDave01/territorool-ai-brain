import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { androidTextFix, lineHeightFor } from "../../../styles/platformText";
import { scaledSize } from "../../../utils/commonFunctions";

const isAndroid = Platform.OS === "android";
const s = scaledSize;
const lh = (size) => lineHeightFor(size, 1.2);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 2,
  },
  name: {
    flex: 1,
    minWidth: 0,
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinBold,
    ...(isAndroid ? { lineHeight: lh(13), ...androidTextFix } : { lineHeight: 18 }),
  },
  icon: {
    marginLeft: 6,
  },
  more: {
    marginLeft: 8,
    fontSize: isAndroid ? s(13) : 13,
    fontFamily: theme.font.dinBold,
    ...(isAndroid ? { lineHeight: lh(13), ...androidTextFix } : {}),
  },
});

export default styles;
