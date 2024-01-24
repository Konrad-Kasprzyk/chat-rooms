import PRIORITIES from "common/constants/priorities.constant";
import Label from "../label.type";

type ArchivedTask = {
  /**
   * Used in url, is an integer.
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  workspaceId: string;
  /**
   * @minLength 1
   */
  title: string;
  description: string;
  authorUsername: string | null;
  assignedUserUsername: string | null;
  columnName: string;
  goalTitle: string | null;
  storyPoints: number | null;
  labels: Label[];
  priority: (typeof PRIORITIES)[number] | null;
  objectives: {
    /**
     * @minLength 1
     */
    objective: string;
    isDone: boolean;
  }[];
  notes: {
    userUsername: string | null;
    /**
     * @minLength 1
     */
    note: string;
    date: Date;
  }[];
  modificationTime: Date;
  columnChangeTime: Date;
  completionTime: Date | null;
  creationTime: Date;
  placingInBinTime: Date | null;
};

export default ArchivedTask;
