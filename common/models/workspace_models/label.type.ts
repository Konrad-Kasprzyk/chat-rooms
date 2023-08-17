import LABEL_COLORS from "common/constants/colors.constant";
import { Timestamp } from "firebase/firestore";

export default interface Label {
  /**
   * @minLength 1
   */
  id: string;
  name: string;
  color: (typeof LABEL_COLORS)[number];
  /**
   * @minLength 1
   */
  replacedByLabelId: string | null;
  inRecycleBin: boolean;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
}
