import LABEL_COLORS from "common/constants/labelColors.constant";

type Label = {
  /**
   * Used in url, is an integer.
   * @minLength 1
   */
  id: string;
  name: string;
  color: (typeof LABEL_COLORS)[number];
};

export default Label;
