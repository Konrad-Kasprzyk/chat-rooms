import { Timestamp } from "firebase/firestore";
import LABEL_COLORS from "global/constants/colors";

type Label = {
  name: string;
  color: (typeof LABEL_COLORS)[number];
  id: string;
  replacedByLabelId: string | null;
  inRecycleBin: boolean;
  placingInBinTime: Timestamp | null;
  insertedIntoBinByUserId: string | null;
};

export default Label;
