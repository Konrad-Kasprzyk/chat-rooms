import LABEL_COLORS from "common/constants/labelColors.constant";

type Label = {
  id: string;
  name: string;
  color: (typeof LABEL_COLORS)[number];
};

export default Label;
