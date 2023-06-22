import { Timestamp } from "firebase/firestore";

type Column = {
  name: string;
  taskFinishColumn: boolean;
  id: string;
  replacedByColumnId: string | null;
  inRecycleBin: boolean;
  placingInBinTime: Timestamp | null;
  insertedIntoBinByUserId: string | null;
};

export default Column;
