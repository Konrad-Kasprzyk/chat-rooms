import LABEL_COLORS from "common/constants/colors.constant";
import { Timestamp } from "firebase/firestore";

export default interface Label {
  /**
   * Used in url, is an integer.
   * @minLength 1
   */
  id: string;
  name: string;
  color: (typeof LABEL_COLORS)[number];
  /**
   * @minLength 1
   */
  replacedByLabelId: string | null;
  isInBin: boolean;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
}
