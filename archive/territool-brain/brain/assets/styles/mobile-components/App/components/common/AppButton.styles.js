import { theme } from "../../styles/theme";

/** Plain style objects merged on AppButton label Text (see theme.typography.buttonLabel). */
const appButtonLabelStyles = {
  text: { ...theme.typography.buttonLabel },
  compact: { fontSize: 16, lineHeight: 21 },
};

export default appButtonLabelStyles;
