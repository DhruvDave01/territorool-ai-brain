import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

const t = theme.colors;

export const companyEditStyles = StyleSheet.create({
  statusPickerLabel: {
    fontSize: 16,
    fontFamily: theme.font.dinLight,
    color: t.textAlmostBlack,
  },
  categoryPickerLabel: {
    fontSize: 16,
    fontFamily: theme.font.dinLight,
    color: t.textPrimary,
  },
  addressAutocompleteWrap: {
    flex: 1,
    minWidth: 0,
  },
});

export function companyEditStatusSwatch(backgroundColor) {
  return {
    backgroundColor,
    width: 22,
    height: 22,
    borderRadius: 6,
  };
}
