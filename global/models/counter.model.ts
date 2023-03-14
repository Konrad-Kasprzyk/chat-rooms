/**
 * This collection is for transactions while making and assigning short ids per project
 */
export default interface Counter {
  id: string;
  projectId: string;
  nextUserShortId: string;
  // search id is number of item: 1, 2, .., 10, 11. It is for tagging tasks, goals etc.
  nextTaskSearchId: number;
  // short id is a-z A-Z 0-9 chars. It is for finished task Stats
  nextTaskShortId: string;
  nextTaskLabelShortId: string;
  nextTaskColumnShortId: string;
  nextGoalSearchId: number;
  nextGoalShortId: string;
  nextGoalLabelShortId: string;
}
